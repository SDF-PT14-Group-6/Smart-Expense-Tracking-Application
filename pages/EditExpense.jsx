import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useFinance } from "../context/FinanceContext";

const categories = [
  "Food",
  "Transport",
  "Utilities",
  "Shopping",
  "Entertainment",
  "Health",
  "Education",
  "Rent",
  "Other",
];

const paymentMethods = [
  "M-Pesa",
  "Cash",
  "Card",
  "Bank Transfer",
];

export default function EditExpense() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { expenses, updateExpense } = useFinance();

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "Food",
    date: "",
    payment: "M-Pesa",
    notes: "",
  });

  const [error, setError] = useState("");

  // Find the expense being edited
  const expense = expenses.find(
    (item) => String(item.id) === String(id)
  );

  // Load existing expense into the form
  useEffect(() => {
    if (expense) {
      setFormData({
        title: expense.title || "",
        amount: expense.amount || "",
        category: expense.category || "Food",
        date: expense.date || "",
        payment: expense.payment || "M-Pesa",
        notes: expense.notes || "",
      });
    }
  }, [expense]);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // Save changes
  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");

    if (!formData.title.trim()) {
      setError("Please enter an expense name.");
      return;
    }

    if (Number(formData.amount) <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }

    updateExpense(id, {
      ...formData,
      amount: Number(formData.amount),
    });

    navigate("/expenses");
  };

  // Expense does not exist
  if (!expense) {
    return (
      <div className="empty-state">
        <h1>Expense Not Found</h1>

        <p>
          The expense you are trying to edit does not exist.
        </p>

        <Link
          to="/expenses"
          className="btn btn-primary"
        >
          Back to Expenses
        </Link>
      </div>
    );
  }

  return (
    <div className="form-page">

      {/* Header */}
      <div className="form-header">
        <span className="eyebrow">
          Transactions
        </span>

        <h1>Edit Expense</h1>

        <p>
          Update the details of this expense.
        </p>
      </div>

      {/* Form */}
      <form
        className="panel form-card"
        onSubmit={handleSubmit}
      >

        <div className="form-grid">

          {/* Expense name */}
          <div className="form-group">
            <label htmlFor="title">
              Expense Name
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Groceries"
              required
            />
          </div>

          {/* Amount */}
          <div className="form-group">
            <label htmlFor="amount">
              Amount (KSh)
            </label>

            <input
              id="amount"
              name="amount"
              type="number"
              min="1"
              value={formData.amount}
              onChange={handleChange}
              placeholder="e.g. 5000"
              required
            />
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="category">
              Category
            </label>

            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="form-group">
            <label htmlFor="date">
              Date
            </label>

            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          {/* Payment */}
          <div className="form-group">
            <label htmlFor="payment">
              Payment Method
            </label>

            <select
              id="payment"
              name="payment"
              value={formData.payment}
              onChange={handleChange}
            >
              {paymentMethods.map((method) => (
                <option
                  key={method}
                  value={method}
                >
                  {method}
                </option>
              ))}
            </select>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label htmlFor="notes">
              Notes
            </label>

            <input
              id="notes"
              name="notes"
              type="text"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Optional note"
            />
          </div>

        </div>

        {/* Error */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="form-actions">

          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate("/expenses")}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn-primary"
          >
            Save Changes
          </button>

        </div>

      </form>
    </div>
  );
}