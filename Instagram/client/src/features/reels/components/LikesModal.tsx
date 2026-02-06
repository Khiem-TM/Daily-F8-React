import { X } from "lucide-react";
import type { Post } from "@/types/post.type";

interface LikesModalProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
}

export default function LikesModal({ post, isOpen, onClose }: LikesModalProps) {
  if (!isOpen) return null;

  const mockLikes = [
    {
      _id: "1",
      username: "user1",
      fullName: "User One",
      profilePicture: "/avatar.png",
      isFollowing: false,
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#262626] rounded-2xl z-50 max-h-[70vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <h2 className="text-white font-semibold text-base">Lượt thích</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {mockLikes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-sm">Chưa có lượt thích nào</p>
            </div>
          ) : (
            <div className="space-y-3">
              {mockLikes.map((user) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.profilePicture}
                      alt={user.username}
                      className="w-11 h-11 rounded-full"
                    />
                    <div>
                      <p className="text-white font-semibold text-sm">
                        {user.username}
                      </p>
                      <p className="text-gray-400 text-xs">{user.fullName}</p>
                    </div>
                  </div>
                  <button
                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                      user.isFollowing
                        ? "bg-[#363636] text-white hover:bg-[#404040]"
                        : "bg-[#0095f6] text-white hover:bg-[#1877f2]"
                    }`}
                  >
                    {user.isFollowing ? "Đang theo dõi" : "Theo dõi"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
