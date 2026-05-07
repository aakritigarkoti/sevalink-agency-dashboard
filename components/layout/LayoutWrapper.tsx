"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { getStoredToken } from "@/lib/local-auth";

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
    const token = getStoredToken();

    if (!token) {
      router.push("/login");
      return;
    }

    Promise.resolve().then(() => setIsReady(true));
  }, [router]);

  if (!isReady) {
    return (
      <div className="flex h-auto min-h-dvh items-center justify-center bg-background">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      </div>
    );
  }

  return (
    <div className="relative isolate min-h-dvh overflow-x-clip bg-transparent text-foreground transition-colors duration-300 md:flex">
      <button
        type="button"
        aria-label="Close sidebar overlay"
        onClick={() => setIsMobileSidebarOpen(false)}
        className={`fixed inset-0 z-30 bg-foreground/30 backdrop-blur-[1px] transition-opacity duration-300 md:hidden ${
          isMobileSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 shrink-0 transform border-r border-border/70 bg-card/95 text-foreground shadow-[0_18px_50px_rgba(15,23,42,0.12)] backdrop-blur-xl transition-all duration-300 md:static md:translate-x-0 md:shadow-none ${
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
          <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

export default LayoutWrapper;
