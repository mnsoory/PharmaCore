import React from "react";
import { Bell } from "lucide-react";
import { useNotificationStore } from "../../../store/useNotificationStore";

const NotificationsButton: React.FC = () => {
  const hasUnread = useNotificationStore((state) => state.hasUnread);

  return (
    <button
      aria-label="Notifications"
      className="relative flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
    >
      <Bell className="h-6 w-6" />
      {hasUnread && (
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white dark:border-slate-900" />
      )}
    </button>
  );
};

export default NotificationsButton;