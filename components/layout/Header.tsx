"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { useTheme } from "@/components/theme/ThemeProvider";
import { clearStoredUser, getStoredUser, type LocalUser } from "@/lib/local-auth";

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
  const router = useRouter();
  const { theme, toggleTheme, isReady } = useTheme();
  const [user, setUser] = useState<LocalUser | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  function handleLogout() {
    clearStoredUser();
    router.replace("/login");
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-border bg-card/95 px-3 backdrop-blur transition-colors duration-300 sm:px-5 lg:px-8">
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

      <div className="flex items-center gap-3 sm:gap-4">
        {user?.name ? <p className="hidden text-sm text-muted-foreground md:block">Welcome, {user.name}</p> : null}
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Toggle theme"
          onClick={toggleTheme}
          className="transition-colors duration-300"
        >
          {isReady && theme === "light" ? (
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2.5M12 19.5V22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12H22M4.93 19.07l1.77-1.77M17.3 6.7l1.77-1.77" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3c0 5 4 9 9 9-.07.27-.14.53-.21.79z" />
            </svg>
          )}
        </Button>
        <NotificationBell />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="h-9"
        >
          Logout
        </Button>
      </div>
    </header>
  );
}

export default Header;