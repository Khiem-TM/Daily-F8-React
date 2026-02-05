import type { User } from "./user.type";

export interface Comment {
  _id: string;
  postId: string;
  userId: User;
  content: string;
  parentCommentId: string | null;
  likes: number;
  repliesCount?: number;
  createdAt: string;
  isLikedByCurrentUser?: boolean;
}

export interface CommentResponse {
  comments: Comment[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalComments: number;
    hasMore: boolean;
  };
}

export interface CreateCommentData {
  content: string;
  parentCommentId?: string | null;
}
