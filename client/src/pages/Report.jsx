import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useFinance } from "../context/useFinance";

export default function Report() {
  const {
    expenses,
    income,
    totals,
    categoryTotals,
  } = useFinance();

  const categories = useMemo(() => {
    return Object.entries(categoryTotals).sort(
      (a, b) => b[1] - a[1]
    );
  }, [categoryTotals]);

  const highestCategory = categories[0];

  const averageExpense =
    expenses.length > 0
      ? totals.expenses / expenses.length
      : 0;

  const savingsRate =
    totals.income > 0
      ? (totals.balance / totals.income) * 100
      : 0;

  const expenseRate =
    totals.income > 0
      ? (totals.expenses / totals.income) * 100
      : 0;

  return (
    <div className="reports-page">

      {/* Page Header */}
      <div className="page-heading">
        <div>
          <span className="eyebrow">Analytics</span>

          <h1>Financial Report</h1>

          <p>
            Understand your income, expenses and
            overall financial performance.
          </p>
        </div>

        <Link
          to="/expenses/add"
          className="btn btn-primary"
        >
          + Add Expense
        </Link>
      </div>

      {/* Financial Statistics */}
      <div className="stats-grid">

        <div className="stat-card income">
          <div className="stat-card-header">
            <span>Total Income</span>
            <span className="stat-icon">↗</span>
          </div>

          <h2>
            KSh {totals.income.toLocaleString()}
          </h2>

          <p>
            {income.length} income transaction
            {income.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="stat-card expense">
          <div className="stat-card-header">
            <span>Total Expenses</span>
            <span className="stat-icon">↘</span>
          </div>

          <h2>
            KSh {totals.expenses.toLocaleString()}
          </h2>

          <p>
            <p>
             Configured monthly income
          </p>
          </p>
        </div>

        <div className="stat-card balance">
          <div className="stat-card-header">
            <span>Balance</span>
            <span className="stat-icon">◈</span>
          </div>

          <h2>
            KSh {totals.balance.toLocaleString()}
          </h2>

          <p>Income minus expenses</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span>Savings Rate</span>
            <span className="stat-icon">%</span>
          </div>

          <h2>
            {savingsRate.toFixed(1)}%
          </h2>

          <p>Percentage of income remaining</p>
        </div>

      </div>

      {/* Report Sections */}
      <div className="dashboard-grid">

        {/* Spending Categories */}
        <section className="panel">

          <div className="panel-header">
            <div>
              <h2>Spending by Category</h2>

              <p>
                See how your expenses are distributed.
              </p>
            </div>
          </div>

          {categories.length > 0 ? (
            <div className="report-categories">

              {categories.map(
                ([category, amount]) => {
                  const percentage =
                    totals.expenses > 0
                      ? (amount / totals.expenses) * 100
                      : 0;

                  return (
                    <div
                      className="report-category"
                      key={category}
                    >

                      <div className="report-category-header">
                        <strong>{category}</strong>

                        <span>
                          KSh {amount.toLocaleString()}
                        </span>
                      </div>

                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${percentage}%`,
                          }}
                        ></div>
                      </div>

                      <small>
                        {percentage.toFixed(1)}%
                        {" "}of total expenses
                      </small>

                    </div>
                  );
                }
              )}

            </div>
          ) : (
            <div className="empty-state">
              <h3>No expense data</h3>

              <p>
                Add expenses to generate a report.
              </p>
            </div>
          )}

        </section>

        {/* Financial Insights */}
        <section className="panel">

          <div className="panel-header">
            <div>
              <h2>Financial Insights</h2>

              <p>
                Important information about your finances.
              </p>
            </div>
          </div>

          <div className="insight-list">

            <div className="insight">
              <span>↘</span>

              <div>
                <strong>
                  Highest spending category
                </strong>

                <p>
                  {highestCategory
                    ? `${highestCategory[0]} — KSh ${highestCategory[1].toLocaleString()}`
                    : "No data available"}
                </p>
              </div>
            </div>

            <div className="insight">
              <span>◈</span>

              <div>
                <strong>
                  Average expense
                </strong>

                <p>
                  KSh{" "}
                  {Math.round(
                    averageExpense
                  ).toLocaleString()}{" "}
                  per transaction
                </p>
              </div>
            </div>

            <div className="insight">
              <span>%</span>

              <div>
                <strong>
                  Expense rate
                </strong>

                <p>
                  {expenseRate.toFixed(1)}%
                  {" "}of your income has been spent.
                </p>
              </div>
            </div>

            <div className="insight">
              <span>✓</span>

              <div>
                <strong>
                  Current balance
                </strong>

                <p>
                  KSh{" "}
                  {totals.balance.toLocaleString()}
                  {" "}remaining.
                </p>
              </div>
            </div>

          </div>

        </section>

      </div>

      {/* Category Comparison */}
      <section className="panel chart-panel">

        <div className="panel-header">
          <div>
            <h2>Category Comparison</h2>

            <p>
              Compare your spending across categories.
            </p>
          </div>
        </div>

        {categories.length > 0 ? (
          <div className="bar-chart">

            {categories.map(
              ([category, amount]) => {

                const highestAmount =
                  categories[0][1];

                const height = Math.max(
                  (amount / highestAmount) * 180,
                  20
                );

                return (
                  <div
                    className="bar-column"
                    key={category}
                  >

                    <div className="bar-value">
                      KSh{" "}
                      {amount.toLocaleString()}
                    </div>

                    <div className="bar-container">
                      <div
                        className="bar"
                        style={{
                          height: `${height}px`,
                        }}
                      ></div>
                    </div>

                    <span>{category}</span>

                  </div>
                );
              }
            )}

          </div>
        ) : (
          <div className="empty-state">
            <p>
              No data available for the chart.
            </p>
          </div>
        )}

      </section>

      {/* Financial Summary */}
      <section className="panel report-summary">

        <div>
          <h2>Financial Summary</h2>

          <p>
            You have earned KSh{" "}
            {totals.income.toLocaleString()} and
            spent KSh{" "}
            {totals.expenses.toLocaleString()}.
          </p>
        </div>

        <div className="report-balance">
          <span>Remaining</span>

          <strong>
            KSh {totals.balance.toLocaleString()}
          </strong>
        </div>

      </section>

    </div>
  );
}