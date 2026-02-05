import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef, useEffect, useCallback } from "react";
import { getFeedPosts } from "@/apis/post.api";
import PostCard from "@/features/posts/components/PostCard";
import { Loader2 } from "lucide-react";

const POSTS_PER_PAGE = 10;

export default function PostFeed() {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["feed-posts"],
    queryFn: ({ pageParam = 0 }) => getFeedPosts(POSTS_PER_PAGE, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      const currentOffset = allPages.length * POSTS_PER_PAGE;
      if (
        lastPage.pagination.hasMore ||
        lastPage.posts.length === POSTS_PER_PAGE
      ) {
        return currentOffset;
      }
      return undefined;
    },
    initialPageParam: 0,
  });

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "100px",
      threshold: 0,
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [handleObserver]);

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-white dark:bg-black animate-pulse"
          >
            <div className="flex items-center gap-3 p-3">
              <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700" />
              <div className="flex-1">
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-24 mb-2" />
                <div className="h-2 bg-gray-300 dark:bg-gray-700 rounded w-16" />
              </div>
            </div>
            <div className="aspect-square bg-gray-200 dark:bg-gray-800" />
            <div className="p-3 space-y-2">
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-20" />
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-2">Không thể tải bài viết</p>
        <p className="text-sm text-gray-500">
          {error instanceof Error ? error.message : "Đã có lỗi xảy ra"}
        </p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12 border border-gray-200 dark:border-gray-800 rounded-lg">
        <p className="text-xl mb-2">📭</p>
        <p className="text-gray-600 dark:text-gray-400">Chưa có bài viết nào</p>
        <p className="text-sm text-gray-500 mt-1">
          Hãy theo dõi người khác để xem bài viết của họ
        </p>
      </div>
    );
  }

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}

      {/* Load more trigger */}
      <div ref={loadMoreRef} className="py-4 flex justify-center">
        {isFetchingNextPage && (
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        )}
        {!hasNextPage && posts.length > 0 && (
          <p className="text-sm text-gray-500">Đã xem hết bài viết</p>
        )}
      </div>
    </div>
  );
}
