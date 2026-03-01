"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IconDots } from "@tabler/icons-react";
import { CircleCheck, Clock, RefreshCcw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useBills } from "@/app/bills/BillsContext";
import {
  Zap,
  Home,
  Shield,
  Repeat,
  DollarSign,
  CreditCard,
  Tag,
} from "lucide-react";

interface Bill {
  _id?: string;
  name: string;
  category: string;
  amount: string;
  due_date: string;
  status: string;
  is_recurring?: boolean;
  frequency?: string;
}

type BillFilter = "all" | "upcoming" | "overdue" | "recurring" | "paid";

interface BillListPageProps {
  filter?: BillFilter;
  search?: string;
}

export default function BillListPage({
  filter = "all",
  search = "",
}: BillListPageProps) {
  const { bills, loading } = useBills();

  // derive a filtered list based on the active tab value and search query
  const filteredBills = useMemo(() => {
    // base filter by tab
    let base = bills;
    if (filter === "paid") base = bills.filter((b) => b.status === "Paid");
    else if (filter === "recurring")
      base = bills.filter((b) => b.frequency != "");
    else if (filter === "upcoming")
      base = bills.filter((b) => b.status === "Upcoming");
    else if (filter === "overdue")
      base = bills.filter((b) => b.status === "Overdue");

    // apply search if present
    if (!search || !search.trim()) return base;
    const q = search.toLowerCase().trim();
    return base.filter((b) => {
      const name = (b.name || "").toLowerCase();
      const cat = (b.category || "").toLowerCase();
      const amount = String(b.amount || "").toLowerCase();
      return name.includes(q) || cat.includes(q) || amount.includes(q);
    });
  }, [bills, filter, search]);

  // console.log("Bills loaded:", bills);
  // console.log("Filtered bills (", filter, "):", filteredBills);
  // console.log("Loading state:", loading);

  // when loading, show placeholder cards equal to the bills length (or at least 3)
  const skeletonCount = Math.max(bills.length, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {loading ? (
        <>
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <BillCardSkeleton key={`skeleton-${i}`} />
          ))}
        </>
      ) : (
        filteredBills.map((bill) => (
          <BillCard key={bill._id ?? bill.name} bill={bill} />
        ))
      )}
    </div>
  );
}

function BillCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 w-full">
          <Skeleton className="w-8 h-8 rounded" />
          <div className="flex-1">
            <Skeleton className="h-5 w-32 mb-2" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <Skeleton className="w-8 h-8 rounded" />
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-6 w-16 rounded" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </div>
  );
}

function BillCard({ bill }: { bill: Bill }) {
  // helper that returns an icon element + styling based on category
  const renderCategoryIcon = () => {
    const cat = bill.category?.toLowerCase() || "";

    if (cat.includes("utilities")) {
      return <div className="p-2 bg-yellow-100 rounded-lg">⚡</div>;
    } else if (cat.includes("rent")) {
      return <div className="p-2 bg-blue-100 rounded-lg">🏠</div>;
    } else if (cat.includes("insurance")) {
      return <div className="p-2 bg-green-100 rounded-lg">🛡️</div>;
    } else if (cat.includes("subscription")) {
      return <div className="p-2 bg-indigo-100 rounded-lg">🔁</div>;
    } else if (cat.includes("loan")) {
      return <div className="p-2 bg-pink-100 rounded-lg">💰</div>;
    } else if (cat.includes("credit")) {
      return <div className="p-2 bg-gray-100 rounded-lg">💳</div>;
    }

    // default / other
    return (
      <div className="p-2 bg-slate-100 rounded-lg">
        <Tag className="w-5 h-5 text-slate-600" />
      </div>
    );
  };

  const dueDate = new Date(bill.due_date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const statusLabel =
    bill.status === "Paid" ? (
      <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent shadow hover:bg-primary/80 gap-1 bg-emerald-50 text-emerald-600">
        <CircleCheck />
        Paid
      </div>
    ) : bill.status === "Upcoming" ? (
      <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent shadow hover:bg-primary/80 gap-1 bg-amber-50 text-amber-600">
        <Clock />
        Upcoming
      </div>
    ) : bill.status === "Overdue" ? (
      <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent shadow hover:bg-primary/80 gap-1 bg-red-50 text-red-600">
        <Clock />
        Overdue
      </div>
    ) : null;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{renderCategoryIcon()}</div>
          <div>
            <h3 className="font-semibold text-slate-900">{bill.name}</h3>
            <p className="text-xs text-slate-400 capitalize">{bill.category}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDots />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Make a copy</DropdownMenuItem>
            <DropdownMenuItem>Favorite</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-slate-700">
            {bill.amount}
          </span>
          {statusLabel}
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Due date</span>
          <span className="font-medium text-slate-700">{dueDate}</span>
        </div>
        {bill.frequency && (
          <div className="flex items-center gap-2 text-xs text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg">
            <RefreshCcw />
            Recurring - {bill.frequency}
          </div>
        )}
      </div>
    </div>
  );
}
