import { useQuery } from "@tanstack/react-query";
import { getSavedPosts, getUserPosts } from "@/apis/post.api";
import { Camera, Heart, MessageCircle, Bookmark, Film } from "lucide-react";
import { useState } from "react";
import PostDetailModal from "./PostDetailModal";
import { getMediaUrl } from "@/utils/media";
import { useAuthStore } from "@/store/auth.store";

interface ProfilePostsProps {
  userId: string;
  saved?: boolean;
  videosOnly?: boolean;
}

export default function ProfilePosts({
  userId,
  saved = false,
  videosOnly = false,
}: ProfilePostsProps) {
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const { user: currentUser } = useAuthStore();

  // Query for user posts
  const userPostsQuery = useQuery({
    queryKey: ["user-posts", userId],
    queryFn: () => getUserPosts(userId),
    enabled: !saved,
  });

  // Query for saved posts - uses currentUser's ID to get posts they saved
  // Note: Saved posts tab is only visible on own profile, so we use currentUser._id
  const savedPostsQuery = useQuery({
    queryKey: ["saved-posts", currentUser?._id],
    queryFn: () => getSavedPosts(currentUser!._id),
    enabled: saved && !!currentUser?._id,
  });

  const isLoading = saved
    ? savedPostsQuery.isLoading
    : userPostsQuery.isLoading;

  // Get raw posts
  let rawPosts = saved ? savedPostsQuery.data || [] : userPostsQuery.data || [];

  // Filter videos if videosOnly is true
  const posts = videosOnly
    ? rawPosts.filter((post) => post.mediaType === "video" || post.video)
    : rawPosts;

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-1">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="aspect-square bg-gray-800 animate-pulse" />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 rounded-full border-2 border-white flex items-center justify-center mb-6">
          {saved ? (
            <Bookmark size={32} className="text-white" strokeWidth={1} />
          ) : videosOnly ? (
            <Film size={32} className="text-white" strokeWidth={1} />
          ) : (
            <Camera size={32} className="text-white" strokeWidth={1} />
          )}
        </div>
        <p className="text-white text-3xl font-light">
          {saved
            ? "Chưa có bài viết đã lưu"
            : videosOnly
            ? "Chưa có video"
            : "Chia sẻ ảnh"}
        </p>
        {!saved && !videosOnly && (
          <p className="text-white text-sm mt-2">
            Khi bạn chia sẻ ảnh, ảnh sẽ xuất hiện trên trang cá nhân của bạn.
          </p>
        )}
        {saved && (
          <p className="text-gray-500 text-sm mt-2">
            Lưu ảnh và video mà bạn muốn xem lại. Chỉ có bạn mới có thể xem nội
            dung mình đã lưu.
          </p>
        )}
        {videosOnly && (
          <p className="text-gray-500 text-sm mt-2">
            Khi bạn đăng video, video sẽ xuất hiện tại đây.
          </p>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-1">
        {posts.map((post) => {
          // Determine media source - check media array first, then fallback to image/video fields
          const firstMedia = post.media?.[0];
          const hasMultipleMedia = post.media && post.media.length > 1;

          // Check if video - from media array or direct video field
          const isVideo =
            firstMedia?.type === "video" ||
            post.mediaType === "video" ||
            !!post.video;

          // Get media URL - prioritize media array, then image/video fields
          let mediaUrl: string;
          if (firstMedia?.url) {
            mediaUrl = getMediaUrl(firstMedia.url);
          } else if (post.image) {
            mediaUrl = getMediaUrl(post.image);
          } else if (post.video) {
            mediaUrl = getMediaUrl(post.video);
          } else {
            mediaUrl = "https://placehold.co/400x400/1a1a1a/666?text=No+Image";
          }

          return (
            <button
              key={post._id}
              onClick={() => setSelectedPostId(post._id)}
              className="relative aspect-square group overflow-hidden bg-black"
            >
              {/* Media */}
              {isVideo ? (
                <video
                  src={mediaUrl}
                  className="w-full h-full object-cover"
                  muted
                />
              ) : (
                <img
                  src={mediaUrl}
                  alt="Post"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    // Prevent infinite loop by checking if already set to placeholder
                    if (!target.dataset.error) {
                      target.dataset.error = "true";
                      target.src =
                        "https://placehold.co/400x400/1a1a1a/666?text=No+Image";
                    }
                  }}
                />
              )}

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6">
                <div className="flex items-center gap-2 text-white font-semibold">
                  <Heart size={24} fill="white" />
                  <span>{post.likesCount || post.likes || 0}</span>
                </div>
                <div className="flex items-center gap-2 text-white font-semibold">
                  <MessageCircle size={24} fill="white" />
                  <span>{post.commentsCount || post.comments || 0}</span>
                </div>
              </div>

              {/* Multiple media indicator */}
              {hasMultipleMedia && (
                <div className="absolute top-2 right-2">
                  <svg
                    className="w-5 h-5 text-white drop-shadow-lg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <rect x="6" y="6" width="12" height="12" rx="1" />
                    <rect
                      x="8"
                      y="4"
                      width="12"
                      height="12"
                      rx="1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              )}

              {/* Video indicator */}
              {isVideo && (
                <div className="absolute top-2 right-2">
                  <svg
                    className="w-5 h-5 text-white drop-shadow-lg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Post Detail Modal */}
      {selectedPostId && (
        <PostDetailModal
          postId={selectedPostId}
          onClose={() => setSelectedPostId(null)}
        />
      )}
    </>
  );
}
