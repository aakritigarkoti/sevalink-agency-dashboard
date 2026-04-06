"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarProps = {
  onNavigate?: () => void;
};

const navItems = [
  { label: "Dashboard", href: "/" },
  { label: "Bookings", href: "/bookings" },
  { label: "Providers", href: "/providers" },
  { label: "Earnings", href: "/earnings" },
];

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="h-full w-64 bg-gray-900 px-4 pt-3 pb-5 text-white">
      <div className="-ml-2 -mt-1 mb-7">
        <Link href="/" className="inline-block" onClick={onNavigate}>
          <Image
            src="/SevaLink-logo-r.png"
            alt="SevaLink"
            width={120}
            height={32}
            priority
            className="h-auto w-[96px]"
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
                className={`block rounded-xl border-l-2 px-3 py-2.5 text-sm font-medium transition-all duration-300 ease-in-out ${
                  isActive
                    ? "border-yellow-300 bg-white/15 text-yellow-300 shadow-sm"
                    : "border-transparent text-white/90 hover:translate-x-0.5 hover:bg-white/10 hover:text-yellow-300"
                }`}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Sidebar;