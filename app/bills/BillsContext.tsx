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

export interface Bill {
  _id?: string;
  name: string;
  category: string;
  amount: string;
  due_date: string;
  status: string;
  is_recurring?: boolean;
  frequency?: string;
}

interface BillsContextValue {
  bills: Bill[];
  loading: boolean;
  loadBills: () => Promise<void>;
  addBill: (bill: Bill) => void;
}

const BillsContext = createContext<BillsContextValue | undefined>(undefined);

export const BillsProvider = ({ children }: { children: React.ReactNode }) => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(false);

  const loadBills = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<Bill[]>("/bills");
      const data = res.data || [];
      // format amounts
      const formatted = data.map((b) => ({
        ...b,
        amount: phpFormatter.format(parseFloat(String(b.amount) ?? 0)),
      }));
      setBills(formatted);
    } catch (err) {
      console.error("Failed to fetch bills", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBills();
  }, [loadBills]);

  const addBill = (bill: Bill) => {
    const formatted = {
      ...bill,
      amount: phpFormatter.format(parseFloat(String(bill.amount) ?? 0)),
    };
    setBills((prev) => [formatted, ...prev]);
  };

  return (
    <BillsContext.Provider value={{ bills, loading, loadBills, addBill }}>
      {children}
    </BillsContext.Provider>
  );
};

export const useBills = () => {
  const ctx = useContext(BillsContext);
  if (!ctx) throw new Error("useBills must be used within BillsProvider");
  return ctx;
};

export default BillsProvider;
