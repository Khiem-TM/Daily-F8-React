import { useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserById } from "@/apis/user.api";
import { useAuthStore } from "@/store/auth.store";

export const useFollowStatusBatch = (userIds: string[]) => {
  const { user: currentUser } = useAuthStore();

  const validUserIds = userIds.filter((id) => id && id !== currentUser?._id);

  const queries = useQueries({
    queries: validUserIds.map((userId) => ({
      queryKey: ["user-follow-status", userId],
      queryFn: async () => {
        const user = await getUserById(userId);
        return {
          userId,
          isFollowing: user?.isFollowing ?? false,
        };
      },
      staleTime: 30 * 1000, // 30s
      enabled: !!userId,
    })),
  });

  // Build a map of userId -> isFollowing
  const followStatusMap: Record<string, boolean> = {};

  queries.forEach((query, index) => {
    const userId = validUserIds[index];
    if (query.data) {
      followStatusMap[userId] = query.data.isFollowing;
    }
  });

  const isLoading = queries.some((q) => q.isLoading);
  const isError = queries.some((q) => q.isError);

  return {
    followStatusMap,
    isLoading,
    isError,
    queries,
  };
};

export const useFollowStatus = (userId: string | undefined) => {
  const { user: currentUser } = useAuthStore();
  const queryClient = useQueryClient();

  const isOwnProfile = userId === currentUser?._id;
  const enabled = !!userId && !isOwnProfile;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user-follow-status", userId],
    queryFn: async () => {
      if (!userId) return false;
      const user = await getUserById(userId);
      return user?.isFollowing ?? false;
    },
    staleTime: 30 * 1000,
    enabled,
  });

  const updateFollowStatus = (newStatus: boolean) => {
    if (userId) {
      queryClient.setQueryData(["user-follow-status", userId], newStatus);
    }
  };

  return {
    isFollowing: data ?? false,
    isLoading: enabled ? isLoading : false,
    isError: enabled ? isError : false,
    updateFollowStatus,
  };
};
