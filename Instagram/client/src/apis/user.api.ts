import { axiosInstance } from "./axios";
import type { User } from "@/types/user.type";

// Lấy danh sách User gợi ý - với giới hạn sl = 5
export const getSuggestedUsers = async (limit: number = 5): Promise<User[]> => {
  try {
    const res = await axiosInstance.get(`/users/suggested?limit=${limit}`);

    if (res.data?.data && Array.isArray(res.data.data)) {
      return res.data.data;
    } else if (Array.isArray(res.data)) {
      return res.data;
    }

    console.error("Invalid suggested users:", res.data);
    return [];
  } catch (error) {
    console.error("Failed :", error);
    return [];
  }
};

export const getUserProfileByUsername = async (
  username: string
): Promise<User | null> => {
  try {
    const searchRes = await axiosInstance.get("/users/search", {
      params: { q: username },
    });

    const users = searchRes.data?.data || searchRes.data || [];

    const user = users.find((u: User) => u.username === username);

    if (!user) {
      console.error(`"${username}" not found`);
      return null;
    }

    const profileRes = await axiosInstance.get(`/users/${user._id}`);
    return profileRes.data?.data || profileRes.data || null;
  } catch (error) {
    console.error(`Failed to fetch ${username}:`, error);
    return null;
  }
};

export const getUserProfile = async (
  usernameOrId: string
): Promise<User | null> => {
  try {
    const res = await axiosInstance.get(`/users/${usernameOrId}`);
    return res.data?.data || res.data || null;
  } catch (error) {
    console.error(`Failed to fetch ${usernameOrId}:`, error);
    return null;
  }
};

export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const res = await axiosInstance.get(`/users/${userId}`);
    return res.data?.data || res.data || null;
  } catch (error) {
    console.error(`Failed to fetch id ${userId}:`, error);
    return null;
  }
};

export const followUser = async (userId: string) => {
  const res = await axiosInstance.post(`/follow/${userId}/follow`);
  return res.data;
};

export const unfollowUser = async (userId: string) => {
  const res = await axiosInstance.delete(`/follow/${userId}/follow`);
  return res.data;
};

export const getUserFollowers = async (
  userId: string,
  page: number = 1,
  limit: number = 20
): Promise<{ followers: User[]; pagination: any }> => {
  try {
    const res = await axiosInstance.get(
      `/follow/${userId}/followers?page=${page}&limit=${limit}`
    );
    return res.data?.data || { followers: [], pagination: {} };
  } catch (error) {
    console.error("Failed to fetch followers:", error);
    return { followers: [], pagination: {} };
  }
};

export const getUserFollowing = async (
  userId: string,
  page: number = 1,
  limit: number = 20
): Promise<{ following: User[]; pagination: any }> => {
  try {
    const res = await axiosInstance.get(
      `/follow/${userId}/following?page=${page}&limit=${limit}`
    );
    return res.data?.data || { following: [], pagination: {} };
  } catch (error) {
    console.error("Failed to fetch following:", error);
    return { following: [], pagination: {} };
  }
};

export const getCurrentUserProfile = async (): Promise<User> => {
  const res = await axiosInstance.get("/users/profile");
  return res.data?.data || res.data;
};

export const updateUserProfile = async (data: FormData): Promise<User> => {
  const res = await axiosInstance.patch("/users/profile", data);
  return res.data?.data || res.data;
};

export const deleteProfilePicture = async () => {
  const res = await axiosInstance.delete("/users/profile/picture");
  return res.data;
};

export const searchUsers = async (query: string): Promise<User[]> => {
  if (!query.trim()) return [];

  try {
    const res = await axiosInstance.get("/users/search", {
      params: { q: query },
    });
    return res.data?.data || res.data || [];
  } catch (error) {
    console.error("Failed:", error);
    return [];
  }
};
