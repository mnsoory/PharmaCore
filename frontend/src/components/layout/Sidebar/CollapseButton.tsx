import React from "react";
import { createPortal } from "react-dom";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  collapsed: boolean;
  onClick?: () => void;
}

const CollapseButton: React.FC<Props> = ({
  collapsed,
  onClick,
}) => {
  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <button
      aria-label="Collapse sidebar"
      onClick={onClick}
      className={cn(
        `
        fixed
        top-20
        z-9999
        flex
        h-7
        w-7
        items-center
        justify-center
        rounded-full
        border
        border-sidebar-border
        bg-sidebar
        text-sidebar-foreground/60
        shadow-md
        transition-all
        hover:bg-sidebar-accent
        hover:text-sidebar-foreground
      `,
        collapsed
          ? "ltr:left-18 rtl:right-18"
          : "ltr:left-62 rtl:right-62",
      )}
    >
      <ChevronLeft
        className={cn(
          "h-4 w-4 transition-transform duration-300",
          collapsed && "rotate-180",
        )}
        aria-hidden="true"
      />
    </button>,
    document.body,
  );
};

export default CollapseButton;