import React from "react";
import { ChevronLeft } from "lucide-react";

interface Props {
  collapsed: boolean;
  onClick?: () => void;
}

const CollapseButton: React.FC<Props> = ({ collapsed, onClick }) => (
  <button
    aria-label="Collapse sidebar"
    onClick={onClick}
    className="absolute ltr:-right-4.5 rtl:-left-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar text-sidebar-foreground/50 shadow-sm transition-all hover:bg-sidebar-accent hover:text-sidebar-foreground"
  >
    <ChevronLeft
      className={`h-3.5 w-3.5 transition-transform duration-300 ${
        collapsed ? "rotate-180" : ""
      }`}
      aria-hidden="true"
    />
  </button>
);

export default CollapseButton;