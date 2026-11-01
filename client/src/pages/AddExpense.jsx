import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFinance } from "../context/useFinance";

const paymentMethods = [
  "M-Pesa",
  "Cash",
  "Card",
  "Bank Transfer",
];

export default function AddExpense() {
  const navigate = useNavigate();

  const {
    addExpense,
    categories,
    loading,
  } = useFinance();

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    type: "expense",
    category_id: "",
    date: new Date().toISOString().split("T")[0],
    payment: "M-Pesa",
    notes: "",
  });

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const defaultCategory =
    categories.find(
      (category) => category.name.toLowerCase() === "food"
    ) || categories[0];

  const selectedCategoryId =
    formData.category_id ||
    (defaultCategory ? String(defaultCategory.id) : "");

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
      setError("Please enter a transaction name.");
      return;
    }

    if (Number(formData.amount) <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }

    if (!selectedCategoryId) {
      setError("Please select a category.");
      return;
    }

    setSaving(true);

    try {
      const selectedCategory = categories.find(
        (category) =>
          String(category.id) === selectedCategoryId
      );

      await addExpense({
        title: formData.title,
        amount: Number(formData.amount),
        category: selectedCategory?.name || "",
        category_id: Number(selectedCategoryId),
        date: formData.date,
        payment: formData.payment,
        notes: formData.notes,
        type: formData.type,
      });

      navigate("/expenses");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const isIncome = formData.type === "income";

  return (
    <div className="form-page">
      <div className="form-header">
        <span className="eyebrow">Transactions</span>

        <h1>Add Transaction</h1>

        <p>
          Record your income or expenses and keep track
          of your finances.
        </p>
      </div>

      <form
        className="panel form-card"
        onSubmit={handleSubmit}
      >
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="type">
              Transaction Type
            </label>

            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="title">
              {isIncome ? "Income Source" : "Expense Name"}
            </label>

            <input
              id="title"
              name="title"
              type="text"
              placeholder={
                isIncome ? "e.g. Salary" : "e.g. Groceries"
              }
              value={formData.title}
              onChange={handleChange}
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
              placeholder="e.g. 5000"
              value={formData.amount}
              onChange={handleChange}
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
              value={selectedCategoryId}
              onChange={handleChange}
              required
              disabled={loading || categories.length === 0}
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

            {!loading && categories.length === 0 && (
              <p className="error-message">
                No categories found for your account.
              </p>
            )}
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

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => navigate("/expenses")}
            disabled={saving}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={
              saving ||
              loading ||
              categories.length === 0
            }
          >
            {saving
              ? "Saving..."
              : isIncome
                ? "Save Income"
                : "Save Expense"}
          </button>
        </div>
      </form>
    </div>
  );
}
