from flask import Flask, jsonify
from flask_cors import CORS

from config import Config
from app.extensions import db, migrate
from app.models import User, Category, Expense
from app.routes.auth import auth_bp
from app.routes.transactions import transactions_bp
from app.routes.categories import categories_bp


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    CORS(app)
    db.init_app(app)
    migrate.init_app(app, db)
    app.register_blueprint(auth_bp)
    app.register_blueprint(transactions_bp)
    app.register_blueprint(categories_bp)


    @app.get("/api/health")
    def health_check():
        return jsonify({
            "status": "ok",
            "message": "SmartExpense Flask API is running",
        }), 200

    return app
