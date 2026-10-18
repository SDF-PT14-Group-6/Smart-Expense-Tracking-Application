import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { useFinance } from "../context/useFinance";

export default function Expenses() {
  const { expenses, deleteExpense } = useFinance();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(
    () => ["All", ...new Set(expenses.map((expense) => expense.category))],
    [expenses]
  );

  const filteredExpenses = useMemo(() => {
    return [...expenses]
      .filter((expense) => {
        const matchesSearch =
          expense.title.toLowerCase().includes(search.toLowerCase()) ||
          expense.category.toLowerCase().includes(search.toLowerCase());

        const matchesCategory =
          category === "All" || expense.category === category;

        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [expenses, search, category]);

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (confirmed) {
      deleteExpense(id);
    }
  };

  return (
    <div className="dashboard">
      <div className="page-header">
        <div>
          <span className="eyebrow">Transactions</span>
          <h1>Expense Transactions</h1>
          <p>View, search and manage your recorded expenses.</p>
        </div>

        <Link to="/expenses/add" className="btn btn-primary">
          + Add Expense
        </Link>
      </div>

      <section className="panel">
        <div className="filters">
          <input
            type="search"
            placeholder="Search expenses..."
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

        {filteredExpenses.length > 0 ? (
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
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id}>
                    <td>{expense.date}</td>

                    <td>
                      <strong>{expense.title}</strong>
                      {expense.notes && (
                        <small className="table-note">
                          {expense.notes}
                        </small>
                      )}
                    </td>

                    <td>{expense.category}</td>

                    <td>{expense.payment || "—"}</td>

                    <td className="expense-amount">
                      - KSh {Number(expense.amount).toLocaleString()}
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
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <h2>No expenses found</h2>
            <p>
              {search || category !== "All"
                ? "Try changing your search or filter."
                : "Start by adding your first expense."}
            </p>

            {!search && category === "All" && (
              <Link to="/expenses/add" className="btn btn-primary">
                Add Your First Expense
              </Link>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
