import { Link } from "react-router-dom";
import { useFinance } from "../context/useFinance";

function StatCard({ title, amount, description, icon, type }) {
  return (
    <div className={`stat-card ${type || ""}`}>
      <div className="stat-card-header">
        <span>{title}</span>
        <span className="stat-icon">{icon}</span>
      </div>

      <h2>{amount}</h2>

      <p>{description}</p>
    </div>
  );
}

function CategoryBar({ category, amount, total }) {
  const percentage = total
    ? Math.min((amount / total) * 100, 100)
    : 0;

  return (
    <div className="category-item">
      <div className="category-info">
        <span>{category}</span>
        <strong>KSh {amount.toLocaleString()}</strong>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      <small>{percentage.toFixed(0)}%</small>
    </div>
  );
}

export default function Dashboard() {
  const {
    expenses,
    totals,
    categoryTotals,
  } = useFinance();

  const recentExpenses = [...expenses]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  const categories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className="dashboard">

      {/* Page Header */}
      <div className="page-header">
        <div>
          <span className="eyebrow">Overview</span>

          <h1>Financial Dashboard</h1>

          <p>
            Track your income, expenses and financial progress.
          </p>
        </div>

        <Link
          to="/expenses/add"
          className="btn btn-primary"
        >
          + Add Expense
        </Link>
      </div>

      {/* Statistics */}
      <div className="stats-grid">

        <StatCard
          title="Total Income"
          amount={`KSh ${totals.income.toLocaleString()}`}
          description="Total money received"
          icon="↗"
          type="income"
        />

        <StatCard
          title="Total Expenses"
          amount={`KSh ${totals.expenses.toLocaleString()}`}
          description="Total money spent"
          icon="↘"
          type="expense"
        />

        <StatCard
          title="Current Balance"
          amount={`KSh ${totals.balance.toLocaleString()}`}
          description="Income minus expenses"
          icon="◈"
          type="balance"
        />

        <StatCard
          title="Transactions"
          amount={expenses.length}
          description="Recorded expenses"
          icon="▤"
          type="transactions"
        />

      </div>

      {/* Main Dashboard */}
      <div className="dashboard-grid">

        {/* Spending by Category */}
        <section className="panel">

          <div className="panel-header">
            <div>
              <h2>Spending by Category</h2>

              <p>
                See where your money is going.
              </p>
            </div>

            <Link to="/reports">
              View Report
            </Link>
          </div>

          <div className="category-list">

            {categories.length > 0 ? (
              categories.map(([category, amount]) => (
                <CategoryBar
                  key={category}
                  category={category}
                  amount={amount}
                  total={totals.expenses}
                />
              ))
            ) : (
              <p className="empty-text">
                No expenses recorded yet.
              </p>
            )}

          </div>

        </section>

        {/* Recent Expenses */}
        <section className="panel">

          <div className="panel-header">
            <div>
              <h2>Recent Expenses</h2>

              <p>
                Your latest transactions.
              </p>
            </div>

            <Link to="/expenses">
              View All
            </Link>
          </div>

          <div className="transaction-list">

            {recentExpenses.length > 0 ? (
              recentExpenses.map((expense) => (
                <div
                  className="transaction"
                  key={expense.id}
                >

                  <div className="transaction-icon">
                    💰
                  </div>

                  <div className="transaction-info">

                    <strong>
                      {expense.title}
                    </strong>

                    <small>
                      {expense.category} • {expense.date}
                    </small>

                  </div>

                  <strong className="expense-amount">
                    - KSh{" "}
                    {Number(
                      expense.amount
                    ).toLocaleString()}
                  </strong>

                </div>
              ))
            ) : (
              <p className="empty-text">
                No expenses recorded yet.
              </p>
            )}

          </div>

        </section>

      </div>

      {/* Financial Summary */}
      <section className="panel financial-summary">

        <div className="panel-header">

          <div>
            <h2>Financial Summary</h2>

            <p>
              Your overall financial position.
            </p>
          </div>

          <Link to="/reports">
            View Reports
          </Link>

        </div>

        <div className="summary-grid">

          <div className="summary-item">
            <span>Total Income</span>

            <strong>
              KSh {totals.income.toLocaleString()}
            </strong>
          </div>

          <div className="summary-item">
            <span>Total Expenses</span>

            <strong>
              KSh {totals.expenses.toLocaleString()}
            </strong>
          </div>

          <div className="summary-item">
            <span>Remaining Balance</span>

            <strong>
              KSh {totals.balance.toLocaleString()}
            </strong>
          </div>

          <div className="summary-item">
            <span>Expense Rate</span>

            <strong>
              {totals.income > 0
                ? (
                    (totals.expenses /
                      totals.income) *
                    100
                  ).toFixed(1)
                : 0}
              %
            </strong>
          </div>

        </div>

      </section>

    </div>
  );
}