import React from "react";
import { useNavigate } from "react-router-dom";
import {
  X, CheckCheck, Trash2, PackageX,
  Clock, TrendingDown, Info,
} from "lucide-react";
import {
  useNotificationStore,
  type AppNotification,
  type NotificationType,
} from "@/store/useNotificationStore";

const typeConfig: Record<NotificationType, {
  icon:      React.ElementType;
  iconClass: string;
  badge:     string;
  label:     string;
}> = {
  expired:     { icon: PackageX,     label: "Expired",   iconClass: "bg-destructive/10 text-destructive",                                    badge: "bg-destructive/10 text-destructive border-destructive/20"                                                        },
  expiring_30: { icon: Clock,        label: "30d",        iconClass: "bg-orange-100 text-orange-600 dark:bg-orange-950 dark:text-orange-400",                 badge: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800"  },
  expiring_60: { icon: Clock,        label: "60d",        iconClass: "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400",                     badge: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800"        },
  expiring_90: { icon: Clock,        label: "90d",        iconClass: "bg-yellow-100 text-yellow-600 dark:bg-yellow-950 dark:text-yellow-400",                 badge: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800"  },
  
  low_stock:   { 
    icon: TrendingDown, 
    label: "Low Stock",  
    iconClass: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400", 
    badge: "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900"  
  },
  
  out_of_stock: { 
    icon: PackageX, 
    label: "Out Of Stock",  
    iconClass: "bg-destructive/15 text-destructive dark:bg-destructive/20", 
    badge: "bg-destructive/10 text-destructive border-destructive/20 font-bold dark:bg-destructive/20 dark:text-red-400 dark:border-destructive/40"  
  },
  
  system:      { icon: Info,         label: "System",     iconClass: "bg-sidebar-primary/10 text-sidebar-primary",                            badge: "bg-sidebar-primary/10 text-sidebar-primary border-sidebar-primary/20"                                            },
};

const extractSearchTerm = (n: AppNotification): string => {
  const batchMatch = n.message.match(/\bBatch\s+([A-Za-z0-9-]+)/i);
  if (batchMatch) {
    return batchMatch[1].trim();
  }

  const drugMatch = n.message.match(/^([^·]+)/);
  if (drugMatch) {
    return drugMatch[1].trim();
  }

  return "";
};

const getNavigationTarget = (type: NotificationType): {
  path: string;
  filter?: string;
  status?: string;
} => {
  switch (type) {
    case "expired":     return { path: "/stock-batches", filter: "expired"       };
    case "expiring_30":
    case "expiring_60":
    case "expiring_90": return { path: "/stock-batches", filter: "expiring-soon" };
    case "low_stock":   return { path: "/drugs", status: "Low Stock"             };
    case "out_of_stock":   return { path: "/drugs", status: "Out of Stock"       };
    case "system":      return { path: "/dashboard"                              };
  }
};

const NotificationItem: React.FC<{
  n:       AppNotification;
  onClose: () => void;
}> = ({ n, onClose }) => {
  const markAsRead = useNotificationStore(s => s.markAsRead);
  const navigate   = useNavigate();
  const cfg        = typeConfig[n.type];
  const Icon       = cfg.icon;

  const handleClick = () => {
    markAsRead(n.id);
    const { path, filter, status } = getNavigationTarget(n.type);
    const searchTerm = extractSearchTerm(n);

    const params = new URLSearchParams();
    if (filter)     params.set("filter", filter);
    if (status)     params.set("status", status);
    if (searchTerm) params.set("search", searchTerm);

    navigate(`${path}?${params.toString()}`);
    onClose();
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors border-b border-border/50 last:border-0 hover:bg-muted/40 ${
        !n.read ? "bg-sidebar-primary/3" : ""
      }`}
    >
      <div className="relative shrink-0 mt-0.5">
        <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${cfg.iconClass}`}>
          <Icon className="h-4 w-4" />
        </div>
        {!n.read && (
          <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-sidebar-primary border-2 border-background" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
          <p className={`text-sm font-semibold truncate ${n.read ? "text-muted-foreground" : "text-foreground"}`}>
            {n.title}
          </p>
          <span className={`shrink-0 inline-flex items-center rounded border px-1.5 py-0.5 text-[10px] font-semibold ${cfg.badge}`}>
            {cfg.label}
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {n.message}
        </p>
        <p className="text-[10px] text-muted-foreground/50 mt-1">
          {new Date(n.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit", month: "short", year: "numeric",
          })}
          {" · "}
          {new Date(n.createdAt).toLocaleTimeString("en-GB", {
            hour: "2-digit", minute: "2-digit",
          })}
        </p>
      </div>
    </button>
  );
};

interface Props { onClose: () => void; }

const NotificationsPanel: React.FC<Props> = ({ onClose }) => {
  const { notifications, markAllAsRead, clearAll } = useNotificationStore();
  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="flex flex-col h-auto max-h-120 w-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-foreground">Notifications</p>
          {unread > 0 && (
            <span className="inline-flex items-center justify-center h-5 min-w-5 rounded-full bg-sidebar-primary text-sidebar-primary-foreground text-[10px] font-bold px-1">
              {unread}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unread > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 h-7 rounded-md px-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Scrollable list — flex-1 + overflow-y-auto */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-14">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted/50">
              <Info className="h-5 w-5 text-muted-foreground/40" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">All caught up!</p>
            <p className="text-xs text-muted-foreground/60 text-center max-w-40">
              No notifications at the moment
            </p>
          </div>
        ) : (
          notifications.map(n => (
            <NotificationItem key={n.id} n={n} onClose={onClose} />
          ))
        )}
      </div>

    </div>
  );
};

export default NotificationsPanel;