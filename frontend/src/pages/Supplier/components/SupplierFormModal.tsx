import React, { useState } from "react";
import { X, Building2, User, Phone, Mail } from "lucide-react";
import type {
  Supplier,
  CreateSupplierPayload,
  UpdateSupplierPayload,
} from "@/types/supplier";

interface Props {
  supplier?: Supplier;
  onClose: () => void;
  isSubmitting: boolean;
  onCreate: (payload: CreateSupplierPayload) => void;
  onUpdate: (id: number, payload: UpdateSupplierPayload) => void;
}

const SupplierFormModal: React.FC<Props> = ({
  supplier,
  onClose,
  onCreate,
  onUpdate,
  isSubmitting,
}) => {
  const isEdit = !!supplier;

  const [supplierName, setsupplierName] = useState(supplier?.name ?? "");
  const [phone, setPhone] = useState(supplier?.phone ?? "");
  const [email, setEmail] = useState(supplier?.email ?? "");
  const [contactPerson, setContactPerson] = useState(
    supplier?.contactPerson ?? "",
  );
  const [isActive, setIsActive] = useState(supplier?.isActive ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit && supplier) {
      onUpdate(supplier.supplierId, {
        supplierName,
        phone,
        email,
        contactPerson,
        isActive,
      });
    } else {
      onCreate({ supplierName, phone, email, contactPerson });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-120 rounded-lg border border-border bg-background shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              {isEdit ? "Edit Supplier" : "New Supplier"}
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {isEdit
                ? `Editing ${supplier!.name}`
                : "Add a new supplier to the system"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Company */}
          <div className="grid gap-2">
            <label className="text-sm font-medium text-foreground">
              Supplier Name
            </label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
              <input
                required
                type="text"
                placeholder="e.g. MediSupply Co."
                value={supplierName}
                onChange={(e) => setsupplierName(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-transparent pl-9 pr-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-[color,box-shadow]"
              />
            </div>
          </div>

          {/* Name */}
          <div className="grid gap-2">
            <label className="text-sm font-medium text-foreground">
              Contact Person
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
              <input
                required
                type="text"
                placeholder="e.g. Ahmed Hassan"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-transparent pl-9 pr-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-[color,box-shadow]"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="grid gap-2">
            <label className="text-sm font-medium text-foreground">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
              <input
                required
                type="tel"
                placeholder="e.g. +20 100 000 0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-transparent pl-9 pr-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-[color,box-shadow]"
              />
            </div>
          </div>

          {/* Email */}
          <div className="grid gap-2">
            <label className="text-sm font-medium text-foreground">
              Email (optional)
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
              <input
                type="email"
                placeholder="e.g. name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-transparent pl-9 pr-4 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-[color,box-shadow]"
              />
            </div>
          </div>

          {/* isActive */}
          {isEdit && (
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Active Status
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Inactive suppliers won't appear in purchase orders
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsActive((p) => !p)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  isActive ? "bg-sidebar-primary" : "bg-muted-foreground/30"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    isActive ? "translate-x-0.5" : "-translate-x-5"
                  }`}
                />
              </button>
            </div>
          )}

          {/* Footer */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 rounded-md border border-input bg-background text-sm font-medium shadow-xs hover:bg-accent hover:text-accent-foreground transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-10 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  {isEdit ? "Saving..." : "Adding..."}
                </span>
              ) : isEdit ? (
                "Save Changes"
              ) : (
                "Add Supplier"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierFormModal;
