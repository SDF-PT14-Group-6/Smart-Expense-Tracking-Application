from app.extensions import db
from app.models import Category, User


def register_and_login(client, username, email):
    registration = client.post(
        "/api/auth/register",
        json={
            "username": username,
            "email": email,
            "password": "SecurePass123!",
        },
    )
    assert registration.status_code == 201

    login = client.post(
        "/api/auth/login",
        json={
            "email": email,
            "password": "SecurePass123!",
        },
    )
    assert login.status_code == 200

    token = login.json["access_token"]
    return {"Authorization": f"Bearer {token}"}


def create_category(app, user_email, name="Food"):
    with app.app_context():
        user = db.session.scalar(
            db.select(User).where(User.email == user_email)
        )

        category = db.session.scalar(
            db.select(Category).where(
                Category.user_id == user.id,
                Category.name == name,
            )
        )

        if category is None:
            category = Category(
                name=name,
                description=f"{name} category",
                user_id=user.id,
            )
            db.session.add(category)
            db.session.commit()

        return category.id
        
def transaction_payload(category_id, **overrides):
    payload = {
        "description": "Lunch",
        "amount": "450.00",
        "transaction_type": "expense",
        "transaction_date": "2026-10-18",
        "category_id": category_id,
    }
    payload.update(overrides)
    return payload


def test_transactions_require_authentication(app):
    client = app.test_client()

    response = client.get("/api/transactions")

    assert response.status_code == 401


def test_create_and_list_transaction(app):
    client = app.test_client()
    headers = register_and_login(
        client,
        "Maureen",
        "maureen@example.com",
    )
    category_id = create_category(app, "maureen@example.com")

    created = client.post(
        "/api/transactions",
        json=transaction_payload(category_id),
        headers=headers,
    )

    assert created.status_code == 201
    assert created.json["transaction"]["description"] == "Lunch"
    assert created.json["transaction"]["amount"] == 450.0
    assert created.json["transaction"]["category"] == "Food"

    listed = client.get("/api/transactions", headers=headers)

    assert listed.status_code == 200
    assert len(listed.json["transactions"]) == 1
    assert listed.json["transactions"][0]["description"] == "Lunch"


def test_create_transaction_rejects_invalid_amount(app):
    client = app.test_client()
    headers = register_and_login(
        client,
        "Maureen",
        "maureen@example.com",
    )
    category_id = create_category(app, "maureen@example.com")

    response = client.post(
        "/api/transactions",
        json=transaction_payload(category_id, amount="-10"),
        headers=headers,
    )

    assert response.status_code == 400


def test_user_cannot_use_another_users_category(app):
    client = app.test_client()

    headers_a = register_and_login(
        client,
        "Maureen",
        "maureen@example.com",
    )
    register_and_login(
        client,
        "Alex",
        "alex@example.com",
    )
    alex_category_id = create_category(
        app,
        "alex@example.com",
        name="Travel",
    )

    response = client.post(
        "/api/transactions",
        json=transaction_payload(alex_category_id),
        headers=headers_a,
    )

    assert response.status_code == 404


def test_update_and_delete_transaction(app):
    client = app.test_client()
    headers = register_and_login(
        client,
        "Maureen",
        "maureen@example.com",
    )
    category_id = create_category(app, "maureen@example.com")

    created = client.post(
        "/api/transactions",
        json=transaction_payload(category_id),
        headers=headers,
    )
    transaction_id = created.json["transaction"]["id"]

    updated = client.patch(
        f"/api/transactions/{transaction_id}",
        json={"description": "Dinner", "amount": "600.00"},
        headers=headers,
    )

    assert updated.status_code == 200
    assert updated.json["transaction"]["description"] == "Dinner"
    assert updated.json["transaction"]["amount"] == 600.0

    deleted = client.delete(
        f"/api/transactions/{transaction_id}",
        headers=headers,
    )

    assert deleted.status_code == 200

    listed = client.get("/api/transactions", headers=headers)
    assert listed.status_code == 200
    assert listed.json["transactions"] == []


def test_user_cannot_update_another_users_transaction(app):
    client = app.test_client()

    headers_a = register_and_login(
        client,
        "Maureen",
        "maureen@example.com",
    )
    headers_b = register_and_login(
        client,
        "Alex",
        "alex@example.com",
    )
    alex_category_id = create_category(
        app,
        "alex@example.com",
        name="Travel",
    )

    created = client.post(
        "/api/transactions",
        json=transaction_payload(alex_category_id),
        headers=headers_b,
    )
    assert created.status_code == 201

    transaction_id = created.json["transaction"]["id"]

    response = client.patch(
        f"/api/transactions/{transaction_id}",
        json={"description": "Changed by another user"},
        headers=headers_a,
    )

    assert response.status_code == 404


def test_user_cannot_delete_another_users_transaction(app):
    client = app.test_client()

    headers_a = register_and_login(
        client,
        "Maureen",
        "maureen@example.com",
    )
    headers_b = register_and_login(
        client,
        "Alex",
        "alex@example.com",
    )
    alex_category_id = create_category(
        app,
        "alex@example.com",
        name="Travel",
    )

    created = client.post(
        "/api/transactions",
        json=transaction_payload(alex_category_id),
        headers=headers_b,
    )
    assert created.status_code == 201

    transaction_id = created.json["transaction"]["id"]

    response = client.delete(
        f"/api/transactions/{transaction_id}",
        headers=headers_a,
    )

    assert response.status_code == 404

    alex_transactions = client.get(
        "/api/transactions",
        headers=headers_b,
    )
    assert len(alex_transactions.json["transactions"]) == 1
