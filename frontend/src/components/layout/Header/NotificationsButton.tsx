import React, { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { createPortal } from "react-dom";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useNotificationChecker } from "@/hooks/useNotificationChecker";
import NotificationsPanel from "./NotificationsPanel";

const NotificationsButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const unread = useNotificationStore(
    (s) => s.notifications.filter((n) => !n.read).length,
  );

  useNotificationChecker();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node) &&
        panelRef.current &&
        !panelRef.current.contains(e.target as Node)
      )
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleToggle = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 8, right: window.innerWidth - rect.right });
    }
    setOpen((p) => !p);
  };

  return (
    <>
      <button
        ref={buttonRef}
        aria-label="Notifications"
        onClick={handleToggle}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted/40 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground border-2 border-background">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open &&
        createPortal(
          <div
            ref={panelRef}
            style={{
              position: "fixed",
              top: pos.top,
              right: pos.right,
              zIndex: 200,
              width: "360px",
              maxHeight: "480px",
            }}
            className="rounded-lg border border-border bg-background shadow-lg flex flex-col overflow-hidden" // ← overflow-hidden هنا مهم
          >
            <NotificationsPanel onClose={() => setOpen(false)} />
          </div>,
          document.body,
        )}
    </>
  );
};

export default NotificationsButton;
