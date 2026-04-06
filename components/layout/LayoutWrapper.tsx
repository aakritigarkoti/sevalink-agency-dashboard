"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-100 md:flex">
      <button
        type="button"
        aria-label="Close sidebar overlay"
        onClick={() => setIsSidebarOpen(false)}
        className={`fixed inset-0 z-30 bg-black/45 transition-opacity duration-300 md:hidden ${
          isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 shrink-0 transform bg-gray-900 transition-transform duration-300 md:static md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onNavigate={() => setIsSidebarOpen(false)} />
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <Header onMenuClick={() => setIsSidebarOpen((current) => !current)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-7">
          {children}
        </main>
      </div>
    </div>
  );
}

export default LayoutWrapper;