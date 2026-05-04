import React, { useState, useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { createPortal } from "react-dom";
import { type NavItem as NavItemType } from "./menuItems";
import NavBadge from "./NavBadge";

interface Props {
  item: NavItemType;
  collapsed: boolean;
}

const NavItem: React.FC<Props> = ({ item, collapsed }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const Icon = item.icon;

  useEffect(() => {
    if (showTooltip && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const isRTL = document.documentElement.dir === "rtl";
      const gap = 1;
      setTooltipPos({
        top: rect.top + rect.height / 2,
        left: isRTL ? rect.left - gap : rect.right + gap,
      });
    }
  }, [showTooltip]);

  return (
    <div
      ref={triggerRef}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
      className="relative w-full"
    >
      <NavLink
        to={item.path}
        className={({ isActive }) =>
          `group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
            collapsed ? "justify-center px-2" : ""
          } ${
            isActive
              ? "bg-sidebar-accent text-sidebar-primary"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <Icon
              className={`shrink-0 transition-colors ${
                isActive
                  ? "text-sidebar-primary"
                  : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground/80"
              } ${collapsed ? "h-5.5 w-5.5" : "h-5 w-5"}`}
              aria-hidden="true"
            />
            {!collapsed && (
              <>
                <span className="flex-1">{item.name}</span>
                {item.badge !== undefined && <NavBadge count={item.badge} />}
              </>
            )}
          </>
        )}
      </NavLink>

      {collapsed && showTooltip &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: tooltipPos.top,
              left: tooltipPos.left,
              transform: "translateY(-50%)",
              zIndex: 9999,
              pointerEvents: "none",
            }}
            className="animate-in fade-in zoom-in duration-100"
          >

            <div
              style={{
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
                [document.documentElement.dir === "rtl" ? "right" : "left"]: -6,
                width: 0,
                height: 0,
                borderWidth: "6px",
                borderStyle: "solid",
                borderColor: "transparent",
                ...(document.documentElement.dir === "rtl"
                  ? { borderRightColor: "transparent", borderLeftColor: "hsl(var(--sidebar-foreground))" }
                  : { borderLeftColor: "transparent", borderRightColor: "hsl(var(--sidebar-foreground))" }
                ),
              }}
            />

            <div className="flex items-center gap-1.5 whitespace-nowrap rounded-md bg-sidebar-foreground px-2.5 py-1.5 text-xs font-medium text-sidebar shadow-md">
              {item.name}
              {item.badge !== undefined && (
                <span className="rounded-full bg-sidebar-primary/30 px-1.5 py-0.5 text-[10px] text-sidebar-primary-foreground">
                  {item.badge}
                </span>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default NavItem;