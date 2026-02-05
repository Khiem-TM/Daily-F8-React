import { Link } from "react-router-dom";
import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import type { User } from "@/types/user.type";
import { getAvatarUrl, getFallbackAvatarUrl } from "@/utils/avatar";
import { useEnrichedUser } from "@/hooks/useUserCache";
import PostOptionsModal from "./PostOptionsModal";

interface PostHeaderProps {
  author: User;
  createdAt: string;
  postId: string;
  isOwnPost?: boolean;
  onDelete?: () => void;
  onEdit?: () => void;
}

export default function PostHeader({
  author,
  createdAt,
  postId,
  isOwnPost = false,
  onDelete,
  onEdit,
}: PostHeaderProps) {
  const [showOptionsModal, setShowOptionsModal] = useState(false);

  // Enrich user data with profilePicture if missing
  const enrichedAuthor = useEnrichedUser(author) || author;

  const timeAgo = (date: string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInSeconds = Math.floor(
      (now.getTime() - postDate.getTime()) / 1000
    );

    if (diffInSeconds < 60) return `${diffInSeconds} giây`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} phút`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} giờ`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} ngày`;
    return `${Math.floor(diffInSeconds / 604800)} tuần`;
  };

  return (
    <div className="flex items-center justify-between p-3">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <Link to={`/profile/${enrichedAuthor._id}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 p-[2px]">
            <div className="w-full h-full rounded-full bg-black p-[2px]">
              <img
                src={getAvatarUrl(
                  enrichedAuthor.profilePicture,
                  enrichedAuthor.fullName || enrichedAuthor.username
                )}
                alt={enrichedAuthor.username}
                className="w-full h-full rounded-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = getFallbackAvatarUrl(
                    enrichedAuthor.fullName || enrichedAuthor.username
                  );
                }}
              />
            </div>
          </div>
        </Link>

        {/* Username & Time - Horizontal */}
        <div className="flex items-center gap-2">
          <Link
            to={`/profile/${enrichedAuthor._id}`}
            className="text-sm font-semibold hover:text-gray-300 transition-colors"
          >
            {enrichedAuthor.username}
          </Link>
          <span className="text-gray-500">•</span>
          <span className="text-sm text-gray-500">{timeAgo(createdAt)}</span>
        </div>
      </div>

      {/* More Options */}
      <button
        onClick={() => setShowOptionsModal(true)}
        className="text-gray-400 hover:text-white transition-colors p-2"
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>

      {/* Options Modal */}
      {showOptionsModal && (
        <PostOptionsModal
          postId={postId}
          isOwnPost={isOwnPost}
          onClose={() => setShowOptionsModal(false)}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      )}
    </div>
  );
}
