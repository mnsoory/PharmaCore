import React from "react";
import { Search, Plus, SlidersHorizontal } from "lucide-react";

interface Props {
  search: string;
  onSearch: (v: string) => void;
  categoryFilter: string;
  onCategoryFilter: (v: string) => void;
  statusFilter: string;
  onStatusFilter: (v: string) => void;
  categories: string[];
  onAdd: () => void;
}

const InventoryToolbar: React.FC<Props> = ({
  search, onSearch,
  categoryFilter, onCategoryFilter,
  statusFilter, onStatusFilter,
  categories, onAdd,
}) => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
    <div className="flex flex-wrap items-center gap-2">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
        <input
          className="h-9 w-56 rounded-lg border border-border bg-muted/40 pl-8 pr-4 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-sidebar-primary/20 focus:border-sidebar-primary/50 focus:bg-background transition-all"
          placeholder="Search name or generic..."
          value={search}
          onChange={e => onSearch(e.target.value)}
        />
      </div>

      {/* Category filter */}
      <div className="relative">
        <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60 pointer-events-none" />
        <select
          value={categoryFilter}
          onChange={e => onCategoryFilter(e.target.value)}
          className="h-9 rounded-lg border border-border bg-muted/40 pl-8 pr-3 text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-sidebar-primary/20 focus:border-sidebar-primary/50 focus:bg-background transition-all appearance-none cursor-pointer"
        >
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Status filter */}
      <select
        value={statusFilter}
        onChange={e => onStatusFilter(e.target.value)}
        className="h-9 rounded-lg border border-border bg-muted/40 px-3 text-sm text-muted-foreground focus:outline-none focus:ring-2 focus:ring-sidebar-primary/20 focus:border-sidebar-primary/50 focus:bg-background transition-all appearance-none cursor-pointer"
      >
        <option value="">All Statuses</option>
        <option value="Safe">Safe</option>
        <option value="Low Stock">Low Stock</option>
        <option value="Out of Stock">Out of Stock</option>
      </select>
    </div>

    <button
      onClick={onAdd}
      className="flex h-9 items-center gap-2 rounded-lg bg-sidebar-primary px-4 text-sm font-semibold text-sidebar-primary-foreground transition-opacity hover:opacity-90 active:scale-[0.98] shrink-0"
    >
      <Plus className="h-4 w-4" />
      Add New Drug
    </button>
  </div>
);

export default InventoryToolbar;