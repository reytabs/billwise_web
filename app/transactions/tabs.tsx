"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import { useState } from "react";
import { useTransaction } from "./TransactionContext";
import TransactionListPage from "./list";

export default function TransactionTabs() {
  const { loadTransactions } = useTransaction();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    const filters: any = {};

    if (value !== "all") {
      filters.transaction_type = value;
    }

    if (searchTerm) {
      filters.transaction_name = searchTerm;
    }

    loadTransactions(filters);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filters: any = {};
    if (activeTab !== "all") {
      filters.transaction_type = activeTab;
    }

    if (term) {
      filters.transaction_name = term;
    }

    loadTransactions(filters);
  };

  return (
    <div className="mt-8">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="flex items-center justify-between w-full">
          <TabsList className="grid grid-cols-3 text-left">
            <TabsTrigger value="all" className="cursor-pointer">
              All Transactions
            </TabsTrigger>
            <TabsTrigger value="income" className="cursor-pointer">
              Income
            </TabsTrigger>
            <TabsTrigger value="expense" className="cursor-pointer">
              Expenses
            </TabsTrigger>
          </TabsList>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="w-5 h-5 text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={handleSearch}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10"
            />
          </div>
        </div>

        {/* All Tab Content */}
        <TabsContent value="all" className="space-y-4 mt-4">
          <TransactionListPage />
        </TabsContent>

        {/* Income Tab Content */}
        <TabsContent value="income" className="space-y-4 mt-4">
          <TransactionListPage />
        </TabsContent>

        {/* Expense Tab Content */}
        <TabsContent value="expense" className="space-y-4 mt-4">
          <TransactionListPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
