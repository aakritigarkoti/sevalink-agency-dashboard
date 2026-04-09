"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNotifications } from "./NotificationContext";
import { notificationTypeLabels, notificationTypeVariants } from "./notification-data";

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

  return (
    <Badge variant={notificationTypeVariants[type]} className="text-[11px]">
      {label}
    </Badge>
  );
}

export function NotificationBell() {
  const { unreadCount, latestNotifications, markAsRead, markAllAsRead } = useNotifications();
  const hasUnreadNotifications = latestNotifications.some((notification) => !notification.isRead);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Open notifications"
          className="relative overflow-visible active:scale-95"
        >
          <BellIcon />
          {unreadCount > 0 ? (
            <span className="absolute -right-0.5 -top-0.5 inline-flex min-h-4.5 min-w-4.5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold leading-none text-destructive-foreground shadow-sm">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="animate-dropdown-in w-[min(94vw,24rem)] rounded-2xl border border-border bg-card p-0 text-card-foreground shadow-xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3.5">
            <div>
              <p className="text-sm font-semibold text-foreground">Notifications</p>
              <p className="text-xs text-muted-foreground">Latest activity from your dashboard</p>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 ? (
                <Button
                  type="button"
                  onClick={markAllAsRead}
                  size="sm"
                  variant="ghost"
                >
                  Mark all as read
                </Button>
              ) : null}
              <Badge variant="secondary">
                {unreadCount} unread
              </Badge>
            </div>
          </div>

          <div className="thin-scrollbar max-h-96 scroll-smooth overflow-y-auto p-2.5">
            {hasUnreadNotifications ? (
              <div className="space-y-2.5">
                {latestNotifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    onSelect={() => markAsRead(notification.id)}
                    className={`h-auto w-full cursor-pointer justify-start rounded-xl border border-border p-3 text-left transition-all duration-300 hover:bg-muted hover:shadow-md focus:bg-muted ${
                      notification.isRead
                        ? "bg-card"
                        : "bg-muted"
                    }`}
                  >
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          {!notification.isRead ? <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" /> : null}
                          <p className="truncate text-sm font-semibold text-foreground">{notification.title}</p>
                        </div>
                        <p className="mt-0.5 line-clamp-2 text-xs leading-5 text-muted-foreground">
                          {notification.description}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs font-medium text-muted-foreground">
                        {notification.timeLabel}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <TypePill type={notification.type} />
                      {!notification.isRead ? (
                        <span className="text-[11px] font-semibold text-muted-foreground">Unread</span>
                      ) : null}
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 px-3 py-12 text-center">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M15 17H9m8-6a5 5 0 1 0-10 0c0 6-2 7-2 7h14s-2-1-2-7" />
                    <path d="M10 20a2 2 0 0 0 4 0" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-foreground">No new notifications</p>
              </div>
            )}
          </div>

          <div className="border-t border-border p-3">
            <Button asChild variant="outline" className="h-10 w-full">
              <Link
                href="/notifications"
              >
                View All
              </Link>
            </Button>
          </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
