import React, { useState } from "react";
import { Edit3, Check, X, User, Mail, Phone } from "lucide-react";
import type { UpdateUserPayload } from "@/types/user";

interface Profile {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string | null;
}

interface Props {
  profile: Profile;
  isSaving: boolean;
  onSave: (
    id: number,
    payload: UpdateUserPayload,
    onSuccess: () => void,
  ) => void;
}

const PersonalInfoCard: React.FC<Props> = ({ profile, isSaving, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [firstname, setFirstname] = useState(profile.firstname);
  const [lastname, setLastname] = useState(profile.lastname);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);

  const handleSave = async () => {
    onSave(
      profile.id,
      {
        firstname,
        lastname,
        email,
        phone,
      },
      () => setIsEditing(false),
    );
  };

  const handleCancel = () => {
    setFirstname(profile.firstname);
    setLastname(profile.lastname);
    setEmail(profile.email);
    setPhone(profile.phone);
    setIsEditing(false);
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="h-1 w-full bg-linear-to-r from-sidebar-primary/60 via-sidebar-primary to-sidebar-primary/60" />

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div>
          <p className="text-base font-semibold text-foreground">
            Personal Information
          </p>
          <p className="text-sm text-muted-foreground mt-0.5">
            Update your personal details
          </p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 h-9 rounded-lg border border-border bg-muted/40 px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Edit3 className="h-3.5 w-3.5" />
            Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-1.5 h-9 rounded-lg border border-border bg-background px-3 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Cancel
            </button>
            <button
              disabled={isSaving}
              onClick={handleSave}
              className="flex items-center gap-1.5 h-9 rounded-lg bg-sidebar-primary px-3 text-sm font-semibold text-sidebar-primary-foreground hover:opacity-90 transition-opacity"
            >
              {isSaving ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Saving...
                </span>
              ) : (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Save
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Fields */}
      <div className="px-6 py-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* First Name */}
        <div className="grid gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" /> First Name
          </label>
          {isEditing ? (
            <input
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              className="h-10 rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-[color,box-shadow]"
            />
          ) : (
            <p className="text-base font-medium text-foreground">{firstname}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="grid gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <User className="h-3.5 w-3.5" /> Last Name
          </label>
          {isEditing ? (
            <input
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              className="h-10 rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-[color,box-shadow]"
            />
          ) : (
            <p className="text-base font-medium text-foreground">{lastname}</p>
          )}
        </div>

        {/* Email */}
        <div className="grid gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" /> Email
          </label>
          {isEditing ? (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-[color,box-shadow]"
            />
          ) : (
            <p className="text-base font-medium text-foreground">{email}</p>
          )}
        </div>

        {/* Phone */}
        <div className="grid gap-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5" /> Phone
          </label>
          {isEditing ? (
            <input
              type="tel"
              value={phone ?? ""}
              onChange={(e) => setPhone(e.target.value)}
              className="h-10 rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-[color,box-shadow]"
            />
          ) : (
            <p className="text-base font-medium text-foreground">{phone}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoCard;
