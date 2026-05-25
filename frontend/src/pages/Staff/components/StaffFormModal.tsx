import React, { useState } from "react";
import { X, User, Mail, Phone, Lock, AtSign } from "lucide-react";
import type {
  User as UserType,
  CreateUserPayload,
  UpdateUserPayload,
  UserRole,
} from "../../../types/user";

const roles: UserRole[] = ["Assistant", "Pharmacist", "Admin", "Tester"];

interface Props {
  user?: UserType;
  isSubmitting: boolean;
  onClose: () => void;
  onCreate: (payload: CreateUserPayload) => void;
  onUpdate: (id: number, payload: UpdateUserPayload) => void;
}

const StaffFormModal: React.FC<Props> = ({
  user,
  isSubmitting,
  onClose,
  onCreate,
  onUpdate,
}) => {
  const isEdit = !!user;

  const [username, setUsername] = useState(user?.username ?? "");
  const [firstname, setFirstname] = useState(user?.firstname ?? "");
  const [lastname, setLastname] = useState(user?.lastname ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setpasswordConfirmation] = useState("");
  const [role, setRole] = useState<UserRole>(user?.role ?? "Pharmacist");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit && user) {
      onUpdate(user.userId, { firstname, lastname, email, phone });
    } else {
      onCreate({
        username,
        firstname,
        lastname,
        email,
        phone,
        password,
        passwordConfirmation,
        role,
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-125 rounded-lg border border-border bg-background shadow-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border shrink-0">
          <div>
            <h2 className="text-base font-semibold text-foreground">
              {isEdit ? "Edit Staff Member" : "Add Staff Member"}
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              {isEdit
                ? `Editing ${user!.firstname} ${user!.lastname}`
                : "Create a new staff account"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-foreground">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
                  <input
                    required
                    placeholder="Ahmed"
                    value={firstname}
                    onChange={(e) => setFirstname(e.target.value)}
                    className="h-10 w-full rounded-md border border-input bg-transparent pl-9 pr-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-[color,box-shadow]"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium text-foreground">
                  Last Name
                </label>
                <input
                  required
                  placeholder="Sayed"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-[color,box-shadow]"
                />
              </div>
            </div>

            {/* Username — إنشاء فقط */}
            {!isEdit && (
              <div className="grid gap-2">
                <label className="text-sm font-medium text-foreground">
                  Username
                </label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
                  <input
                    required
                    placeholder="ahmed.sayed"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-10 w-full rounded-md border border-input bg-transparent pl-9 pr-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-[color,box-shadow]"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
                <input
                  required
                  type="email"
                  placeholder="ahmed@pharmacy.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-transparent pl-9 pr-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-[color,box-shadow]"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="grid gap-2">
              <label className="text-sm font-medium text-foreground">
                Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
                <input
                  required
                  type="tel"
                  placeholder="+20 100 000 0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-10 w-full rounded-md border border-input bg-transparent pl-9 pr-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-[color,box-shadow]"
                />
              </div>
            </div>

            {/* Password */}
            {!isEdit && (
              <>
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-foreground">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
                    <input
                      required
                      type="password"
                      placeholder="Minimum 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-10 w-full rounded-md border border-input bg-transparent pl-9 pr-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-[color,box-shadow]"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium text-foreground">
                    Password Confirmation
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60 pointer-events-none" />
                    <input
                      required
                      type="password"
                      placeholder="Minimum 8 characters"
                      value={passwordConfirmation}
                      onChange={(e) => setpasswordConfirmation(e.target.value)}
                      className="h-10 w-full rounded-md border border-input bg-transparent pl-9 pr-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 transition-[color,box-shadow]"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Role — ChangeRoleModal */}
            {!isEdit && (
              <div className="grid gap-2">
                <label className="text-sm font-medium text-foreground">
                  Role
                </label>
                <div className="flex gap-2">
                  {roles.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`flex-1 h-9 rounded-md border text-sm font-semibold transition-all ${
                        role === r
                          ? "border-ring bg-primary text-primary-foreground"
                          : "border-input bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex gap-2 px-6 py-5 border-t border-border shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 rounded-md border border-input bg-background text-sm font-medium shadow-xs hover:bg-accent hover:text-accent-foreground transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 h-10 rounded-md bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 active:scale-[0.98] transition-all"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  {isEdit ? "Saving..." : "Creating..."}
                </span>
              ) : isEdit ? (
                "Save Changes"
              ) : (
                "Create Account"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StaffFormModal;
