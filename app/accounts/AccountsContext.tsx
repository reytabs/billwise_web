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

export interface Account {
  _id?: string;
  account_name: string;
  bank_name: string;
  account_type: string;
  current_balance: string | number;
  last_four_digits?: string;
}

interface AccountsContextValue {
  accounts: Account[];
  loading: boolean;
  loadAccounts: () => Promise<void>;
  addAccount: (account: Account) => void;
}

const AccountsContext = createContext<AccountsContextValue | undefined>(
  undefined,
);

export const AccountsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);

  const loadAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get<Account[]>("/accounts");
      const data = res.data || [];
      const formatted = data.map((a: Account) => ({
        ...a,
        current_balance: phpFormatter.format(
          parseFloat(String(a.current_balance ?? 0)),
        ),
      }));
      setAccounts(formatted);
    } catch (err) {
      console.error("Failed to fetch accounts", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  const addAccount = (account: Account) => {
    const formatted = {
      ...account,
      current_balance: phpFormatter.format(
        parseFloat(String(account.current_balance ?? 0)),
      ),
    };
    setAccounts((prev) => [formatted, ...prev]);
  };

  return (
    <AccountsContext.Provider
      value={{ accounts, loading, loadAccounts, addAccount }}
    >
      {children}
    </AccountsContext.Provider>
  );
};

export const useAccounts = () => {
  const ctx = useContext(AccountsContext);
  if (!ctx)
    throw new Error("useAccounts must be used within AccountsProvider");
  return ctx;
};

export default AccountsProvider;
