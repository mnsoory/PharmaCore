import { create } from 'zustand';

interface NotificationState {
  hasUnread: boolean;
  setHasUnread: (status: boolean) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  hasUnread: false, 
  setHasUnread: (status) => set({ hasUnread: status }),
}));