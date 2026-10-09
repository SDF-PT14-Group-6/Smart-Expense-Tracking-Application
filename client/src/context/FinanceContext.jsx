import { useEffect, useMemo, useState } from "react";
import { FinanceContext } from "./FinanceContextValue";


const STORAGE_KEY = "smartexpense_expenses";
const INCOME_KEY = "smartexpense_income";

const starterExpenses = [
  {
    id: "starter-1",
    title: "Groceries",
    amount: 3500,
    category: "Food",
    date: "2026-10-03",
    payment: "M-Pesa",
    notes: "Weekly groceries",
  },
  {
    id: "starter-2",
    title: "Transport",
    amount: 1200,
    category: "Transport",
    date: "2026-10-04",
    payment: "M-Pesa",
    notes: "Weekly commuting",
  },
];

export function FinanceProvider({ children }) {
  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : starterExpenses;
    } catch {
      return starterExpenses;
    }
  });

  const [income, setIncome] = useState(() => {
    try {
      const saved = localStorage.getItem(INCOME_KEY);
      return saved ? Number(saved) : 50000;
    } catch {
      return 50000;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(INCOME_KEY, String(income));
  }, [income]);

  const addExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: crypto.randomUUID(),
      amount: Number(expense.amount),
    };

    setExpenses((currentExpenses) => [
      ...currentExpenses,
      newExpense,
    ]);
  };

  const updateExpense = (id, updatedExpense) => {
    setExpenses((currentExpenses) =>
      currentExpenses.map((expense) =>
        expense.id === id
          ? {
              ...expense,
              ...updatedExpense,
              id,
              amount: Number(updatedExpense.amount),
            }
          : expense
      )
    );
  };

  const deleteExpense = (id) => {
    setExpenses((currentExpenses) =>
      currentExpenses.filter((expense) => expense.id !== id)
    );
  };

  const categoryTotals = useMemo(() => {
    return expenses.reduce((totals, expense) => {
      const category = expense.category || "Other";
      totals[category] =
        (totals[category] || 0) + Number(expense.amount || 0);
      return totals;
    }, {});
  }, [expenses]);

  const totals = useMemo(() => {
    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + Number(expense.amount || 0),
      0
    );

    return {
      income: Number(income),
      expenses: totalExpenses,
      balance: Number(income) - totalExpenses,
    };
  }, [expenses, income]);

  const value = {
    expenses,
    income,
    setIncome,
    totals,
    categoryTotals,
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
