import { useMutation, useQueryClient } from "@tanstack/react-query";
import { savePost, unsavePost } from "@/apis/post.api";
import { toast } from "sonner";

export const usePostSave = (postId: string) => {
  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: () => savePost(postId),
    onSuccess: () => {
      toast.success("Đã lưu bài viết");
      queryClient.invalidateQueries({ queryKey: ["feed-posts"] });
      // Invalidate all saved-posts queries (with any userId)
      queryClient.invalidateQueries({ queryKey: ["saved-posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["post-like-status", postId] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Không thể lưu bài viết");
    },
  });

  const unsaveMutation = useMutation({
    mutationFn: () => unsavePost(postId),
    onSuccess: () => {
      toast.success("Đã bỏ lưu bài viết");
      queryClient.invalidateQueries({ queryKey: ["feed-posts"] });
      // Invalidate all saved-posts queries (with any userId)
      queryClient.invalidateQueries({ queryKey: ["saved-posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["post-like-status", postId] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Không thể bỏ lưu bài viết");
    },
  });

  return {
    save: saveMutation.mutate,
    unsave: unsaveMutation.mutate,
    isSaving: saveMutation.isPending,
    isUnsaving: unsaveMutation.isPending,
  };
};
