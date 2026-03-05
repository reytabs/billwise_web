"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import api from "@/lib/api";
import { phpFormatter } from "@/lib/phpFormatter";

export interface Budget {
  _id?: string;
  category: string;
  budget_amount: string | number;
  spent?: string | number;
  month: number;
  year: number;
  account_id?: string;
  goal_id?: string;
}

interface BudgetContextValue {
  budgets: Budget[];
  loading: boolean;
  loadBudgets: (month?: number, year?: number) => Promise<void>;
  addBudget: (budget: Budget) => void;
  month: number;
  year: number;
  setMonthYear: (month: number, year: number) => void;
}

const BudgetContext = createContext<BudgetContextValue | undefined>(undefined);

export const BudgetProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(false);

  const setMonthYear = useCallback((m: number, y: number) => {
    setMonth(m);
    setYear(y);
  }, []);

  const loadBudgets = useCallback(
    async (m?: number, y?: number) => {
      const targetMonth = m ?? month;
      const targetYear = y ?? year;
      setLoading(true);
      try {
        const res = await api.get<Budget[]>("/budgets", {
          params: { month: targetMonth, year: targetYear },
        });
        const data = res.data || [];
        const formatted = data.map((b: Budget) => ({
          ...b,
          budget_amount: phpFormatter.format(parseFloat(String(b.budget_amount ?? 0))),
          spent: phpFormatter.format(parseFloat(String(b.spent ?? 0))),
        }));
        setBudgets(formatted);
      } catch (err) {
        console.error("Failed to fetch budgets", err);
      } finally {
        setLoading(false);
      }
    },
    [month, year],
  );

  useEffect(() => {
    loadBudgets(month, year);
  }, [month, year, loadBudgets]);

  const addBudget = (budget: Budget) => {
    const formatted = {
      ...budget,
      budget_amount: phpFormatter.format(parseFloat(String(budget.budget_amount ?? 0))),
      spent: phpFormatter.format(parseFloat(String(budget.spent ?? 0))),
    };
    setBudgets((prev) => [formatted, ...prev]);
  };

  return (
    <BudgetContext.Provider
      value={{
        budgets,
        loading,
        loadBudgets,
        addBudget,
        month,
        year,
        setMonthYear,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => {
  const ctx = useContext(BudgetContext);
  if (!ctx)
    throw new Error("useBudget must be used within BudgetProvider");
  return ctx;
};

export default BudgetProvider;
