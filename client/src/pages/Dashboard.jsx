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

  // Load this user's transactions from the authenticated Flask API.
  useEffect(() => {
    let cancelled = false;

    async function loadTransactions() {
      setLoading(true);
      setError(null);

      if (!token) {
        setError("Your session has expired. Please sign in again.");
        setLoading(false);
        return;
      }

      try {
        const apiBaseUrl = (
          import.meta.env.VITE_API_URL || "http://127.0.0.1:5000"
        ).replace(/\/$/, "");

        const response = await fetch(`${apiBaseUrl}/api/transactions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const payload = await response.json().catch(() => ({}));

        if (response.status === 401) {
          logout();
          throw new Error("Your session has expired. Please sign in again.");
        }

        if (!response.ok) {
          throw new Error(
            payload.error || payload.message || "Unable to load transactions."
          );
        }

        const rows = (payload.transactions || []).map((item) => ({
          id: item.id,
          text: item.description,
          amount: Number(item.amount),
          type: item.transaction_type,
          category: item.category_name || item.category || "Uncategorized",
          date: item.transaction_date,
        }));

        if (!cancelled) setTransactions(rows);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Could not connect to the Flask API.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadTransactions();

    return () => {
      cancelled = true;
    };
  }, [token, logout]);

  // Compute key finance values dynamically
  const { incomeTotal, expenseTotal, netBalance } = useMemo(() => {
    let inc = 0; let exp = 0;
    transactions.forEach(t => {
      t.type === 'income' ? inc += Number(t.amount) : exp += Number(t.amount);
    });
    return { incomeTotal: inc, expenseTotal: exp, netBalance: inc - exp };
  }, [transactions]);

  // Apply visual search filtering and category constraints
  const filteredData = useMemo(() => {
    return transactions.filter(t => {
      const matchText = t.text.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = selectedCategory === 'All' || t.category === selectedCategory;
      return matchText && matchCat;
    });
  }, [transactions, searchTerm, selectedCategory]);

  // Extract spending categories for live analytics tracking
  const categoryAnalytics = useMemo(() => {
    const map = {};
    transactions.forEach(t => {
      if (t.type === 'expense') map[t.category] = (map[t.category] || 0) + Number(t.amount);
    });
    return Object.entries(map);
  }, [transactions]);

  if (loading) return <div className="loader-box"><p>Synchronizing financial ledgers...</p></div>;
  if (error) return <div className="error-box"><p>⚠️ Interface Connection Error: {error}</p></div>;

  return (
    <div className="dash-layout">
      <header className="dash-hero">
        <h1>Financial Dashboard</h1>
        <p>Real-time analytics and transaction verification panels.</p>
      </header>

      {/* Metrics Scoreboard displaying modular components */}
      <section className="score-grid">
        <StatCard label="Available Balance" value={netBalance} type="balance" />
        <StatCard label="Total Earnings" value={incomeTotal} type="income" />
        <StatCard label="Total Debits" value={expenseTotal} type="expense" />
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
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
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
                  {filteredData.map((t) => (
                    <tr key={t.id}>
                      <td className="font-medium">{t.text}</td>
                      <td><span className="pill-tag">{t.category}</span></td>
                      <td className="text-muted">{t.date}</td>
                      <td className={`font-bold align-right ${t.type}`}>
                        {t.type === 'income' ? '+' : '-'}\Total \${t.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">No matching parameters found in this account.</div>
            )}
          </div>
        </main>

        <aside className="analytics-card shadow-sm">
          <h2>Outlays by Sector</h2>
          <div className="sector-stack">
            {categoryAnalytics.map(([cat, val]) => (
              <div key={cat} className="sector-row">
                <span className="sector-title">{cat}</span>
                <span className="sector-val">\${val.toLocaleString()}</span>
              </div>
            ))}
            {categoryAnalytics.length === 0 && <div className="empty-state">No debit data logged.</div>}
          </div>
        </aside>
      </div>
    </div>
  );
}
