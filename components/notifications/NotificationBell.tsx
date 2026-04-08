"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useNotifications } from "./NotificationContext";
import { notificationTypeLabels } from "./notification-data";

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 17H9m8-6a5 5 0 1 0-10 0c0 6-2 7-2 7h14s-2-1-2-7" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  );
}

function TypePill({ type }: { type: keyof typeof notificationTypeLabels }) {
  const label = notificationTypeLabels[type];
  const styles: Record<keyof typeof notificationTypeLabels, string> = {
    "booking-request": "bg-amber-500/10 text-amber-700 ring-amber-500/15",
    "booking-accepted": "bg-emerald-500/10 text-emerald-700 ring-emerald-500/15",
    "booking-rejected": "bg-rose-500/10 text-rose-700 ring-rose-500/15",
    "profile-update": "bg-sky-500/10 text-sky-700 ring-sky-500/15",
    "system-alert": "bg-slate-500/10 text-slate-700 ring-slate-500/15",
  };

  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${styles[type]}`}>
      {label}
    </span>
  );
}

export function NotificationBell() {
  const { unreadCount, latestNotifications, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hasUnreadNotifications = latestNotifications.some((notification) => !notification.isRead);

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Open notifications"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="relative overflow-visible active:scale-95"
      >
        <BellIcon />
        {unreadCount > 0 ? (
          <span className="absolute -right-0.5 -top-0.5 inline-flex min-h-4.5 min-w-4.5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold leading-none text-white shadow-sm">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </Button>

      {isOpen ? (
        <div className="animate-dropdown-in absolute right-2 top-full z-50 mt-2 w-[min(94vw,24rem)] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900 sm:right-4">
          <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3.5 dark:border-gray-800">
            <div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">Notifications</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Latest activity from your dashboard</p>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 ? (
                <button
                  type="button"
                  onClick={markAllAsRead}
                  className="rounded-lg px-2.5 py-1 text-xs font-semibold text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
                >
                  Mark all as read
                </button>
              ) : null}
              <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                {unreadCount} unread
              </span>
            </div>
          </div>

          <div className="thin-scrollbar max-h-96 scroll-smooth overflow-y-auto p-2.5">
            {hasUnreadNotifications ? (
              <div className="space-y-2.5">
                {latestNotifications.map((notification) => (
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() => markAsRead(notification.id)}
                      className={`w-full rounded-xl border border-gray-100 p-3 text-left transition-all duration-300 hover:bg-gray-50 hover:shadow-md dark:border-gray-800 dark:hover:bg-gray-800 ${
                      notification.isRead
                          ? "bg-white dark:bg-gray-900"
                          : "bg-blue-50 dark:bg-blue-500/10"
                    }`}
                  >
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          {!notification.isRead ? <span className="h-1.5 w-1.5 rounded-full bg-blue-500" aria-hidden="true" /> : null}
                          <p className="truncate text-sm font-semibold text-gray-800 dark:text-gray-100">{notification.title}</p>
                        </div>
                        <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-gray-500 dark:text-gray-400">
                          {notification.description}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs font-medium text-gray-400 dark:text-gray-500">
                        {notification.timeLabel}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <TypePill type={notification.type} />
                      <span className={`text-[11px] font-semibold ${notification.isRead ? "text-gray-400 dark:text-gray-500" : "text-blue-600 dark:text-blue-400"}`}>
                        {notification.isRead ? "Read" : "Unread"}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 px-3 py-12 text-center">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M15 17H9m8-6a5 5 0 1 0-10 0c0 6-2 7-2 7h14s-2-1-2-7" />
                    <path d="M10 20a2 2 0 0 0 4 0" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">No new notifications</p>
              </div>
            )}
          </div>

          <div className="border-t border-gray-100 p-3 dark:border-gray-800">
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="inline-flex h-10 w-full items-center justify-center rounded-xl bg-white px-3 text-sm font-semibold text-gray-900 shadow-sm transition-colors duration-300 hover:bg-gray-100 dark:bg-blue-500 dark:text-white dark:hover:bg-blue-600"
            >
              View All
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
