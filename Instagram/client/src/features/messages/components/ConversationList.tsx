import { useQuery } from "@tanstack/react-query";
import { Loader2, Edit } from "lucide-react";
import { getConversations } from "@/apis/message.api";
import { useAuthStore } from "@/store/auth.store";
import { getAvatarUrl, getFallbackAvatarUrl } from "@/utils/avatar";
import type { Conversation } from "@/types/message.type";

interface ConversationListProps {
  selectedConversationId: string | null;
  onSelectConversation: (conversation: Conversation) => void;
  onNewMessage: () => void;
}

export default function ConversationList({
  selectedConversationId,
  onSelectConversation,
  onNewMessage,
}: ConversationListProps) {
  const { user: currentUser } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => getConversations(1, 50),
    refetchInterval: 10000, // Refetch 10s/time
  });

  const conversations = data?.conversations || [];

  const getOtherParticipant = (conversation: Conversation) => {
    return conversation.participants.find((p) => p._id !== currentUser?._id);
  };

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    const diffWeeks = Math.floor(diffDays / 7);

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút`;
    if (diffHours < 24) return `${diffHours} giờ`;
    if (diffDays < 7) return `${diffDays} ngày`;
    return `${diffWeeks} tuần`;
  };

  const getLastMessagePreview = (conversation: Conversation) => {
    const lastMessage = conversation.lastMessage;
    if (!lastMessage) return "";

    if (lastMessage.messageType === "image") {
      const isSentByMe = lastMessage.senderId === currentUser?._id;
      return isSentByMe
        ? "Bạn đã gửi một file đính kèm."
        : "Đã gửi một file đính kèm.";
    }

    return lastMessage.content || "";
  };

  return (
    <div className="w-100 border-r border-gray-800 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <h2 className="text-white font-semibold">{currentUser?.username}</h2>
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
        <button
          onClick={onNewMessage}
          className="text-white hover:opacity-70 transition-opacity"
        >
          <Edit size={24} />
        </button>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm"
            className="w-full bg-[#363636] text-white text-sm rounded-lg pl-10 pr-4 py-2 outline-none focus:ring-1 focus:ring-gray-600"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-4 gap-4 border-b border-gray-800">
        <button className="pb-3 text-white font-semibold border-b-2 border-white">
          Tin nhắn
        </button>
        <button className="pb-3 text-gray-500 hover:text-gray-300 transition-colors">
          Tin nhắn đang chờ
        </button>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin text-white" size={32} />
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">Chưa có tin nhắn nào</p>
          </div>
        ) : (
          <div>
            {conversations.map((conversation) => {
              const otherUser = getOtherParticipant(conversation);
              if (!otherUser) return null;

              const avatarUrl = getAvatarUrl(
                otherUser.profilePicture,
                otherUser.fullName || otherUser.username
              );
              const isSelected = selectedConversationId === conversation._id;
              const hasUnread = conversation.unreadCount > 0;
              const lastMessagePreview = getLastMessagePreview(conversation);

              return (
                <button
                  key={conversation._id}
                  onClick={() => onSelectConversation(conversation)}
                  className={`w-full flex items-center gap-3 p-4 hover:bg-[#1a1a1a] transition-colors ${
                    isSelected ? "bg-[#363636]" : ""
                  }`}
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <img
                      src={avatarUrl}
                      alt={otherUser.username}
                      className="w-14 h-14 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = getFallbackAvatarUrl(
                          otherUser.fullName || otherUser.username
                        );
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 text-left">
                    <p
                      className={`text-sm truncate ${
                        hasUnread ? "text-white font-semibold" : "text-white"
                      }`}
                    >
                      {otherUser.fullName || otherUser.username}
                    </p>
                    <p
                      className={`text-sm truncate ${
                        hasUnread ? "text-white" : "text-gray-400"
                      }`}
                    >
                      {lastMessagePreview}
                      {conversation.lastMessage && (
                        <span className="text-gray-500">
                          {" "}
                          · {formatTime(conversation.lastMessage.createdAt)}
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Unread indicator */}
                  {hasUnread && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
