import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { NotificationsProvider } from "@/components/notifications/NotificationContext";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SevaLink Agency Dashboard",
  description: "Operational dashboard for bookings, providers, and earnings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col bg-background text-foreground transition-colors duration-300">
        <ThemeProvider>
          <ToastProvider>
            <NotificationsProvider>{children}</NotificationsProvider>
            <Toaster position="top-right" richColors />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
