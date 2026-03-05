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

export interface Goal {
  _id?: string;
  name: string;
  target_amount: string | number;
  current_amount: string | number;
  category: string;
  target_date: string;
}

interface GoalsContextValue {
  goals: Goal[];
  loading: boolean;
  loadGoals: () => Promise<void>;
  addGoal: (goal: Goal) => void;
}

const GoalsContext = createContext<GoalsContextValue | undefined>(undefined);

export const GoalsProvider = ({ children }: { children: React.ReactNode }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);

  const loadGoals = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<Goal[]>("/goals");
      const data = res.data || [];
      const formatted = data.map((g: Goal) => ({
        ...g,
        target_amount: phpFormatter.format(
          parseFloat(String(g.target_amount ?? 0)),
        ),
        current_amount: phpFormatter.format(
          parseFloat(String(g.current_amount ?? 0)),
        ),
      }));
      setGoals(formatted);
    } catch (err) {
      console.error("Failed to fetch goals", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  const addGoal = (goal: Goal) => {
    const formatted = {
      ...goal,
      target_amount: phpFormatter.format(
        parseFloat(String(goal.target_amount ?? 0)),
      ),
      current_amount: phpFormatter.format(
        parseFloat(String(goal.current_amount ?? 0)),
      ),
    };
    setGoals((prev) => [formatted, ...prev]);
  };

  return (
    <GoalsContext.Provider value={{ goals, loading, loadGoals, addGoal }}>
      {children}
    </GoalsContext.Provider>
  );
};

export const useGoals = () => {
  const ctx = useContext(GoalsContext);
  if (!ctx) throw new Error("useGoals must be used within GoalsProvider");
  return ctx;
};

export default GoalsProvider;
