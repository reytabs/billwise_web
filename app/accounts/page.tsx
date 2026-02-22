import DashboardLayout from "@/components/dashboard-layout";
import AccountCreatePage from "./create";
import AccountListPage from "./list";

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{pageName}</h1>
          <p className="text-slate-500 mt-1">{description}</p>
        </div>
        <AccountCreatePage />
      </div>
      <div className="bg-linear-to-br from-slate-800 to-slate-900 rounded-2xl p-8 text-white">
        <p className="text-slate-400 text-sm">Total Balance</p>
        <h2 className="text-4xl font-bold mt-2">$240,000</h2>
        <p className="text-slate-400 text-sm mt-2">Across 3 accounts</p>
      </div>
      <AccountListPage />
    </DashboardLayout>
  );
}
