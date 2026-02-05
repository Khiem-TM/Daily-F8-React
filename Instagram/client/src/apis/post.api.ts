import { axiosInstance } from "./axios";
import type { Post } from "@/types/post.type";
import type {
  Comment,
  CommentResponse,
  CreateCommentData,
} from "@/types/comment.type";
import { getMediaBaseUrl } from "@/utils/media";

const API_BASE = getMediaBaseUrl();

export interface FeedPagination {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  hasMore: boolean;
}

export interface FeedPostsResponse {
  posts: Post[];
  pagination: FeedPagination;
}

export const getFeedPosts = async (
  limit: number = 10,
  offset: number = 0
): Promise<FeedPostsResponse> => {
  const res = await axiosInstance.get("/posts/feed", {
    params: { limit, offset },
  });

  let posts: any[] = [];
  let pagination: FeedPagination = {
    currentPage: Math.floor(offset / limit) + 1,
    totalPages: 1,
    totalPosts: 0,
    hasMore: false,
  };

  if (res.data?.data?.posts && Array.isArray(res.data.data.posts)) {
    posts = res.data.data.posts;
    if (res.data.data.pagination) {
      pagination = res.data.data.pagination;
    }
  } else if (Array.isArray(res.data?.data)) {
    posts = res.data.data;
  } else if (Array.isArray(res.data)) {
    posts = res.data;
  } else {
    console.error("Invalid response structure:", res.data);
    return { posts: [], pagination };
  }

  const mappedPosts = posts
    .map((post) => ({
      ...post,
      user: post.user || post.userId || post.author, // API uses 'userId'
      image:
        post.image && !post.image.startsWith("http")
          ? `${API_BASE}${post.image}`
          : post.image,
      video:
        post.video && !post.video.startsWith("http")
          ? `${API_BASE}${post.video}`
          : post.video,
    }))
    .filter((post) => {
      if (!post.user || post.user === null) {
        console.warn("Skipping :", post._id);
        return false;
      }
      return true;
    });

  if (!res.data?.data?.pagination) {
    pagination.hasMore = posts.length === limit;
    pagination.totalPosts =
      offset + posts.length + (pagination.hasMore ? 1 : 0);
  }

  return { posts: mappedPosts, pagination };
};

export const likePost = async (postId: string) => {
  const res = await axiosInstance.post(`/posts/${postId}/like`);
  return res.data;
};

export const unlikePost = async (postId: string) => {
  const res = await axiosInstance.delete(`/posts/${postId}/like`);
  return res.data;
};

export const createPost = async (formData: FormData): Promise<Post> => {
  const res = await axiosInstance.post("/posts", formData);

  const post = res.data?.data || res.data;

  return {
    ...post,
    user: post.user || post.userId || post.author,
    image:
      post.image && !post.image.startsWith("http")
        ? `${API_BASE}${post.image}`
        : post.image,
    video:
      post.video && !post.video.startsWith("http")
        ? `${API_BASE}${post.video}`
        : post.video,
  };
};

export const updatePost = async (
  postId: string,
  caption: string
): Promise<Post> => {
  const res = await axiosInstance.patch(`/posts/${postId}`, { caption });
  const post = res.data?.data || res.data;

  return {
    ...post,
    user: post.user || post.userId || post.author,
    image:
      post.image && !post.image.startsWith("http")
        ? `${API_BASE}${post.image}`
        : post.image,
    video:
      post.video && !post.video.startsWith("http")
        ? `${API_BASE}${post.video}`
        : post.video,
  };
};

// delete post
export const deletePost = async (postId: string) => {
  if (!postId || !isValidMongoId(postId)) {
    throw new Error("Invalid post ID");
  }
  const res = await axiosInstance.delete(`/posts/${postId}`);
  return res.data;
};

// Validate MongoDB ObjectId format
const isValidMongoId = (id: string): boolean => {
  return /^[a-fA-F0-9]{24}$/.test(id);
};

