import React from "react";
import { Bell, Package, CalendarClock, ShoppingCart, ShieldAlert } from "lucide-react";
import { useNotificationStore } from "@/store/useNotificationStore";

const Toggle: React.FC<{
  enabled:  boolean;
  onChange: () => void;
  size?:    "default" | "sm";
}> = ({ enabled, onChange, size = "default" }) => (
  <button
    type="button"
    role="switch"
    aria-checked={enabled}
    onClick={onChange}
    className={`relative rounded-full transition-colors shrink-0 ${
      size === "sm" ? "h-5 w-9" : "h-6 w-11"
    } ${enabled ? "bg-sidebar-primary" : "bg-muted-foreground/25"}`}
  >
    <span className={`absolute top-0.5 rounded-full bg-white shadow transition-transform ${
      size === "sm" ? "h-4 w-4" : "h-5 w-5"
    } ${enabled ? "translate-x-0.4" : "-translate-x-5"}`} />
  </button>
);

const NotificationsCard: React.FC = () => {
  const { settings, updateSettings } = useNotificationStore();

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="h-1 w-full bg-linear-to-r from-sidebar-primary/60 via-sidebar-primary to-sidebar-primary/60" />

      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div>
          <p className="text-base font-semibold text-foreground">Notifications</p>
          <p className="text-sm text-muted-foreground mt-0.5">
            Choose what you want to be notified about
          </p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary/10 text-sidebar-primary">
          <Bell className="h-4 w-4" />
        </div>
      </div>

      <div className="px-6 py-2">

        {/* Low Stock */}
        <div className="flex items-center gap-4 py-4 border-b border-border">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-warning/35 text-warning-foreground">
            <Package className="h-5 w-5" strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">Low Stock Alerts</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Notify when a drug falls below minimum stock level
            </p>
          </div>
          <Toggle
            enabled={settings.lowStock}
            onChange={() => updateSettings({ lowStock: !settings.lowStock })}
          />
        </div>

        {/* Expiry warnings */}
        <div className="py-4 border-b border-border space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400">
              <CalendarClock className="h-5 w-5" strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground">Expiry Warnings</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Alerts for batches approaching expiry date
              </p>
            </div>
            <Toggle
              enabled={settings.expiring}
              onChange={() => updateSettings({ expiring: !settings.expiring })}
            />
          </div>

          {settings.expiring && (
            <div className="ml-14 rounded-lg border border-border bg-muted/30 px-4 py-3 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Active Alert Thresholds
              </p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "30 Days",  key: "expiry30" as const, color: "text-destructive", enabled: settings.expiry30 },
                  { label: "60 Days",  key: "expiry60" as const, color: "text-orange-500",  enabled: settings.expiry60 },
                  { label: "90 Days",  key: "expiry90" as const, color: "text-emerald-600", enabled: settings.expiry90 },
                ].map(({ label, key, color, enabled }) => (
                  <div key={key} className="flex items-center justify-between gap-2">
                    <span className={`text-[11px] font-bold uppercase tracking-tight ${color}`}>{label}</span>
                    <Toggle
                      size="sm"
                      enabled={enabled}
                      onChange={() => updateSettings({ [key]: !enabled })}
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground pt-1 border-t border-border/50">
                Changes apply on the next daily check.
              </p>
            </div>
          )}
        </div>

        {/* New orders */}
        <div className="flex items-center gap-4 py-4 border-b border-border">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary/15 text-sidebar-primary">
            <ShoppingCart className="h-5 w-5" strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">New Purchase Orders</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Notify when a new purchase order is created or updated
            </p>
          </div>
          <Toggle
            enabled={settings.newOrders}
            onChange={() => updateSettings({ newOrders: !settings.newOrders })}
          />
        </div>

        {/* System alerts */}
        <div className="flex items-center gap-4 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/15 text-destructive">
            <ShieldAlert className="h-5 w-5" strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-foreground">System Alerts</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Critical system notifications and error reports
            </p>
          </div>
          <Toggle
            enabled={settings.systemAlerts}
            onChange={() => updateSettings({ systemAlerts: !settings.systemAlerts })}
          />
        </div>

      </div>
    </div>
  );
};

export default NotificationsCard;