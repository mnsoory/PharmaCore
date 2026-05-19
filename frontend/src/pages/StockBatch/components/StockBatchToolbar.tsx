import React from "react";
import { Search } from "lucide-react";
import type { BatchFilter } from "@/types/stockBatch";

const filterOptions: { label: string; value: BatchFilter }[] = [
  { label: "All Batches",    value: "all"           },
  { label: "Safe",      value: "safe"     },
  { label: "Expiring Soon",  value: "expiring-soon" },
  { label: "Expired",        value: "expired"       },
];

interface Props {
  search: string;
  onSearch: (v: string) => void;
  activeFilter: BatchFilter;
  onFilter: (v: BatchFilter) => void;
}

const StockBatchToolbar: React.FC<Props> = ({ search, onSearch, activeFilter, onFilter }) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
    {/* Filter tabs */}
    <div className="flex flex-wrap gap-1.5">
      {filterOptions.map(opt => (
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

    {/* Search */}
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
      <input
        className="h-9 w-56 rounded-lg border border-border bg-muted/40 pl-8 pr-4 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-sidebar-primary/20 focus:border-sidebar-primary/50 focus:bg-background transition-all"
        placeholder="Search drug or batch..."
        value={search}
        onChange={e => onSearch(e.target.value)}
      />
    </div>
  </div>
);

export default StockBatchToolbar;