export const savePost = async (postId: string) => {
  if (!postId || !isValidMongoId(postId)) {
    throw new Error("Invalid post ID");
  }
  const res = await axiosInstance.post(`/posts/${postId}/save`);
  return res.data;
};
export const unsavePost = async (postId: string) => {
  if (!postId || !isValidMongoId(postId)) {
    throw new Error("Invalid post ID");
  }
  const res = await axiosInstance.delete(`/posts/${postId}/save`);
  return res.data;
};

export const getPostById = async (postId: string): Promise<Post> => {
  const res = await axiosInstance.get(`/posts/${postId}`);

  const post = res.data?.data || res.data;

  return {
    ...post,
    user: post.user || post.userId || post.author,
    image:
      post.image && !post.image.startsWith("http")
        ? `${API_BASE}${post.image}`
        : post.image,
    video:
      post.video && !post.video.startsWith("http")
        ? `${API_BASE}${post.video}`
        : post.video,
  };
};

export const getPostComments = async (
  postId: string,
  limit = 20,
  offset = 0
): Promise<CommentResponse> => {
  const res = await axiosInstance.get(`/posts/${postId}/comments`, {
    params: { limit, offset },
  });

  return res.data?.data || res.data;
};

export const createComment = async (
  postId: string,
  data: CreateCommentData
): Promise<Comment> => {
  const res = await axiosInstance.post(`/posts/${postId}/comments`, data);
  return res.data?.data || res.data;
};

export const likeComment = async (postId: string, commentId: string) => {
  const res = await axiosInstance.post(
    `/posts/${postId}/comments/${commentId}/like`
  );
  return res.data;
};

export const unlikeComment = async (postId: string, commentId: string) => {
  const res = await axiosInstance.delete(
    `/posts/${postId}/comments/${commentId}/like`
  );
  return res.data;
};

export const updateComment = async (
  postId: string,
  commentId: string,
  content: string
): Promise<Comment> => {
  const res = await axiosInstance.patch(
    `/posts/${postId}/comments/${commentId}`,
    { content }
  );
  return res.data?.data || res.data;
};

export const deleteComment = async (postId: string, commentId: string) => {
  const res = await axiosInstance.delete(
    `/posts/${postId}/comments/${commentId}`
  );
  return res.data;
};

export const getCommentReplies = async (
  postId: string,
  commentId: string,
  limit = 10,
  offset = 0
): Promise<CommentResponse> => {
  const res = await axiosInstance.get(
    `/posts/${postId}/comments/${commentId}/replies`,
    {
      params: { limit, offset },
    }
  );

  return res.data?.data || res.data;
};

export const getSavedPosts = async (userId: string): Promise<Post[]> => {
  const res = await axiosInstance.get(`/posts/user/${userId}`, {
    params: { filter: "saved" },
  });

  let posts: any[] = [];

  if (res.data?.data?.posts && Array.isArray(res.data.data.posts)) {
    posts = res.data.data.posts;
  } else if (Array.isArray(res.data?.data)) {
    posts = res.data.data;
  } else if (Array.isArray(res.data)) {
    posts = res.data;
  } else {
    return [];
  }

  return posts
    .map((post) => ({
      ...post,
      user: post.user || post.userId || post.author,
      image:
        post.image && !post.image.startsWith("http")
          ? `${API_BASE}${post.image}`
          : post.image,
      video:
        post.video && !post.video.startsWith("http")
          ? `${API_BASE}${post.video}`
          : post.video,
    }))
    .filter((post) => post.user !== null);
};

export const getUserPosts = async (userId: string): Promise<Post[]> => {
  const res = await axiosInstance.get(`/posts/user/${userId}`);

  let posts: any[] = [];

  if (res.data?.data?.posts && Array.isArray(res.data.data.posts)) {
    posts = res.data.data.posts;
  } else if (Array.isArray(res.data?.data)) {
    posts = res.data.data;
  } else if (Array.isArray(res.data)) {
    posts = res.data;
  } else {
    return [];
  }

  return posts
    .map((post) => ({
      ...post,
      user: post.user || post.userId || post.author,
      image:
        post.image && !post.image.startsWith("http")
          ? `${API_BASE}${post.image}`
          : post.image,
      video:
        post.video && !post.video.startsWith("http")
          ? `${API_BASE}${post.video}`
          : post.video,
    }))
    .filter((post) => post.user !== null);
};
