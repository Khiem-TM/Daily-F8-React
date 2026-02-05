import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Loader2,
  Phone,
  Video,
  Info,
  Smile,
  Image as ImageIcon,
  Heart,
  Mic,
} from "lucide-react";
import {
  getMessages,
  sendTextMessage,
  sendImageMessage,
} from "@/apis/message.api";
import { useAuthStore } from "@/store/auth.store";
import { getAvatarUrl, getFallbackAvatarUrl } from "@/utils/avatar";
import { getMediaUrl } from "@/utils/media";
import type { Conversation, Message } from "@/types/message.type";

interface ChatAreaProps {
  conversation: Conversation;
}

export default function ChatArea({ conversation }: ChatAreaProps) {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();
  const [messageText, setMessageText] = useState("");
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(
    null
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const otherUser = conversation.participants.find(
    (p) => p._id !== currentUser?._id
  );

  // Fetch messages
  const { data, isLoading } = useQuery({
    queryKey: ["messages", conversation._id],
    queryFn: () => getMessages(conversation._id, 1, 100),
    refetchInterval: 5000,
  });

  const messages = data?.messages || [];

  // Send text message mutation
  const sendTextMutation = useMutation({
    mutationFn: (content: string) =>
      sendTextMessage({
        conversationId: conversation._id,
        recipientId: otherUser?._id || "",
        messageType: "text",
        content,
      }),
    onSuccess: () => {
      setMessageText("");
      queryClient.invalidateQueries({
        queryKey: ["messages", conversation._id],
      });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  // Send image mutation
  const sendImageMutation = useMutation({
    mutationFn: (file: File) =>
      sendImageMessage(conversation._id, otherUser?._id || "", file),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages", conversation._id],
      });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim() && !sendTextMutation.isPending) {
      sendTextMutation.mutate(messageText.trim());
    }
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

  // format time
  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [key: string]: Message[] } = {};

    messages.forEach((msg) => {
      const date = new Date(msg.createdAt).toLocaleDateString("vi-VN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(msg);
    });

    return groups;
  };

  const getSenderId = (msg: Message): string => {
    if (typeof msg.senderId === "string") {
      return msg.senderId;
    }
    return msg.senderId._id;
  };

  const avatarUrl = getAvatarUrl(
    otherUser?.profilePicture,
    otherUser?.fullName || otherUser?.username || "User"
  );

  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <Link
          to={`/profile/${otherUser?._id}`}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <img
            src={avatarUrl}
            alt={otherUser?.username}
            className="w-11 h-11 rounded-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = getFallbackAvatarUrl(
                otherUser?.fullName || otherUser?.username || "User"
              );
            }}
          />
          <div>
            <p className="text-white font-semibold">
              {otherUser?.fullName || otherUser?.username}
            </p>
            <p className="text-gray-400 text-xs">{otherUser?.username}</p>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <button className="text-white hover:opacity-70 transition-opacity">
            <Phone size={24} />
          </button>
          <button className="text-white hover:opacity-70 transition-opacity">
            <Video size={24} />
          </button>
          <button className="text-white hover:opacity-70 transition-opacity">
            <Info size={24} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin text-white" size={32} />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <img
              src={avatarUrl}
              alt={otherUser?.username}
              className="w-24 h-24 rounded-full object-cover mb-4"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = getFallbackAvatarUrl(
                  otherUser?.fullName || otherUser?.username || "User"
                );
              }}
            />
            <p className="text-white font-semibold text-lg">
              {otherUser?.fullName || otherUser?.username}
            </p>
            <p className="text-gray-400 text-sm">
              {otherUser?.username} · Instagram
            </p>
            <Link
              to={`/profile/${otherUser?._id}`}
              className="mt-4 px-4 py-2 bg-[#363636] text-white text-sm font-semibold rounded-lg hover:bg-[#4a4a4a] transition-colors"
            >
              Xem trang cá nhân
            </Link>
          </div>
        ) : (
          <>
            {/* Profile intro at top */}
            <div className="flex flex-col items-center py-6">
              <img
                src={avatarUrl}
                alt={otherUser?.username}
                className="w-24 h-24 rounded-full object-cover mb-4"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = getFallbackAvatarUrl(
                    otherUser?.fullName || otherUser?.username || "User"
                  );
                }}
              />
              <p className="text-white font-semibold text-lg">
                {otherUser?.fullName || otherUser?.username}
              </p>
              <p className="text-gray-400 text-sm">
                {otherUser?.username} · Instagram
              </p>
              <Link
                to={`/profile/${otherUser?._id}`}
                className="mt-4 px-4 py-2 bg-[#363636] text-white text-sm font-semibold rounded-lg hover:bg-[#4a4a4a] transition-colors"
              >
                Xem trang cá nhân
              </Link>
            </div>

            {/* Messages grouped by date */}
            {Object.entries(messageGroups).map(([date, msgs]) => (
              <div key={date}>
                {/* Date separator */}
                <div className="flex items-center justify-center my-4">
                  <span className="text-gray-500 text-xs">{date}</span>
                </div>

                {/* Messages */}
                {msgs.map((msg, index) => {
                  const isOwnMessage = getSenderId(msg) === currentUser?._id;
                  const showAvatar =
                    !isOwnMessage &&
                    (index === 0 ||
                      getSenderId(msgs[index - 1]) !== getSenderId(msg));
                  const isSelected = selectedMessageId === msg._id;

                  return (
                    <div
                      key={msg._id}
                      className={`flex items-end gap-2 mb-1 ${
                        isOwnMessage ? "justify-end" : "justify-start"
                      }`}
                    >
                      {/* Avatar for other user */}
                      {!isOwnMessage && (
                        <div className="w-6 h-6 shrink-0">
                          {showAvatar && (
                            <img
                              src={avatarUrl}
                              alt={otherUser?.username}
                              className="w-6 h-6 rounded-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = getFallbackAvatarUrl(
                                  otherUser?.fullName ||
                                    otherUser?.username ||
                                    "User"
                                );
                              }}
                            />
                          )}
                        </div>
                      )}

                      {/* Message content */}
                      <div
                        className={`max-w-[60%] ${
                          isOwnMessage ? "order-1" : ""
                        }`}
                      >
                        {msg.messageType === "image" && msg.imageUrl ? (
                          <img
                            src={getMediaUrl(msg.imageUrl)}
                            alt="Message image"
                            className="max-w-full rounded-2xl cursor-pointer"
                            onClick={() =>
                              setSelectedMessageId(isSelected ? null : msg._id)
                            }
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              if (!target.dataset.error) {
                                target.dataset.error = "true";
                                target.src =
                                  "https://placehold.co/300x300/1a1a1a/666?text=Image";
                              }
                            }}
                          />
                        ) : (
                          <div
                            onClick={() =>
                              setSelectedMessageId(isSelected ? null : msg._id)
                            }
                            className={`px-4 py-2 rounded-3xl cursor-pointer transition-opacity hover:opacity-90 ${
                              isOwnMessage
                                ? "bg-[#3797f0] text-white"
                                : "bg-[#363636] text-white"
                            }`}
                          >
                            <p className="text-sm wrap-break-word">
                              {msg.content}
                            </p>
                          </div>
                        )}

                        {/* Time & Status - only show when message is selected */}
                        {isSelected && (
                          <p
                            className={`text-[10px] text-gray-500 mt-1 animate-fade-in ${
                              isOwnMessage ? "text-right" : "text-left ml-2"
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
              </div>
            ))}

            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-800">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center gap-3 bg-[#363636] rounded-full px-4 py-2"
        >
          <button
            type="button"
            className="text-white hover:opacity-70 transition-opacity"
          >
            <Smile size={24} />
          </button>

          <input
            type="text"
            placeholder="Nhắn tin..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-400"
          />

          {messageText.trim() ? (
            <button
              type="submit"
              disabled={sendTextMutation.isPending}
              className="text-blue-500 font-semibold text-sm hover:text-white transition-colors disabled:opacity-50"
            >
              {sendTextMutation.isPending ? "..." : "Gửi"}
            </button>
          ) : (
            <>
              <button
                type="button"
                className="text-white hover:opacity-70 transition-opacity"
              >
                <Mic size={24} />
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-white hover:opacity-70 transition-opacity"
              >
                <ImageIcon size={24} />
              </button>
              <button
                type="button"
                onClick={handleLikeMessage}
                className="text-white hover:opacity-70 transition-opacity"
              >
                <Heart size={24} />
              </button>
            </>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
        </form>
      </div>
    </div>
  );
}
