"use client";

import { createContext, useContext, useMemo, useState } from "react";
import {
  initialNotifications,
  type NotificationItem,
} from "./notification-data";

type NotificationsContextValue = {
  notifications: NotificationItem[];
  unreadCount: number;
  latestNotifications: NotificationItem[];
  markAsRead: (notificationId: number) => void;
  markAllAsRead: () => void;
};

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const value = useMemo<NotificationsContextValue>(() => {
    const unreadCount = notifications.filter((notification) => !notification.isRead).length;

    return {
      notifications,
      unreadCount,
      latestNotifications: notifications.slice(0, 5),
      markAsRead: (notificationId: number) => {
        setNotifications((currentNotifications) =>
          currentNotifications.map((notification) =>
            notification.id === notificationId ? { ...notification, isRead: true } : notification,
          ),
        );
      },
      markAllAsRead: () => {
        setNotifications((currentNotifications) =>
          currentNotifications.map((notification) =>
            notification.isRead ? notification : { ...notification, isRead: true },
          ),
        );
      },
    };
  }, [notifications]);

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
  const context = useContext(NotificationsContext);

  if (!context) {
    throw new Error("useNotifications must be used within a NotificationsProvider");
  }

  return context;
}
