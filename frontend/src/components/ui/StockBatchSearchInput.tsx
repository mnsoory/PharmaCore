import React, { useRef, useState, useEffect, useMemo } from "react";
import { Search, Package, Loader2 } from "lucide-react";
import { createPortal } from "react-dom";
import useDebounce from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { stockBatchService } from "@/services/stockBatchService";
import { stockBatchKeys } from "@/api/keys";

interface BatchSearchResult {
  batchId: number;
  drugId: number;
  drugName: string;
  batchNumber: string;
  availableQuantity: number;
  unitPrice: number;
  expiryDate: string;
  daysLeft: number;
  isExpired: boolean;
}

interface Props {
  placeholder?: string;
  excludeIds?: number[];
  onSelect: (stockBatch: BatchSearchResult) => void;
}

const now = Date.now();

const StockBatchSearchInput: React.FC<Props> = ({
  placeholder = "Search by trade name or batch...",
  excludeIds = [],
  onSelect,
}) => {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: stockBatches = [], isLoading } = useQuery({
  queryKey: stockBatchKeys.search(debouncedQuery),
  queryFn:  () => stockBatchService.getAll(debouncedQuery), // ← مرر searchTerm
  enabled:  showDropdown && debouncedQuery.trim().length >= 2,
  staleTime: 30_000,
});

//   const filteredResults: BatchSearchResult[] = useMemo(() => {
//     if (debouncedQuery.trim().length < 2) return [];

//     return stockBatches
//       .filter((sb) => {
//         const term = debouncedQuery.toLowerCase();
//         return (
//           (sb.tradeName?.toLowerCase().includes(term) ||
//             sb.genericName?.toLowerCase().includes(term) ||
//             sb.batchNumber?.toLowerCase().includes(term)) &&
//           !excludeIds.includes(sb.drugId)
//         );
//       })
//       .slice(0, 8)
//       .map((sb) => {
//         const expiryDate = new Date(sb.expiryDate);
//         const daysLeft = Math.ceil(
//           (expiryDate.getTime() - now) / (1000 * 60 * 60 * 24),
//         );

//         return {
//           batchId: sb.stockBatchId,
//           drugId: sb.drugId,
//           drugName: `${sb.tradeName} ${sb.concentration || ""}`.trim(),
//           batchNumber: sb.batchNumber,
//           availableQuantity: sb.remainingQty,
//           unitPrice: sb.purchasePrice,
//           expiryDate: sb.expiryDate,
//           daysLeft,
//           isExpired: daysLeft < 0,
//         };
//       });
//   }, [stockBatches, debouncedQuery, excludeIds]);

const filteredResults: BatchSearchResult[] = useMemo(() => {
  if (debouncedQuery.trim().length < 2) return [];

  return stockBatches
    .filter(sb => !excludeIds.includes(sb.drugId)) // فقط استبعاد المضافة
    .slice(0, 8)
    .map(sb => {
      const daysLeft = Math.ceil(
        (new Date(sb.expiryDate).getTime() - now) / (1000 * 60 * 60 * 24)
      );
      return {
        batchId:           sb.stockBatchId,
        drugId:            sb.drugId,
        drugName:          `${sb.tradeName} ${sb.concentration || ""}`.trim(),
        batchNumber:       sb.batchNumber,
        availableQuantity: sb.remainingQty,
        unitPrice:         sb.purchasePrice,
        expiryDate:        sb.expiryDate,
        daysLeft,
        isExpired:         daysLeft < 0,
      };
    });
}, [stockBatches, excludeIds, debouncedQuery]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        inputRef.current?.contains(e.target as Node) ||
        dropdownRef.current?.contains(e.target as Node)
      ) {
        return;
      }
      setShowDropdown(false);
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const updateDropdownPosition = () => {
    if (!inputRef.current) return;
    const rect = inputRef.current.getBoundingClientRect();
    setDropdownPos({
      top: rect.bottom + 6,
      left: rect.left,
      width: rect.width,
    });
  };

  const handleSelect = (batch: BatchSearchResult) => {
    onSelect(batch);
    if (batch.availableQuantity <= 0) return;
    setQuery("");
    setShowDropdown(false);
  };

  const showEmpty =
    debouncedQuery.trim().length >= 2 && filteredResults.length === 0;
  const showResults = filteredResults.length > 0;

  return (
    <>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.trim().length >= 2) {
              updateDropdownPosition();
              setShowDropdown(true);
            } else {
              setShowDropdown(false);
            }
          }}
          onFocus={() => {
            if (query.trim().length >= 2) {
              updateDropdownPosition();
              setShowDropdown(true);
            }
          }}
          className="h-10 w-full rounded-lg border border-input bg-transparent pl-9 pr-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-[color,box-shadow]"
        />
      </div>

      {showDropdown &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: "fixed",
              top: dropdownPos.top,
              left: dropdownPos.left,
              width: dropdownPos.width,
              zIndex: 200,
            }}
            className="rounded-lg border border-border bg-background shadow-xl overflow-hidden"
          >
            {isLoading ? (
              <div className="flex items-center gap-2 px-4 py-3">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Searching...</p>
              </div>
            ) : showResults ? (
              filteredResults.map((batch) => (
                <button
                  key={batch.batchId}
                  type="button"
                  onClick={() => handleSelect(batch)}
                  className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-muted/70 transition-colors border-b border-border/50 last:border-none"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-0.5">
                    <Package className="h-4 w-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {batch.drugName}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Batch: {batch.batchNumber} • Available:{" "}
                      {batch.availableQuantity}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ${batch.unitPrice.toFixed(2)} / unit
                    </p>

                    <p
                      className={`text-xs mt-1 font-medium ${
                        batch.isExpired
                          ? "text-destructive"
                          : batch.daysLeft <= 30
                            ? "text-orange-600 dark:text-orange-500"
                            : batch.daysLeft <= 90
                              ? "text-amber-600 dark:text-amber-500"
                              : "text-muted-foreground"
                      }`}
                    >
                      Expires:{" "}
                      {new Date(batch.expiryDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                      {batch.isExpired
                        ? " (Expired)"
                        : ` (${batch.daysLeft}d left)`}
                    </p>
                  </div>
                </button>
              ))
            ) : showEmpty ? (
              <div className="px-4 py-6 text-center">
                <p className="text-sm text-muted-foreground">
                  No matching batches found for "{debouncedQuery}"
                </p>
              </div>
            ) : null}
          </div>,
          document.body,
        )}
    </>
  );
};

export default StockBatchSearchInput;
