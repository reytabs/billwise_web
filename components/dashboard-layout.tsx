"use client";

import { Sidebar } from "./sidebar";

// import data from "./data.json";

export default function DashboardLayout({
  children,
  page,
  description,
}: {
  children: React.ReactNode;
  page: string;
  description: string;
}) {
  const pageName = page;
  const pageDescription = description;
  return (
    <div className="flex">
      <Sidebar page={pageName} />
      <main className="flex-1 ml-64 p-8 bg-gray-50 min-h-screen">
        {children}
      </main>
    </div>
  );
}
