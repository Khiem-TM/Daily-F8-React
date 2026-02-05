import type { User } from "./user.type";

export interface Notification {
  _id: string;
  type: "follow" | "like" | "comment" | "mention";
  userId: User;
  postId?: string;
  postImage?: string;
  content?: string;
  createdAt: string;
  isRead: boolean;
}
