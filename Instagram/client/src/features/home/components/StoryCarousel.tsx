import { useAuthStore } from "@/store/auth.store";
import { getAvatarUrl, getFallbackAvatarUrl } from "@/utils/avatar";

export default function StoryCarousel() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="bg-black py-4 mb-6">
      <div className="flex gap-4 overflow-x-auto scrollbar-hide">
        {/* Current User - Add Story */}
        <button className="flex flex-col items-center gap-1 flex-shrink-0 group">
          <div className="relative w-16 h-16">
            <div className="w-full h-full rounded-full bg-gray-700 overflow-hidden flex items-center justify-center">
              <img
                src={getAvatarUrl(
                  user?.profilePicture,
                  user?.fullName || user?.username || "User"
                )}
                alt={user?.username || "User"}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = getFallbackAvatarUrl(
                    user?.fullName || user?.username || "User"
                  );
                }}
              />
            </div>
            {/* Add Story Button */}
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-black">
              <span className="text-white text-xs font-bold">+</span>
            </div>
          </div>
          <span className="text-xs text-gray-400 max-w-[70px] truncate">
            Tin của bạn
          </span>
        </button>

        {/* Empty state  */}
        <div className="flex items-center justify-center flex-1 text-gray-500 text-sm">
          <p>Chưa có story nào</p>
        </div>
      </div>
    </div>
  );
}
