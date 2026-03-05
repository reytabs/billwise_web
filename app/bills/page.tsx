import DashboardLayout from "@/components/dashboard-layout";
import BillCreatePage from "./create";
import BillTabs from "./tabs";
import { BillsProvider } from "./BillsContext";

export default function BillPage({ children }: { children: React.ReactNode }) {
  const pageName = "Bills";
  const description = "Manage and track your recurring bills";
  return (
    <DashboardLayout page={pageName} description={description}>
      {children}
      <BillsProvider>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{pageName}</h1>
            <p className="text-slate-500 mt-1">{description}</p>
          </div>
          <BillCreatePage />
        </div>
        <BillTabs />
      </BillsProvider>
    </DashboardLayout>
  );
}
