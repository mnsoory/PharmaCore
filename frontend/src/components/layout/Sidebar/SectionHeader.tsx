import React from "react";
import { ChevronRight } from "lucide-react";

interface Props {
  title: string;
  open: boolean;
  onToggle: () => void;
}

const SectionHeader: React.FC<Props> = ({ title, open, onToggle }) => (
  <button
    onClick={onToggle}
    className="flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/30 transition-colors hover:text-sidebar-foreground/50"
  >
    <span className="flex-1 text-start">{title}</span>
    <ChevronRight
      className={`size-3 transition-transform duration-200 ${open ? "rotate-90" : ""}`}
      aria-hidden="true"
    />
  </button>
);

export default SectionHeader;