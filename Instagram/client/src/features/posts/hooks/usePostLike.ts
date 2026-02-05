import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likePost, unlikePost } from "@/apis/post.api";
import { toast } from "sonner";

export const usePostLike = (postId: string) => {
  const queryClient = useQueryClient();

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: ["feed-posts"] });
    queryClient.invalidateQueries({ queryKey: ["reels"] });
    queryClient.invalidateQueries({ queryKey: ["explore-posts"] });
    queryClient.invalidateQueries({ queryKey: ["post", postId] });
    queryClient.invalidateQueries({ queryKey: ["post-like-status", postId] });
  };

  const likeMutation = useMutation({
    mutationFn: () => likePost(postId),
    onSuccess: () => {
      // Update like status cache immediately
      queryClient.setQueryData(["post-like-status", postId], (old: any) => ({
        ...old,
        isLiked: true,
        likes: (old?.likes ?? 0) + 1,
      }));
      invalidateQueries();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Đã có lỗi xảy ra");
    },
  });

  const unlikeMutation = useMutation({
    mutationFn: () => unlikePost(postId),
    onSuccess: () => {
      // Update like status cache immediately
      queryClient.setQueryData(["post-like-status", postId], (old: any) => ({
        ...old,
        isLiked: false,
        likes: Math.max((old?.likes ?? 1) - 1, 0),
      }));
      invalidateQueries();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Đã có lỗi xảy ra");
    },
  });

  return {
    like: likeMutation.mutate,
    unlike: unlikeMutation.mutate,
    isLiking: likeMutation.isPending,
    isUnliking: unlikeMutation.isPending,
    isPending: likeMutation.isPending || unlikeMutation.isPending,
  };
};
