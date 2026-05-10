import React, { useRef, useState, useEffect } from "react";
import { Search, Package, Loader2 } from "lucide-react";
import { createPortal } from "react-dom";
import useDebounce from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { inventoryService } from "@/services/inventoryService";
import { drugKeys } from "@/api/keys";

interface DrugResult {
  drugId: number;
  tradeName: string;
  genericName: string;
}

interface Props {
  placeholder?: string;
  excludeIds?: number[];
  onSelect: (drug: DrugResult) => void;
}

const DrugSearchInput: React.FC<Props> = ({
  placeholder = "Search by trade name...",
  excludeIds = [],
  onSelect,
}) => {
  const [query,        setQuery]        = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPos,  setDropdownPos]  = useState({ top: 0, left: 0, width: 0 });

  const debouncedQuery = useDebounce(query, 300);

  const inputRef    = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: drugs = [], isLoading } = useQuery({
    queryKey: drugKeys.lists(),
    queryFn:  () => inventoryService.getAllDrugs(),
    enabled:  showDropdown,
  });

  const filteredResults = debouncedQuery.trim().length >= 2
    ? drugs
        .filter(d =>
          (d.tradeName.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
           d.genericName.toLowerCase().includes(debouncedQuery.toLowerCase())) &&
          !excludeIds.includes(d.id)
        )
        .slice(0, 8)
        .map(d => ({ drugId: d.id, tradeName: d.tradeName, genericName: d.genericName }))
    : [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        inputRef.current    && !inputRef.current.contains(e.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const updateDropdownPos = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }
  };

  const handleChange = (q: string) => {
    setQuery(q);
    if (q.trim().length >= 2) {
      updateDropdownPos();
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const handleFocus = () => {
    if (query.trim().length >= 2) {
      updateDropdownPos();
      setShowDropdown(true);
    }
  };

  const handleSelect = (drug: DrugResult) => {
    onSelect(drug);
    setQuery("");
    setShowDropdown(false);
  };

  const showEmpty   = !isLoading && debouncedQuery.trim().length >= 2 && filteredResults.length === 0;
  const showResults = !isLoading && filteredResults.length > 0;

  return (
    <>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={e => handleChange(e.target.value)}
          onFocus={handleFocus}
          className="h-10 w-full rounded-lg border border-input bg-transparent pl-9 pr-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-[color,box-shadow]"
        />
      </div>

      {/* Dropdown via portal */}
      {showDropdown && createPortal(
        <div
          ref={dropdownRef}
          style={{
            position: "fixed",
            top:      dropdownPos.top,
            left:     dropdownPos.left,
            width:    dropdownPos.width,
            zIndex:   200,
          }}
          className="rounded-lg border border-border bg-background shadow-lg overflow-hidden"
        >
          {/* Loading */}
          {isLoading && (
            <div className="flex items-center gap-2 px-4 py-3">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Searching...</p>
            </div>
          )}

          {/* Results */}
          {showResults && filteredResults.map(drug => (
            <button
              key={drug.drugId}
              type="button"
              onClick={() => handleSelect(drug)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary/10 text-sidebar-primary">
                <Package className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{drug.tradeName}</p>
                <p className="text-xs text-muted-foreground mt-0.5 italic">{drug.genericName}</p>
              </div>
            </button>
          ))}

          {/* Empty */}
          {showEmpty && (
            <div className="px-4 py-3">
              <p className="text-sm text-muted-foreground">No drugs found for "{debouncedQuery}"</p>
            </div>
          )}
        </div>,
        document.body
      )}
    </>
  );
};

export default DrugSearchInput;