"use client";

import { useState, useEffect, useCallback } from "react";
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

export default function BillListPage() {
  const { bills, loading } = useBills();
  console.log("Bills loaded:", bills);
  console.log("Loading state:", loading);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {loading ? (
        <>
          <BillCardSkeleton key="s1" />
          <BillCardSkeleton key="s2" />
          <BillCardSkeleton key="s3" />
        </>
      ) : (
        bills.map((bill) => (
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
  // choose an emoji based on category
  const icon = bill.category?.toLowerCase().includes("electric") ? "⚡" : "🏠";
  const dueDate = new Date(bill.due_date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const statusLabel =
    bill.status === "paid" ? (
      <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent shadow hover:bg-primary/80 gap-1 bg-emerald-50 text-emerald-600">
        <CircleCheck />
        Paid
      </div>
    ) : bill.status === "due" ? (
      <div className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent shadow hover:bg-primary/80 gap-1 bg-amber-50 text-amber-600">
        <Clock />
        Due Soon
      </div>
    ) : null;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{icon}</div>
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
          <span className="text-2xl font-bold text-slate-900">
            {bill.amount}
          </span>
          {statusLabel}
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500">Due date</span>
          <span className="font-medium text-slate-700">{dueDate}</span>
        </div>
        {bill.is_recurring && (
          <div className="flex items-center gap-2 text-xs text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg">
            <RefreshCcw />
            Recurring{bill.frequency ? ` ${bill.frequency}` : ""}
          </div>
        )}
      </div>
    </div>
  );
}
