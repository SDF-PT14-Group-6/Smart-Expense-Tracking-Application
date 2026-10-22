import pytest

from app import create_app
from app.extensions import db
from app.models import User


class TestConfig:
    TESTING = True
    SECRET_KEY = "test-secret-key"
    JWT_SECRET_KEY = "test-jwt-secret-key"
    JWT_ACCESS_TOKEN_EXPIRES = 3600
    SQLALCHEMY_DATABASE_URI = "sqlite://"
    SQLALCHEMY_TRACK_MODIFICATIONS = False


@pytest.fixture()
def client():
    app = create_app(TestConfig)

    with app.app_context():
        db.create_all()

    with app.test_client() as test_client:
        yield test_client

    with app.app_context():
        db.session.remove()
        db.drop_all()


def register_user(client):
    return client.post(
        "/api/auth/register",
        json={
            "username": "joshua",
            "email": "joshua@example.com",
            "password": "StrongPass123!",
        },
    )


def test_health_endpoint(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json["status"] == "ok"


def test_registration_hashes_password(client):
    response = register_user(client)

    assert response.status_code == 201
    assert "password_hash" not in response.json["user"]

    with client.application.app_context():
        user = db.session.execute(
            db.select(User).where(User.email == "joshua@example.com")
        ).scalar_one()

        assert user.password_hash != "StrongPass123!"
        assert user.check_password("StrongPass123!")
        assert not user.check_password("WrongPassword123!")


def test_duplicate_registration_is_rejected(client):
    register_user(client)
    response = register_user(client)
    assert response.status_code == 409


def test_short_password_is_rejected(client):
    response = client.post(
        "/api/auth/register",
        json={
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "short",
        },
    )
    assert response.status_code == 400


def test_login_returns_access_token(client):
    register_user(client)

    response = client.post(
        "/api/auth/login",
        json={
            "email": "joshua@example.com",
            "password": "StrongPass123!",
        },
    )

    assert response.status_code == 200
    assert response.json["access_token"]


def test_wrong_password_is_rejected(client):
    register_user(client)

    response = client.post(
        "/api/auth/login",
        json={
            "email": "joshua@example.com",
            "password": "WrongPassword123!",
        },
    )

    assert response.status_code == 401


def test_me_requires_a_token(client):
    response = client.get("/api/auth/me")
    assert response.status_code == 401


def test_me_accepts_a_valid_token(client):
    register_user(client)

    login_response = client.post(
        "/api/auth/login",
        json={
            "email": "joshua@example.com",
            "password": "StrongPass123!",
        },
    )

    token = login_response.json["access_token"]

    response = client.get(
        "/api/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )

    assert response.status_code == 200
    assert response.json["user"]["email"] == "joshua@example.com"
