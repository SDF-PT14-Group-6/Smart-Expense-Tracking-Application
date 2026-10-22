from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required
from sqlalchemy import or_
from sqlalchemy.exc import IntegrityError

from app.extensions import db
from app.models import User

auth_bp = Blueprint("auth", __name__)


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

    if "@" not in email or email.startswith("@") or email.endswith("@"):
        return jsonify({"error": "Enter a valid email address."}), 400

    if len(password) < 8:
        return jsonify({
            "error": "Password must contain at least 8 characters."
        }), 400

    existing_user = db.session.execute(
        db.select(User).where(
            or_(User.username == username, User.email == email)
        )
    ).scalar_one_or_none()

    if existing_user:
        return jsonify({
            "error": "That username or email is already registered."
        }), 409

    user = User(username=username, email=email)
    user.set_password(password)

    try:
        db.session.add(user)
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({
            "error": "That username or email is already registered."
        }), 409

    return jsonify({
        "message": "Registration successful.",
        "user": user.to_dict(),
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

    user = db.session.execute(
        db.select(User).where(User.email == email)
    ).scalar_one_or_none()

    if user is None or not user.check_password(password):
        return jsonify({"error": "Invalid email or password."}), 401

    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        "message": "Login successful.",
        "access_token": access_token,
        "user": user.to_dict(),
    }), 200


@auth_bp.get("/me")
@jwt_required()
def get_current_user():
    user_id = get_jwt_identity()

    try:
        user = db.session.get(User, int(user_id))
    except (TypeError, ValueError):
        user = None

    if user is None:
        return jsonify({"error": "User not found."}), 404

    return jsonify({"user": user.to_dict()}), 200
