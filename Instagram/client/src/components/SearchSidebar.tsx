import { useState, useEffect } from "react";
import { X, Search, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { searchUsers } from "@/apis/user.api";
import {
  getSearchHistory,
  addSearchHistory,
  deleteSearchHistoryItem,
  clearAllSearchHistory,
} from "@/apis/search.api";
import { useDebounce } from "@/hooks/useDebounce.ts";
import { Link, useNavigate } from "react-router-dom";
import { getAvatarUrl, getFallbackAvatarUrl } from "@/utils/avatar";
import { toast } from "sonner";
import type { SearchHistoryItem } from "@/types/search.type";

interface SearchSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchSidebar({ isOpen, onClose }: SearchSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 500);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Get search history
  const { data: searchHistoryData } = useQuery({
    queryKey: ["search-history"],
    queryFn: async () => {
      console.log("📋 Fetching search history...");
      const result = await getSearchHistory(20);
      console.log("📋 Search history loaded:", result);
      return result;
    },
    enabled: isOpen,
  });

  const searchHistory = searchHistoryData?.data || [];

  console.log("🔍 Current search history items:", searchHistory.length);

  // Search users
  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["search-users", debouncedQuery],
    queryFn: () => searchUsers(debouncedQuery),
    enabled: debouncedQuery.length > 0,
  });

  // Add to search history
  const addHistoryMutation = useMutation({
    mutationFn: addSearchHistory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["search-history"] });
    },
    onError: (error: any) => {
      console.error("Failed to save search history:", error);
    },
  });

  // Delete single history item
  const deleteHistoryMutation = useMutation({
    mutationFn: deleteSearchHistoryItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["search-history"] });
      toast.success("Đã xóa khỏi lịch sử tìm kiếm");
    },
    onError: (error: any) => {
      toast.error("Không thể xóa lịch sử tìm kiếm");
      console.error("Failed to delete search history:", error);
    },
  });

  // Clear all history
  const clearHistoryMutation = useMutation({
    mutationFn: clearAllSearchHistory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["search-history"] });
      toast.success("Đã xóa toàn bộ lịch sử tìm kiếm");
    },
    onError: (error: any) => {
      toast.error("Không thể xóa lịch sử tìm kiếm");
      console.error("Failed to clear search history:", error);
    },
  });

  // Handle user click - save to history and navigate
  const handleUserClick = async (userId: string, e: React.MouseEvent) => {
    // Prevent default navigation to handle it manually after saving
    e.preventDefault();

    console.log(
      "🔍 Saving user to search history:",
      userId,
      "with query:",
      searchQuery
    );

    // Build request data - only include fields that have values
    const requestData: { searchedUserId: string; searchQuery?: string } = {
      searchedUserId: userId,
    };

    // Only add searchQuery if it has a non-empty value
    if (searchQuery.trim()) {
      requestData.searchQuery = searchQuery.trim();
    }

    try {
      // Save to history first
      await addHistoryMutation.mutateAsync(requestData);
      console.log("✅ Search history saved successfully");
    } catch (error: any) {
      // Log detailed error but don't block navigation
      console.error("❌ Failed to save to search history:", {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
        requestData,
      });
    }
    // Close sidebar and navigate regardless of save success
    onClose();
    navigate(`/profile/${userId}`);
  };

  // Clear search when closing
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Sidebar - No backdrop, wider width */}
      <div className="fixed left-0 top-0 h-screen w-120 bg-black border-r border-gray-800 z-50 flex flex-col animate-slide-in-left shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-white text-2xl font-semibold">Tìm kiếm</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={20}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                // Save search query to history when Enter is pressed
                if (e.key === "Enter" && searchQuery.trim()) {
                  addHistoryMutation.mutate({
                    searchQuery: searchQuery.trim(),
                  });
                }
              }}
              placeholder="Tìm kiếm"
              className="w-full bg-[#262626] text-white pl-10 pr-4 py-3 rounded-lg outline-none placeholder:text-gray-500 focus:bg-[#363636] transition-colors"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto">
          {!searchQuery ? (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Gần đây</h3>
                {searchHistory.length > 0 && (
                  <button
                    onClick={() => clearHistoryMutation.mutate()}
                    className="text-blue-500 text-sm font-semibold hover:text-blue-400"
                  >
                    Xóa tất cả
                  </button>
                )}
              </div>

              {searchHistory.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-8">
                  Không có tìm kiếm gần đây
                </p>
              ) : (
                <div className="space-y-1">
                  {searchHistory.map((item: SearchHistoryItem) => {
                    const user = item.searchedUser;
                    const query = item.searchQuery;

                    // Render user item
                    if (user) {
                      const avatarUrl = getAvatarUrl(
                        user.profilePicture,
                        user.fullName || user.username
                      );

                      return (
                        <div
                          key={item._id}
                          className="flex items-center gap-3 px-2 py-2 hover:bg-white/5 rounded-lg transition-colors group"
                        >
                          <Link
                            to={`/profile/${user._id}`}
                            onClick={onClose}
                            className="flex items-center gap-3 flex-1"
                          >
                            <img
                              src={avatarUrl}
                              alt={user.username}
                              className="w-11 h-11 rounded-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = getFallbackAvatarUrl(
                                  user.fullName || user.username
                                );
                              }}
                            />
                            <div className="flex-1 text-left">
                              <p className="text-white font-semibold text-sm">
                                {user.username}
                              </p>
                              <p className="text-gray-400 text-sm">
                                {user.fullName}
                              </p>
                            </div>
                          </Link>
                          <button
                            onClick={() =>
                              deleteHistoryMutation.mutate(item._id)
                            }
                            className="text-gray-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      );
                    }

                    // Render search query item
                    if (query) {
                      return (
                        <div
                          key={item._id}
                          className="flex items-center gap-3 px-2 py-2 hover:bg-white/5 rounded-lg transition-colors group"
                        >
                          <button
                            onClick={() => {
                              setSearchQuery(query);
                            }}
                            className="flex items-center gap-3 flex-1"
                          >
                            {/* Search icon in gray circle */}
                            <div className="w-11 h-11 rounded-full bg-[#363636] flex items-center justify-center flex-shrink-0">
                              <Search size={18} className="text-white" />
                            </div>
                            <p className="text-white text-sm text-left">
                              {query}
                            </p>
                          </button>
                          <button
                            onClick={() =>
                              deleteHistoryMutation.mutate(item._id)
                            }
                            className="text-gray-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      );
                    }

                    return null;
                  })}
                </div>
              )}
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin text-gray-500" size={32} />
            </div>
          ) : searchResults && searchResults.length > 0 ? (
            <div className="py-2">
              {searchResults.map((user: any) => {
                const avatarUrl = getAvatarUrl(
                  user.profilePicture,
                  user.fullName || user.username
                );

                return (
                  <Link
                    key={user._id}
                    to={`/profile/${user._id}`}
                    onClick={(e) => handleUserClick(user._id, e)}
                    className="w-full flex items-center gap-3 px-6 py-2 hover:bg-white/5 transition-colors"
                  >
                    <img
                      src={avatarUrl}
                      alt={user.username}
                      className="w-11 h-11 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = getFallbackAvatarUrl(
                          user.fullName || user.username
                        );
                      }}
                    />
                    <div className="flex-1 text-left">
                      <p className="text-white font-semibold text-sm">
                        {user.username}
                      </p>
                      <p className="text-gray-400 text-sm">{user.fullName}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="p-6">
              <p className="text-gray-500 text-sm text-center py-8">
                Không tìm thấy kết quả nào
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
