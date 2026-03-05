"use client";

import DashboardLayout from "@/components/dashboard-layout";
import GoalListPage from "./list";
import GoalCreatePage from "./create";
import { GoalsProvider, useGoals } from "./GoalsContext";

function GoalStats() {
  const { goals } = useGoals();
  const totalSaved = goals.reduce(
    (sum, g) =>
      sum +
      parseFloat(String(g.current_amount).replace(/[^0-9.]/g, "") || "0"),
    0,
  );
  const totalTarget = goals.reduce(
    (sum, g) =>
      sum +
      parseFloat(String(g.target_amount).replace(/[^0-9.]/g, "") || "0"),
    0,
  );
  const progress =
    totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  return (
    <>
      <div className="bg-linear-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
        <p className="text-indigo-100 text-sm">Total Saved</p>
        <h3 className="text-3xl font-bold mt-1">
          ₱{totalSaved.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
        </h3>
        <p className="text-indigo-200 text-sm mt-2">
          of ₱
          {totalTarget.toLocaleString("en-PH", { minimumFractionDigits: 2 })}{" "}
          target
        </p>
      </div>
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <p className="text-slate-500 text-sm">Active Goals</p>
        <h3 className="text-3xl font-bold text-slate-900 mt-1">
          {goals.length}
        </h3>
      </div>
      <div className="bg-white rounded-2xl p-6 border border-slate-100">
        <p className="text-slate-500 text-sm">Overall Progress</p>
        <h3 className="text-3xl font-bold text-slate-900 mt-1">{progress}%</h3>
      </div>
    </>
  );
}

export default function GoalPage({ children }: { children: React.ReactNode }) {
  const pageName = "Goals";
  const description = "Track your progress towards financial goals";
  return (
    <DashboardLayout page={pageName} description={description}>
      {children}
      <GoalsProvider>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{pageName}</h1>
            <p className="text-slate-500 mt-1">{description}</p>
          </div>
          <GoalCreatePage />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GoalStats />
        </div>
        <GoalListPage />
      </GoalsProvider>
    </DashboardLayout>
  );
}
