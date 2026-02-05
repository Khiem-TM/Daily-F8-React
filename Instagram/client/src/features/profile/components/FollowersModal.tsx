import { X, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { getAvatarUrl, getFallbackAvatarUrl } from "@/utils/avatar";
import { useFollowers, useFollowMutation } from "@/hooks/useFollow";
import { useFollowStatusBatch } from "@/hooks/useFollowStatus";
import { useAuthStore } from "@/store/auth.store";
import { useState, useMemo } from "react";

interface FollowersModalProps {
  userId: string;
  onClose: () => void;
}

export default function FollowersModal({
  userId,
  onClose,
}: FollowersModalProps) {
  const { data, isLoading } = useFollowers(userId, 1, 50);
  const { follow, unfollow, isPending } = useFollowMutation();
  const { user: currentUser } = useAuthStore();
  const [followingState, setFollowingState] = useState<Record<string, boolean>>(
    {}
  );

  const followers = (data?.data?.followers || []).filter(
    (user): user is NonNullable<typeof user> => user != null
  );

  // Get user IDs to fetch follow status
  const userIds = useMemo(() => followers.map((user) => user._id), [followers]);

  // Fetch follow status for all users in the list
  const { followStatusMap, isLoading: isLoadingStatus } =
    useFollowStatusBatch(userIds);

  const handleFollowToggle = (
    targetUserId: string,
    currentlyFollowing: boolean
  ) => {
    const newState = !currentlyFollowing;
    setFollowingState((prev) => ({ ...prev, [targetUserId]: newState }));

    if (newState) {
      follow(targetUserId, {
        onError: () =>
          setFollowingState((prev) => ({ ...prev, [targetUserId]: false })),
      });
    } else {
      unfollow(targetUserId, {
        onError: () =>
          setFollowingState((prev) => ({ ...prev, [targetUserId]: true })),
      });
    }
  };

  // Check follow status: first local state, then from API, fallback to false
  const isUserFollowing = (targetUserId: string) => {
    if (followingState[targetUserId] !== undefined) {
      return followingState[targetUserId];
    }
    return followStatusMap[targetUserId] ?? false;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-[#262626] rounded-xl w-full max-w-md max-h-[400px] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="text-white font-semibold">Người theo dõi</h3>
          <button onClick={onClose}>
            <X className="text-white" size={24} />
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto max-h-[320px]">
          {isLoading || isLoadingStatus ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin text-white" size={32} />
            </div>
          ) : followers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Chưa có người theo dõi</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {followers.map((user) => {
                const avatarUrl = getAvatarUrl(
                  user.profilePicture,
                  user.fullName || user.username
                );
                const following = isUserFollowing(user._id);

                return (
                  <div
                    key={user._id}
                    className="flex items-center gap-3 p-3 hover:bg-[#363636] transition-colors"
                  >
                    <Link
                      to={`/profile/${user._id}`}
                      onClick={onClose}
                      className="flex items-center gap-3 flex-1 min-w-0"
                    >
                      <img
                        src={avatarUrl}
                        alt={user.username}
                        className="w-11 h-11 rounded-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = getFallbackAvatarUrl(
                            user.fullName || user.username
                          );
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold truncate">
                          {user.username}
                        </p>
                        <p className="text-gray-400 text-sm truncate">
                          {user.fullName}
                        </p>
                      </div>
                    </Link>
                    {/* Don't show follow button for current user */}
                    {currentUser?._id !== user._id && (
                      <button
                        onClick={() => handleFollowToggle(user._id, following)}
                        disabled={isPending}
                        className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                          following
                            ? "bg-[#363636] text-white hover:bg-[#262626]"
                            : "bg-[#0095f6] text-white hover:bg-[#1877f2]"
                        }`}
                      >
                        {following ? "Đang theo dõi" : "Theo dõi"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
