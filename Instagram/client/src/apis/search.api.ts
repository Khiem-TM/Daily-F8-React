import { axiosInstance } from "./axios";
import type {
  SearchHistoryResponse,
  AddSearchHistoryRequest,
  AddSearchHistoryResponse,
} from "@/types/search.type";

const isValidMongoId = (id: string): boolean => {
  return /^[a-fA-F0-9]{24}$/.test(id);
};

export const addSearchHistory = async (
  data: AddSearchHistoryRequest
): Promise<AddSearchHistoryResponse> => {
  if (!data.searchedUserId && !data.searchQuery?.trim()) {
    throw new Error("Either searchedUserId or searchQuery is required");
  }

  if (data.searchedUserId && !isValidMongoId(data.searchedUserId)) {
    throw new Error("Invalid user ID format");
  }

  const requestBody: { searchedUserId?: string; searchQuery?: string } = {};

  if (data.searchedUserId) {
    requestBody.searchedUserId = data.searchedUserId;
  }

  if (data.searchQuery?.trim()) {
    requestBody.searchQuery = data.searchQuery.trim();
  }

  const response = await axiosInstance.post<AddSearchHistoryResponse>(
    "/search-history",
    requestBody
  );
  return response.data;
};

export const getSearchHistory = async (
  limit: number = 20
): Promise<SearchHistoryResponse> => {
  const response = await axiosInstance.get<SearchHistoryResponse>(
    "/search-history",
    {
      params: { limit },
    }
  );
  return response.data;
};

export const deleteSearchHistoryItem = async (
  historyId: string
): Promise<{ success: boolean; message: string }> => {
  const response = await axiosInstance.delete(`/search-history/${historyId}`);
  return response.data;
};

export const clearAllSearchHistory = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  const response = await axiosInstance.delete("/search-history");
  return response.data;
};
