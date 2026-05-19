import React, { useState } from "react";
import ProfileHeader from "./components/ProfileHeader";
import PersonalInfoCard from "./components/PersonalInfoCard";
import ChangePasswordCard from "./components/ChangePasswordCard";
import AccountInfoCard from "./components/AccountInfoCard";
import type { ChangePasswordPayload, UpdateUserPayload } from "@/types/user";
import { userService } from "@/services/userService";
import { toast } from "sonner";
import { handleApiError } from "@/utils/errorHandler";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { profileKeys } from "@/api/keys";
import { profileService } from "@/services/profileService";
import LoadingScreen from "@/components/ui/LoadingScreen";
import ErrorScreen from "@/components/ui/ErrorScreen";
import { useAuthStore } from "@/store/useAuthStore";

const ProfilePage: React.FC = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const queryClient = useQueryClient();

  const { updateUser } = useAuthStore();

  const {
    data: profile,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: profileKeys.detail(),
    queryFn: profileService.getProfile,
  });

  const handleUpdate = async (
    id: number,
    payload: UpdateUserPayload,
    onSuccess: () => void,
  ) => {
    setIsUpdating(true);
    try {
      const updatePayload = {
        ...payload,
        phone: payload.phone?.trim() === "" ? null : payload.phone,
      };
      await userService.update(id, updatePayload);
      toast.success(`Profile updated successfully`);
      onSuccess();
      queryClient.invalidateQueries({ queryKey: profileKeys.all });

      updateUser({
        fullName: `${payload.firstname} ${payload.lastname}`,
        email: payload.email,
      });
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (
    payload: ChangePasswordPayload,
    onSuccess: () => void,
  ) => {
    setIsChanging(true);
    try {
      await userService.changePassword(payload);
      toast.success(`Password updated successfully`);
      onSuccess();
    } catch (err) {
      handleApiError(err);
    } finally {
      setIsChanging(false);
    }
  };

  if (isLoading) return <LoadingScreen />;

  if (isError || !profile)
    return <ErrorScreen onRetry={() => refetch()} resetLoading={isFetching} />;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">My Profile</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your personal information and account settings
        </p>
      </div>

      <ProfileHeader profile={profile} />

      <div className="grid grid-cols-1 gap-6">
        <PersonalInfoCard
          profile={{ ...profile, id: profile.userId }}
          onSave={handleUpdate}
          isSaving={isUpdating}
        />
        <ChangePasswordCard
          onChange={handleChangePassword}
          isChanging={isChanging}
        />
      </div>

      <AccountInfoCard profile={{ ...profile, id: profile.userId }} />
    </div>
  );
};

export default ProfilePage;
