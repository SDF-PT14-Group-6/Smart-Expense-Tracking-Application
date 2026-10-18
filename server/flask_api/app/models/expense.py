
from datetime import date, datetime, timezone


from app.extensions import db


class Expense(db.Model):
    __tablename__ = "expenses"

    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(255), nullable=False)
    amount = db.Column(db.Numeric(12, 2), nullable=False)
    transaction_type = db.Column(
        db.String(10),
        nullable=False,
        default="expense",
    )
    transaction_date = db.Column(
        db.Date,
        nullable=False,
        default=date.today,
        index=True,
    )
    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False,
        index=True,
    )
    category_id = db.Column(
        db.Integer,
        db.ForeignKey("categories.id"),
        nullable=False,
        index=True,
    )
    created_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    user = db.relationship("User", back_populates="expenses")
    category = db.relationship("Category", back_populates="expenses")

    __table_args__ = (
        db.CheckConstraint(
            "amount > 0",
            name="ck_expense_amount_positive",
        ),
        db.CheckConstraint(
            "transaction_type IN ('income', 'expense')",
            name="ck_expense_transaction_type",
        ),
    )

    def __repr__(self):
        return f"<Expense {self.description}: {self.amount}>"
