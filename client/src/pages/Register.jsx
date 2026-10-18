
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [registerForm, setRegisterForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  async function handleRegister(event) {
    event.preventDefault();
    setError("");

    if (registerForm.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      await register({
        username: registerForm.username,
        email: registerForm.email,
        password: registerForm.password,
      });

      navigate("/login", {
        replace: true,
        state: { registered: true },
      });
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

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

        <h1>Create Your Account</h1>
        <p className="auth-subtitle">
          Start taking control of your personal finances today.
        </p>

        <form onSubmit={handleRegister}>
          <label htmlFor="register-name">Username</label>
          <input
            id="register-name"
            type="text"
            autoComplete="username"
            placeholder="Enter your username"
            value={registerForm.username}
            onChange={(event) =>
              setRegisterForm({
                ...registerForm,
                username: event.target.value,
              })
            }
            maxLength={80}
            required
          />

          <label htmlFor="register-email">Email Address</label>
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={registerForm.email}
            onChange={(event) =>
              setRegisterForm({
                ...registerForm,
                email: event.target.value,
              })
            }
            required
          />

          <label htmlFor="register-password">Password (minimum 8 characters)</label>
          <div className="password-wrapper">
            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create a password"
              value={registerForm.password}
              onChange={(event) =>
                setRegisterForm({
                  ...registerForm,
                  password: event.target.value,
                })
              }
              minLength={8}
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((current) => !current)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <label htmlFor="confirm-password">Confirm Password</label>
          <div className="password-wrapper">
            <input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Confirm your password"
              value={registerForm.confirmPassword}
              onChange={(event) =>
                setRegisterForm({
                  ...registerForm,
                  confirmPassword: event.target.value,
                })
              }
              minLength={8}
              required
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowConfirmPassword((current) => !current)
              }
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>

          {error && <p role="alert" className="error-message">{error}</p>}

          <button
            className="primary-button"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="switch-text">
          Already have an account?{" "}
          <Link to="/login">Sign In</Link>
        </p>
      </div>
    </main>
  );
}
