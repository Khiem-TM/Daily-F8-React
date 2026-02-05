import type { User } from "@/types/user.type";
import { useState } from "react";
import FollowersModal from "./FollowersModal";
import FollowingModal from "./FollowingModal";

interface ProfileStatsProps {
  profile: User;
}

export default function ProfileStats({ profile }: ProfileStatsProps) {
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);

  return (
    <>
      <div className="flex gap-10">
        <div className="flex gap-1">
          <span className="text-white font-semibold">
            {profile.postsCount || 0}
          </span>
          <span className="text-white"> bài viết</span>
        </div>

        <button
          onClick={() => setShowFollowers(true)}
          className="flex gap-1 hover:opacity-70 transition-opacity"
        >
          <span className="text-white font-semibold">
            {profile.followersCount || 0}
          </span>
          <span className="text-white"> người theo dõi</span>
        </button>

        <button
          onClick={() => setShowFollowing(true)}
          className="flex gap-1 hover:opacity-70 transition-opacity"
        >
          <span className="text-white font-semibold">
            {profile.followingCount || 0}
          </span>
          <span className="text-white"> đang theo dõi</span>
        </button>
      </div>

      {/* Modals */}
      {showFollowers && (
        <FollowersModal
          userId={profile._id}
          onClose={() => setShowFollowers(false)}
        />
      )}
      {showFollowing && (
        <FollowingModal
          userId={profile._id}
          onClose={() => setShowFollowing(false)}
        />
      )}
    </>
  );
}
