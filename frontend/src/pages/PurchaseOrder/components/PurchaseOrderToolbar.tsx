import React from "react";
import { Search, Plus } from "lucide-react";
import type { OrderFilter } from "@/types/purchaseOrder";

const filterOptions: { label: string; value: OrderFilter }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "Pending" },
  { label: "Partially Received", value: "PartiallyReceived" },
  { label: "Completed", value: "Completed" },
  { label: "Cancelled", value: "Cancelled" },
];

interface Props {
  search: string;
  onSearch: (v: string) => void;
  activeFilter: OrderFilter;
  onFilter: (v: OrderFilter) => void;
  onNew: () => void;
}

const PurchaseOrderToolbar: React.FC<Props> = ({
  search,
  onSearch,
  activeFilter,
  onFilter,
  onNew,
}) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
    <div className="flex flex-wrap gap-1.5">
      {filterOptions.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onFilter(opt.value)}
          className={`h-8 rounded-lg px-3 text-sm font-medium transition-all ${
            activeFilter === opt.value
              ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
              : "border border-border bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>

    <div className="flex items-center gap-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
        <input
          className="h-9 w-52 rounded-lg border border-border bg-muted/40 pl-8 pr-4 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-sidebar-primary/20 focus:border-sidebar-primary/50 focus:bg-background transition-all"
          placeholder="Search supplier or order..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <button
        onClick={onNew}
        className="flex h-9 items-center gap-2 rounded-lg bg-sidebar-primary px-4 text-sm font-semibold text-sidebar-primary-foreground transition-opacity hover:opacity-90 active:scale-[0.98] shrink-0"
      >
        <Plus className="h-4 w-4" />
        New Order
      </button>
    </div>
  </div>
);

export default PurchaseOrderToolbar;
