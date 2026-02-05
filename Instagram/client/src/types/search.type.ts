import type { User } from "./user.type";

export interface SearchHistoryItem {
  _id: string;
  searchQuery?: string;
  searchedUser?: User;
  createdAt: string;
}

export interface AddSearchHistoryRequest {
  searchedUserId?: string;
  searchQuery?: string;
}

export interface SearchHistoryResponse {
  success: boolean;
  message: string;
  data: SearchHistoryItem[];
}

export interface AddSearchHistoryResponse {
  success: boolean;
  message: string;
  data: SearchHistoryItem;
}
