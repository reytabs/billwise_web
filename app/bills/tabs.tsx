"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  CalendarClock,
  CalendarX2,
  History,
  CircleCheckBig,
} from "lucide-react";
import BillListPage from "./list";
import { useState } from "react";

export default function BillTabs() {
  const [search, setSearch] = useState("");
  return (
    <div>
      <Tabs defaultValue="all" className="w-full">
        <div className="flex items-center justify-between w-full">
          <TabsList className="grid grid-cols-5 text-left">
            <TabsTrigger value="all" className="cursor-pointer active">
              <CalendarClock /> All
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="cursor-pointer">
              <CalendarClock /> Upcoming
            </TabsTrigger>
            <TabsTrigger value="overdue" className="cursor-pointer">
              <CalendarX2 />
              Overdue
            </TabsTrigger>
            <TabsTrigger value="recurring" className="cursor-pointer">
              <History />
              Recurring
            </TabsTrigger>
            <TabsTrigger value="paid" className="cursor-pointer">
              <CircleCheckBig />
              Paid
            </TabsTrigger>
          </TabsList>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10"
            />
          </div>
        </div>

        {/* All Tab Content */}
        <TabsContent value="all" className="space-y-4 mt-4">
          <BillListPage filter="all" search={search} />
        </TabsContent>

        {/* Upcoming Tab Content */}
        <TabsContent value="upcoming" className="space-y-4 mt-4">
          <BillListPage filter="upcoming" search={search} />
        </TabsContent>

        {/* Overdue Tab Content */}
        <TabsContent value="overdue" className="space-y-4 mt-4">
          <BillListPage filter="overdue" search={search} />
        </TabsContent>

        {/* Recurring Tab Content */}
        <TabsContent value="recurring" className="space-y-4 mt-4">
          <BillListPage filter="recurring" search={search} />
        </TabsContent>

        {/* Paid Tab Content */}
        <TabsContent value="paid" className="space-y-4 mt-4">
          <BillListPage filter="paid" search={search} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
