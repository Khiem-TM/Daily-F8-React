import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPostComments,
  createComment,
  likeComment,
  unlikeComment,
  getCommentReplies,
} from "@/apis/post.api";
import { toast } from "sonner";

/**
 * Hook to fetch comments for a post
 */
export const usePostComments = (postId: string, limit = 20, offset = 0) => {
  return useQuery({
    queryKey: ["post-comments", postId, limit, offset],
    queryFn: () => getPostComments(postId, limit, offset),
    enabled: !!postId,
  });
};

/**
 * Hook to create a new comment
 */
export const useCreateComment = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) => createComment(postId, { content }),
    onSuccess: () => {
      // Invalidate comments query to refresh
      queryClient.invalidateQueries({ queryKey: ["post-comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Không thể gửi bình luận");
    },
  });
};

/**
 * Hook to create a reply to a comment
 */
export const useCreateReply = (postId: string, parentCommentId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) =>
      createComment(postId, { content, parentCommentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-comments", postId] });
      queryClient.invalidateQueries({
        queryKey: ["comment-replies", postId, parentCommentId],
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Không thể gửi trả lời");
    },
  });
};

/**
 * Hook to like/unlike a comment
 */
export const useCommentLike = (
  postId: string,
  commentId: string,
  isLiked: boolean
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      isLiked
        ? unlikeComment(postId, commentId)
        : likeComment(postId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-comments", postId] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Đã có lỗi xảy ra");
    },
  });
};

/**
 * Hook to fetch replies for a comment
 */
export const useCommentReplies = (
  postId: string,
  commentId: string,
  enabled = false
) => {
  return useQuery({
    queryKey: ["comment-replies", postId, commentId],
    queryFn: () => getCommentReplies(postId, commentId),
    enabled: enabled && !!postId && !!commentId,
  });
};
