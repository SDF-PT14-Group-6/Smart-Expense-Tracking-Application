
from decimal import Decimal

import pytest
from sqlalchemy.exc import IntegrityError

from app import create_app
from app.extensions import db
from app.models import User, Category, Expense


@pytest.fixture
def app():
    class TestConfig:
        TESTING = True
        SECRET_KEY = "test-secret-key"
        SQLALCHEMY_DATABASE_URI = "sqlite://"
        SQLALCHEMY_TRACK_MODIFICATIONS = False

    test_app = create_app(TestConfig)

    with test_app.app_context():
        db.create_all()
        yield test_app
        db.session.remove()
        db.drop_all()


def create_user(username, email):
    user = User(
        username=username,
        email=email,
        password_hash="test-password-hash",
    )
    db.session.add(user)
    db.session.flush()
    return user


def test_models_create_related_records(app):
    with app.app_context():
        user = create_user("testuser", "test@example.com")

        category = Category(
            name="Food",
            description="Food expenses",
            user_id=user.id,
        )
        db.session.add(category)
        db.session.flush()

        expense = Expense(
            description="Lunch",
            amount=Decimal("250.00"),
            transaction_type="expense",
            user_id=user.id,
            category_id=category.id,
        )
        db.session.add(expense)
        db.session.commit()

        saved_expense = db.session.get(Expense, expense.id)

        assert saved_expense is not None
        assert saved_expense.user.username == "testuser"
        assert saved_expense.category.name == "Food"
        assert saved_expense.amount == Decimal("250.00")
        assert len(user.expenses) == 1
        assert len(user.categories) == 1


def test_expense_rejects_invalid_transaction_type(app):
    with app.app_context():
        user = create_user("testuser2", "test2@example.com")
        category = Category(name="Travel", user_id=user.id)
        db.session.add(category)
        db.session.flush()

        expense = Expense(
            description="Bus fare",
            amount=Decimal("100.00"),
            transaction_type="transfer",
            user_id=user.id,
            category_id=category.id,
        )
        db.session.add(expense)

        with pytest.raises(IntegrityError):
            db.session.commit()

        db.session.rollback()


def test_expense_rejects_zero_amount(app):
    with app.app_context():
        user = create_user("testuser3", "test3@example.com")
        category = Category(name="Shopping", user_id=user.id)
        db.session.add(category)
        db.session.flush()

        expense = Expense(
            description="Invalid purchase",
            amount=Decimal("0.00"),
            transaction_type="expense",
            user_id=user.id,
            category_id=category.id,
        )
        db.session.add(expense)

        with pytest.raises(IntegrityError):
            db.session.commit()

        db.session.rollback()


def test_category_name_must_be_unique_per_user(app):
    with app.app_context():
        user = create_user("testuser4", "test4@example.com")

        db.session.add(Category(name="Transport", user_id=user.id))
        db.session.commit()

        db.session.add(Category(name="Transport", user_id=user.id))

        with pytest.raises(IntegrityError):
            db.session.commit()

        db.session.rollback()
