import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useFinance } from "../context/useFinance";

const paymentMethods = [
  "M-Pesa",
  "Cash",
  "Card",
  "Bank Transfer",
];

export default function EditExpense() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    expenses,
    categories,
    updateExpense,
    loading,
    error: financeError,
  } = useFinance();

  const expense = expenses.find(
    (item) => String(item.id) === String(id)
  );

  if (loading) {
    return (
      <div className="empty-state">
        <p>Loading transaction...</p>
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="empty-state">
        <h1>Expense Not Found</h1>

        <p>
          The expense you are trying to edit does not exist.
        </p>

        {financeError && (
          <p className="error-message">{financeError}</p>
        )}

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
    <EditExpenseForm
      key={expense.id}
      id={id}
      expense={expense}
      categories={categories}
      updateExpense={updateExpense}
      navigate={navigate}
      financeError={financeError}
    />
  );
}

function EditExpenseForm({
  id,
  expense,
  categories,
  updateExpense,
  navigate,
  financeError,
}) {
  const [formData, setFormData] = useState({
    title: expense.title || "",
    amount: expense.amount ?? "",
    category_id: String(expense.category_id || ""),
    date: expense.date || "",
    payment: expense.payment || "M-Pesa",
    notes: expense.notes || "",
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
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

    if (!formData.category_id) {
      setError("Please select a category.");
      return;
    }

    setSaving(true);

    try {
      const selectedCategory = categories.find(
        (category) =>
          String(category.id) === formData.category_id
      );

      await updateExpense(id, {
        title: formData.title,
        amount: Number(formData.amount),
        category: selectedCategory?.name || expense.category,
        category_id: Number(formData.category_id),
        date: formData.date,
        payment: formData.payment,
        notes: formData.notes,
      });

      navigate("/expenses");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="form-page">
      <div className="form-header">
        <span className="eyebrow">
          Transactions
        </span>

        <h1>Edit Expense</h1>

        <p>
          Update the details of this expense.
        </p>
      </div>

      <form
        className="panel form-card"
        onSubmit={handleSubmit}
      >
        <div className="form-grid">
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

          <div className="form-group">
            <label htmlFor="category_id">
              Category
            </label>

            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              required
            >
              <option value="">
                Select category
              </option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={String(category.id)}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>

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

          <div className="form-group full-width">
            <label htmlFor="notes">
              Notes
            </label>

            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any additional notes..."
            />
          </div>
        </div>

        {(error || financeError) && (
          <p className="error-message">
            {error || financeError}
          </p>
        )}

        <div className="form-actions">
          <Link
            to="/expenses"
            className="btn btn-secondary"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={saving || categories.length === 0}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
