import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";
import { getSuggestedUsers } from "@/apis/user.api";
import { getAvatarUrl, getFallbackAvatarUrl } from "@/utils/avatar";
import { useFollowMutation } from "@/hooks/useFollow";
import { useState } from "react";

export default function SuggestedUsers() {
  const user = useAuthStore((state) => state.user);
  const { follow, isPending } = useFollowMutation();
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());

  const { data: suggestedUsers = [], isLoading } = useQuery({
    queryKey: ["suggested-users"],
    queryFn: () => getSuggestedUsers(5),
    staleTime: 5 * 60 * 1000, // 5p
  });

  const handleFollow = (userId: string) => {
    setFollowedUsers((prev) => new Set(prev).add(userId));
    follow(userId, {
      onError: () => {
        setFollowedUsers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(userId);
          return newSet;
        });
      },
    });
  };

  const isFollowed = (userId: string) => followedUsers.has(userId);

  return (
    <div className="hidden lg:block w-80 pt-8">
      {/* Current User */}
      <div className="flex items-center gap-3 mb-6">
        <Link to="/profile">
          <img
            src={getAvatarUrl(
              user?.profilePicture,
              user?.fullName || user?.username || "User"
            )}
            alt={user?.username || "User"}
            className="w-14 h-14 rounded-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = getFallbackAvatarUrl(
                user?.fullName || user?.username || "User"
              );
            }}
          />
        </Link>
        <div className="flex-1">
          <Link
            to="/profile"
            className="text-sm font-semibold hover:text-gray-400 transition-colors"
          >
            {user?.username}
          </Link>
          <p className="text-xs text-gray-500">{user?.fullName}</p>
        </div>
        <button className="text-xs text-blue-500 font-semibold hover:text-blue-400">
          Chuyển
        </button>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-gray-400">Gợi ý cho bạn</p>
          <button className="text-xs text-white font-semibold hover:text-gray-400">
            Xem tất cả
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-gray-700" />
                <div className="flex-1">
                  <div className="h-3 bg-gray-700 rounded w-20 mb-2" />
                  <div className="h-2 bg-gray-700 rounded w-16" />
                </div>
                <div className="h-6 w-16 bg-gray-700 rounded" />
              </div>
            ))}
          </div>
        ) : suggestedUsers.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            Không có gợi ý nào
          </p>
        ) : (
          <div className="space-y-3">
            {suggestedUsers.map((suggestedUser) => {
              const avatarUrl = getAvatarUrl(
                suggestedUser.profilePicture,
                suggestedUser.fullName || suggestedUser.username
              );

              return (
                <div
                  key={suggestedUser._id}
                  className="flex items-center gap-3"
                >
                  <Link to={`/profile/${suggestedUser._id}`}>
                    <img
                      src={avatarUrl}
                      alt={suggestedUser.username}
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = getFallbackAvatarUrl(
                          suggestedUser.fullName || suggestedUser.username
                        );
                      }}
                    />
                  </Link>
                  <div className="flex-1">
                    <Link
                      to={`/profile/${suggestedUser._id}`}
                      className="text-sm font-semibold hover:text-gray-400 transition-colors block truncate"
                    >
                      {suggestedUser.username}
                    </Link>
                    <p className="text-xs text-gray-500 truncate">
                      {suggestedUser.fullName || "Gợi ý cho bạn"}
                    </p>
                  </div>
                  <button
                    onClick={() => handleFollow(suggestedUser._id)}
                    disabled={isPending || isFollowed(suggestedUser._id)}
                    className={`text-xs font-semibold ${
                      isFollowed(suggestedUser._id)
                        ? "text-gray-400"
                        : "text-blue-500 hover:text-blue-400"
                    }`}
                  >
                    {isFollowed(suggestedUser._id)
                      ? "Đang theo dõi"
                      : "Theo dõi"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Links */}
      <div className="mt-8 text-xs text-gray-600 space-y-2">
        <div className="flex flex-wrap gap-2">
          <a href="#" className="hover:underline">
            Giới thiệu
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            Trợ giúp
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            Báo chí
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            API
          </a>
          <span>·</span>
          <a href="#" className="hover:underline">
            Việc làm
          </a>
        </div>
        <p>© 2026 INSTAGRAM FROM META</p>
      </div>
    </div>
  );
}
