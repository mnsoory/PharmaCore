import React, { useState } from "react";
import { Lock, Eye, EyeOff, ShieldAlert } from "lucide-react";
import type { ChangePasswordPayload } from "@/types/user";

interface Props {
  isChanging: boolean;
  onChange: (payload: ChangePasswordPayload, onSuccess: () => void,) => void;
}

const ChangePasswordCard: React.FC<Props> = ({ isChanging, onChange }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const mismatch =
    newPassword && passwordConfirmation && newPassword !== passwordConfirmation;
  const canSubmit =
    currentPassword && newPassword && passwordConfirmation && !mismatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    const payload: ChangePasswordPayload = {
      currentPassword,
      newPassword,
      passwordConfirmation,
    };
    onChange(payload, () => {
    setCurrentPassword("");
    setNewPassword("");
    setPasswordConfirmation("");
  });
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="h-1 w-full bg-linear-to-r from-sidebar-primary/60 via-sidebar-primary to-sidebar-primary/60" />

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div>
          <p className="text-base font-semibold text-foreground">
            Change Password
          </p>
          <p className="text-sm text-muted-foreground mt-0.5">
            Update your account password
          </p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
          <ShieldAlert className="h-4 w-4" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
        {/* Current password */}
        <div className="grid gap-2">
          <label className="text-sm font-medium text-foreground">
            Current Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
            <input
              required
              type={showCurrent ? "text" : "password"}
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-transparent pl-9 pr-10 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-[color,box-shadow]"
            />
            <button
              type="button"
              onClick={() => setShowCurrent((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-muted-foreground transition-colors"
            >
              {showCurrent ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* New password */}
          <div className="grid gap-2">
            <label className="text-sm font-medium text-foreground">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
              <input
                required
                type={showNew ? "text" : "password"}
                placeholder="Minimum 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-transparent pl-9 pr-10 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-[color,box-shadow]"
              />
              <button
                type="button"
                onClick={() => setShowNew((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-muted-foreground transition-colors"
              >
                {showNew ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Confirm */}
          <div className="grid gap-2">
            <label className="text-sm font-medium text-foreground">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
              <input
                required
                type={showConfirm ? "text" : "password"}
                placeholder="Repeat new password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className={`h-10 w-full rounded-md border bg-transparent pl-9 pr-10 text-sm outline-none focus-visible:ring-[3px] transition-[color,box-shadow] ${
                  mismatch
                    ? "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/30"
                    : "border-input focus-visible:border-ring focus-visible:ring-ring/50"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-muted-foreground transition-colors"
              >
                {showConfirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {mismatch && (
              <p className="text-xs text-destructive">Passwords do not match</p>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={!canSubmit || isChanging}
            className="h-10 rounded-lg bg-sidebar-primary px-6 text-sm font-semibold text-sidebar-primary-foreground hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isChanging ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                Updating...
              </span>
            ) : (
              "Update Password"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordCard;
