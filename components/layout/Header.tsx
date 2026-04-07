"use client";

import { Button } from "@/components/ui/button";

type HeaderProps = {
  onMenuClick: () => void;
  onDesktopSidebarToggle: () => void;
  isSidebarCollapsed: boolean;
};

export function Header({
  onMenuClick,
  onDesktopSidebarToggle,
  isSidebarCollapsed,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-border bg-background/95 px-3 backdrop-blur sm:px-5 lg:px-8">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Open sidebar menu"
          onClick={onMenuClick}
          className="active:scale-95 md:hidden"
        >
          <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M3 12h18M3 18h18" />
          </svg>
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Toggle desktop sidebar"
          onClick={onDesktopSidebarToggle}
          className="hidden md:inline-flex"
        >
          <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2">
            {isSidebarCollapsed ? <path d="M9 6l6 6-6 6" /> : <path d="M15 6l-6 6 6 6" />}
          </svg>
        </Button>

        <div className="leading-tight">
          <h2 className="text-base font-semibold text-foreground sm:text-lg">Agency Dashboard</h2>
          <p className="text-xs text-muted-foreground sm:text-sm">
            Manage your agency operations smoothly
          </p>
        </div>
      </div>

      <p className="hidden text-sm text-muted-foreground md:block">Welcome, Admin</p>
    </header>
  );
}

export default Header;