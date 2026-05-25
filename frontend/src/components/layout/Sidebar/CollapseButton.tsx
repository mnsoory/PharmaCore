import React from "react";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  collapsed: boolean;
  onClick?: () => void;
}

const CollapseButton: React.FC<Props> = ({ collapsed, onClick }) => (
  <button
    aria-label="Collapse sidebar"
    onClick={onClick}
    className={cn(
      "absolute -right-4 top-20 z-40",
      "flex h-6 w-6 items-center justify-center",
      "rounded-full border border-sidebar-border",
      "bg-sidebar text-sidebar-foreground/60 shadow-md",
      "transition-all hover:bg-sidebar-accent hover:text-sidebar-foreground",
    )}
  >
    <ChevronLeft
      className={cn(
        "h-4 w-4 transition-transform duration-300",
        collapsed && "rotate-180",
      )}
      aria-hidden="true"
    />
  </button>
);

export default CollapseButton;