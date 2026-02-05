import { useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/apis/axios";
import type { User } from "@/types/user.type";

const fetchUserById = async (userId: string): Promise<User | null> => {
  try {
    const res = await axiosInstance.get(`/users/${userId}`);
    return res.data?.data || res.data || null;
  } catch (error) {
    console.error(`Failed to fetch user ${userId}:`, error);
    return null;
  }
};

export const useEnrichedUser = (
  partialUser: Partial<User> | null | undefined
) => {
  const userId = partialUser?._id;
  const hasProfilePicture = !!partialUser?.profilePicture;

  const { data: fullUser } = useQuery({
    queryKey: ["user-profile", userId],
    queryFn: () => fetchUserById(userId!),
    enabled: !!userId && !hasProfilePicture,
    staleTime: 10 * 60 * 1000, // 10p cache
    gcTime: 30 * 60 * 1000, // Hold 30p cache
  });

  if (!partialUser) return null;

  if (hasProfilePicture) {
    return partialUser as User;
  }

  return {
    ...partialUser,
    profilePicture: fullUser?.profilePicture,
    fullName: fullUser?.fullName || partialUser.fullName,
  } as User;
};

export const usePrefetchUsers = () => {
  const queryClient = useQueryClient();

  const prefetchUsers = async (userIds: string[]) => {
    const uniqueIds = [...new Set(userIds)];

    await Promise.all(
      uniqueIds.map((userId) =>
        queryClient.prefetchQuery({
          queryKey: ["user-profile", userId],
          queryFn: () => fetchUserById(userId),
          staleTime: 10 * 60 * 1000,
        })
      )
    );
  };

  return { prefetchUsers };
};
