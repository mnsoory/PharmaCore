import React, { useRef, useState, useEffect } from "react";
import { Search, Building2, Loader2 } from "lucide-react";
import { createPortal } from "react-dom";
import useDebounce from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { supplierService } from "@/services/supplierService";
import { supplierKeys } from "@/api/keys";

interface SupplierResult {
  supplierId: number;
  name: string;
  contactPerson: string;
}

interface Props {
  placeholder?: string;
  onSelect: (supplier: SupplierResult) => void;
}

const SupplierSearchInput: React.FC<Props> = ({
  placeholder = "Search by company name or contact person...",
  onSelect,
}) => {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });

  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: suppliers = [], isLoading } = useQuery({
    queryKey: supplierKeys.lists(),
    queryFn: () => supplierService.getAll(),
    enabled: showDropdown,
  });

  const filteredResults =
    debouncedQuery.trim().length >= 2
      ? suppliers
          .filter(
            (s) =>
              s.isActive &&
              (s.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
                s.contactPerson
                  .toLowerCase()
                  .includes(debouncedQuery.toLowerCase())),
          )
          .slice(0, 8)
          .map((s) => ({
            supplierId: s.supplierId,
            name: s.name,
            contactPerson: s.contactPerson,
          }))
      : [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      )
        setShowDropdown(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const updatePos = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }
  };

  const handleChange = (q: string) => {
    setQuery(q);
    if (q.trim().length >= 2) {
      updatePos();
      setShowDropdown(true);
    } else setShowDropdown(false);
  };

  const handleSelect = (supplier: SupplierResult) => {
    onSelect(supplier);
    setQuery(`${supplier.name} — ${supplier.contactPerson}`);
    setShowDropdown(false);
  };

  const showEmpty =
    !isLoading &&
    debouncedQuery.trim().length >= 2 &&
    filteredResults.length === 0;
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
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => {
            if (query.trim().length >= 2) {
              updatePos();
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
            className="rounded-lg border border-border bg-background shadow-lg overflow-hidden"
          >
            {isLoading && (
              <div className="flex items-center gap-2 px-4 py-3">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Searching...</p>
              </div>
            )}
            {showResults &&
              filteredResults.map((s) => (
                <button
                  key={s.supplierId}
                  type="button"
                  onClick={() => handleSelect(s)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-muted/50 transition-colors border-b border-border/50 last:border-0"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary/10 text-sidebar-primary">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {s.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {s.contactPerson}
                    </p>
                  </div>
                </button>
              ))}
            {showEmpty && (
              <div className="px-4 py-3">
                <p className="text-sm text-muted-foreground">
                  No suppliers found for "{debouncedQuery}"
                </p>
              </div>
            )}
          </div>,
          document.body,
        )}
    </>
  );
};

export default SupplierSearchInput;
