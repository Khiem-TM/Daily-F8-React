import { useInfiniteQuery } from "@tanstack/react-query";
import { getExplorePosts } from "@/apis/explore.api";

export const useExplorePosts = (limit: number = 20) => {
  return useInfiniteQuery({
    queryKey: ["explore-posts", limit],
    queryFn: ({ pageParam = 1 }) => getExplorePosts(pageParam, limit),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.hasMore) {
        return lastPage.pagination.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000, // 5p
  });
};
