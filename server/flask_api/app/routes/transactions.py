
from datetime import date
from decimal import Decimal, InvalidOperation

import jwt
from flask import Blueprint, current_app, jsonify, request
from sqlalchemy.exc import IntegrityError

from app.extensions import db
from app.models import Category, Expense

transactions_bp = Blueprint(
    "transactions",
    __name__,
    url_prefix="/api/transactions",
)


def authenticated_user_id():
    """Return the authenticated user's ID or None."""
    header = request.headers.get("Authorization", "")
    parts = header.split()

    if len(parts) != 2 or parts[0].lower() != "bearer":
        return None

    try:
        payload = jwt.decode(
            parts[1],
            current_app.config["SECRET_KEY"],
            algorithms=["HS256"],
        )
        return int(payload["sub"])
    except (jwt.InvalidTokenError, KeyError, TypeError, ValueError):
        return None


def transaction_to_dict(transaction):
    return {
        "id": transaction.id,
        "description": transaction.description,
        "amount": float(transaction.amount),
        "transaction_type": transaction.transaction_type,
        "transaction_date": transaction.transaction_date.isoformat(),
        "category_id": transaction.category_id,
        "category": transaction.category.name,
    }


def parse_transaction_data(data, existing=None):
    """Validate fields and return transaction values or an error."""
    if not isinstance(data, dict):
        return None, "A JSON request body is required."

    existing = existing or {}

    description = data.get("description", existing.get("description"))
    amount = data.get("amount", existing.get("amount"))
    transaction_type = data.get(
        "transaction_type",
        existing.get("transaction_type", "expense"),
    )
    transaction_date = data.get(
        "transaction_date",
        existing.get("transaction_date"),
    )
    category_id = data.get("category_id", existing.get("category_id"))

    if not isinstance(description, str) or not description.strip():
        return None, "Description is required."

    description = description.strip()
    if len(description) > 255:
        return None, "Description must not exceed 255 characters."

    if isinstance(amount, bool) or amount is None:
        return None, "A positive amount is required."

    try:
        amount = Decimal(str(amount))
    except (InvalidOperation, ValueError):
        return None, "Amount must be a valid number."

    if not amount.is_finite() or amount <= 0 or amount > Decimal("9999999999.99"):
        return None, "Amount must be positive and within the supported limit."

    if transaction_type not in ("income", "expense"):
        return None, "Transaction type must be 'income' or 'expense'."

    if isinstance(transaction_date, date):
        parsed_date = transaction_date
    elif isinstance(transaction_date, str):
        try:
            parsed_date = date.fromisoformat(transaction_date)
        except ValueError:
            return None, "Transaction date must use YYYY-MM-DD format."
    elif transaction_date is None:
        parsed_date = date.today()
    else:
        return None, "Transaction date must use YYYY-MM-DD format."

    if isinstance(category_id, bool):
        return None, "A valid category ID is required."

    try:
        category_id = int(category_id)
    except (TypeError, ValueError):
        return None, "A valid category ID is required."

    if category_id <= 0:
        return None, "A valid category ID is required."

    return {
        "description": description,
        "amount": amount,
        "transaction_type": transaction_type,
        "transaction_date": parsed_date,
        "category_id": category_id,
    }, None


@transactions_bp.get("")
def list_transactions():
    user_id = authenticated_user_id()
    if user_id is None:
        return jsonify({"error": "Authentication required."}), 401

    query = db.select(Expense).where(Expense.user_id == user_id)

    transaction_type = request.args.get("type")
    if transaction_type:
        if transaction_type not in ("income", "expense"):
            return jsonify({
                "error": "Type must be 'income' or 'expense'."
            }), 400
        query = query.where(Expense.transaction_type == transaction_type)

    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    try:
        if start_date:
            query = query.where(
                Expense.transaction_date >= date.fromisoformat(start_date)
            )
        if end_date:
            query = query.where(
                Expense.transaction_date <= date.fromisoformat(end_date)
            )
    except ValueError:
        return jsonify({
            "error": "Dates must use YYYY-MM-DD format."
        }), 400

    transactions = db.session.scalars(
        query.order_by(Expense.transaction_date.desc(), Expense.id.desc())
    ).all()

    return jsonify({
        "transactions": [transaction_to_dict(item) for item in transactions]
    }), 200


@transactions_bp.post("")
def create_transaction():
    user_id = authenticated_user_id()
    if user_id is None:
        return jsonify({"error": "Authentication required."}), 401

    values, error = parse_transaction_data(request.get_json(silent=True))
    if error:
        return jsonify({"error": error}), 400

    category = db.session.get(Category, values["category_id"])
    if category is None or category.user_id != user_id:
        return jsonify({
            "error": "Category not found for this user."
        }), 404

    transaction = Expense(user_id=user_id, **values)
    db.session.add(transaction)

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Transaction could not be saved."}), 400

    return jsonify({
        "message": "Transaction created successfully.",
        "transaction": transaction_to_dict(transaction),
    }), 201


@transactions_bp.patch("/<int:transaction_id>")
def update_transaction(transaction_id):
    user_id = authenticated_user_id()
    if user_id is None:
        return jsonify({"error": "Authentication required."}), 401

    transaction = db.session.scalar(
        db.select(Expense).where(
            Expense.id == transaction_id,
            Expense.user_id == user_id,
        )
    )
    if transaction is None:
        return jsonify({"error": "Transaction not found."}), 404

    values, error = parse_transaction_data(
        request.get_json(silent=True),
        existing={
            "description": transaction.description,
            "amount": transaction.amount,
            "transaction_type": transaction.transaction_type,
            "transaction_date": transaction.transaction_date,
            "category_id": transaction.category_id,
        },
    )
    if error:
        return jsonify({"error": error}), 400

    category = db.session.get(Category, values["category_id"])
    if category is None or category.user_id != user_id:
        return jsonify({
            "error": "Category not found for this user."
        }), 404

    for field, value in values.items():
        setattr(transaction, field, value)

    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "Transaction could not be updated."}), 400

    return jsonify({
        "message": "Transaction updated successfully.",
        "transaction": transaction_to_dict(transaction),
    }), 200


@transactions_bp.delete("/<int:transaction_id>")
def delete_transaction(transaction_id):
    user_id = authenticated_user_id()
    if user_id is None:
        return jsonify({"error": "Authentication required."}), 401

    transaction = db.session.scalar(
        db.select(Expense).where(
            Expense.id == transaction_id,
            Expense.user_id == user_id,
        )
    )
    if transaction is None:
        return jsonify({"error": "Transaction not found."}), 404

    db.session.delete(transaction)
    db.session.commit()

    return jsonify({"message": "Transaction deleted successfully."}), 200
