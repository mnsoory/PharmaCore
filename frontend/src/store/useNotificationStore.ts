import { create } from "zustand";
import { persist } from "zustand/middleware";

export type NotificationType =
  | "expired"
  | "expiring_30"
  | "expiring_60"
  | "expiring_90"
  | "low_stock"
  | "out_of_stock"
  | "system";

export interface AppNotification {
  id:        string;
  type:      NotificationType;
  title:     string;
  message:   string;
  createdAt: string;
  read:      boolean;
}

interface NotificationStore {
  notifications:      AppNotification[];
  lastCheckedDate:    string | null;
  addNotifications:   (items: AppNotification[]) => void;
  markAsRead:         (id: string) => void;
  markAllAsRead:      () => void;
  clearAll:           () => void;
  setLastCheckedDate: (date: string) => void;
}

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set) => ({
      notifications:   [],
      lastCheckedDate: null,

      addNotifications: (items) =>
  set(state => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const existing = state.notifications
      .filter(n => new Date(n.createdAt) > thirtyDaysAgo);

    const merged = [
      ...items.filter(n => !existing.some(e => e.id === n.id)),
      ...existing,
    ].slice(0, 50);

    return { notifications: merged };
  }),

      markAsRead: (id) =>
        set(state => ({
          notifications: state.notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      markAllAsRead: () =>
        set(state => ({
          notifications: state.notifications.map(n => ({ ...n, read: true })),
        })),

      clearAll: () => set({ notifications: [] }),

      setLastCheckedDate: (date) => set({ lastCheckedDate: date }),
    }),
    { name: "pharma-notifications" }
  )
);