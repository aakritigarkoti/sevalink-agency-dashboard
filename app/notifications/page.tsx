"use client";

import { useMemo, useState } from "react";
import LayoutWrapper from "@/components/layout/LayoutWrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNotifications } from "@/components/notifications/NotificationContext";
import { notificationTypeLabels, notificationTypeVariants, type NotificationItem } from "@/components/notifications/notification-data";

const filterTabs = ["All", "Unread", "Read"] as const;
type FilterTab = (typeof filterTabs)[number];

function notificationTypeBadge(type: NotificationItem["type"]) {
  return (
    <Badge variant={notificationTypeVariants[type]} className="text-[11px]">
      {notificationTypeLabels[type]}
    </Badge>
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
      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Notifications</h1>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
              Review booking activity, profile updates, and system alerts in one place.
            </p>
          </div>

          <div className="shadow-sm">
            <Badge variant="outline" className="h-auto px-3 py-1 text-sm font-medium">
            {unreadCount} unread
            </Badge>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {filterTabs.map((tab) => {
            const isActive = tab === activeFilter;

            return (
              <Button
                key={tab}
                type="button"
                onClick={() => setActiveFilter(tab)}
                size="sm"
                variant={isActive ? "default" : "outline"}
              >
                {tab}
              </Button>
            );
          })}
        </div>

        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5 ${
                notification.isRead ? "bg-card" : "bg-muted"
              }`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-semibold text-card-foreground">{notification.title}</h2>
                    {notificationTypeBadge(notification.type)}
                    {!notification.isRead ? (
                      <span className="text-[11px] font-semibold text-muted-foreground">
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
              <p className="text-base font-semibold text-card-foreground">No data available</p>
              <p className="mt-1 text-sm text-muted-foreground">Try a different filter or wait for new activity.</p>
            </Card>
          ) : null}
        </div>
      </section>
    </LayoutWrapper>
  );
}