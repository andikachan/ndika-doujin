"use client";

import { useToastStore } from "../store/toastStore";

const STYLES = {
  info: "bg-ink-light text-white dark:bg-white dark:text-ink-light",
  success: "bg-primary text-white",
  error: "bg-red-500 text-white",
};

export default function ToastNotification() {
  const { toasts, dismiss } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-[100] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4 sm:bottom-6 sm:left-auto sm:right-6 sm:translate-x-0">
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => dismiss(t.id)}
          className={`animate-fadeIn cursor-pointer rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${STYLES[t.type] || STYLES.info}`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
