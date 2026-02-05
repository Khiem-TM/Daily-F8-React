import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { useExplorePosts } from "../hooks/useExplorePosts";
import ExplorePostCard from "../components/ExplorePostCard";
import Footer from "@/components/Footer";

export default function ExplorePage() {
  const observerTarget = useRef<HTMLDivElement>(null);
  const [hasScrolled, setHasScrolled] = useState(false);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useExplorePosts(20);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setHasScrolled(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allPosts = data?.pages.flatMap((page) => page.posts) || [];

  const isLargePost = (index: number) => {
    const positionInChunk = index % 10;

    return positionInChunk === 5 || positionInChunk === 6;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-white" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-4">
        <p className="text-white text-lg mb-4">Không thể tải bài viết</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (allPosts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-4">
        <p className="text-white text-lg">Chưa có bài viết nào</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Layout 25-50-25: left 25% (sidebar already takes space), center 50%, right 25% */}
      <div className="max-w-[975px] mx-auto px-5">
        {/* Masonry Grid */}
        <div className="grid grid-cols-3 gap-1 auto-rows-fr">
          {allPosts.map((post, index) => (
            <ExplorePostCard
              key={post._id}
              post={post}
              isLarge={isLargePost(index)}
            />
          ))}
        </div>

        {/* Loading More Indicator */}
        {isFetchingNextPage && (
          <div className="flex flex-col items-center justify-center py-8 gap-2">
            <Loader2 className="animate-spin text-white" size={32} />
            <p className="text-gray-400 text-sm">Đang tải...</p>
          </div>
        )}

        {/* End of Content Message */}
        {!hasNextPage &&
          hasScrolled &&
          !isFetchingNextPage &&
          allPosts.length > 0 && (
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-gray-400 text-sm">Bạn đã xem hết tin</p>
            </div>
          )}

        {/* Intersection Observer Target */}
        <div ref={observerTarget} className="h-20" />

        {/* Footer - Only show when scrolled and no more posts */}
        {!hasNextPage && hasScrolled && (
          <div className="mt-8">
            <Footer />
          </div>
        )}
      </div>
    </div>
  );
}
