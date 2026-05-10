import React, { useState } from "react";
import { X, Pill, Factory, Layers } from "lucide-react";
import type { Drug, EditDrugFormData } from "@/types/inventory";

interface Props {
  drug: Drug;
  onClose: () => void;
  onSubmit: (id: number, data: EditDrugFormData) => void;
  isSubmitting: boolean;
}

const EditDrugModal: React.FC<Props> = ({ drug, onClose, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState<EditDrugFormData>({
    tradeName:            drug.tradeName,
    genericName:          drug.genericName,
    manufacturer:         drug.manufacturer,
    form:                 drug.form,
    concentration:        drug.concentration,
    category:             drug.category,
    requiresPrescription: drug.requiresPrescription,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(drug.id, formData);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
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
                Update details for <span className="font-semibold">{drug.tradeName}</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Trade Name */}
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-foreground">Trade Name</label>
              <input
                name="tradeName"
                value={formData.tradeName}
                onChange={handleChange}
                required
                className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-all"
              />
            </div>

            {/* Generic Name */}
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-foreground">Generic Name</label>
              <input
                name="genericName"
                value={formData.genericName}
                onChange={handleChange}
                required
                className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-all"
              />
            </div>

            {/* Manufacturer */}
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Factory className="h-3.5 w-3.5 text-muted-foreground" /> Manufacturer
              </label>
              <input
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleChange}
                required
                className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-all"
              />
            </div>

            {/* Category */}
            <div className="grid gap-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-muted-foreground" /> Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-all"
              >
                <option value="Analgesic">Analgesic</option>
                <option value="Antibiotic">Antibiotic</option>
                <option value="Antiviral">Antiviral</option>
                <option value="Cardiovascular">Cardiovascular</option>
                <option value="Antihistamine">Antihistamine</option>
                <option value="Proton Pump Inhibitor">Proton Pump Inhibitor</option>
                <option value="Beta-Blocker">Beta-Blocker</option>
                <option value="Antidiabetic">Antidiabetic</option>
              </select>
            </div>

            {/* Form & Concentration */}
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <label className="text-sm font-semibold text-foreground">Form</label>
                <select
                  name="form"
                  value={formData.form}
                  onChange={handleChange}
                  className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-all"
                >
                  <option value="Tablet">Tablet</option>
                  <option value="Capsule">Capsule</option>
                  <option value="Syrup">Syrup</option>
                  <option value="Injection">Injection</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-semibold text-foreground">Conc.</label>
                <input
                  name="concentration"
                  value={formData.concentration}
                  onChange={handleChange}
                  placeholder="500mg"
                  className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-all"
                />
              </div>
            </div>

          </div>

          {/* Prescription Toggle */}
          <div className="mt-6 flex items-center justify-between rounded-lg border border-sidebar-primary/20 bg-sidebar-primary/5 p-4 transition-colors hover:bg-sidebar-primary/10">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${formData.requiresPrescription ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                <Pill className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Prescription Required</p>
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