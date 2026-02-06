import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Volume2,
  VolumeX,
  Music,
} from "lucide-react";
import type { Post } from "@/types/post.type";
import { usePostLike } from "@/features/posts/hooks/usePostLike";
import { useLikeStatus } from "@/features/posts/hooks/useLikeStatus";
import { getAvatarUrl, getFallbackAvatarUrl } from "@/utils/avatar";
import { useEnrichedUser } from "@/hooks/useUserCache";
import { useFollowStatus } from "@/hooks/useFollowStatus";
import { useFollowMutation } from "@/hooks/useFollow";
import { useAuthStore } from "@/store/auth.store";

interface ReelItemProps {
  post: Post;
  isActive: boolean;
  onCommentClick: () => void;
}

export default function ReelItem({
  post,
  isActive,
  onCommentClick,
}: ReelItemProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showLikeAnimation, setShowLikeAnimation] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  const enrichedUser = useEnrichedUser(post.user) || post.user;
  const currentUser = useAuthStore((state) => state.user);
  const isOwnPost = currentUser?._id === enrichedUser?._id;

  const { isFollowing: apiIsFollowing, isLoading: isLoadingFollow } =
    useFollowStatus(isOwnPost ? "" : enrichedUser?._id || "");
  const [isFollowing, setIsFollowing] = useState(false);
  const { follow, unfollow } = useFollowMutation();

  useEffect(() => {
    if (!isLoadingFollow) {
      setIsFollowing(apiIsFollowing);
    }
  }, [apiIsFollowing, isLoadingFollow]);

  const hasLikeStatus =
    post.isLiked !== undefined || post.isLikedByCurrentUser !== undefined;

  const { isLiked: apiIsLiked, isLoading: isLoadingStatus } = useLikeStatus(
    hasLikeStatus ? "" : post._id
  );
  const [isLiked, setIsLiked] = useState(
    post.isLiked ?? post.isLikedByCurrentUser ?? false
  );
  const { like, unlike } = usePostLike(post._id);

  useEffect(() => {
    if (!hasLikeStatus && !isLoadingStatus) {
      setIsLiked(apiIsLiked);
    }
  }, [hasLikeStatus, apiIsLiked, isLoadingStatus]);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive && !isPaused) {
        videoRef.current
          .play()
          .catch((err) => console.error("Play error:", err));
      } else {
        videoRef.current.pause();
      }
    }
  }, [isActive, isPaused]);

  // Handle video click to toggle pause
  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPaused) {
        videoRef.current
          .play()
          .catch((err) => console.error("Play error:", err));
        setIsPaused(false);
      } else {
        videoRef.current.pause();
        setIsPaused(true);
      }
    }
  };

  // Toggle mute
  const handleMuteToggle = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
      if (newMuted) {
        setVolume(0);
      } else {
        setVolume(1);
        videoRef.current.volume = 1;
      }
    }
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
      setIsMuted(newVolume === 0);
    }
  };

  // Handle follow
  const handleFollow = () => {
    if (isFollowing) {
      setIsFollowing(false);
      unfollow(enrichedUser?._id || "");
    } else {
      setIsFollowing(true);
      follow(enrichedUser?._id || "");
    }
  };

  const handleDoubleClick = () => {
    if (!isLiked) {
      setIsLiked(true);
      like();
    }
    setShowLikeAnimation(true);
    setTimeout(() => setShowLikeAnimation(false), 1000);
  };

  const handleLikeClick = () => {
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    if (newIsLiked) {
      like();
    } else {
      unlike();
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="relative h-screen w-full bg-black snap-start snap-always flex items-center justify-center">
      {/* Video Container - Centered with margin for action bar */}
      <div className="relative h-full flex items-center justify-center mr-16">
        <video
          ref={videoRef}
          src={post.video || undefined}
          className="h-full max-h-[calc(100vh-80px)] object-contain rounded-lg cursor-pointer"
          loop
          playsInline
          muted={isMuted}
          onClick={handleVideoClick}
          onDoubleClick={handleDoubleClick}
        />

        {/* Pause Indicator */}
        {isPaused && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-20 h-20 bg-black/50 rounded-full flex items-center justify-center">
              <div className="w-0 h-0 border-l-[30px] border-l-white border-y-[18px] border-y-transparent ml-2"></div>
            </div>
          </div>
        )}

        {/* Double-tap Like Animation */}
        {showLikeAnimation && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Heart
              className="text-white animate-ping"
              size={120}
              fill="white"
              strokeWidth={0}
            />
          </div>
        )}

        {/* Bottom Info - Inside Video */}
        <div className="absolute bottom-4 left-4 right-4 z-10">
          {/* User Info */}
          <div className="flex items-center gap-3 mb-3">
            <Link to={`/profile/${enrichedUser?._id}`}>
              <img
                src={getAvatarUrl(
                  enrichedUser?.profilePicture,
                  enrichedUser?.fullName || enrichedUser?.username || "User"
                )}
                alt={enrichedUser?.username}
                className="w-10 h-10 rounded-full border-2 border-white/20 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = getFallbackAvatarUrl(
                    enrichedUser?.fullName || enrichedUser?.username || "User"
                  );
                }}
              />
            </Link>
            <Link
              to={`/profile/${enrichedUser?._id}`}
              className="text-white font-semibold hover:underline"
            >
              {enrichedUser?.username}
            </Link>
            {!isOwnPost && (
              <button
                onClick={handleFollow}
                className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                  isFollowing
                    ? "bg-white/20 text-white hover:bg-white/30"
                    : "bg-transparent border border-white/50 text-white hover:bg-white/10"
                }`}
              >
                {isFollowing ? "Đang theo dõi" : "Theo dõi"}
              </button>
            )}

            {/* Volume Control */}
            <div
              className="ml-auto relative"
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
            >
              <button
                onClick={handleMuteToggle}
                className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="text-white" size={16} />
                ) : (
                  <Volume2 className="text-white" size={16} />
                )}
              </button>

              {/* Vertical Volume Slider */}
              {showVolumeSlider && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black/80 rounded-lg p-2 h-24">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-1 h-20 appearance-none bg-white/30 rounded-full cursor-pointer [writing-mode:vertical-lr] [direction:rtl]"
                    style={{
                      background: `linear-gradient(to top, white ${
                        volume * 100
                      }%, rgba(255,255,255,0.3) ${volume * 100}%)`,
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Caption */}
          {post.caption && (
            <p className="text-white text-sm line-clamp-2 mb-2">
              {post.caption}
            </p>
          )}

          {/* Audio Info */}
          <div className="flex items-center gap-2 text-white/80 text-xs">
            <Music size={12} />
            <span className="truncate">Âm thanh gốc</span>
            <span className="text-white/50">·</span>
            <span>{enrichedUser?.username}</span>
          </div>
        </div>
      </div>

      {/* Right Actions Bar - Outside Video, positioned to the right */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-5">
        {/* Like */}
        <button
          onClick={handleLikeClick}
          className="flex flex-col items-center gap-1"
        >
          <div className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
            <Heart
              className={`transition-all ${
                isLiked ? "text-red-500 fill-red-500" : "text-white"
              }`}
              size={26}
            />
          </div>
          <span className="text-white text-xs font-medium">
            {formatNumber(post.likes)}
          </span>
        </button>

        {/* Comment */}
        <button
          onClick={onCommentClick}
          className="flex flex-col items-center gap-1"
        >
          <div className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
            <MessageCircle className="text-white" size={26} />
          </div>
          <span className="text-white text-xs font-medium">
            {formatNumber(post.comments)}
          </span>
        </button>

        {/* Share */}
        <button className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
            <Send className="text-white" size={26} />
          </div>
        </button>

        {/* Save */}
        <button className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
            <Bookmark className="text-white" size={26} />
          </div>
        </button>

        {/* More */}
        <button className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
            <MoreHorizontal className="text-white" size={26} />
          </div>
        </button>

        {/* User Avatar Thumbnail */}
        <Link
          to={`/profile/${enrichedUser?._id}`}
          className="w-10 h-10 rounded-lg border border-white/30 overflow-hidden mx-auto"
        >
          <img
            src={getAvatarUrl(
              enrichedUser?.profilePicture,
              enrichedUser?.fullName || enrichedUser?.username || "User"
            )}
            alt={enrichedUser?.username}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = getFallbackAvatarUrl(
                enrichedUser?.fullName || enrichedUser?.username || "User"
              );
            }}
          />
        </Link>
      </div>
    </div>
  );
}
