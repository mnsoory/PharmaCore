import React, { useState } from "react";
import { X, Pill, Factory, Layers, Settings2 } from "lucide-react";
import type { Drug, EditDrugFormData } from "@/types/inventory";

interface Props {
  drug: Drug;
  onClose: () => void;
  onSubmit: (id: number, data: EditDrugFormData) => void;
  isSubmitting: boolean;
  isSettingsOnly: boolean;
  onToggleSettingsOnly: (value: boolean) => void;
}

const EditDrugModal: React.FC<Props> = ({
  drug,
  onClose,
  onSubmit,
  isSubmitting,
  isSettingsOnly,
  onToggleSettingsOnly,
}) => {
  const [formData, setFormData] = useState<EditDrugFormData>({
    tradeName: drug.tradeName,
    genericName: drug.genericName,
    manufacturer: drug.manufacturer,
    form: drug.form,
    concentration: drug.concentration,
    category: drug.category,
    requiresPrescription: drug.requiresPrescription,
    minimumStock: drug.minimumStock,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(drug.id, formData);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl rounded-lg border border-border bg-background shadow-lg overflow-hidden transition-all animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border bg-card/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Pill className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground tracking-tight">
                Edit Medication
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Update details for{" "}
                <span className="font-semibold">{drug.tradeName}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Stock Settings Toggle Section */}
          <div className="mb-6 flex items-center justify-between rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4 transition-all">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${isSettingsOnly ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                <Settings2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  Update Stock Settings Only
                </p>
                <p className="text-xs text-muted-foreground">
                  Focus only on stock thresholds and alerts
                </p>
              </div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={isSettingsOnly}
                onChange={(e) => onToggleSettingsOnly(e.target.checked)}
                className="sr-only peer disabled:cursor-not-allowed disabled:bg-muted/50"
              />
              <div className="w-11 h-6 bg-blue-200/60 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Trade Name */}
            <div
              className={`grid gap-2 transition-all duration-300 ${isSettingsOnly ? "opacity-50" : "opacity-100"}`}
            >
              <label className="text-sm font-semibold text-foreground">
                Trade Name
              </label>
              <input
                name="tradeName"
                disabled={isSettingsOnly}
                value={formData.tradeName}
                onChange={handleChange}
                required
                className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-all disabled:cursor-not-allowed disabled:bg-muted/70"
              />
            </div>

            {/* Generic Name */}
            <div
              className={`grid gap-2 transition-all duration-300 ${isSettingsOnly ? "opacity-50" : "opacity-100"}`}
            >
              <label className="text-sm font-semibold text-foreground">
                Generic Name
              </label>
              <input
                name="genericName"
                disabled={isSettingsOnly}
                value={formData.genericName}
                onChange={handleChange}
                required
                className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-all disabled:cursor-not-allowed disabled:bg-muted/70"
              />
            </div>

            {/* Manufacturer */}
            <div
              className={`grid gap-2 transition-all duration-300 ${isSettingsOnly ? "opacity-50" : "opacity-100"}`}
            >
              <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Factory className="h-3.5 w-3.5 text-muted-foreground" />{" "}
                Manufacturer
              </label>
              <input
                name="manufacturer"
                disabled={isSettingsOnly}
                value={formData.manufacturer}
                onChange={handleChange}
                required
                className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-all disabled:cursor-not-allowed disabled:bg-muted/70"
              />
            </div>

            {/* Category */}
            <div
              className={`grid gap-2 transition-all duration-300 ${isSettingsOnly ? "opacity-50" : "opacity-100"}`}
            >
              <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-muted-foreground" />{" "}
                Category
              </label>
              <select
                name="category"
                disabled={isSettingsOnly}
                value={formData.category}
                onChange={handleChange}
                className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-all disabled:cursor-not-allowed disabled:bg-muted/70"
              >
                <option value="Analgesic">Analgesic</option>
                <option value="Antibiotic">Antibiotic</option>
                <option value="Antiviral">Antiviral</option>
                <option value="Cardiovascular">Cardiovascular</option>
                <option value="Antihistamine">Antihistamine</option>
                <option value="Proton Pump Inhibitor">
                  Proton Pump Inhibitor
                </option>
                <option value="Beta-Blocker">Beta-Blocker</option>
                <option value="Antidiabetic">Antidiabetic</option>
              </select>
            </div>

            {/* Form & Concentration */}
            <div
              className={`grid grid-cols-2 gap-3 transition-all duration-300 ${isSettingsOnly ? "opacity-50" : "opacity-100"}`}
            >
              <div className="grid gap-2">
                <label className="text-sm font-semibold text-foreground">
                  Form
                </label>
                <select
                  name="form"
                  disabled={isSettingsOnly}
                  value={formData.form}
                  onChange={handleChange}
                  className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-all disabled:cursor-not-allowed disabled:bg-muted/70"
                >
                  <option value="Tablet">Tablet</option>
                  <option value="Capsule">Capsule</option>
                  <option value="Syrup">Syrup</option>
                  <option value="Injection">Injection</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-semibold text-foreground">
                  Conc.
                </label>
                <input
                  name="concentration"
                  disabled={isSettingsOnly}
                  value={formData.concentration}
                  onChange={handleChange}
                  placeholder="500mg"
                  className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-all disabled:cursor-not-allowed disabled:bg-muted/70"
                />
              </div>
            </div>

            {/* Minimum Stock */}
           <div className={`grid gap-2 md:col-span-2 pt-4 mt-2 transition-all duration-300 ${isSettingsOnly ? "border-t-2 border-primary/30" : "border-t border-border/40"}`}>
  <div className="flex items-center gap-2">
    <label
      className={`text-sm font-bold transition-colors ${isSettingsOnly ? "text-primary" : "text-foreground"}`}
    >
      Minimum Stock Alert
    </label>
    {isSettingsOnly && (
      <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium animate-pulse">
        Active Section
      </span>
    )}
  </div>

  <input
    type="number"
    name="minimumStock"
    value={formData.minimumStock}
    onChange={handleChange}
    min={0}
    placeholder={String(drug.minimumStock)}
    className={`h-10 w-full rounded-md border px-3 text-sm shadow-sm outline-none focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/20 transition-all
      ${
        isSettingsOnly
          ? "border-primary/40 bg-card shadow-inner"
          : "border-input bg-transparent focus-visible:border-ring focus-visible:ring-ring/50"
      }`}
  />
  
  <div className="flex items-center justify-between">
    <p className="text-xs text-muted-foreground">
      Current value:{" "}
      <span className="font-medium text-foreground">
        {drug.minimumStock}
      </span>
    </p>
    {isSettingsOnly && (
      <p className="text-[12px] text-primary/80 italic">
        Only this value will be updated
      </p>
    )}
  </div>
</div>
          </div>

          <div className="mt-6 flex items-center justify-between rounded-lg border border-sidebar-primary/20 bg-sidebar-primary/5 p-4 transition-all hover:bg-sidebar-primary/10 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-full ${formData.requiresPrescription ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                <Pill className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  Prescription Required
                </p>
                <p className="text-xs text-muted-foreground">
                  Is this medication restricted to doctors' orders?
                </p>
              </div>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                name="requiresPrescription"
                checked={formData.requiresPrescription}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-blue-200/60 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-md border border-input bg-background text-sm font-medium shadow-xs hover:bg-accent hover:text-accent-foreground transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-11 rounded-md bg-primary text-primary-foreground text-sm font-bold shadow-md hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Saving...
                </span>
              ) : isSettingsOnly ? (
                "Update Stock Only"
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDrugModal;
