import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCurrentUserProfile,
  updateUserProfile,
  deleteProfilePicture,
} from "@/apis/user.api";
import { useAuthStore } from "@/store/auth.store";
import type { User } from "@/types/user.type";

export const useCurrentUserProfile = () => {
  return useQuery({
    queryKey: ["current-user-profile"],
    queryFn: getCurrentUserProfile,
    staleTime: 5 * 60 * 1000, // 5p
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (updatedUser: User) => {
      // Update React Query cache
      queryClient.setQueryData(["current-user-profile"], updatedUser);

      // Update auth store with new user data
      const { user, accessToken, refreshToken, setAuth } =
        useAuthStore.getState();
      if (user && accessToken && refreshToken) {
        setAuth({
          user: {
            ...user,
            ...updatedUser,
          },
          accessToken,
          refreshToken,
        });
      }
    },
  });
};

export const useDeleteProfilePicture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProfilePicture,
    onSuccess: () => {
      // Refetch profile
      queryClient.invalidateQueries({ queryKey: ["current-user-profile"] });

      // Update auth store - remove profile picture
      const { user, accessToken, refreshToken, setAuth } =
        useAuthStore.getState();
      if (user && accessToken && refreshToken) {
        setAuth({
          user: {
            ...user,
            profilePicture: null,
          },
          accessToken,
          refreshToken,
        });
      }
    },
  });
};
