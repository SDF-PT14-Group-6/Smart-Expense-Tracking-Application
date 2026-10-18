import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleRegister = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (registerForm.password !== registerForm.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (registerForm.password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      await register(
        registerForm.name.trim(),
        registerForm.email.trim(),
        registerForm.password
      );

      setMessage("Account created successfully. Opening your dashboard...");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
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

        <h1>Create Your Account</h1>

        <p className="auth-subtitle">
          Start taking control of your personal finances today.
        </p>

        <form onSubmit={handleRegister}>
          <label htmlFor="register-name">Full Name</label>

          <input
            id="register-name"
            type="text"
            placeholder="Enter your full name"
            value={registerForm.name}
            onChange={(event) =>
              setRegisterForm({
                ...registerForm,
                name: event.target.value,
              })
            }
            required
          />

          <label htmlFor="register-email">Email Address</label>

          <input
            id="register-email"
            type="email"
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

          <label htmlFor="register-password">Password</label>

          <div className="password-wrapper">
            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={registerForm.password}
              onChange={(event) =>
                setRegisterForm({
                  ...registerForm,
                  password: event.target.value,
                })
              }
              required
              minLength="8"
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <label htmlFor="confirm-password">Confirm Password</label>

          <div className="password-wrapper">
            <input
              id="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={registerForm.confirmPassword}
              onChange={(event) =>
                setRegisterForm({
                  ...registerForm,
                  confirmPassword: event.target.value,
                })
              }
              required
              minLength="8"
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            className="primary-button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {message && (
          <p className="success-message">{message}</p>
        )}

        {error && (
          <p className="error-message" role="alert">{error}</p>
        )}

        <p className="switch-text">
          Already have an account?{" "}
          <Link to="/login">Sign In</Link>
        </p>
      </div>
    </main>
  );
}