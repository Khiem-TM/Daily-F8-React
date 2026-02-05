import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Settings, Loader2, Plus, AtSign } from "lucide-react";
import { getUserById, getCurrentUserProfile } from "@/apis/user.api";
import { useAuthStore } from "@/store/auth.store";
import { getAvatarUrl, getFallbackAvatarUrl } from "@/utils/avatar";
import ProfileStats from "../components/ProfileStats";
import ProfileTabs from "../components/ProfileTabs";
import ProfilePosts from "../components/ProfilePosts";
import ProfileActions from "../components/ProfileActions";

type TabType = "posts" | "saved" | "videos";

export default function ProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>("posts");

  // Fetch profile data based on userId param
  const {
    data: profile,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user-profile", userId ?? "me"],
    queryFn: async () => {
      if (!userId) {
        return getCurrentUserProfile();
      }
      return getUserById(userId);
    },
    enabled: !!currentUser,
    staleTime: 0,
  });

  // Determine if viewing own profile AFTER we have the profile data
  const isOwnProfile = !userId || profile?._id === currentUser?._id;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin text-white" size={48} />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-4">
        <p className="text-white text-lg mb-4">Không tìm thấy người dùng này</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-white text-black rounded-lg font-semibold hover:bg-gray-200 transition-colors"
        >
          Về trang chủ
        </button>
      </div>
    );
  }

  const avatarUrl = getAvatarUrl(
    profile.profilePicture,
    profile.fullName || profile.username
  );

  return (
    <div className="max-w-233.75 mx-auto px-5 py-8">
      {/* Profile Header Section */}
      <div className="flex gap-8 md:gap-20 mb-11">
        {/* Avatar */}
        <div className="shrink-0">
          <div className="relative group">
            {/* Story ring gradient - nếu có story active */}
            <div className="w-37.5 h-37.5 rounded-full p-0.75 bg-linear-to-tr from-yellow-400 via-red-500 to-purple-600">
              <div className="w-full h-full rounded-full p-0.75 bg-black">
                <img
                  src={avatarUrl}
                  alt={profile.username}
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = getFallbackAvatarUrl(
                      profile.fullName || profile.username
                    );
                  }}
                />
              </div>
            </div>
            {/* Ghi chú label */}
            {isOwnProfile && (
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#262626] text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
                Ghi chú...
              </div>
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex-1 min-w-0">
          {/* Username + Actions */}
          <div className="flex flex-wrap items-center gap-4 mb-5">
            <h2 className="text-xl text-white font-normal">
              {profile.username}
            </h2>

            {isOwnProfile ? (
              <>
                <Link
                  to="/settings"
                  className="px-4 py-1.5 bg-[#363636] text-white text-sm font-semibold rounded-lg hover:bg-[#4a4a4a] transition-colors"
                >
                  Chỉnh sửa trang cá nhân
                </Link>
                <button className="px-4 py-1.5 bg-[#363636] text-white text-sm font-semibold rounded-lg hover:bg-[#4a4a4a] transition-colors">
                  Xem kho lưu trữ
                </button>
                <Link to="/settings">
                  <Settings
                    className="text-white cursor-pointer hover:opacity-70"
                    size={24}
                  />
                </Link>
              </>
            ) : (
              <ProfileActions profile={profile} isOwnProfile={false} />
            )}
          </div>

          {/* Stats */}
          <ProfileStats profile={profile} />

          {/* Bio */}
          <div className="mt-5">
            <p className="text-white font-semibold text-sm">
              {profile.fullName}
            </p>
            {profile.bio && (
              <p className="text-white text-sm mt-1 whitespace-pre-wrap">
                {profile.bio}
              </p>
            )}
            {profile.website && (
              <a
                href={profile.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 text-sm mt-1 block hover:underline"
              >
                {profile.website}
              </a>
            )}
          </div>

          {/* Threads link */}
          <div className="mt-4 flex items-center gap-2 text-gray-400 text-sm">
            <AtSign size={16} />
            <span>{profile.username}</span>
          </div>
        </div>
      </div>

      {/* Story Highlights */}
      <div className="mb-10">
        <div className="flex gap-6 overflow-x-auto pb-4">
          {/* Add new highlight button */}
          {isOwnProfile && (
            <div className="flex flex-col items-center gap-2 shrink-0">
              <button className="w-19.25 h-19.25 rounded-full border border-gray-600 flex items-center justify-center hover:opacity-70">
                <Plus size={40} className="text-gray-400" strokeWidth={1} />
              </button>
              <span className="text-white text-xs">Mới</span>
            </div>
          )}
          {/* Placeholder for highlights - có thể thêm data từ API */}
        </div>
      </div>

      {/* Tabs */}
      <ProfileTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOwnProfile={isOwnProfile}
      />

      {/* Tab Content */}
      <div className="mt-1">
        {activeTab === "posts" && <ProfilePosts userId={profile._id} />}
        {activeTab === "saved" && isOwnProfile && (
          <ProfilePosts userId={profile._id} saved />
        )}
        {activeTab === "videos" && (
          <ProfilePosts userId={profile._id} videosOnly />
        )}
      </div>
    </div>
  );
}
