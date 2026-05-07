"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BadgeDollarSign, CalendarDays, Clock3, LayoutDashboard, Users } from "lucide-react";
import { getStoredUser, type LocalUser } from "@/lib/local-auth";

type SidebarProps = {
  onNavigate?: () => void;
  isCollapsed?: boolean;
};

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Bookings",
    href: "/bookings",
    icon: CalendarDays,
  },
  {
    label: "Pending Requests",
    href: "/bookings/pending-requests",
    isChild: true,
    icon: Clock3,
  },
  {
    label: "Providers",
    href: "/providers",
    icon: Users,
  },
  {
    label: "Earnings",
    href: "/earnings",
    icon: BadgeDollarSign,
  },
];

export function Sidebar({ onNavigate, isCollapsed = false }: SidebarProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<LocalUser | null>(null);

  useEffect(() => {
    const fetchUser = () => {
      setUser(getStoredUser());
    };

    fetchUser();

    window.addEventListener("storage", fetchUser);
    return () => window.removeEventListener("storage", fetchUser);
  }, []);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-3 py-4 text-foreground transition-colors duration-300">
      <div className={`mb-5 flex items-center ${isCollapsed ? "justify-center md:justify-center" : "justify-start"}`}>
        <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-2xl px-2 py-1.5 transition-colors hover:bg-muted/70" onClick={onNavigate}>
          <Image
            src="/SevaLink-logo-r.png"
            alt="SevaLink"
            width={120}
            height={32}
            priority
            className={`h-auto transition-all duration-300 ${isCollapsed ? "w-[42px] md:block" : "w-[102px]"}`}
          />
        </Link>
      </div>

      <div className={`mb-4 rounded-2xl border border-border/70 bg-muted/30 px-3 py-3 ${isCollapsed ? "md:hidden" : ""}`}>
        {user?.name ? <p className="text-sm font-semibold text-foreground">{user.name}</p> : null}
        <p className="mt-0.5 text-xs text-muted-foreground">{user?.agency || "Care Agency Dashboard"}</p>
      </div>

      <div className="mb-4 h-px bg-border" />

      <ul className="space-y-1.5">
        {navItems.map((item) => {
          const isActive = item.href === "/bookings"
            ? pathname === item.href || pathname.startsWith("/bookings/")
            : pathname === item.href;
          const Icon = item.icon;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className={`group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ${item.isChild && !isCollapsed ? "ml-4" : ""} ${
                  isActive
                    ? "bg-primary/10 text-foreground ring-1 ring-primary/15"
                    : "border-transparent text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-all duration-300 ${
                  isActive
                    ? "border-primary/20 bg-background text-primary shadow-sm"
                    : "border-border/70 bg-background/80 text-muted-foreground group-hover:text-foreground"
                }`}>
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <span className={`${isCollapsed ? "hidden" : "inline"}`}>
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <div className={`mt-auto pt-4 ${isCollapsed ? "hidden" : ""}`}>
        <div className="rounded-2xl border border-border/70 bg-muted/25 p-3">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Workspace</p>
          <p className="mt-1 text-sm font-semibold text-foreground">{user?.agency || "SevaLink"}</p>
          <p className="text-xs text-muted-foreground">Responsive dashboard shell enabled</p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;