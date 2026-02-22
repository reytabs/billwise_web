// app/page.tsx
import DashboardLayout from "@/components/dashboard-layout";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight, ArrowDownRight, DollarSign, Zap } from "lucide-react";

export default function Dashboard({ children }: { children: React.ReactNode }) {
  const pageName = "Dashboard";
  const description = "Welcome back! Here's your financial overview.";
  return (
    // <div className="flex">
    <DashboardLayout page={pageName} description={description}>
      {children}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{pageName}</h1>
          <p className="text-slate-500 mt-1">{description}</p>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Total Balance</p>
                <h3 className="text-2xl font-bold">₱50,000</h3>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <ArrowUpRight className="w-3 h-3" /> vs last month
                </p>
              </div>
              <div className="p-2 bg-indigo-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Monthly Income</p>
                <h3 className="text-2xl font-bold">₱1,000</h3>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <ArrowUpRight className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Pending Bills</p>
                <h3 className="text-2xl font-bold">₱2,500</h3>
              </div>
              <div className="p-2 bg-red-100 rounded-lg">
                <ArrowDownRight className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Goals Progress</p>
                <h3 className="text-2xl font-bold">0%</h3>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Zap className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
            <Progress value={0} className="mt-3" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Transactions */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <TransactionItem
                  title="Salary"
                  date="Mar 28, 2026"
                  amount="+₱50,000"
                  type="income"
                />
                <TransactionItem
                  title="Shopping"
                  date="Feb 28, 2026"
                  amount="-₱1,000"
                  type="expense"
                />
                <TransactionItem
                  title="Transpo"
                  date="Feb 26, 2026"
                  amount="-₱200"
                  type="expense"
                />
                <TransactionItem
                  title="Shop"
                  date="Feb 17, 2026"
                  amount="-₱1,000"
                  type="expense"
                />
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <QuickActionButton amount="+₱50,000" type="income" />
                <QuickActionButton amount="+₱1,000" type="income" />
                <QuickActionButton amount="-₱1,000" type="expense" />
                <QuickActionButton amount="-₱200" type="expense" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Upcoming Bills */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Upcoming Bills</CardTitle>
              <span className="text-sm text-gray-500">Next 5</span>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <BillItem
                  title="Electric Bill"
                  date="Feb 21, 2026"
                  amount="₱2,500"
                  daysLeft="3d left"
                />
                {/* Add more bills if needed */}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Budget Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <BudgetCategory name="Housing" spent={1200} total={2000} />
                <BudgetCategory name="Food" spent={400} total={600} />
                <BudgetCategory name="Transport" spent={150} total={300} />
                <BudgetCategory name="Entertainment" spent={200} total={400} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
    // </div>
  );
}

// Helper Components
function TransactionItem({
  title,
  date,
  amount,
  type,
}: {
  title: string;
  date: string;
  amount: string;
  type: "income" | "expense";
}) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-gray-500">{date}</p>
      </div>
      <p
        className={`font-semibold ₱{type === "income" ? "text-green-600" : "text-red-600"}`}
      >
        {amount}
      </p>
    </div>
  );
}

function BillItem({
  title,
  date,
  amount,
  daysLeft,
}: {
  title: string;
  date: string;
  amount: string;
  daysLeft: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-gray-500">{date}</p>
      </div>
      <div className="text-right">
        <p className="font-semibold">{amount}</p>
        <p className="text-xs text-red-500">{daysLeft}</p>
      </div>
    </div>
  );
}

function QuickActionButton({
  amount,
  type,
}: {
  amount: string;
  type: "income" | "expense";
}) {
  return (
    <button
      className={`p-3 rounded-lg border transition-colors ₱{
        type === "income"
          ? "border-green-200 hover:bg-green-50 text-green-600"
          : "border-red-200 hover:bg-red-50 text-red-600"
      }`}
    >
      {amount}
    </button>
  );
}

function BudgetCategory({
  name,
  spent,
  total,
}: {
  name: string;
  spent: number;
  total: number;
}) {
  const percentage = (spent / total) * 100;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{name}</span>
        <span className="text-gray-600">
          ₱{spent}/₱{total}
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}
