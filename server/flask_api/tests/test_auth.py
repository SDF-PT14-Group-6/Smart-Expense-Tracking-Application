
import jwt
from werkzeug.security import check_password_hash

from app.extensions import db
from app.models import User


def register_user(client, username="Maureen", email="maureen@example.com",
                  password="SecurePass123!"):
    return client.post(
        "/api/auth/register",
        json={
            "username": username,
            "email": email,
            "password": password,
        },
    )


def test_register_user_successfully(app):
    client = app.test_client()

    response = register_user(client)

    assert response.status_code == 201
    assert response.json["message"] == "Registration successful."
    assert response.json["user"]["email"] == "maureen@example.com"

    with app.app_context():
        user = db.session.scalar(
            db.select(User).where(User.email == "maureen@example.com")
        )
        assert user is not None
        assert user.password_hash != "SecurePass123!"
        assert check_password_hash(user.password_hash, "SecurePass123!")


def test_register_rejects_duplicate_email(app):
    client = app.test_client()

    first_response = register_user(client)
    second_response = register_user(
        client,
        username="AnotherUser",
    )

    assert first_response.status_code == 201
    assert second_response.status_code == 409


def test_register_rejects_short_password(app):
    client = app.test_client()

    response = register_user(client, password="short")

    assert response.status_code == 400


def test_login_returns_jwt_for_correct_password(app):
    client = app.test_client()
    register_user(client)

    response = client.post(
        "/api/auth/login",
        json={
            "email": "maureen@example.com",
            "password": "SecurePass123!",
        },
    )

    assert response.status_code == 200
    assert response.json["token_type"] == "Bearer"
    assert response.json["expires_in"] == 3600

    token = response.json["access_token"]
    decoded = jwt.decode(
        token,
        app.config["SECRET_KEY"],
        algorithms=["HS256"],
    )

    assert decoded["sub"] == str(response.json["user"]["id"])
    assert decoded["email"] == "maureen@example.com"


def test_login_rejects_incorrect_password(app):
    client = app.test_client()
    register_user(client)

    response = client.post(
        "/api/auth/login",
        json={
            "email": "maureen@example.com",
            "password": "WrongPassword123!",
        },
    )

    assert response.status_code == 401


def test_login_rejects_unknown_email(app):
    client = app.test_client()

    response = client.post(
        "/api/auth/login",
        json={
            "email": "unknown@example.com",
            "password": "SecurePass123!",
        },
    )

    assert response.status_code == 401
