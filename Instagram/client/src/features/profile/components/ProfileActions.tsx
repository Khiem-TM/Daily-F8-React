import type { User } from "@/types/user.type";
import { useFollowMutation } from "@/hooks/useFollow";
import { useNavigate } from "react-router-dom";
import { ChevronDown, UserPlus } from "lucide-react";
import { useState, useEffect } from "react";

interface ProfileActionsProps {
  profile: User;
  isOwnProfile: boolean;
}

export default function ProfileActions({
  profile,
  isOwnProfile,
}: ProfileActionsProps) {
  const navigate = useNavigate();
  const { follow, unfollow, isPending } = useFollowMutation();

  // Use isFollowing from API response, fallback to false
  const [isFollowing, setIsFollowing] = useState(profile.isFollowing || false);

  // Sync state when profile changes
  useEffect(() => {
    setIsFollowing(profile.isFollowing || false);
  }, [profile.isFollowing]);

  const handleFollow = () => {
    setIsFollowing(true); // Optimistic update
    follow(profile._id, {
      onError: () => setIsFollowing(false), // Rollback on error
    });
  };

  const handleUnfollow = () => {
    setIsFollowing(false); // Optimistic update
    unfollow(profile._id, {
      onError: () => setIsFollowing(true), // Rollback on error
    });
  };

  if (isOwnProfile) {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => navigate("/settings")}
          className="px-4 py-1.5 bg-[#363636] text-white rounded-lg font-semibold text-sm hover:bg-[#262626] transition-colors"
        >
          Chỉnh sửa trang cá nhân
        </button>
        <button className="px-4 py-1.5 bg-[#363636] text-white rounded-lg font-semibold text-sm hover:bg-[#262626] transition-colors">
          Xem kho lưu trữ
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      {isFollowing ? (
        <>
          <button className="px-6 py-1.5 bg-[#363636] text-white rounded-lg font-semibold text-sm hover:bg-[#262626] transition-colors">
            Nhắn tin
          </button>
          <button
            onClick={handleUnfollow}
            disabled={isPending}
            className="px-4 py-1.5 bg-[#363636] text-white rounded-lg font-semibold text-sm hover:bg-[#262626] transition-colors flex items-center gap-1"
          >
            Đang theo dõi
            <ChevronDown size={16} />
          </button>
        </>
      ) : (
        <button
          onClick={handleFollow}
          disabled={isPending}
          className="px-6 py-1.5 bg-[#0095f6] text-white rounded-lg font-semibold text-sm hover:bg-[#1877f2] transition-colors flex items-center gap-1"
        >
          <UserPlus size={16} />
          Theo dõi
        </button>
      )}
      <button className="px-4 py-1.5 bg-[#363636] text-white rounded-lg font-semibold text-sm hover:bg-[#262626] transition-colors">
        ...
      </button>
    </div>
  );
}
