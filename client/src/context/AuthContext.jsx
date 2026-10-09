import { useState } from "react";
import { AuthContext } from "./AuthContextValue";

const USER_KEY = "smartexpense_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(USER_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const login = (email) => {
    const savedUser = localStorage.getItem(USER_KEY);
    const existingUser = savedUser ? JSON.parse(savedUser) : null;

    const loggedInUser = {
      name:
        existingUser?.email === email
          ? existingUser.name
          : email.split("@")[0],
      email,
    };

    localStorage.setItem(USER_KEY, JSON.stringify(loggedInUser));
    setUser(loggedInUser);
  };

  const register = (name, email) => {
    const newUser = {
      name,
      email,
    };

    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
