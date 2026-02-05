import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { X, Loader2 } from "lucide-react";
import { axiosInstance } from "@/apis/axios";
import { createOrGetConversation } from "@/apis/message.api";
import { getAvatarUrl, getFallbackAvatarUrl } from "@/utils/avatar";
import type { User } from "@/types/user.type";
import type { Conversation } from "@/types/message.type";

interface NewMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectConversation: (conversation: Conversation) => void;
}

export default function NewMessageModal({
  isOpen,
  onClose,
  onSelectConversation,
}: NewMessageModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  // Search users
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ["search-users", searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      const res = await axiosInstance.get("/users/search", {
        params: { q: searchQuery },
      });
      return res.data?.data || [];
    },
    enabled: searchQuery.length >= 1,
  });

  // Create conversation mutation
  const createConversationMutation = useMutation({
    mutationFn: (userId: string) => createOrGetConversation(userId),
    onSuccess: (conversation) => {
      onSelectConversation(conversation);
      onClose();
      setSearchQuery("");
      setSelectedUsers([]);
    },
  });

  const handleUserSelect = (user: User) => {
    // For now, only support 1-1 conversations
    createConversationMutation.mutate(user._id);
  };

  const handleChat = () => {
    if (selectedUsers.length > 0) {
      createConversationMutation.mutate(selectedUsers[0]._id);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#262626] rounded-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <button onClick={onClose} className="text-white">
            <X size={24} />
          </button>
          <h3 className="text-white font-semibold">Tin nhắn mới</h3>
          <button
            onClick={handleChat}
            disabled={
              selectedUsers.length === 0 || createConversationMutation.isPending
            }
            className="text-blue-500 font-semibold disabled:opacity-50"
          >
            Chat
          </button>
        </div>

        {/* Search input */}
        <div className="flex items-center gap-3 p-4 border-b border-gray-700">
          <span className="text-white font-semibold">Đến:</span>
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-white outline-none placeholder-gray-400"
            autoFocus
          />
        </div>

        {/* Selected users */}
        {selectedUsers.length > 0 && (
          <div className="flex flex-wrap gap-2 p-4 border-b border-gray-700">
            {selectedUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center gap-2 bg-[#363636] rounded-full px-3 py-1"
              >
                <span className="text-white text-sm">{user.username}</span>
                <button
                  onClick={() =>
                    setSelectedUsers((prev) =>
                      prev.filter((u) => u._id !== user._id)
                    )
                  }
                  className="text-gray-400 hover:text-white"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Search results */}
        <div className="max-h-[300px] overflow-y-auto">
          {isSearching ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin text-white" size={24} />
            </div>
          ) : searchResults && searchResults.length > 0 ? (
            <div>
              {searchResults.map((user: User) => {
                const avatarUrl = getAvatarUrl(
                  user.profilePicture,
                  user.fullName || user.username
                );

                return (
                  <button
                    key={user._id}
                    onClick={() => handleUserSelect(user)}
                    className="w-full flex items-center gap-3 p-4 hover:bg-[#363636] transition-colors"
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
                    <div className="flex-1 text-left">
                      <p className="text-white text-sm font-semibold">
                        {user.fullName || user.username}
                      </p>
                      <p className="text-gray-400 text-sm">{user.username}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : searchQuery ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Không tìm thấy tài khoản nào.</p>
            </div>
          ) : (
            <div className="p-4">
              <p className="text-gray-400 text-sm">Gợi ý</p>
              {/* Could add suggested users here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
