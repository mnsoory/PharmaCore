import React from "react";
import {
  ChevronUp,
  ChevronDown,
  Edit3,
  ToggleLeft,
  ToggleRight,
  KeyRound,
  ShieldHalf,
} from "lucide-react";
import TableShell from "@/components/ui/table/TableShell";
import TableRow from "@/components/ui/table/TableRow";
import TableCell from "@/components/ui/table/TableCell";
import type { User } from "../../../types/user";

const roleConfig: Record<string, string> = {
  Admin:
    "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800",
  Manager:
    "bg-blue-50   text-blue-700   border-blue-200   dark:bg-blue-950   dark:text-blue-300   dark:border-blue-800",
  Pharmacist:
    "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
};

interface Props {
  users: User[];
  sortField: keyof User | null;
  sortDir: "asc" | "desc";
  isToggling: boolean;
  onSort: (f: keyof User) => void;
  onEdit: (user: User) => void;
  onChangeRole: (user: User) => void;
  onToggleStatus: (user: User) => void;
  onResetPassword: (user: User) => void;
}

const columns: { label: string; field: keyof User | null; align?: "end" }[] = [
  { label: "Staff Member", field: "firstname" },
  { label: "Username", field: "username" },
  { label: "Email", field: "email" },
  { label: "Phone", field: "phone" },
  { label: "Role", field: "role" },
  { label: "Status", field: "isActive" },
  { label: "Actions", field: null, align: "end" },
];

const StaffTable: React.FC<Props> = ({
  users,
  sortField,
  sortDir,
  isToggling,
  onSort,
  onEdit,
  onChangeRole,
  onToggleStatus,
  onResetPassword,
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
      {users.map((user) => (
        <TableRow key={user.userId}>
          {/* Staff Member */}
          <TableCell>
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sidebar-primary/10 text-sm font-bold text-sidebar-primary">
                {user.firstname[0]}
                {user.lastname[0]}
              </div>
              <div>
                <p className="text-base font-semibold text-foreground">
                  {user.firstname} {user.lastname}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  ID #{user.userId}
                </p>
              </div>
            </div>
          </TableCell>

          {/* Username */}
          <TableCell>
            <span className="rounded-md border border-border bg-muted/50 px-2.5 py-1 text-sm font-mono font-medium text-foreground">
              @{user.username}
            </span>
          </TableCell>

          {/* Email */}
          <TableCell>
            <span className="text-sm text-muted-foreground">{user.email}</span>
          </TableCell>

          {/* Phone */}
          <TableCell>
            <span className="text-sm text-muted-foreground">{user.phone}</span>
          </TableCell>

          {/* Role */}
          <TableCell>
            <span
              className={`inline-flex items-center rounded-md border px-2.5 py-1 text-sm font-semibold ${roleConfig[user.role] ?? "bg-muted text-muted-foreground border-border"}`}
            >
              {user.role}
            </span>
          </TableCell>

          {/* Status */}
          <TableCell>
            <span
              className={`inline-flex items-center rounded-md border px-2.5 py-1 text-sm font-semibold ${
                user.isActive
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800"
                  : "bg-red-50     text-red-700     border-red-200     dark:bg-red-950     dark:text-red-300     dark:border-red-800"
              }`}
            >
              {user.isActive ? "Active" : "Inactive"}
            </span>
          </TableCell>

          {/* Actions */}
          <TableCell align="end">
            <div className="flex justify-end gap-1">
              {/* Edit */}
              <div className="relative group/tip">
                <button
                  onClick={() => onEdit(user)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-sidebar-primary/10 hover:text-sidebar-primary"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <div className="pointer-events-none absolute bottom-full right-0 mb-1.5 z-50 opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150">
                  <div className="whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[11px] font-medium text-background shadow-md">
                    Edit Info
                  </div>
                </div>
              </div>

              {/* Change Role */}
              <div className="relative group/tip">
                <button
                  onClick={() => onChangeRole(user)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-purple-50 hover:text-purple-600 dark:hover:bg-purple-950"
                >
                  <ShieldHalf className="h-4 w-4" />
                </button>
                <div className="pointer-events-none absolute bottom-full right-0 mb-1.5 z-50 opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150">
                  <div className="whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[11px] font-medium text-background shadow-md">
                    Change Role
                  </div>
                </div>
              </div>

              {/* Reset Password */}
              <div className="relative group/tip">
                <button
                  onClick={() => onResetPassword(user)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-amber-50 hover:text-amber-600 dark:hover:bg-amber-950"
                >
                  <KeyRound className="h-4 w-4" />
                </button>
                <div className="pointer-events-none absolute bottom-full right-0 mb-1.5 z-50 opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150">
                  <div className="whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[11px] font-medium text-background shadow-md">
                    Reset Password
                  </div>
                </div>
              </div>

              {/* Toggle Status */}
              <div className="relative group/tip">
                <button
                  disabled={isToggling}
                  onClick={() => onToggleStatus(user)}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                    user.isActive
                      ? "text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      : "text-muted-foreground hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950"
                  }`}
                >
                  {user.isActive ? (
                    <ToggleRight className="h-5 w-5" />
                  ) : (
                    <ToggleLeft className="h-5 w-5" />
                  )}
                </button>
                <div className="pointer-events-none absolute bottom-full right-0 mb-1.5 z-50 opacity-0 group-hover/tip:opacity-100 transition-opacity duration-150">
                  <div className="whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-[11px] font-medium text-background shadow-md">
                    {user.isActive ? "Deactivate" : "Activate"}
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

export default StaffTable;
