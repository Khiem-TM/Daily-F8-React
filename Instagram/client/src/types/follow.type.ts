// Config res/req for follow feature

// follow/unfollow response
export interface FollowResponse {
  success: boolean;
  message: string;
  data: null;
}

// user infor (bonus isFollowing)
export interface FollowerUser {
  _id: string;
  username: string;
  fullName: string;
  profilePicture?: string;
  bio?: string;
  isFollowing?: boolean;
}

// get followers response
export interface FollowersResponse {
  success: boolean;
  message: string;
  data: {
    followers: FollowerUser[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalFollowers: number;
      hasMore: boolean;
    };
  };
}

// get following response
export interface FollowingResponse {
  success: boolean;
  message: string;
  data: {
    following: FollowerUser[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalFollowing: number;
      hasMore: boolean;
    };
  };
}
