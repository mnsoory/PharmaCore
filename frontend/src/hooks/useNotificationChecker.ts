import { useEffect } from "react";
import { stockBatchService } from "@/services/stockBatchService";
import { useNotificationStore, type AppNotification } from "@/store/useNotificationStore";

const todayStr = () => new Date().toISOString().split("T")[0];

export const useNotificationChecker = () => {
  const { addNotifications, setLastCheckedDate, lastCheckedDate, settings } =
    useNotificationStore();

  useEffect(() => {
    const today = todayStr();
    if (lastCheckedDate === today) return;

    const run = async () => {
      try {
        if (!settings.expiring) {
          setLastCheckedDate(today);
          return;
        }

        const [expired, expiringSoon] = await Promise.all([
          stockBatchService.getExpired(),
          stockBatchService.getExpiringSoon(),
        ]);

        const items: AppNotification[] = [];

        expired.forEach(b => items.push({
          id:        `expired-${b.stockBatchId}`,
          type:      "expired",
          title:     "Batch Expired",
          message:   `${b.tradeName} ${b.concentration} · Batch ${b.batchNumber} has expired`,
          createdAt: new Date().toISOString(),
          read:      false,
        }));

        if (settings.expiry30)
          expiringSoon.within30Days.forEach(b => items.push({
            id:        `exp30-${b.stockBatchId}`,
            type:      "expiring_30",
            title:     "Expiring in 30 Days",
            message:   `${b.tradeName} ${b.concentration} · Batch ${b.batchNumber} expires ${new Date(b.expiryDate).toLocaleDateString("en-GB")}`,
            createdAt: new Date().toISOString(),
            read:      false,
          }));

        if (settings.expiry60)
          expiringSoon.within60Days.forEach(b => items.push({
            id:        `exp60-${b.stockBatchId}`,
            type:      "expiring_60",
            title:     "Expiring in 60 Days",
            message:   `${b.tradeName} ${b.concentration} · Batch ${b.batchNumber} expires ${new Date(b.expiryDate).toLocaleDateString("en-GB")}`,
            createdAt: new Date().toISOString(),
            read:      false,
          }));

        if (settings.expiry90)
          expiringSoon.within90Days.forEach(b => items.push({
            id:        `exp90-${b.stockBatchId}`,
            type:      "expiring_90",
            title:     "Expiring in 90 Days",
            message:   `${b.tradeName} ${b.concentration} · Batch ${b.batchNumber} expires ${new Date(b.expiryDate).toLocaleDateString("en-GB")}`,
            createdAt: new Date().toISOString(),
            read:      false,
          }));

        if (items.length > 0) addNotifications(items);
        setLastCheckedDate(today);
      } catch {
        //
      }
    };

    run();
  }, [
    addNotifications,
    lastCheckedDate,
    setLastCheckedDate,
    settings.expiring,
    settings.expiry30,
    settings.expiry60,
    settings.expiry90,
  ]);
};

export const checkLowStock = async (
  addNotifications: (n: AppNotification[]) => void,
  enabled: boolean = true,
) => {
  if (!enabled) return;
  try {
    const lowStock = await stockBatchService.getLowStock();
    const today    = todayStr();
    const items: AppNotification[] = lowStock.map(d => ({
      id:        `lowstock-${d.drugId}-${today}`,
      type:      "low_stock" as const,
      title:     "Low Stock Alert",
      message:   `${d.tradeName} ${d.concentration} · Only ${d.currentStock} units left (min: ${d.minimumStockThreshold})`,
      createdAt: new Date().toISOString(),
      read:      false,
    }));
    if (items.length > 0) addNotifications(items);
  } catch {
    //
  }
};