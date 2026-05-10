import React from "react";
import { ChevronUp, ChevronDown, Pill, Edit3, FileText } from "lucide-react";
import TableShell from "@/components/ui/table/TableShell";
import TableRow from "@/components/ui/table/TableRow";
import TableCell from "@/components/ui/table/TableCell";
import type { Drug } from "../../../types/inventory";



const categoryColors: Record<string, string> = {
  Analgesic:
    "bg-blue-50   text-blue-600   border-blue-100   dark:bg-blue-950   dark:text-blue-300",
  Antibiotic:
    "bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-950 dark:text-purple-300",
  Cardiology:
    "bg-rose-50   text-rose-600   border-rose-100   dark:bg-rose-950   dark:text-rose-300",

  "Proton Pump Inhibitor":
    "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950 dark:text-emerald-300",
  "Beta-Blocker":
    "bg-orange-50  text-orange-600  border-orange-100  dark:bg-orange-950  dark:text-orange-300",
  "Antidiabetic":
    "bg-cyan-50    text-cyan-600    border-cyan-100    dark:bg-cyan-950    dark:text-cyan-300",
  "Antihistamine":
    "bg-indigo-50  text-indigo-600  border-indigo-100  dark:bg-indigo-950  dark:text-indigo-300",
};

const statusConfig: Record<Drug["status"], string> = {
  Safe: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
  "Low Stock":
    "bg-amber-100   text-amber-700   border-amber-200   dark:bg-amber-950   dark:text-amber-300   dark:border-amber-800",
  "Out of Stock":
    "bg-red-50     text-red-700     border-red-200     dark:bg-red-950     dark:text-red-300     dark:border-red-800",
};

const columns: { label: string; field: keyof Drug | null; align?: "end" }[] = [
  { label: "Drug", field: "tradeName" },
  { label: "Category", field: "category" },
  { label: "Stock", field: "totalAvailableStock" },
  { label: "Minimum Stock", field: "minimumStock" },
  { label: "Price", field: "averagePurchasePrice" },
  { label: "Status", field: "status" },
  { label: "Actions", field: null, align: "end" },
];

interface Props {
  drugs: Drug[];
  sortField: keyof Drug | null;
  sortDir: "asc" | "desc";
  onSort: (field: keyof Drug) => void;
  onEdit: (drug: Drug) => void;
  onViewDetails: (drug: Drug) => void;
}

const InventoryTable: React.FC<Props> = ({
  drugs,
  sortField,
  sortDir,
  onSort,
  onEdit,
  onViewDetails
}) => (
  <TableShell>
    <thead>
      <tr className="border-b border-border">
        {columns.map((col) => (
          <th
            key={col.label}
            onClick={() => col.field && onSort(col.field)}
            className={`pb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 select-none ${
              col.align === "end" ? "text-end" : "text-start"
            } ${col.field ? "cursor-pointer hover:text-foreground transition-colors" : ""}`}
          >
            <span className="inline-flex items-center gap-1">
              {col.label}
              {col.field && (
                <span className="inline-flex flex-col opacity-40">
                  <ChevronUp
                    className={`h-2.5 w-2.5 ${sortField === col.field && sortDir === "asc" ? "opacity-100 text-sidebar-primary" : ""}`}
                  />
                  <ChevronDown
                    className={`h-2.5 w-2.5 ${sortField === col.field && sortDir === "desc" ? "opacity-100 text-sidebar-primary" : ""}`}
                  />
                </span>
              )}
            </span>
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {drugs.map((drug) => {
        const catColor =
          categoryColors[drug.category] ??
          "bg-muted text-muted-foreground border-border";
        const stockPct = Math.min(
          100,
          Math.round(
            (drug.totalAvailableStock / (drug.minimumStock * 5)) * 100,
          ),
        );

        return (
          <TableRow key={drug.id}>
            {/* Drug */}
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary/10 text-sidebar-primary">
                  <Pill className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-base font-semibold text-foreground leading-tight">
                    {drug.tradeName}
                  </p>
                  <p className="text-sm text-muted-foreground italic mt-0.5">
                    {drug.genericName} · {drug.concentration}
                  </p>
                </div>
              </div>
            </TableCell>

            {/* Category */}
            <TableCell>
              <span
                className={`inline-flex items-center rounded-md border px-2.5 py-1 text-sm font-semibold ${catColor}`}
              >
                {drug.category === "Proton Pump Inhibitor" ? "PPI": drug.category}
              </span>
            </TableCell>

            {/* Stock */}
            <TableCell>
              <div className="flex flex-col gap-1.5">
                <span className="text-base font-bold text-foreground">
                  {drug.totalAvailableStock.toLocaleString()}
                </span>
                <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      drug.status === "Safe"
                        ? "bg-success"
                        : drug.status === "Low Stock"
                          ? "bg-warning"
                          : "bg-destructive"
                    }`}
                    style={{ width: `${stockPct}%` }}
                  />
                </div>
              </div>
            </TableCell>

            {/* Reorder */}
            <TableCell>
              <span className="text-base text-muted-foreground">
                {drug.minimumStock}
              </span>
            </TableCell>

            {/* Price */}
            <TableCell>
              <span className="text-base font-semibold text-foreground">
                ${drug.averagePurchasePrice.toFixed(2)}
              </span>
            </TableCell>

            {/* Status */}
            <TableCell>
              <span
                className={`inline-flex items-center rounded-md border px-2.5 py-1 text-sm font-semibold ${statusConfig[drug.status]}`}
              >
                {drug.status}
              </span>
            </TableCell>

            {/* Actions */}
            <TableCell align="end">
              <div className="flex justify-end gap-1">
                <div className="relative group/tip">
                  <button 
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-sidebar-primary/10 hover:text-sidebar-primary"
                  onClick={() => onEdit(drug)}
                  >
                    <Edit3 
                    className="h-4 w-4" 
                    />
                  </button>
                  <div className="pointer-events-none absolute bottom-full right-0 mb-1.5 z-50 opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150">
                    <div className="whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[11px] font-medium text-background shadow-md">
                      Edit Drug
                    </div>
                  </div>
                </div>

                <div className="relative group/tip">
                  <button 
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  onClick={() => onViewDetails(drug)}
                  >
                    <FileText className="h-4 w-4" />
                  </button>
                  <div className="pointer-events-none absolute bottom-full right-0 mb-1.5 z-50 opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150">
                    <div className="whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[11px] font-medium text-background shadow-md">
                      View Details
                    </div>
                  </div>
                </div>
              </div>
            </TableCell>
          </TableRow>
        );
      })}
    </tbody>
  </TableShell>
);

export default InventoryTable;
