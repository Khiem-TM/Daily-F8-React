export interface User {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  gender?: string;
  profilePicture: string | null;
  bio?: string;
  website?: string;
  followersCount?: number;
  followingCount?: number;
  postsCount?: number;
  isFollowing?: boolean; // For other user profiles
  createdAt?: string;
}
