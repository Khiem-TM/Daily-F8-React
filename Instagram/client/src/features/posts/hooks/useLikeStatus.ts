import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getPostById } from "@/apis/post.api";

/**
 * Hook to get like status for a single post
 * Fetches post details which includes isLiked/isSaved
 */
export const useLikeStatus = (postId: string) => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["post-like-status", postId],
    queryFn: async () => {
      const post = await getPostById(postId);
      return {
        // API returns isLiked/isSaved (or isLikedByCurrentUser for compatibility)
        isLiked: post.isLiked ?? post.isLikedByCurrentUser ?? false,
        isSaved: post.isSaved ?? post.isSavedByCurrentUser ?? false,
        likes: post.likes ?? 0,
      };
    },
    staleTime: 30 * 1000, // 30 seconds
    enabled: !!postId,
  });

  const updateLikeStatus = (isLiked: boolean, likesCount?: number) => {
    queryClient.setQueryData(["post-like-status", postId], (old: any) => ({
      ...old,
      isLiked,
      likes: likesCount ?? old?.likes ?? 0,
    }));
  };

  const updateSaveStatus = (isSaved: boolean) => {
    queryClient.setQueryData(["post-like-status", postId], (old: any) => ({
      ...old,
      isSaved,
    }));
  };

  return {
    isLiked: data?.isLiked ?? false,
    isSaved: data?.isSaved ?? false,
    likes: data?.likes ?? 0,
    isLoading,
    updateLikeStatus,
    updateSaveStatus,
  };
};

/**
 * Hook to get like status for multiple posts (batch)
 * Useful for lists like feed, explore, etc.
 */
export const useLikeStatusBatch = (postIds: string[]) => {
  const queryClient = useQueryClient();

  const queries = postIds.map((postId) => ({
    queryKey: ["post-like-status", postId],
    queryFn: async () => {
      const post = await getPostById(postId);
      return {
        postId,
        isLiked: post.isLikedByCurrentUser ?? false,
        isSaved: post.isSavedByCurrentUser ?? false,
        likes: post.likes ?? 0,
      };
    },
    staleTime: 30 * 1000,
    enabled: !!postId,
  }));

  // Build status map
  const statusMap: Record<
    string,
    { isLiked: boolean; isSaved: boolean; likes: number }
  > = {};

  postIds.forEach((postId) => {
    const cached = queryClient.getQueryData<{
      isLiked: boolean;
      isSaved: boolean;
      likes: number;
    }>(["post-like-status", postId]);

    if (cached) {
      statusMap[postId] = cached;
    }
  });

  return {
    statusMap,
    queries,
  };
};
