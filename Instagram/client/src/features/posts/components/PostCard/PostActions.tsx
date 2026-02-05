import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";

interface PostActionsProps {
  isLiked: boolean;
  isSaved?: boolean;
  onLike: () => void;
  onComment: () => void;
  onShare?: () => void;
  onSave?: () => void;
  likesCount?: number;
  onLikesClick?: () => void;
}

export default function PostActions({
  isLiked,
  isSaved = false,
  onLike,
  onComment,
  onShare,
  onSave,
  likesCount = 0,
  onLikesClick,
}: PostActionsProps) {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="flex items-center justify-between px-3 pt-3 pb-1">
      {/* Left Actions */}
      <div className="flex items-center gap-4">
        {/* Like Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onLike}
            className="transition-transform active:scale-125"
          >
            <Heart
              className={`w-6 h-6 ${
                isLiked
                  ? "fill-red-500 text-red-500"
                  : "text-white hover:text-gray-400"
              } transition-colors`}
            />
          </button>
          {likesCount > 0 && (
            <button
              onClick={onLikesClick}
              className="text-sm font-semibold hover:text-gray-400 transition-colors"
            >
              {formatNumber(likesCount)}
            </button>
          )}
        </div>

        <button
          onClick={onComment}
          className="hover:text-gray-400 transition-colors"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
        <button
          onClick={onShare}
          className="hover:text-gray-400 transition-colors"
        >
          <Send className="w-6 h-6" />
        </button>
      </div>

      {/* Right Action - Save */}
      <button
        onClick={onSave}
        className="hover:text-gray-400 transition-colors"
      >
        <Bookmark
          className={`w-6 h-6 ${
            isSaved ? "fill-white text-white" : ""
          } transition-colors`}
        />
      </button>
    </div>
  );
}
