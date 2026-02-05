import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAvatarUrl, getFallbackAvatarUrl } from "@/utils/avatar";
import { Link } from "react-router-dom";

interface LikesModalProps {
  postId: string;
  onClose: () => void;
}

interface LikedUser {
  _id: string;
  username: string;
  fullName: string;
  profilePicture?: string;
}

export default function LikesModal({ postId, onClose }: LikesModalProps) {
  // TODO: Replace with actual API call to fetch users who liked the post
  const { data: likedUsers = [], isLoading } = useQuery<LikedUser[]>({
    queryKey: ["post-likes", postId],
    queryFn: async () => {
      // Placeholder - replace with actual API call
      // const response = await getPostLikes(postId);
      // return response.data;
      return [];
    },
  });

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#262626] rounded-2xl w-full max-w-md max-h-[400px] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-base font-semibold">Lượt thích</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : likedUsers.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-gray-500">
              Chưa có lượt thích nào
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {likedUsers.map((user) => (
                <Link
                  key={user._id}
                  to={`/profile/${user._id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 p-4 hover:bg-white/5 transition-colors"
                >
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-full overflow-hidden shrink-0">
                    <img
                      src={getAvatarUrl(
                        user.profilePicture,
                        user.fullName || user.username
                      )}
                      alt={user.username}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = getFallbackAvatarUrl(
                          user.fullName || user.username
                        );
                      }}
                    />
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {user.username}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {user.fullName}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
