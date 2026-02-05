import { axiosInstance } from "./axios";
import type {
  Conversation,
  ConversationsResponse,
  Message,
  MessagesResponse,
  SendMessageData,
} from "@/types/message.type";

// Lấy full đoạn hội thoại
export const getConversations = async (
  page: number = 1,
  limit: number = 20
): Promise<ConversationsResponse> => {
  const res = await axiosInstance.get("/messages/conversations", {
    params: { page, limit },
  });
  return res.data?.data || { conversations: [], pagination: {} };
};

// Tạo hoặc lấy đoạn hội thoại với một người dùng
export const createOrGetConversation = async (
  userId: string
): Promise<Conversation> => {
  const res = await axiosInstance.post("/messages/conversations", { userId });
  return res.data?.data;
};

// Lấy tin nhắn trong một đoạn hội thoại
// API: GET /messages/conversations/:conversationId/messages
export const getMessages = async (
  conversationId: string,
  page: number = 1,
  limit: number = 50
): Promise<MessagesResponse> => {
  const res = await axiosInstance.get(
    `/messages/conversations/${conversationId}/messages`,
    {
      params: { page, limit },
    }
  );
  return res.data?.data || { messages: [], pagination: {} };
};

export const sendTextMessage = async (
  data: SendMessageData
): Promise<Message> => {
  const res = await axiosInstance.post("/messages/messages", data);
  return res.data?.data;
};

export const sendImageMessage = async (
  conversationId: string,
  recipientId: string,
  image: File
): Promise<Message> => {
  const formData = new FormData();
  formData.append("conversationId", conversationId);
  formData.append("recipientId", recipientId);
  formData.append("messageType", "image");
  formData.append("image", image);

  const res = await axiosInstance.post("/messages/messages", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data?.data;
};

export const markMessageAsRead = async (messageId: string): Promise<void> => {
  await axiosInstance.put(`/messages/messages/${messageId}/read`);
};

// Tổng số lượng tin nhắn chưa đọc 
export const getUnreadCount = async (): Promise<number> => {
  const res = await axiosInstance.get("/messages/unread-count");
  return res.data?.data?.unreadCount || 0;
};
