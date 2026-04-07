"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarProps = {
  onNavigate?: () => void;
  isCollapsed?: boolean;
};

const navItems = [
  { label: "Dashboard", href: "/" },
  { label: "Bookings", href: "/bookings" },
  { label: "Providers", href: "/providers" },
  { label: "Earnings", href: "/earnings" },
];

export function Sidebar({ onNavigate, isCollapsed = false }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col overflow-hidden bg-background px-3 py-4 text-foreground">
      <div className={`mb-7 ${isCollapsed ? "md:flex md:justify-center" : "-ml-1"}`}>
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

      <ul className="space-y-1.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className={`flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-300 ease-in-out ${
                  isActive
                    ? "bg-muted text-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <span className={`${isCollapsed ? "md:hidden" : "inline"}`}>
                  {item.label}
                </span>
                <span className={`${isCollapsed ? "hidden md:inline" : "hidden"}`}>
                  {item.label.charAt(0)}
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