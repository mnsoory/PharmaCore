import { useState, useMemo } from "react";
import TableCard from "@/components/ui/table/TableCard";
import StaffStatCards from "./components/StaffStatCards";
import StaffToolbar from "./components/StaffToolbar";
import StaffTable from "./components/StaffTable";
import StaffFormModal from "./components/StaffFormModal";
import ChangeRoleModal from "./components/ChangeRoleModal";
import ResetPasswordModal from "./components/ResetPasswordModal";
import type {
  User,
  CreateUserPayload,
  UpdateUserPayload,
  UpdateRolePayload,
  ResetPasswordPayload,
  StaffFilter,
} from "../../types/user";
import { userKeys } from "@/api/keys";
import { userService } from "@/services/userService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingScreen from "@/components/ui/LoadingScreen";
import ErrorScreen from "@/components/ui/ErrorScreen";
import { handleApiError } from "@/utils/errorHandler";
import { toast } from "sonner";

const StaffPage = () => {
  const {
    data: users,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: userKeys.lists(),
    queryFn: userService.getAll,
  });

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<StaffFilter>("all");
  const [sortField, setSortField] = useState<keyof User | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const [editUser, setEditUser] = useState<User | undefined>(undefined);
  const [roleUser, setRoleUser] = useState<User | null>(null);
  const [passwordUser, setPasswordUser] = useState<User | null>(null);
  const [showForm, setShowForm] = useState(false);

  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const isSubmitting = isCreating || isUpdating;

  const handleSort = (field: keyof User) => {
    if (sortField === field) setSortDir((p) => (p === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const handleCreate = async (payload: CreateUserPayload) => {
    setIsCreating(true);
    try {
      const createPayload = {
        ...payload,
        phone: payload.phone?.trim() === "" ? null : payload.phone,
      };
      const user = await userService.create(createPayload);
      toast.success(`User #${user.userId} created successfully`);
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdate = async (id: number, payload: UpdateUserPayload) => {
    setIsUpdating(true);
    try {
      const updatePayload = {
        ...payload,
        phone: payload.phone?.trim() === "" ? null : payload.phone,
      };
      await userService.update(id, updatePayload);
      toast.success(`User #${id} updated successfully`);
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangeRole = async (id: number, payload: UpdateRolePayload) => {
    setIsChanging(true);
    try {
      await userService.updateRole(id, payload);
      toast.success(`Role for user #${id} updated successfully`);
      setRoleUser(null);
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsChanging(false);
    }
  };

  const handleToggleStatus = async (user: User) => {
    setIsToggling(true);
    try {
      await userService.toggleStatus(user.userId);
      toast.success(
        `User #${user.userId} ${user.isActive ? "deactivated" : "activated"} successfully`,
      );
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsToggling(false);
    }
  };

  const handleResetPassword = async (
    id: number,
    payload: ResetPasswordPayload,
  ) => {
    setIsResetting(true);
    try {
      await userService.resetPassword(id, payload);
      toast.success(`Password for user #${id} is resetted successfully`);
      setPasswordUser(null);
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsResetting(false);
    }
  };

  const openCreate = () => {
    setEditUser(undefined);
    setShowForm(true);
  };
  const openEdit = (user: User) => {
    setEditUser(user);
    setShowForm(true);
  };

  const filtered = useMemo(() => {
    if (!users) return [];
    let result = users.filter((u) => {
      const fullName = `${u.firstname} ${u.lastname}`.toLowerCase();
      const matchSearch =
        fullName.includes(search.toLowerCase()) ||
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());

      const matchFilter =
        activeFilter === "all"
          ? true
          : activeFilter === "active"
            ? u.isActive
            : !u.isActive;

      return matchSearch && matchFilter;
    });

    if (sortField) {
      result = [...result].sort((a, b) => {
        const av = a[sortField] ?? "",
          bv = b[sortField] ?? "";
        if (av === bv) return 0;
        return (av < bv ? -1 : 1) * (sortDir === "asc" ? 1 : -1);
      });
    }

    return result;
  }, [users, search, activeFilter, sortField, sortDir]);

  const stats = useMemo(() => {
    if (!users) {
      return {
        total: 0,
        active: 0,
        inactive: 0,
        admins: 0,
      };
    }

    return {
      total: users.length,
      active: users.filter((u) => u.isActive).length,
      inactive: users.filter((u) => !u.isActive).length,
      admins: users.filter((u) => u.role === "Admin").length,
    };
  }, [users]);

  if (isLoading) return <LoadingScreen />;

  if (isError || !users)
    return <ErrorScreen onRetry={() => refetch()} resetLoading={isFetching} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">
            Staff Management
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage pharmacy staff accounts and permissions
          </p>
        </div>
      </div>

      <StaffStatCards {...stats} />

      <TableCard
        title="Staff Members"
        description="All registered staff accounts"
      >
        <StaffToolbar
          search={search}
          onSearch={setSearch}
          activeFilter={activeFilter}
          onFilter={setActiveFilter}
          onAdd={openCreate}
        />
        <StaffTable
          users={filtered}
          sortField={sortField}
          sortDir={sortDir}
          onSort={handleSort}
          onEdit={openEdit}
          onChangeRole={setRoleUser}
          onToggleStatus={handleToggleStatus}
          onResetPassword={setPasswordUser}
          isToggling={isToggling}
        />
      </TableCard>

      {showForm && (
        <StaffFormModal
          user={editUser}
          onClose={() => setShowForm(false)}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
          isSubmitting={isSubmitting}
        />
      )}

      {roleUser && (
        <ChangeRoleModal
          user={roleUser}
          onClose={() => setRoleUser(null)}
          onSubmit={handleChangeRole}
          isChanging={isChanging}
        />
      )}

      {passwordUser && (
        <ResetPasswordModal
          user={passwordUser}
          onClose={() => setPasswordUser(null)}
          onSubmit={handleResetPassword}
          isResetting={isResetting}
        />
      )}
    </div>
  );
};

export default StaffPage;
