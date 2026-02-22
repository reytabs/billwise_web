"use client";

import DashboardLayout from "@/components/dashboard-layout";
import BudgetCreatePage from "./create";
import BudgetListPage from "./list";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{pageName}</h1>
          <p className="text-slate-500 mt-1">{description}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 p-1">
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 w-9">
              <ChevronLeft />
            </button>
            <span className="font-medium px-2">February 2026</span>
            <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg]:size-4 [&amp;_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-9 w-9">
              <ChevronRight />
            </button>
          </div>
          <BudgetCreatePage />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <p className="text-slate-500 text-sm">Total Budget</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">$3,000</h3>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <p className="text-slate-500 text-sm">Total Spent</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">$1,200</h3>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <p className="text-slate-500 text-sm">Remaining</p>
          <h3 className="text-2xl font-bold mt-1 text-emerald-600">$1,800</h3>
        </div>
      </div>
      <BudgetListPage />
    </DashboardLayout>
  );
}
