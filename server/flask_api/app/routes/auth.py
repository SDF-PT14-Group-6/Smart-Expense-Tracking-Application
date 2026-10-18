
from datetime import datetime, timedelta, timezone

import jwt
from flask import Blueprint, current_app, jsonify, request
from sqlalchemy import or_
from werkzeug.security import check_password_hash, generate_password_hash

from app.extensions import db
from app.models import Category, User

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


def create_access_token(user):
    """Create a signed JWT for an authenticated user."""
    now = datetime.now(timezone.utc)
    expires_at = now + timedelta(hours=1)

    return jwt.encode(
        {
            "sub": str(user.id),
            "email": user.email,
            "iat": now,
            "exp": expires_at,
        },
        current_app.config["SECRET_KEY"],
        algorithm="HS256",
    )


@auth_bp.post("/register")
def register():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({"error": "A JSON request body is required."}), 400

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not all(isinstance(value, str) for value in (username, email, password)):
        return jsonify({
            "error": "Username, email, and password are required."
        }), 400

    username = username.strip()
    email = email.strip().lower()

    if not username or not email or not password:
        return jsonify({
            "error": "Username, email, and password cannot be empty."
        }), 400

    if len(username) > 80 or len(email) > 255:
        return jsonify({"error": "Username or email is too long."}), 400

    if len(password) < 8:
        return jsonify({
            "error": "Password must be at least 8 characters long."
        }), 400

    existing_user = db.session.scalar(
        db.select(User).where(
            or_(User.username == username, User.email == email)
        )
    )

    if existing_user:
        return jsonify({
            "error": "That username or email is already registered."
        }), 409

    user = User(
        username=username,
        email=email,
        password_hash=generate_password_hash(password),
    )

    default_categories = [
        "Food",
        "Transport",
        "Utilities",
        "Shopping",
        "Entertainment",
        "Health",
        "Education",
        "Rent",
        "Other",
        "Salary",
        "Other Income",
    ]

    try:
        db.session.add(user)
        db.session.flush()

        for category_name in default_categories:
            db.session.add(
                Category(
                    name=category_name,
                    user_id=user.id,
                )
            )

        db.session.commit()
    except Exception:
        db.session.rollback()
        current_app.logger.exception("User registration failed.")
        return jsonify({"error": "Unable to register user."}), 500

    return jsonify({
        "message": "Registration successful.",
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
        },
    }), 201


@auth_bp.post("/login")
def login():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({"error": "A JSON request body is required."}), 400

    email = data.get("email")
    password = data.get("password")

    if not isinstance(email, str) or not isinstance(password, str):
        return jsonify({"error": "Email and password are required."}), 400

    email = email.strip().lower()

    if not email or not password:
        return jsonify({"error": "Email and password are required."}), 400

    user = db.session.scalar(
        db.select(User).where(User.email == email)
    )

    if user is None or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid email or password."}), 401

    token = create_access_token(user)

    return jsonify({
        "message": "Login successful.",
        "access_token": token,
        "token_type": "Bearer",
        "expires_in": 3600,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
        },
    }), 200
