"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Menu, PanelLeftClose, PanelLeftOpen, SunMedium, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { useTheme } from "@/components/theme/ThemeProvider";
import { logout } from "@/lib/api";
import { clearAuthSession, getStoredUser, type LocalUser } from "@/lib/local-auth";

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
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<LocalUser | null>(null);

  useEffect(() => {
    Promise.resolve().then(() => {
      setUser(getStoredUser());
    });
  }, []);

  async function handleLogout() {
    try {
      await logout();
    } catch {
      // Local auth state should still be cleared if network logout fails.
    } finally {
      clearAuthSession();
      router.push("/login");
    }
  }

  const userInitials = user?.name
    ? user.name
        .split(" ")
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase()
    : "SL";

  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/80 backdrop-blur-xl transition-colors duration-300">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Open sidebar menu"
            onClick={onMenuClick}
            className="shrink-0 active:scale-95 md:hidden"
          >
            <Menu className="h-4.5 w-4.5" />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Toggle desktop sidebar"
            onClick={onDesktopSidebarToggle}
            className="hidden shrink-0 md:inline-flex"
          >
            {isSidebarCollapsed ? <PanelLeftOpen className="h-4.5 w-4.5" /> : <PanelLeftClose className="h-4.5 w-4.5" />}
          </Button>

          <div className="min-w-0 leading-tight">
            <h2 className="truncate text-base font-semibold text-foreground sm:text-lg">Agency Dashboard</h2>
            <p className="truncate text-xs text-muted-foreground sm:text-sm">
              Care operations, bookings, and revenue in one place
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {user?.name ? (
            <div className="hidden items-center gap-3 rounded-full border border-border/70 bg-card/80 px-3 py-1.5 md:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary ring-1 ring-primary/15">
                {userInitials}
              </div>
              <div className="leading-tight">
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <p className="text-[11px] text-muted-foreground">{user.agency || "Agency workspace"}</p>
              </div>
            </div>
          ) : null}

          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => {
              const newTheme = theme === "dark" ? "light" : "dark";
              setTheme(newTheme);
              document.documentElement.classList.remove("light", "dark");
              document.documentElement.classList.add(newTheme);
            }}
            className="shrink-0 transition-colors duration-300"
          >
            {theme === "light" ? <Moon className="h-4.5 w-4.5" /> : <SunMedium className="h-4.5 w-4.5" />}
          </Button>
          <NotificationBell />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="h-9 gap-2 px-3"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Header;