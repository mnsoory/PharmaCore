import React, { useState } from "react";
import { X, ShieldHalf } from "lucide-react";
import type { User, UserRole, UpdateRolePayload } from "../../../types/user";

const roles: UserRole[] = ["Assistant", "Pharmacist", "Admin", "Tester"];

const roleDescriptions: Record<UserRole, string> = {
  Pharmacist: "Can process sales, view inventory, and manage stock",
  // Manager: "All pharmacist permissions plus reports and supplier management",
  Admin: "Full system access including user management",
  Assistant: "Can view inventory and assist with sales processing",
  Tester: "Demo account for testing the core sales flow and exploring system features",
};

interface Props {
  user: User;
  isChanging: boolean;
  onClose: () => void;
  onSubmit: (id: number, payload: UpdateRolePayload) => void;
}

const ChangeRoleModal: React.FC<Props> = ({
  user,
  isChanging,
  onClose,
  onSubmit,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(user.role);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === user.role) {
      onClose();
      return;
    }
    onSubmit(user.userId, { newRole: selectedRole });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-110 rounded-lg border border-border bg-background shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
              <ShieldHalf className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Change Role
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {user.firstname} {user.lastname}
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

        <form onSubmit={handleSubmit} className="p-6 space-y-3">
          {roles.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setSelectedRole(r)}
              className={`w-full flex items-start gap-3 rounded-lg border px-4 py-3 text-left transition-all ${
                selectedRole === r
                  ? "border-ring bg-primary/5"
                  : "border-border bg-background hover:bg-muted/50"
              }`}
            >
              <div
                className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
                  selectedRole === r
                    ? "border-primary"
                    : "border-muted-foreground/40"
                }`}
              >
                {selectedRole === r && (
                  <div className="h-2 w-2 rounded-full bg-primary" />
                )}
              </div>
              <div>
                <p
                  className={`text-sm font-semibold ${selectedRole === r ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {r}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {roleDescriptions[r]}
                </p>
              </div>
            </button>
          ))}

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
              disabled={selectedRole === user.role}
              className="flex-1 h-10 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isChanging ? (
                <span className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-destructive-foreground border-t-transparent" />
                  Changing...
                </span>
              ) : (
                "Confirm Change"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangeRoleModal;
