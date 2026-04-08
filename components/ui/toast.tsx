"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (message: string, type: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((message: string, type: ToastType) => {
    const id = Date.now().toString();
    const newToast: Toast = { id, message, type };

    setToasts((current) => [...current, newToast]);

    const timeoutId = setTimeout(() => {
      removeToast(id);
    }, 3000);

    return timeoutId;
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}

function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: Toast[];
  onRemove: (id: string) => void;
}) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 sm:bottom-5 sm:right-5">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: (id: string) => void;
}) {
  const styles: Record<ToastType, { bg: string; text: string; icon: string }> =
    {
      success: {
        bg: "bg-emerald-600",
        text: "text-white",
        icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
      },
      error: {
        bg: "bg-rose-600",
        text: "text-white",
        icon: "M6 18L18 6M6 6l12 12",
      },
      info: {
        bg: "bg-blue-600",
        text: "text-white",
        icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      },
    };

  const style = styles[toast.type];

  return (
    <div
      className={`animate-toast-in ${style.bg} ${style.text} flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg transition-all duration-200`}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <path d={style.icon} />
      </svg>
      <p className="text-sm font-medium">{toast.message}</p>
      <button
        type="button"
        onClick={() => onRemove(toast.id)}
        className="ml-auto shrink-0 text-2xl leading-none opacity-70 transition-opacity hover:opacity-100"
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}
