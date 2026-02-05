import { axiosInstance } from "./axios";
import type { Post } from "@/types/post.type";

interface ExploreResponse {
  posts: Post[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalPosts: number;
    hasMore: boolean;
  };
}

// Config các API về explore
export const getExplorePosts = async (
  page: number = 1,
  limit: number = 20
): Promise<ExploreResponse> => {
  try {
    const res = await axiosInstance.get("/posts/explore", {
      params: { page, limit },
    });

    const data = res.data?.data || res.data;

    const posts = (data.posts || []).map((post: any) => ({
      ...post,
      user: post.user || post.userId || post.author,
      image:
        post.image && !post.image.startsWith("http")
          ? `https://instagram.f8team.dev${post.image}`
          : post.image,
      video:
        post.video && !post.video.startsWith("http")
          ? `https://instagram.f8team.dev${post.video}`
          : post.video,
    }));

    return {
      posts,
      pagination: data.pagination || {
        currentPage: page,
        totalPages: 1,
        totalPosts: posts.length,
        hasMore: false,
      },
    };
  } catch (error) {
    console.error("Failed to fetch explore posts:", error);
    return {
      posts: [],
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalPosts: 0,
        hasMore: false,
      },
    };
  }
};
