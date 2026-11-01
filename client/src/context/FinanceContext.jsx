import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { FinanceContext } from "./FinanceContextValue";
import { useAuth } from "./useAuth";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://127.0.0.1:5000"
).replace(/\/$/, "");

async function apiRequest(path, token, options = {}) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(options.body
          ? { "Content-Type": "application/json" }
          : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      "Cannot connect to the SmartExpense server. Please check your internet connection."
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.error ||
        data.message ||
        `Request failed with status ${response.status}.`
    );
  }

  return data;
}

function normalizeTransaction(transaction) {
  return {
    id: transaction.id,
    title: transaction.description || "",
    amount: Number(transaction.amount || 0),
    category:
      transaction.category_name ||
      transaction.category ||
      "Other",
    category_id: transaction.category_id,
    date: transaction.transaction_date || "",
    payment: transaction.payment_method || "Cash",
    notes: transaction.notes || "",
    type: transaction.transaction_type || "expense",
  };
}

export function FinanceProvider({ children }) {
  const { token } = useAuth();

  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshData = useCallback(async () => {
    // Defer state updates so they do not happen synchronously
    // when this function is first called by the loading effect.
    await Promise.resolve();

    if (!token) {
      setExpenses([]);
      setCategories([]);
      setLoading(false);
      setError("");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const [transactionData, categoryData] = await Promise.all([
        apiRequest("/api/transactions", token),
        apiRequest("/api/categories", token),
      ]);

      const transactionList = Array.isArray(transactionData)
        ? transactionData
        : transactionData.transactions || [];

      const categoryList = Array.isArray(categoryData)
        ? categoryData
        : categoryData.categories || [];

      setExpenses(transactionList.map(normalizeTransaction));
      setCategories(categoryList);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    let cancelled = false;

    Promise.resolve().then(() => {
      if (!cancelled) {
        refreshData();
      }
    });

    return () => {
      cancelled = true;
    };
  }, [refreshData]);

  const getCategoryId = (expense) => {
    if (expense.category_id) {
      return Number(expense.category_id);
    }

    const selectedCategory = categories.find(
      (category) =>
        category.name.toLowerCase() ===
        String(expense.category || "").toLowerCase()
    );

    return selectedCategory?.id;
  };

  const addExpense = async (expense) => {
    if (!token) {
      throw new Error("Please log in before adding a transaction.");
    }

    const categoryId = getCategoryId(expense);

    if (!categoryId) {
      throw new Error(
        "Please select a valid category. The category could not be found."
      );
    }

    const payload = {
      description: expense.title,
      amount: Number(expense.amount),
      transaction_type: expense.type || "expense",
      transaction_date: expense.date,
      category_id: categoryId,
      payment_method: expense.payment || "Cash",
      notes: expense.notes || null,
    };

    await apiRequest("/api/transactions", token, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    await refreshData();
  };

  const updateExpense = async (id, updatedExpense) => {
    if (!token) {
      throw new Error("Please log in before updating a transaction.");
    }

    const existingExpense = expenses.find(
      (expense) => String(expense.id) === String(id)
    );

    if (!existingExpense) {
      throw new Error("Transaction not found.");
    }

    const categoryId = getCategoryId({
      ...existingExpense,
      ...updatedExpense,
    });

    if (!categoryId) {
      throw new Error("Please select a valid category.");
    }

    const payload = {
      description:
        updatedExpense.title ?? existingExpense.title,
      amount: Number(
        updatedExpense.amount ?? existingExpense.amount
      ),
      transaction_type:
        updatedExpense.type ?? existingExpense.type,
      transaction_date:
        updatedExpense.date ?? existingExpense.date,
      category_id: categoryId,
      payment_method:
        updatedExpense.payment ?? existingExpense.payment,
      notes:
        updatedExpense.notes ?? existingExpense.notes,
    };

    await apiRequest(`/api/transactions/${id}`, token, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });

    await refreshData();
  };

  const deleteExpense = async (id) => {
    if (!token) {
      throw new Error("Please log in before deleting a transaction.");
    }

    await apiRequest(`/api/transactions/${id}`, token, {
      method: "DELETE",
    });

    await refreshData();
  };

  const income = useMemo(() => {
    return expenses
      .filter((expense) => expense.type === "income")
      .reduce(
        (total, expense) => total + Number(expense.amount || 0),
        0
      );
  }, [expenses]);

  const totalExpenses = useMemo(() => {
    return expenses
      .filter((expense) => expense.type === "expense")
      .reduce(
        (total, expense) => total + Number(expense.amount || 0),
        0
      );
  }, [expenses]);

  const totals = useMemo(
    () => ({
      income,
      expenses: totalExpenses,
      balance: income - totalExpenses,
    }),
    [income, totalExpenses]
  );

  const categoryTotals = useMemo(() => {
    return expenses
      .filter((expense) => expense.type === "expense")
      .reduce((result, expense) => {
        const category = expense.category || "Other";

        result[category] =
          (result[category] || 0) +
          Number(expense.amount || 0);

        return result;
      }, {});
  }, [expenses]);

  const value = {
    expenses,
    categories,
    income,
    totals,
    categoryTotals,
    loading,
    error,
    refreshData,
    addExpense,
    updateExpense,
    deleteExpense,
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
}