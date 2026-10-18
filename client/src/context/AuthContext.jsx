import { useState } from "react";
import { AuthContext } from "./AuthContextValue";

const USER_KEY = "smartexpense_user";
const TOKEN_KEY = "smartexpense_token";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:5000"
).replace(/\/$/, "");

function getSavedUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
}

async function postAuthRequest(path, payload) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      "Cannot connect to the SmartExpense server. Make sure the Flask backend is running."
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.error || data.message || "The request failed. Please try again."
    );
  }

  return data;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getSavedUser);
  const [token, setToken] = useState(() =>
    localStorage.getItem(TOKEN_KEY)
  );

  const login = async (email, password) => {
    const data = await postAuthRequest("/api/auth/login", {
      email,
      password,
    });

    const loggedInUser = {
      id: data.user.id,
      name: data.user.username,
      email: data.user.email,
    };

    localStorage.setItem(USER_KEY, JSON.stringify(loggedInUser));
    localStorage.setItem(TOKEN_KEY, data.access_token);

    setUser(loggedInUser);
    setToken(data.access_token);

    return loggedInUser;
  };

  const register = async (name, email, password) => {
    await postAuthRequest("/api/auth/register", {
      username: name,
      email,
      password,
    });

    // Sign in automatically after successful registration.
    return login(email, password);
  };

  const logout = () => {
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
