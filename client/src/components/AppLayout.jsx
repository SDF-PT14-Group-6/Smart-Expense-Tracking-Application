import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="app-shell">
      <header className="app-header">
        <Link to="/dashboard" className="app-logo">
          <span className="brand-icon">S</span>
          <span>SmartExpense</span>
        </Link>

        <nav className="app-nav">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/expenses"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Transactions
          </NavLink>

          <NavLink
            to="/reports"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Reports
          </NavLink>

          <NavLink
            to="/expenses/add"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            + Add Expense
          </NavLink>
        </nav>

        <div className="user-menu">
          <div className="user-info">
            <span className="user-avatar">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </span>

            <div>
              <strong>{user?.name || "User"}</strong>
              <small>{user?.email}</small>
            </div>
          </div>

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}