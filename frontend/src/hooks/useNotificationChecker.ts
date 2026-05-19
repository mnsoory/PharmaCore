import { useEffect } from "react";
import { stockBatchService } from "@/services/stockBatchService";
import {
  useNotificationStore,
  type AppNotification,
} from "@/store/useNotificationStore";

const todayStr = () => new Date().toISOString().split("T")[0];

export const useNotificationChecker = () => {
  useEffect(() => {
    const today = todayStr();
    const store = useNotificationStore.getState();
    
    if (store.lastCheckedDate === today) return;

    const run = async () => {
      try {
        const [expired, expiringSoon] = await Promise.all([
          stockBatchService.getExpired(),
          stockBatchService.getExpiringSoon(),
        ]);

        const items: AppNotification[] = [];

        expired.forEach((b) =>
          items.push({
            id: `expired-${b.stockBatchId}`,
            type: "expired",
            title: "Batch Expired",
            message: `${b.tradeName} ${b.concentration} · Batch ${b.batchNumber} has expired`,
            createdAt: new Date().toISOString(),
            read: false,
          }),
        );

        expiringSoon.within30Days.forEach((b) =>
          items.push({
            id: `exp30-${b.stockBatchId}`,
            type: "expiring_30",
            title: "Expiring in 30 Days",
            message: `${b.tradeName} ${b.concentration} · Batch ${b.batchNumber} expires ${new Date(b.expiryDate).toLocaleDateString("en-GB")}`,
            createdAt: new Date().toISOString(),
            read: false,
          }),
        );

        expiringSoon.within60Days.forEach((b) =>
          items.push({
            id: `exp60-${b.stockBatchId}`,
            type: "expiring_60",
            title: "Expiring in 60 Days",
            message: `${b.tradeName} ${b.concentration} · Batch ${b.batchNumber} expires ${new Date(b.expiryDate).toLocaleDateString("en-GB")}`,
            createdAt: new Date().toISOString(),
            read: false,
          }),
        );

        expiringSoon.within90Days.forEach((b) =>
          items.push({
            id: `exp90-${b.stockBatchId}`,
            type: "expiring_90",
            title: "Expiring in 90 Days",
            message: `${b.tradeName} ${b.concentration} · Batch ${b.batchNumber} expires ${new Date(b.expiryDate).toLocaleDateString("en-GB")}`,
            createdAt: new Date().toISOString(),
            read: false,
          }),
        );

        if (items.length > 0) store.addNotifications(items);
        store.setLastCheckedDate(today);
      } catch {
        // 
      }
    };

    run();
  }, []);
};

export const checkLowStock = async (
  addNotifications: (n: AppNotification[]) => void,
) => {
  try {
    const lowStock = await stockBatchService.getLowStock();
    const today = todayStr();

    const items: AppNotification[] = lowStock.map((d) => {
      const isOutOfStock = d.currentStock <= 0;
      const statusKey = isOutOfStock ? "out" : "low";
      const notificationMessage = isOutOfStock
        ? `${d.tradeName} ${d.concentration} · Out of stock! The inventory is completely empty (min: ${d.minimumStockThreshold})`
        : `${d.tradeName} ${d.concentration} · Only ${d.currentStock} units left (min: ${d.minimumStockThreshold})`;

      return {
        id: `lowstock-${d.drugId}-${statusKey}-${today}`,
        type: isOutOfStock ? "out_of_stock" : ("low_stock" as const),
        title: isOutOfStock ? "Out Of Stock Alert" : "Low Stock Alert",
        message: notificationMessage,
        createdAt: new Date().toISOString(),
        read: false,
      };
    });

    if (items.length > 0) addNotifications(items);
  } catch {
    // 
  }
};