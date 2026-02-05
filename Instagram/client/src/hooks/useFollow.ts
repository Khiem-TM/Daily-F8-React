import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
} from "@/apis/follow.api";
import { toast } from "sonner";

export const useFollowMutation = () => {
  const queryClient = useQueryClient();

  const followMutation = useMutation({
    mutationFn: followUser,
    onSuccess: (_data, userId) => {
      queryClient.setQueryData(["user-follow-status", userId], true);

      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      queryClient.invalidateQueries({ queryKey: ["user-profile", userId] });
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      queryClient.invalidateQueries({ queryKey: ["followers", userId] });
      queryClient.invalidateQueries({ queryKey: ["followers"] });
      queryClient.invalidateQueries({ queryKey: ["following"] });
      queryClient.invalidateQueries({ queryKey: ["suggested-users"] });
      toast.success("Đã theo dõi");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Không thể theo dõi");
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: unfollowUser,
    onSuccess: (_data, userId) => {
      queryClient.setQueryData(["user-follow-status", userId], false);

      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      queryClient.invalidateQueries({ queryKey: ["user-profile", userId] });
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
      queryClient.invalidateQueries({ queryKey: ["followers", userId] });
      queryClient.invalidateQueries({ queryKey: ["followers"] });
      queryClient.invalidateQueries({ queryKey: ["following"] });
      queryClient.invalidateQueries({ queryKey: ["suggested-users"] });
      toast.success("Đã bỏ theo dõi");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Không thể bỏ theo dõi");
    },
  });

  return {
    follow: followMutation.mutate,
    unfollow: unfollowMutation.mutate,
    followAsync: followMutation.mutateAsync,
    unfollowAsync: unfollowMutation.mutateAsync,
    isFollowPending: followMutation.isPending,
    isUnfollowPending: unfollowMutation.isPending,
    isPending: followMutation.isPending || unfollowMutation.isPending,
  };
};

export const useFollowers = (
  userId: string,
  page: number = 1,
  limit: number = 20
) => {
  return useQuery({
    queryKey: ["followers", userId, page, limit],
    queryFn: () => getFollowers(userId, page, limit),
    enabled: !!userId,
  });
};

export const useFollowing = (
  userId: string,
  page: number = 1,
  limit: number = 20
) => {
  return useQuery({
    queryKey: ["following", userId, page, limit],
    queryFn: () => getFollowing(userId, page, limit),
    enabled: !!userId,
  });
};
