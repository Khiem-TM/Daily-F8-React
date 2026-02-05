import { useState, useRef, useEffect } from "react";
import { Camera, ChevronUp, ChevronDown } from "lucide-react";
import { useReelsPosts } from "../hooks/useReelsPosts";
import ReelItem from "../components/ReelItem";
import CommentsModal from "../components/CommentsModal";
import LikesModal from "../components/LikesModal";

export default function ReelsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isLikesOpen, setIsLikesOpen] = useState(false);
  const isScrolling = useRef(false);
  const touchStartY = useRef(0);

  const { data: reels, isLoading, error } = useReelsPosts();

  const goToNext = () => {
    if (isScrolling.current || !reels?.length) return;
    if (currentIndex < reels.length - 1) {
      isScrolling.current = true;
      setCurrentIndex((prev) => prev + 1);
      setTimeout(() => {
        isScrolling.current = false;
      }, 800);
    }
  };

  const goToPrev = () => {
    if (isScrolling.current || !reels?.length) return;
    if (currentIndex > 0) {
      isScrolling.current = true;
      setCurrentIndex((prev) => prev - 1);
      setTimeout(() => {
        isScrolling.current = false;
      }, 800);
    }
  };

  const handleWheel = (e: WheelEvent) => {
    if (isScrolling.current || !reels?.length) return;

    e.preventDefault();

    if (Math.abs(e.deltaY) > 30) {
      if (e.deltaY > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
  };

  const handleTouchStart = (e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (isScrolling.current || !reels?.length) return;

    const touchEndY = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "j") {
        goToNext();
      } else if (e.key === "ArrowUp" || e.key === "k") {
        goToPrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, reels?.length]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentIndex, reels?.length]);

  useEffect(() => {
    if (containerRef.current && reels?.length) {
      const container = containerRef.current;
      const reelHeight = container.clientHeight;
      const targetScroll = currentIndex * reelHeight;
      container.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
    }
  }, [currentIndex, reels?.length]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-4">
        <p className="text-white text-lg mb-4">Không thể tải Reels</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (!reels?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-4">
        <Camera size={64} className="text-gray-500 mb-4" />
        <p className="text-white text-lg mb-2">Chưa có Reels nào</p>
        <p className="text-gray-400 text-sm text-center">
          Các video từ người bạn theo dõi sẽ hiển thị ở đây
        </p>
      </div>
    );
  }

  const currentReel = reels[currentIndex];

  return (
    <div className="flex items-center justify-center h-screen bg-black overflow-hidden">
      {/* Main Reels Container */}
      <div
        ref={containerRef}
        className="relative h-screen max-w-[500px] w-full overflow-hidden"
        style={{ scrollSnapType: "y mandatory" }}
      >
        <div className="relative">
          {reels.map((reel, index) => (
            <ReelItem
              key={reel._id}
              post={reel}
              isActive={index === currentIndex}
              onCommentClick={() => setIsCommentsOpen(true)}
            />
          ))}
        </div>
      </div>

      {/* Navigation Buttons - Right Side */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-10">
        {/* Up Button */}
        <button
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className={`w-12 h-12 rounded-full border border-white/30 flex items-center justify-center transition-all hover:bg-white/10 ${
            currentIndex === 0
              ? "opacity-30 cursor-not-allowed"
              : "opacity-100 hover:border-white/60"
          }`}
        >
          <ChevronUp className="text-white" size={24} />
        </button>

        {/* Down Button */}
        <button
          onClick={goToNext}
          disabled={currentIndex === reels.length - 1}
          className={`w-12 h-12 rounded-full border border-white/30 flex items-center justify-center transition-all hover:bg-white/10 ${
            currentIndex === reels.length - 1
              ? "opacity-30 cursor-not-allowed"
              : "opacity-100 hover:border-white/60"
          }`}
        >
          <ChevronDown className="text-white" size={24} />
        </button>
      </div>

      {/* Comments Modal - Right Side */}
      {currentReel && (
        <>
          <CommentsModal
            post={currentReel}
            isOpen={isCommentsOpen}
            onClose={() => setIsCommentsOpen(false)}
          />
          <LikesModal
            post={currentReel}
            isOpen={isLikesOpen}
            onClose={() => setIsLikesOpen(false)}
          />
        </>
      )}
    </div>
  );
}
