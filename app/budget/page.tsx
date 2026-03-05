"use client";

import DashboardLayout from "@/components/dashboard-layout";
import BudgetCreatePage from "./create";
import BudgetListPage from "./list";
import { BudgetProvider, useBudget } from "./BudgetContext";
import { AccountsProvider } from "@/app/accounts/AccountsContext";
import { GoalsProvider } from "@/app/goals/GoalsContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

function BudgetStats() {
  const { budgets } = useBudget();
  const totalBudget = budgets.reduce(
    (sum, b) =>
      sum +
      parseFloat(
        String(b.budget_amount).replace(/[^0-9.]/g, "") || "0",
      ),
    0,
  );
  const totalSpent = budgets.reduce(
    (sum, b) =>
      sum +
      parseFloat(
        String(b.spent).replace(/[^0-9.]/g, "") || "0",
      ),
    0,
  );
  const remaining = totalBudget - totalSpent;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <p className="text-slate-500 text-sm">Total Budget</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-1">
          ₱{totalBudget.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
        </h3>
      </div>
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <p className="text-slate-500 text-sm">Total Spent</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-1">
          ₱{totalSpent.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
        </h3>
      </div>
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <p className="text-slate-500 text-sm">Remaining</p>
        <h3 className="text-2xl font-bold mt-1 text-emerald-600">
          ₱{remaining.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
        </h3>
      </div>
    </div>
  );
}

function MonthNavigator() {
  const { month, year, setMonthYear } = useBudget();
  const date = new Date(year, month - 1, 1);
  const label = date.toLocaleString("default", { month: "long", year: "numeric" });

  const goPrev = () => {
    if (month === 1) setMonthYear(12, year - 1);
    else setMonthYear(month - 1, year);
  };

  const goNext = () => {
    if (month === 12) setMonthYear(1, year + 1);
    else setMonthYear(month + 1, year);
  };

  return (
    <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 p-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        onClick={goPrev}
      >
        <ChevronLeft />
      </Button>
      <span className="font-medium px-2 min-w-[140px] text-center">
        {label}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-9 w-9"
        onClick={goNext}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}

export default function BudgetPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const pageName = "Budget";
  const description = "Track your spending by category";

  return (
    <DashboardLayout page={pageName} description={description}>
      {children}
      <AccountsProvider>
        <GoalsProvider>
          <BudgetProvider>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  {pageName}
                </h1>
                <p className="text-slate-500 mt-1">{description}</p>
              </div>
              <div className="flex items-center gap-4">
                <MonthNavigator />
                <BudgetCreatePage />
              </div>
            </div>
            <BudgetStats />
            <BudgetListPage />
          </BudgetProvider>
        </GoalsProvider>
      </AccountsProvider>
    </DashboardLayout>
  );
}
