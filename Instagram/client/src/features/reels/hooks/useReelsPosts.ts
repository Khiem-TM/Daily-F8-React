import { useQuery } from "@tanstack/react-query";
import { getFeedPosts } from "@/apis/post.api";
import type { Post } from "@/types/post.type";

export const useReelsPosts = () => {
  return useQuery<Post[]>({
    queryKey: ["reels"],
    queryFn: async () => {
      const response = await getFeedPosts(100, 0);
      return response.posts.filter(
        (post: Post) => post.mediaType === "video" && post.video
      );
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
