import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";

import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import EditExpense from "./pages/EditExpense";
import Expenses from "./pages/Expenses";
import Report from "./pages/Report";
import Login from "./pages/login";
import Register from "./pages/Register";

function LandingPage() {
  return (
    <main>
      <section className="hero-section">
        <div className="hero-content">
          <div className="brand hero-brand">
            <span className="brand-icon">S</span>
            <span>SmartExpense</span>
          </div>

          <h1>Take Control of Your Money</h1>

          <p>
            Track your income, manage your expenses, and understand where your
            money goes — all in one simple and intelligent platform.
          </p>

          <div className="hero-actions">
            <a href="/login" className="primary-button">
              Login
            </a>

            <a href="/register" className="secondary-button">
              Create Account
            </a>
          </div>

          <div className="feature-row">
            <div>
              <strong>Track</strong>
              <span>Every transaction</span>
            </div>

            <div>
              <strong>Analyse</strong>
              <span>Your spending habits</span>
            </div>

            <div>
              <strong>Plan</strong>
              <span>Your financial future</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/expenses/add" element={<AddExpense />} />
        <Route path="/expenses/edit/:id" element={<EditExpense />} />
        <Route path="/reports" element={<Report />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;