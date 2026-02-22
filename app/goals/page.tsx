import DashboardLayout from "@/components/dashboard-layout";
import GoalListPage from "./list";
import GoalCreatePage from "./create";

export default function GoalPage({ children }: { children: React.ReactNode }) {
  const pageName = "Goals";
  const description = "Track your progress towards financial goals";
  return (
    <DashboardLayout page={pageName} description={description}>
      {children}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{pageName}</h1>
          <p className="text-slate-500 mt-1">{description}</p>
        </div>
        <GoalCreatePage />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-linear-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
          <p className="text-indigo-100 text-sm">Total Saved</p>
          <h3 className="text-3xl font-bold mt-1">₱0</h3>
          <p className="text-indigo-200 text-sm mt-2">of ₱0 target</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <p className="text-slate-500 text-sm">Active Goals</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-1">0</h3>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <p className="text-slate-500 text-sm">Overall Progress</p>
          <h3 className="text-3xl font-bold text-slate-900 mt-1">0%</h3>
        </div>
      </div>
      <GoalListPage />
    </DashboardLayout>
  );
}
