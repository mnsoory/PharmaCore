import React from "react";
import {
  ChevronUp,
  ChevronDown,
  Edit3,
  ToggleLeft,
  ToggleRight,
  Building2,
} from "lucide-react";
import TableShell from "@/components/ui/table/TableShell";
import TableRow from "@/components/ui/table/TableRow";
import TableCell from "@/components/ui/table/TableCell";
import type { Supplier } from "../../../types/supplier";

interface Props {
  suppliers: Supplier[];
  sortField: keyof Supplier | null;
  sortDir: "asc" | "desc";
  isToggling: boolean;
  onSort: (f: keyof Supplier) => void;
  onEdit: (supplier: Supplier) => void;
  onToggleStatus: (supplier: Supplier) => void;
}

const columns: {
  label: string;
  field: keyof Supplier | null;
  align?: "end";
}[] = [
  { label: "Supplier", field: "name" },
  { label: "Contact Person", field: "contactPerson" },
  { label: "Phone", field: "phone" },
  { label: "Email", field: "email" },
  { label: "Status", field: "isActive" },
  { label: "Actions", field: null, align: "end" },
];

const SupplierTable: React.FC<Props> = ({
  suppliers,
  sortField,
  sortDir,
  onSort,
  onEdit,
  onToggleStatus,
  isToggling
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
      {suppliers.map((supplier) => (
        <TableRow key={supplier.supplierId}>
          {/* Supplier */}
          <TableCell>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sidebar-primary/10 text-sidebar-primary">
                <Building2 className="h-4 w-4" />
              </div>
              <div>
                <p className="text-base font-semibold text-foreground">
                  {supplier.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  ID #{supplier.supplierId}
                </p>
              </div>
            </div>
          </TableCell>

          {/* Contact Name */}
          <TableCell>
            <span className="text-base text-muted-foreground font-medium">
              {supplier.contactPerson}
            </span>
          </TableCell>

          {/* Phone */}
          <TableCell>
            <span className="text-base text-muted-foreground font-medium">
              {supplier.phone}
            </span>
          </TableCell>

          {/* Phone */}
          <TableCell>
            <span className="text-base text-muted-foreground font-medium">
              {supplier.email?? "__"}
            </span>
          </TableCell>

          {/* Status */}
          <TableCell>
            <span
              className={`inline-flex items-center rounded-md border px-2.5 py-1 text-sm font-semibold ${
                supplier.isActive
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800"
                  : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800"
              }`}
            >
              {supplier.isActive ? "Active" : "Inactive"}
            </span>
          </TableCell>

          {/* Actions */}
          <TableCell align="end">
            <div className="flex justify-end gap-1">
              {/* Edit */}
              <div className="relative group/tip">
                <button
                  onClick={() => onEdit(supplier)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-sidebar-primary/10 hover:text-sidebar-primary"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <div className="pointer-events-none absolute bottom-full right-0 mb-1.5 z-50 opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150">
                  <div className="whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[11px] font-medium text-background shadow-md">
                    Edit Supplier
                  </div>
                </div>
              </div>

              {/* Toggle status */}
              <div className="relative group/tip">
                <button
                disabled={isToggling}
                  onClick={() => onToggleStatus(supplier)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                    supplier.isActive
                      ? "text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      : "text-muted-foreground hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950"
                  }`}
                >
                  {supplier.isActive ? (
                    <ToggleRight className="h-4 w-4" />
                  ) : (
                    <ToggleLeft className="h-4 w-4" />
                  )}
                </button>
                <div className="pointer-events-none absolute bottom-full right-0 mb-1.5 z-50 opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150">
                  <div className="whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[11px] font-medium text-background shadow-md">
                    {supplier.isActive ? "Deactivate" : "Activate"}
                  </div>
                </div>
              </div>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </tbody>
  </TableShell>
);

export default SupplierTable;
