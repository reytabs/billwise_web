"use client";

import DashboardLayout from "@/components/dashboard-layout";
import AccountCreatePage from "./create";
import AccountListPage from "./list";
import { AccountsProvider, useAccounts } from "./AccountsContext";

function AccountStats() {
  const { accounts } = useAccounts();
  const totalBalance = accounts.reduce(
    (sum, a) =>
      sum +
      parseFloat(
        String(a.current_balance).replace(/[^0-9.]/g, "") || "0",
      ),
    0,
  );

  return (
    <div className="bg-linear-to-br from-slate-800 to-slate-900 rounded-2xl p-8 text-white">
      <p className="text-slate-400 text-sm">Total Balance</p>
      <h2 className="text-4xl font-bold mt-2">
        ₱{totalBalance.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
      </h2>
      <p className="text-slate-400 text-sm mt-2">
        Across {accounts.length} account{accounts.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

export default function AccountPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const pageName = "Accounts";
  const description = "Manage all your financial accounts";

  return (
    <DashboardLayout page={pageName} description={description}>
      {children}
      <AccountsProvider>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{pageName}</h1>
            <p className="text-slate-500 mt-1">{description}</p>
          </div>
          <AccountCreatePage />
        </div>
        <AccountStats />
        <AccountListPage />
      </AccountsProvider>
    </DashboardLayout>
  );
}
