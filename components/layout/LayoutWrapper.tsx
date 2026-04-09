"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { getStoredUser } from "@/lib/local-auth";

export function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const user = getStoredUser();

    if (!user) {
      router.push("/login");
      return;
    }

    setIsReady(true);
  }, [router]);

  if (!isReady) {
    return (
      <div className="flex h-auto min-h-dvh items-center justify-center bg-background">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh overflow-x-clip bg-background text-foreground transition-colors duration-300 md:flex">
      <button
        type="button"
        aria-label="Close sidebar overlay"
        onClick={() => setIsMobileSidebarOpen(false)}
        className={`fixed inset-0 z-30 bg-foreground/35 transition-opacity duration-300 md:hidden ${
          isMobileSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 shrink-0 transform border-r border-border bg-card text-foreground shadow-sm transition-all duration-300 md:static md:translate-x-0 ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${isDesktopSidebarCollapsed ? "md:w-20" : "md:w-72"}`}
      >
        <Sidebar
          isCollapsed={isDesktopSidebarCollapsed}
          onNavigate={() => setIsMobileSidebarOpen(false)}
        />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          isSidebarCollapsed={isDesktopSidebarCollapsed}
          onMenuClick={() => setIsMobileSidebarOpen((current) => !current)}
          onDesktopSidebarToggle={() =>
            setIsDesktopSidebarCollapsed((current) => !current)
          }
        />
        <main className="flex-1 overflow-x-clip">
          <div className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default LayoutWrapper;
