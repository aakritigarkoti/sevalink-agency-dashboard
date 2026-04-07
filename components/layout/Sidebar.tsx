"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarProps = {
  onNavigate?: () => void;
  isCollapsed?: boolean;
};

const navItems = [
  {
    label: "Dashboard",
    href: "/",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 13h8V3H3zM13 21h8v-6h-8zM13 11h8V3h-8zM3 21h8v-6H3z" />
      </svg>
    ),
  },
  {
    label: "Bookings",
    href: "/bookings",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M8 3v4M16 3v4M3 10h18" />
      </svg>
    ),
  },
  {
    label: "Providers",
    href: "/providers",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.9" />
      </svg>
    ),
  },
  {
    label: "Earnings",
    href: "/earnings",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 1v22" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14.5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
];

export function Sidebar({ onNavigate, isCollapsed = false }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background px-3 py-4 text-foreground">
      <div className={`mb-5 ${isCollapsed ? "md:flex md:justify-center" : "-ml-1"}`}>
        <Link href="/" className="inline-flex" onClick={onNavigate}>
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

      <div className="mb-5 rounded-2xl border border-border bg-muted/20 px-3 py-3">
        <p className="text-sm font-semibold text-foreground">Welcome, Admin</p>
        <p className="text-xs text-muted-foreground">Care Agency Admin</p>
      </div>

      <ul className="space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className={`flex items-center gap-2.5 rounded-lg border-l-2 px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "border-primary bg-muted text-foreground shadow-sm"
                    : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <span className={`h-4 w-4 shrink-0 ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                  {item.icon}
                </span>
                <span className={`${isCollapsed ? "hidden" : "inline"}`}>
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Sidebar;