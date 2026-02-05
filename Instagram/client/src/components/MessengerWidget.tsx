import { useState, useRef, useEffect } from "react";
import {
  X,
  Phone,
  Video,
  Image,
  Mic,
  Smile,
  Loader2,
  Heart,
  Maximize2,
  Send,
  ChevronLeft,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getConversations,
  getMessages,
  sendTextMessage,
  sendImageMessage,
} from "@/apis/message.api";
import { getAvatarUrl, getFallbackAvatarUrl } from "@/utils/avatar";
import { getMediaUrl } from "@/utils/media";
import { useAuthStore } from "@/store/auth.store";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function MessengerWidget() {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messageInput, setMessageInput] = useState("");
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Ẩn khi trong trang tin nhắn
  const isMessagesPage = location.pathname.startsWith("/direct");

  const { data: conversationsData } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => getConversations(),
    enabled: !isMessagesPage,
  });

  const { data: messagesData, isLoading: isLoadingMessages } = useQuery({
    queryKey: ["widget-messages", selectedChat?._id],
    queryFn: () => getMessages(selectedChat._id, 1, 50),
    enabled: !!selectedChat?._id,
    refetchInterval: 5000,
  });

  const messages = messagesData?.messages || [];
  const conversations = conversationsData?.conversations || [];

  const recentConversations = conversations.slice(0, 2);

  const sendTextMutation = useMutation({
    mutationFn: (content: string) =>
      sendTextMessage({
        conversationId: selectedChat._id,
        recipientId: selectedChat.otherUser?._id || "",
        messageType: "text",
        content,
      }),
    onSuccess: () => {
      setMessageInput("");
      queryClient.invalidateQueries({
        queryKey: ["widget-messages", selectedChat._id],
      });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  const sendImageMutation = useMutation({
    mutationFn: (file: File) =>
      sendImageMessage(
        selectedChat._id,
        selectedChat.otherUser?._id || "",
        file
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["widget-messages", selectedChat._id],
      });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || sendTextMutation.isPending) return;
    sendTextMutation.mutate(messageInput.trim());
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      sendImageMutation.mutate(file);
    }
  };

  const handleLikeMessage = () => {
    sendTextMutation.mutate("❤️");
  };

  const handleExpandToFullPage = () => {
    setIsOpen(false);
    setSelectedChat(null);
    navigate("/direct/inbox");
  };

  const getSenderId = (msg: any): string => {
    if (typeof msg.senderId === "string") {
      return msg.senderId;
    }
    return msg.senderId?._id || "";
  };

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isMessagesPage) {
    return null;
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-white dark:bg-[#363636] text-black dark:text-white rounded-full shadow-lg hover:shadow-xl border border-gray-200 dark:border-transparent transition-all duration-200 flex items-center gap-3 pl-4 pr-5 py-2.5"
        >
          {/* DM Icon */}
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>

          <span className="font-medium text-sm">Messages</span>

          {/* Recent conversation avatars */}
          {recentConversations.length > 0 && (
            <div className="flex -space-x-2 ml-1">
              {recentConversations.map((conversation: any) => {
                const otherUser =
                  conversation.participants?.find(
                    (p: any) => p._id !== conversation.currentUserId
                  ) || conversation.participants?.[0];

                return (
                  <img
                    key={conversation._id}
                    src={getAvatarUrl(
                      otherUser?.profilePicture,
                      otherUser?._id || "User"
                    )}
                    alt={otherUser?.username}
                    className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-[#363636]"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = getFallbackAvatarUrl(
                        otherUser?._id || "User"
                      );
                    }}
                  />
                );
              })}
            </div>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat List Modal */}
      {!selectedChat ? (
        <div className="bg-white dark:bg-[#262626] rounded-2xl shadow-2xl border border-gray-200 dark:border-transparent w-[360px] h-[500px] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-black dark:text-white">
              Tin nhắn
            </h2>
            <div className="flex items-center gap-1">
              {/* Expand button */}
              <button
                onClick={handleExpandToFullPage}
                className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full"
                title="Mở trang tin nhắn"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
              {/* New message button */}
              <button className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </button>
              {/* Close button */}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 p-4">
                <svg
                  className="w-16 h-16 mb-4 opacity-50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <p className="text-center text-sm">Chưa có tin nhắn nào</p>
                <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-1">
                  Bắt đầu trò chuyện với bạn bè
                </p>
              </div>
            ) : (
              conversations.map((conversation: any) => {
                const otherUser =
                  conversation.participants?.find(
                    (p: any) => p._id !== conversation.currentUserId
                  ) || conversation.participants?.[0];
                const hasUnread = conversation.unreadCount > 0;

                return (
                  <button
                    key={conversation._id}
                    onClick={() => {
                      setSelectedChat({
                        ...conversation,
                        otherUser: otherUser,
                      });
                      setSelectedMessageId(null);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={getAvatarUrl(
                          otherUser?.profilePicture,
                          otherUser?._id || "User"
                        )}
                        alt={otherUser?.username}
                        className="w-14 h-14 rounded-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = getFallbackAvatarUrl(
                            otherUser?._id || "User"
                          );
                        }}
                      />
                      {/* Online indicator */}
                      {otherUser?.isOnline && (
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-[#262626]" />
                      )}
                    </div>

                    {/* Message Info */}
                    <div className="flex-1 text-left min-w-0">
                      <p
                        className={`text-sm truncate ${
                          hasUnread
                            ? "font-bold text-black dark:text-white"
                            : "font-semibold text-black dark:text-white"
                        }`}
                      >
                        {otherUser?.fullName || otherUser?.username}
                      </p>
                      <p
                        className={`text-xs truncate ${
                          hasUnread
                            ? "font-semibold text-black dark:text-white"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {conversation.lastMessage?.content ||
                          "Bắt đầu trò chuyện"}
                      </p>
                    </div>

                    {/* Time + Unread indicator */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {conversation.lastMessage && (
                        <span
                          className={`text-xs ${
                            hasUnread
                              ? "text-black dark:text-white"
                              : "text-gray-400 dark:text-gray-500"
                          }`}
                        >
                          {new Date(
                            conversation.lastMessage.createdAt
                          ).toLocaleDateString("vi-VN")}
                        </span>
                      )}
                      {hasUnread && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      ) : (
        /* Chat Window */
        <div className="bg-white dark:bg-[#262626] rounded-2xl shadow-2xl border border-gray-200 dark:border-transparent w-[360px] h-[500px] flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedChat(null)}
                className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <Link
                to={`/profile/${selectedChat.otherUser?._id}`}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <img
                  src={getAvatarUrl(
                    selectedChat.otherUser?.profilePicture,
                    selectedChat.otherUser?._id || "User"
                  )}
                  alt={selectedChat.otherUser?.username}
                  className="w-9 h-9 rounded-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = getFallbackAvatarUrl(
                      selectedChat.otherUser?._id || "User"
                    );
                  }}
                />
                <div>
                  <p className="text-sm font-semibold text-black dark:text-white">
                    {selectedChat.otherUser?.fullName ||
                      selectedChat.otherUser?.username}
                  </p>
                  {selectedChat.otherUser?.isOnline && (
                    <p className="text-xs text-green-500">Đang hoạt động</p>
                  )}
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-1">
              <button className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full">
                <Phone className="w-5 h-5" />
              </button>
              <button className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full">
                <Video className="w-5 h-5" />
              </button>
              <button
                onClick={handleExpandToFullPage}
                className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full"
                title="Mở trang tin nhắn"
              >
                <Maximize2 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {isLoadingMessages ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-gray-400" size={24} />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <p className="text-sm">Chưa có tin nhắn</p>
                <p className="text-xs mt-1">Hãy bắt đầu cuộc trò chuyện!</p>
              </div>
            ) : (
              <>
                {messages.map((msg: any) => {
                  const isOwnMessage = getSenderId(msg) === currentUser?._id;
                  const isSelected = selectedMessageId === msg._id;

                  return (
                    <div
                      key={msg._id}
                      className={`flex items-end gap-2 ${
                        isOwnMessage ? "justify-end" : "justify-start"
                      }`}
                    >
                      {/* Avatar for other user */}
                      {!isOwnMessage && (
                        <img
                          src={getAvatarUrl(
                            selectedChat.otherUser?.profilePicture,
                            selectedChat.otherUser?._id || "User"
                          )}
                          alt={selectedChat.otherUser?.username}
                          className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = getFallbackAvatarUrl(
                              selectedChat.otherUser?._id || "User"
                            );
                          }}
                        />
                      )}

                      {/* Message content */}
                      <div className="max-w-[70%]">
                        {msg.messageType === "image" && msg.imageUrl ? (
                          <img
                            src={getMediaUrl(msg.imageUrl)}
                            alt="Message image"
                            className="max-w-full rounded-2xl cursor-pointer"
                            onClick={() =>
                              setSelectedMessageId(isSelected ? null : msg._id)
                            }
                          />
                        ) : (
                          <div
                            onClick={() =>
                              setSelectedMessageId(isSelected ? null : msg._id)
                            }
                            className={`px-4 py-2 rounded-2xl cursor-pointer transition-opacity hover:opacity-90 ${
                              isOwnMessage
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
                            }`}
                          >
                            <p className="text-sm break-words">{msg.content}</p>
                          </div>
                        )}
                        {/* Time & Status - only show when message is selected */}
                        {isSelected && (
                          <p
                            className={`text-[10px] text-gray-400 dark:text-gray-500 mt-1 ${
                              isOwnMessage ? "text-right" : "text-left"
                            }`}
                          >
                            {formatMessageTime(msg.createdAt)}
                            {isOwnMessage &&
                              (msg.isRead ? " · Đã xem" : " · Đã gửi")}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700/50 rounded-full px-4 py-2">
              <button className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors flex-shrink-0">
                <Smile className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Nhắn tin..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-500 text-black dark:text-white min-w-0"
              />

              {messageInput.trim() ? (
                <button
                  onClick={handleSendMessage}
                  disabled={sendTextMutation.isPending}
                  className="text-blue-500 hover:text-blue-400 transition-colors disabled:opacity-50 flex-shrink-0"
                >
                  <Send className="w-5 h-5" />
                </button>
              ) : (
                <>
                  <button className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors flex-shrink-0">
                    <Mic className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors flex-shrink-0"
                  >
                    <Image className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleLikeMessage}
                    className="text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                  >
                    <Heart className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>
        </div>
      )}
    </div>
  );
}
