
from datetime import datetime, timezone

from app.extensions import db


class Category(db.Model):
    __tablename__ = "categories"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    description = db.Column(db.String(255))
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False,
        index=True,
    )
    created_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    user = db.relationship("User", back_populates="categories")
    expenses = db.relationship("Expense", back_populates="category")

    __table_args__ = (
        db.UniqueConstraint(
            "user_id",
            "name",
            name="uq_category_user_name",
        ),
    )

    def __repr__(self):
        return f"<Category {self.name}>"
