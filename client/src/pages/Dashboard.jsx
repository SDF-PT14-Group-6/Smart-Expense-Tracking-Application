
import { useState, useEffect, useMemo } from 'react';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/useAuth';
import './Dashboard.css';

export default function Dashboard() {
  const { token, logout } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Format all dashboard amounts in Kenyan Shillings.
  const formatCurrency = (amount) =>
    `KSh ${Number(amount || 0).toLocaleString('en-KE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  // Load this user's transactions from the authenticated Flask API.
  useEffect(() => {
    let cancelled = false;

    async function loadTransactions() {
      setLoading(true);
      setError(null);

      if (!token) {
        setError('Your session has expired. Please sign in again.');
        setLoading(false);
        return;
      }

      try {
        const apiBaseUrl = (
          import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000'
        ).replace(/\/$/, '');

        const response = await fetch(
          `${apiBaseUrl}/api/transactions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const payload = await response.json().catch(() => ({}));

        if (response.status === 401) {
          logout();
          throw new Error('Your session has expired. Please sign in again.');
        }

        if (!response.ok) {
          throw new Error(
            payload.error ||
            payload.message ||
            'Unable to load transactions.'
          );
        }

        const rows = (payload.transactions || []).map((item) => ({
          id: item.id,
          text: item.description,
          amount: Number(item.amount),
          type: item.transaction_type,
          category: item.category_name || item.category || 'Uncategorized',
          date: item.transaction_date,
        }));

        if (!cancelled) {
          setTransactions(rows);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Could not connect to the Flask API.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadTransactions();

    return () => {
      cancelled = true;
    };
  }, [token, logout]);

  // Compute key finance values dynamically.
  const { incomeTotal, expenseTotal, netBalance } = useMemo(() => {
    let inc = 0;
    let exp = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === 'income') {
        inc += Number(transaction.amount);
      } else if (transaction.type === 'expense') {
        exp += Number(transaction.amount);
      }
    });

    return {
      incomeTotal: inc,
      expenseTotal: exp,
      netBalance: inc - exp,
    };
  }, [transactions]);

  // Apply search filtering and category constraints.
  const filteredData = useMemo(() => {
    return transactions.filter((transaction) => {
      const matchText = transaction.text
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchCat =
        selectedCategory === 'All' ||
        transaction.category === selectedCategory;

      return matchText && matchCat;
    });
  }, [transactions, searchTerm, selectedCategory]);

  // Extract spending categories for analytics.
  const categoryAnalytics = useMemo(() => {
    const map = {};

    transactions.forEach((transaction) => {
      if (transaction.type === 'expense') {
        map[transaction.category] =
          (map[transaction.category] || 0) +
          Number(transaction.amount);
      }
    });

    return Object.entries(map);
  }, [transactions]);

  if (loading) {
    return (
      <div className="loader-box">
        <p>Synchronizing financial ledgers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-box">
        <p>⚠️ Interface Connection Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="dash-layout">
      <header className="dash-hero">
        <h1>Financial Dashboard</h1>
        <p>
          Real-time analytics and transaction verification panels.
        </p>
      </header>

      <section className="score-grid">
        <StatCard
          label="Available Balance"
          value={netBalance}
          type="balance"
        />
        <StatCard
          label="Total Earnings"
          value={incomeTotal}
          type="income"
        />
        <StatCard
          label="Total Debits"
          value={expenseTotal}
          type="expense"
        />
      </section>

      <div className="content-split">
        <main className="ledger-card shadow-sm">
          <div className="ledger-controls">
            <h2>Transaction Records</h2>

            <div className="inputs-cluster">
              <input
                type="text"
                placeholder="Search descriptions..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
              />

              <select
                value={selectedCategory}
                onChange={(event) =>
                  setSelectedCategory(event.target.value)
                }
              >
                <option value="All">All Sectors</option>
                <option value="Income">Income Streams</option>
                <option value="Food">Food / Groceries</option>
                <option value="Utilities">Utilities / Bills</option>
                <option value="Entertainment">Entertainment</option>
              </select>
            </div>
          </div>

          <div className="table-responsive">
            {filteredData.length > 0 ? (
              <table className="ledger-table">
                <thead>
                  <tr>
                    <th>Details</th>
                    <th>Sector</th>
                    <th>Date Stamp</th>
                    <th style={{ textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredData.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="font-medium">
                        {transaction.text}
                      </td>

                      <td>
                        <span className="pill-tag">
                          {transaction.category}
                        </span>
                      </td>

                      <td className="text-muted">
                        {transaction.date}
                      </td>

                      <td
                        className={`font-bold align-right ${transaction.type}`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                No matching parameters found in this account.
              </div>
            )}
          </div>
        </main>

        <aside className="analytics-card shadow-sm">
          <h2>Outlays by Sector</h2>

          <div className="sector-stack">
            {categoryAnalytics.map(([category, amount]) => (
              <div key={category} className="sector-row">
                <span className="sector-title">
                  {category}
                </span>

                <span className="sector-val">
                  {formatCurrency(amount)}
                </span>
              </div>
            ))}

            {categoryAnalytics.length === 0 && (
              <div className="empty-state">
                No debit data logged.
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
