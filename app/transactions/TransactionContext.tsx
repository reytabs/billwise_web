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

export interface Transaction {
  _id?: string;
  transaction_name: string;
  amount: string | number;
  date: string;
  transaction_type: string;
  category: string;
  bank_account?: {
    _id: string;
    account_name: string;
    bank_name: string;
  };
  user?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface TransactionContextValue {
  transactions: Transaction[];
  loading: boolean;
  loadTransactions: (filters?: any) => Promise<void>;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  getTransactionStats: () => Promise<any>;
  month: number;
  year: number;
  setMonthYear: (month: number, year: number) => void;
}

const TransactionContext = createContext<TransactionContextValue | undefined>(undefined);

export const TransactionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const setMonthYear = useCallback((m: number, y: number) => {
    setMonth(m);
    setYear(y);
  }, []);

  const loadTransactions = useCallback(
    async (filters: any = {}) => {
      setLoading(true);
      try {
        const params = {
          page: filters.page || 1,
          limit: filters.limit || 50,
          transaction_type: filters.transaction_type,
          category: filters.category,
          start_date: filters.start_date,
          end_date: filters.end_date,
          bank_account: filters.bank_account,
        };

        // Remove undefined values
        Object.keys(params).forEach(key => {
          if ((params as any)[key] === undefined) delete (params as any)[key];
        });

        const res = await api.get<Transaction[]>("/transactions", { params });
        const data = res.data || [];
        const formatted = data.map((t: Transaction) => ({
          ...t,
          amount: phpFormatter.format(parseFloat(String(t.amount ?? 0))),
        }));
        setTransactions(formatted);
      } catch (err) {
        console.error("Failed to fetch transactions", err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const addTransaction = useCallback((transaction: Transaction) => {
    const formatted = {
      ...transaction,
      amount: phpFormatter.format(parseFloat(String(transaction.amount ?? 0))),
    };
    setTransactions((prev) => [formatted, ...prev]);
  }, []);

  const updateTransaction = useCallback(async (id: string, transaction: Partial<Transaction>) => {
    try {
      const res = await api.put(`/transactions/${id}`, transaction);
      const updatedTransaction = {
        ...res.data,
        amount: phpFormatter.format(parseFloat(String(res.data.amount ?? 0))),
      };
      setTransactions((prev) =>
        prev.map((t) => (t._id === id ? updatedTransaction : t))
      );
    } catch (err) {
      console.error("Failed to update transaction", err);
      throw err;
    }
  }, []);

  const deleteTransaction = useCallback(async (id: string) => {
    try {
      await api.delete(`/transactions/${id}`);
      setTransactions((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Failed to delete transaction", err);
      throw err;
    }
  }, []);

  const getTransactionStats = useCallback(async () => {
    try {
      const res = await api.get("/transactions/stats/summary");
      return res.data;
    } catch (err) {
      console.error("Failed to fetch transaction stats", err);
      return [];
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        loading,
        loadTransactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        getTransactionStats,
        month,
        year,
        setMonthYear,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransaction = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error("useTransaction must be used within a TransactionProvider");
  }
  return context;
};