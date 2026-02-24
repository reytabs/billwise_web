// components/sidebar.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  PieChart,
  Receipt,
  Target,
  Landmark,
  ArrowLeftRight,
  LogOut,
} from "lucide-react";
import Link from "next/link";

interface UserData {
  name: string;
  email: string;
}

function getInitials(name: string) {
  const parts = name.trim().split(" ");
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return parts[0][0].toUpperCase() + parts[parts.length - 1][0].toUpperCase();
}

export function Sidebar({ page }: { page: string }) {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("userData");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.name && parsed.email) {
          setUser(parsed);
        }
      }
    } catch (e) {
      // ignore parsing errors
    }
  }, []);

  const handleLogout = () => {
    // Clear authentication tokens and user data from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("token");
    localStorage.removeItem("userData");

    // Clear authentication cookies
    document.cookie =
      "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";

    // Redirect to login
    router.replace("/auth/login");
  };

  const displayName = user?.name || "Guest";
  const displayEmail = user?.email || "guest@example.com";
  const initials = user ? getInitials(user.name) : "JD";

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
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
            <span className="text-indigo-600 font-semibold">{initials}</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{displayName}</p>
            <p className="text-xs text-gray-500">{displayEmail}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
