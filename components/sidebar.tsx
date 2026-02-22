// components/sidebar.tsx
import {
  Home,
  PieChart,
  Receipt,
  Target,
  Landmark,
  ArrowLeftRight,
} from "lucide-react";
import Link from "next/link";

export function Sidebar({ page }: { page: string }) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-indigo-600">BillWise</h1>
        <p className="text-sm text-gray-500 mt-1">Bill & Finance Manager</p>
      </div>

      <nav className="flex-1 px-4">
        <Link
          href="/dashboard"
          className={
            page === "Dashboard"
              ? "flex items-center gap-3 px-3 py-2 text-indigo-600 bg-indigo-50 rounded-lg mb-1"
              : "flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg mb-1"
          }
        >
          <Home className="w-5 h-5" />
          <span>Dashboard</span>
        </Link>

        <Link
          href="/bills"
          className={
            page === "Bills"
              ? "flex items-center gap-3 px-3 py-2 text-indigo-600 bg-indigo-50 rounded-lg mb-1"
              : "flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg mb-1"
          }
        >
          <Receipt className="w-5 h-5" />
          <span>Bills</span>
        </Link>

        <Link
          href="/goals"
          className={
            page === "Goals"
              ? "flex items-center gap-3 px-3 py-2 text-indigo-600 bg-indigo-50 rounded-lg mb-1"
              : "flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg mb-1"
          }
        >
          <Target className="w-5 h-5" />
          <span>Goals</span>
        </Link>

        <Link
          href="/accounts"
          className={
            page === "Accounts"
              ? "flex items-center gap-3 px-3 py-2 text-indigo-600 bg-indigo-50 rounded-lg mb-1"
              : "flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg mb-1"
          }
        >
          <Landmark className="w-5 h-5" />
          <span>Bank Accounts</span>
        </Link>

        <Link
          href="/budget"
          className={
            page === "Budget"
              ? "flex items-center gap-3 px-3 py-2 text-indigo-600 bg-indigo-50 rounded-lg mb-1"
              : "flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg mb-1"
          }
        >
          <PieChart className="w-5 h-5" />
          <span>Budget</span>
        </Link>

        <Link
          href="/transactions"
          className={
            page === "Transactions"
              ? "flex items-center gap-3 px-3 py-2 text-indigo-600 bg-indigo-50 rounded-lg mb-1"
              : "flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg mb-1"
          }
        >
          <ArrowLeftRight className="w-5 h-5" />
          <span>Transactions</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
            <span className="text-indigo-600 font-semibold">JD</span>
          </div>
          <div>
            <p className="text-sm font-medium">
              Guest
            </p>
            <p className="text-xs text-gray-500">
              guest@example.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
