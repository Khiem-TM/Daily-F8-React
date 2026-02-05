import { axiosInstance } from "./axios";
import type {
  FollowResponse,
  FollowersResponse,
  FollowingResponse,
} from "@/types/follow.type";

export const followUser = async (userId: string): Promise<FollowResponse> => {
  const response = await axiosInstance.post<FollowResponse>(
    `/follow/${userId}/follow`
  );
  return response.data;
};

export const unfollowUser = async (userId: string): Promise<FollowResponse> => {
  const response = await axiosInstance.delete<FollowResponse>(
    `/follow/${userId}/follow`
  );
  return response.data;
};

export const getFollowers = async (
  userId: string,
  page: number = 1,
  limit: number = 20
): Promise<FollowersResponse> => {
  const response = await axiosInstance.get<FollowersResponse>(
    `/follow/${userId}/followers`,
    {
      params: { page, limit },
    }
  );
  return response.data;
};

export const getFollowing = async (
  userId: string,
  page: number = 1,
  limit: number = 20
): Promise<FollowingResponse> => {
  const response = await axiosInstance.get<FollowingResponse>(
    `/follow/${userId}/following`,
    {
      params: { page, limit },
    }
  );
  return response.data;
};
