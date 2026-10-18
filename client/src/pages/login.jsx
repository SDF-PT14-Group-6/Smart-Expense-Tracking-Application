import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);

    try {
      await login(loginForm.email.trim(), loginForm.password);
      setMessage("Login successful. Welcome to SmartExpense!");

      const redirectTo =
        location.state?.from?.pathname || "/dashboard";

      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed. Please check your details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <Link to="/" className="back-button">
          ← Back to Home
        </Link>

        <div className="brand">
          <span className="brand-icon">S</span>
          <span>SmartExpense</span>
        </div>

        <h1>Welcome Back</h1>

        <p className="auth-subtitle">
          Sign in to continue managing your finances.
        </p>

        <form onSubmit={handleLogin}>
          <label htmlFor="login-email">Email Address</label>

          <input
            id="login-email"
            type="email"
            placeholder="you@example.com"
            value={loginForm.email}
            onChange={(event) =>
              setLoginForm({
                ...loginForm,
                email: event.target.value,
              })
            }
            required
          />

          <label htmlFor="login-password">Password</label>

          <div className="password-wrapper">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={loginForm.password}
              onChange={(event) =>
                setLoginForm({
                  ...loginForm,
                  password: event.target.value,
                })
              }
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            className="primary-button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {message && (
          <p className="success-message">{message}</p>
        )}

        {error && (
          <p className="error-message" role="alert">{error}</p>
        )}

        <p className="switch-text">
          Don't have an account?{" "}
          <Link to="/register">Create Account</Link>
        </p>
      </div>
    </main>
  );
}