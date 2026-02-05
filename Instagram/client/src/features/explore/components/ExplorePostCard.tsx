import { useState } from "react";
import { Play, Layers } from "lucide-react";
import type { Post } from "@/types/post.type";
import PostDetailModal from "@/features/profile/components/PostDetailModal";

interface ExplorePostCardProps {
  post: Post;
  isLarge?: boolean;
}

export default function ExplorePostCard({
  post,
  isLarge = false,
}: ExplorePostCardProps) {
  const [showModal, setShowModal] = useState(false);
  const isVideo = post.mediaType === "video" || !!post.video;

  return (
    <>
      <button
        className={`relative w-full bg-black overflow-hidden group cursor-pointer ${
          isLarge ? "row-span-2" : ""
        }`}
        style={{ aspectRatio: isLarge ? "1/2" : "1/1" }}
        onClick={() => setShowModal(true)}
      >
        {/* Media */}
        {isVideo ? (
          <video
            src={post.video || undefined}
            className="w-full h-full object-cover"
            muted
            loop
          />
        ) : (
          <img
            src={post.image || "/placeholder.jpg"}
            alt={post.caption || "Post"}
            className="w-full h-full object-cover"
          />
        )}

        {/* Media Type Icon - Top Right */}
        {isVideo ? (
          <div className="absolute top-2 right-2 z-10">
            <Play
              size={20}
              className="text-white drop-shadow-lg"
              fill="white"
            />
          </div>
        ) : (
          post.image && (
            <div className="absolute top-2 right-2 z-10">
              <Layers size={20} className="text-white drop-shadow-lg" />
            </div>
          )
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
          <div className="flex items-center gap-2 text-white font-semibold">
            <svg
              className="w-7 h-7 fill-white"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span>{post.likes}</span>
          </div>
          <div className="flex items-center gap-2 text-white font-semibold">
            <svg
              className="w-7 h-7 fill-white"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M21 6h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1zm-4 6V3c0-.55-.45-1-1-1H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1z" />
            </svg>
            <span>{post.comments}</span>
          </div>
        </div>
      </button>

      {/* Post Detail Modal */}
      {showModal && (
        <PostDetailModal
          postId={post._id}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
