import type { User } from "./user.type";

export interface Media {
  _id?: string;
  url: string;
  type: "image" | "video";
  thumbnail?: string;
}

// Cấu hình kiểu Post
export interface Post {
  _id: string;
  userId: User | null;
  caption: string;
  image: string | null;
  video: string | null;
  media?: Media[];
  mediaType: "image" | "video";
  likes: number;
  comments: number;
  likesCount?: number;
  commentsCount?: number;
  createdAt: string;
  user?: User;
  // API returns these fields
  isLiked?: boolean;
  isSaved?: boolean;
  likedBy?: string[];
  savedBy?: string[];
  // Aliases for compatibility
  isLikedByCurrentUser?: boolean;
  isSavedByCurrentUser?: boolean;
}

export interface FeedResponse {
  posts: Post[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPosts: number;
    hasMore: boolean;
  };
}
