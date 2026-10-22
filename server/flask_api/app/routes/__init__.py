from flask import Flask, jsonify
from flask_cors import CORS

from config import Config
from app.extensions import db, migrate, jwt
from app.models import User


def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # Allow the local Vite frontend to call the Flask API.
    CORS(
        app,
        resources={
            r"/api/*": {
                "origins": [
                    "http://localhost:5173",
                    "http://127.0.0.1:5173",
                ]
            }
        },
    )

    from app.routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    @app.get("/api/health")
    def health_check():
        return jsonify({
            "status": "ok",
            "message": "Smart Expense Flask API is running",
        }), 200

    return app
