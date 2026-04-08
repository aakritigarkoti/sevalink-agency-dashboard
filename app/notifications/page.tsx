"use client";

import { useMemo, useState } from "react";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNotifications } from "@/components/notifications/NotificationContext";
import { notificationTypeLabels, type NotificationItem } from "@/components/notifications/notification-data";

const filterTabs = ["All", "Unread", "Read"] as const;
type FilterTab = (typeof filterTabs)[number];

function notificationTypeBadge(type: NotificationItem["type"]) {
  const styles: Record<NotificationItem["type"], string> = {
    "booking-request": "bg-amber-500/10 text-amber-700 ring-amber-500/15",
    "booking-accepted": "bg-emerald-500/10 text-emerald-700 ring-emerald-500/15",
    "booking-rejected": "bg-rose-500/10 text-rose-700 ring-rose-500/15",
    "profile-update": "bg-sky-500/10 text-sky-700 ring-sky-500/15",
    "system-alert": "bg-slate-500/10 text-slate-700 ring-slate-500/15",
  };

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${styles[type]}`}>
      {notificationTypeLabels[type]}
    </span>
  );
}

export default function NotificationsPage() {
  const { notifications, markAsRead, unreadCount } = useNotifications();
  const [activeFilter, setActiveFilter] = useState<FilterTab>("All");

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      if (activeFilter === "Unread") {
        return !notification.isRead;
      }

      if (activeFilter === "Read") {
        return notification.isRead;
      }

      return true;
    });
  }, [activeFilter, notifications]);

  return (
    <LayoutWrapper>
      <section className="space-y-6 lg:space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Notifications</h1>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
              Review booking activity, profile updates, and system alerts in one place.
            </p>
          </div>

          <div className="rounded-full border border-border bg-card px-3 py-1 text-sm font-medium text-foreground shadow-sm">
            {unreadCount} unread
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {filterTabs.map((tab) => {
            const isActive = tab === activeFilter;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveFilter(tab)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-foreground text-background shadow-sm"
                    : "border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5 ${
                notification.isRead ? "bg-card" : "border-primary/10 bg-primary/5"
              }`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-semibold text-card-foreground">{notification.title}</h2>
                    {notificationTypeBadge(notification.type)}
                    {!notification.isRead ? (
                      <span className="inline-flex rounded-full bg-rose-500/10 px-2 py-0.5 text-[11px] font-semibold text-rose-700">
                        Unread
                      </span>
                    ) : null}
                  </div>

                  <p className="max-w-3xl text-sm leading-6 text-muted-foreground">{notification.description}</p>

                  <p className="text-xs font-medium text-muted-foreground">{notification.timeLabel}</p>
                </div>

                <Button
                  type="button"
                  variant={notification.isRead ? "outline" : "default"}
                  size="sm"
                  onClick={() => markAsRead(notification.id)}
                  disabled={notification.isRead}
                  className={notification.isRead ? "cursor-default" : "shadow-sm"}
                >
                  {notification.isRead ? "Read" : "Mark as read"}
                </Button>
              </div>
            </Card>
          ))}

          {filteredNotifications.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-base font-semibold text-card-foreground">No notifications here</p>
              <p className="mt-1 text-sm text-muted-foreground">Try a different filter or wait for new activity.</p>
            </Card>
          ) : null}
        </div>
      </section>
    </LayoutWrapper>
  );
}