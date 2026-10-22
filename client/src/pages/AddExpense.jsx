import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFinance } from "../context/useFinance";

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

export default function AddExpense() {
  const navigate = useNavigate();
  const { addExpense } = useFinance();

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "Food",
    date: new Date().toISOString().split("T")[0],
    payment: "M-Pesa",
    notes: "",
  });

  const [error, setError] = useState("");

  // Handle form input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // Submit expense
  const handleSubmit = (event) => {
    event.preventDefault();

    setError("");

    // Validate amount
    if (Number(formData.amount) <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }

    // Add expense to FinanceContext
    addExpense(formData);

    // Go back to expenses page
    navigate("/expenses");
  };

  return (
    <div className="form-page">

      {/* Page heading */}
      <div className="form-header">
        <span className="eyebrow">Transactions</span>

        <h1>Add Expense</h1>

        <p>
          Record a new expense and keep track of your spending.
        </p>
      </div>

      {/* Expense form */}
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
              placeholder="e.g. Groceries"
              value={formData.title}
              onChange={handleChange}
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
              placeholder="e.g. 5000"
              value={formData.amount}
              onChange={handleChange}
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

          {/* Payment method */}
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
              placeholder="Optional note"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

        </div>

        {/* Error message */}
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
            Save Expense
          </button>

        </div>

      </form>
    </div>
  );
}