import type { User } from "@/types/user.type";
import { getAvatarUrl, getFallbackAvatarUrl } from "@/utils/avatar";

interface ProfileHeaderProps {
  profile: User;
  isOwnProfile: boolean;
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  const avatarUrl = getAvatarUrl(
    profile.profilePicture,
    profile.fullName || profile.username
  );

  return (
    <button className="relative group">
      <div className="w-37.5 h-37.5 rounded-full overflow-hidden border-2 border-gray-800">
        <img
          src={avatarUrl}
          alt={profile.username}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = getFallbackAvatarUrl(
              profile.fullName || profile.username
            );
          }}
        />
      </div>
    </button>
  );
}
