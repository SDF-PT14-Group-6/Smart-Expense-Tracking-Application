from datetime import datetime, timezone

import jwt
from flask import Blueprint, current_app, jsonify, request

from app.extensions import db
from app.models import Category

categories_bp = Blueprint(
    "categories",
    __name__,
    url_prefix="/api/categories",
)


def get_authenticated_user_id():
    """Return the user ID from a valid Bearer token."""
    authorization = request.headers.get("Authorization", "")

    if not authorization.startswith("Bearer "):
        return None

    token = authorization.split(" ", 1)[1].strip()

    if not token:
        return None

    try:
        payload = jwt.decode(
            token,
            current_app.config["SECRET_KEY"],
            algorithms=["HS256"],
        )

        user_id = payload.get("sub")
        if not user_id:
            return None

        return int(user_id)

    except (jwt.InvalidTokenError, ValueError, TypeError):
        return None


@categories_bp.get("")
def get_categories():
    """Return categories belonging only to the authenticated user."""
    user_id = get_authenticated_user_id()

    if user_id is None:
        return jsonify({"error": "Authentication required."}), 401

    categories = db.session.scalars(
        db.select(Category)
        .where(Category.user_id == user_id)
        .order_by(Category.name.asc())
    ).all()

    return jsonify({
        "categories": [
            {
                "id": category.id,
                "name": category.name,
                "description": category.description,
            }
            for category in categories
        ]
    }), 200