import DashboardLayout from "@/components/dashboard-layout";
import TransactionCreatePage from "./create";
import TransactionTabs from "./tabs";
import TransactionListPage from "./list";

export default function TransactionPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const pageName = "Transactions";
  const description = "Track all your financial transactions";
  return (
    <DashboardLayout page={pageName} description={description}>
      {children}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{pageName}</h1>
          <p className="text-slate-500 mt-1">{description}</p>
        </div>
        <TransactionCreatePage />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
          <p className="text-emerald-700 text-sm font-medium">Total Income</p>
          <h3 className="text-2xl font-bold text-emerald-700 mt-1">+$51,000</h3>
        </div>
        <div className="bg-rose-50 rounded-2xl p-6 border border-rose-100">
          <p className="text-rose-700 text-sm font-medium">Total Expenses</p>
          <h3 className="text-2xl font-bold text-rose-700 mt-1">-$1,200</h3>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100">
          <p className="text-slate-600 text-sm font-medium">Net</p>
          <h3 className="text-2xl font-bold mt-1 text-emerald-600">$49,800</h3>
        </div>
      </div>
      <TransactionTabs />
      <TransactionListPage />
    </DashboardLayout>
  );
}
