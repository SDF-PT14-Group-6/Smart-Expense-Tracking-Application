
import pytest

from app import create_app
from app.extensions import db


@pytest.fixture
def app():
    class TestConfig:
        TESTING = True
        SECRET_KEY = "test-secret-key-for-smart-expense-tests-2026"
        SQLALCHEMY_DATABASE_URI = "sqlite://"
        SQLALCHEMY_TRACK_MODIFICATIONS = False

    test_app = create_app(TestConfig)

    with test_app.app_context():
        db.create_all()
        yield test_app
        db.session.remove()
        db.drop_all()
