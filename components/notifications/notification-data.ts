export type NotificationType =
  | "booking-request"
  | "booking-accepted"
  | "booking-rejected"
  | "profile-update"
  | "system-alert";

export type NotificationItem = {
  id: number;
  title: string;
  description: string;
  timeLabel: string;
  createdAt: string;
  isRead: boolean;
  type: NotificationType;
};

export const notificationTypeVariants: Record<
  NotificationType,
  "default" | "secondary" | "destructive" | "outline"
> = {
  "booking-request": "secondary",
  "booking-accepted": "secondary",
  "booking-rejected": "secondary",
  "profile-update": "outline",
  "system-alert": "default",
};

export const initialNotifications: NotificationItem[] = [
  {
    id: 1,
    title: "New Booking Request",
    description: "Ananya Sharma requested Nursing Care for tomorrow morning.",
    timeLabel: "2 min ago",
    createdAt: "2026-04-08T10:28:00Z",
    isRead: false,
    type: "booking-request",
  },
  {
    id: 2,
    title: "Booking Accepted",
    description: "Rohan Verma's physiotherapy booking has been confirmed.",
    timeLabel: "18 min ago",
    createdAt: "2026-04-08T10:12:00Z",
    isRead: false,
    type: "booking-accepted",
  },
  {
    id: 3,
    title: "Profile Updated",
    description: "Dr. Pooja Nair updated her specialization and availability.",
    timeLabel: "41 min ago",
    createdAt: "2026-04-08T09:49:00Z",
    isRead: true,
    type: "profile-update",
  },
  {
    id: 4,
    title: "System Alert",
    description: "Payment gateway latency is slightly elevated. Monitoring continues.",
    timeLabel: "1 hr ago",
    createdAt: "2026-04-08T09:05:00Z",
    isRead: false,
    type: "system-alert",
  },
  {
    id: 5,
    title: "Booking Rejected",
    description: "The requested booking for 12 Apr was declined by the provider.",
    timeLabel: "2 hrs ago",
    createdAt: "2026-04-08T08:12:00Z",
    isRead: true,
    type: "booking-rejected",
  },
  {
    id: 6,
    title: "New Booking Request",
    description: "Meera Iyer submitted a new elder care request for this evening.",
    timeLabel: "3 hrs ago",
    createdAt: "2026-04-08T07:35:00Z",
    isRead: false,
    type: "booking-request",
  },
  {
    id: 7,
    title: "Profile Updated",
    description: "Sonal Mehta refreshed her service coverage and contact details.",
    timeLabel: "5 hrs ago",
    createdAt: "2026-04-08T05:25:00Z",
    isRead: true,
    type: "profile-update",
  },
  {
    id: 8,
    title: "System Alert",
    description: "A backup completed successfully for the dashboard data store.",
    timeLabel: "7 hrs ago",
    createdAt: "2026-04-08T03:55:00Z",
    isRead: true,
    type: "system-alert",
  },
];

export const notificationTypeLabels: Record<NotificationType, string> = {
  "booking-request": "Booking",
  "booking-accepted": "Booking",
  "booking-rejected": "Booking",
  "profile-update": "Profile",
  "system-alert": "System",
};
