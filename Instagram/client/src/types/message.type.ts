export interface MessageUser {
  _id: string;
  username: string;
  fullName: string;
  profilePicture?: string;
}

export interface LastMessage {
  _id: string;
  messageType: "text" | "image";
  content?: string;
  imageUrl?: string;
  createdAt: string;
  senderId: string;
  isRead: boolean;
}

export interface Conversation {
  _id: string;
  participants: MessageUser[];
  lastMessage: LastMessage | null;
  lastMessageAt: string;
  unreadCount: number;
  createdAt: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  senderId: MessageUser | string;
  recipientId: string;
  messageType: "text" | "image";
  content?: string;
  imageUrl?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ConversationsResponse {
  conversations: Conversation[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalConversations: number;
    hasMore: boolean;
  };
}

export interface MessagesResponse {
  messages: Message[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalMessages: number;
    hasMore: boolean;
  };
}

export interface SendMessageData {
  conversationId: string;
  recipientId: string;
  messageType: "text" | "image";
  content?: string;
}
