
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { useFinance } from "../context/useFinance";

const formatCurrency = (amount) =>
  `KSh ${Number(amount || 0).toLocaleString("en-KE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function Expenses() {
  const {
    expenses,
    deleteExpense,
    loading,
    error: financeError,
  } = useFinance();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [error, setError] = useState("");

  const categories = useMemo(
    () => [
      "All",
      ...new Set(
        expenses.map((expense) => expense.category || "Other")
      ),
    ],
    [expenses]
  );

  const filteredExpenses = useMemo(() => {
    return [...expenses]
      .filter((expense) => {
        const title = (expense.title || "").toLowerCase();
        const expenseCategory = (
          expense.category || ""
        ).toLowerCase();

        const searchTerm = search.toLowerCase();

        const matchesSearch =
          title.includes(searchTerm) ||
          expenseCategory.includes(searchTerm);

        const matchesCategory =
          category === "All" ||
          (expense.category || "Other") === category;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) =>
        (b.date || "").localeCompare(a.date || "")
      );
  }, [expenses, search, category]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this transaction?"
    );

    if (!confirmed) return;

    setError("");

    try {
      await deleteExpense(id);
    } catch (deleteError) {
      setError(deleteError.message);
    }
  };

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <span className="eyebrow">Transactions</span>
          <h1>Transactions</h1>
          <p>
            View, search and manage your recorded income and expenses.
          </p>
        </div>

        <Link to="/expenses/add" className="btn btn-primary">
          + Add Transaction
        </Link>
      </div>

      <section className="panel">
        <div className="filters">
          <input
            type="search"
            placeholder="Search transactions..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="search-input"
          />

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="filter-select"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {(error || financeError) && (
          <div className="error-message">
            {error || financeError}
          </div>
        )}

        {loading ? (
          <div className="empty-state">
            <p>Loading transactions...</p>
          </div>
        ) : filteredExpenses.length > 0 ? (
          <div className="table-wrapper">
            <table className="expenses-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Payment</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredExpenses.map((expense) => {
                  const isIncome = expense.type === "income";

                  return (
                    <tr key={expense.id}>
                      <td>{expense.date}</td>

                      <td>
                        <strong>{expense.title}</strong>

                        {expense.notes && (
                          <small className="table-note">
                            {expense.notes}
                          </small>
                        )}

                        <small className="table-note">
                          Type: {isIncome ? "Income" : "Expense"}
                        </small>
                      </td>

                      <td>{expense.category || "Other"}</td>

                      <td>{expense.payment || "—"}</td>

                      <td className="expense-amount">
                        {isIncome ? "+" : "-"}{" "}
                        {formatCurrency(expense.amount)}
                      </td>

                      <td>
                        <div className="expense-actions">
                          <Link
                            to={`/expenses/edit/${expense.id}`}
                            className="edit-button"
                          >
                            Edit
                          </Link>

                          <button
                            type="button"
                            className="delete-button"
                            onClick={() => handleDelete(expense.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <h2>No transactions found</h2>

            <p>
              {search || category !== "All"
                ? "Try changing your search or category filter."
                : "Start by adding your first income or expense transaction."}
            </p>

            {!search && category === "All" && (
              <Link
                to="/expenses/add"
                className="btn btn-primary"
              >
                Add Your First Transaction
              </Link>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
