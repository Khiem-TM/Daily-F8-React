import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPostComments, createComment } from "@/apis/post.api";
import type { CreateCommentData } from "@/types/comment.type";

export const usePostComments = (postId: string) => {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getPostComments(postId),
    enabled: !!postId,
  });
};

export const useCreateComment = (postId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommentData) => createComment(postId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["reels"] });
      queryClient.invalidateQueries({ queryKey: ["feed"] });
    },
  });
};
