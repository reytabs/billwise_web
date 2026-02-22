import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search } from "lucide-react";

export default function TransactiionTabs() {
  return (
    <div className="mt-8">
      <Tabs defaultValue="upcoming" className="w-full">
        <div className="flex items-center justify-between w-full">
          <TabsList className="grid grid-cols-5 text-left">
            <TabsTrigger value="all" className="cursor-pointer active">
              All
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="cursor-pointer">
              Upcoming
            </TabsTrigger>
            <TabsTrigger value="overdue" className="cursor-pointer">
              Overdue
            </TabsTrigger>
            <TabsTrigger value="recurring" className="cursor-pointer">
              Recurring
            </TabsTrigger>
            <TabsTrigger value="paid" className="cursor-pointer">
              Paid
            </TabsTrigger>
          </TabsList>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="w-5 h-5 text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="Search..."
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10"
            />
          </div>
        </div>

        {/* All Tab Content */}
        <TabsContent value="all" className="space-y-4 mt-4"></TabsContent>

        {/* Upcoming Tab Content */}
        <TabsContent value="upcoming" className="space-y-4 mt-4"></TabsContent>

        {/* Overdue Tab Content */}
        <TabsContent value="overdue" className="space-y-4 mt-4"></TabsContent>

        {/* Recurring Tab Content */}
        <TabsContent value="recurring" className="space-y-4 mt-4"></TabsContent>

        {/* Paid Tab Content */}
        <TabsContent value="paid" className="space-y-4 mt-4"></TabsContent>
      </Tabs>
    </div>
  );
}
