import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  X,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Smile,
} from "lucide-react";
import {
  getPostById,
  getPostComments,
  createComment,
  likePost,
  unlikePost,
  savePost,
  unsavePost,
} from "@/apis/post.api";
import { getAvatarUrl, getFallbackAvatarUrl } from "@/utils/avatar";
import { getMediaUrl } from "@/utils/media";
import { useAuthStore } from "@/store/auth.store";
import { useEnrichedUser } from "@/hooks/useUserCache";
import type { Comment } from "@/types/comment.type";
import CommentItem from "@/features/posts/components/CommentItem";

interface PostDetailModalProps {
  postId: string;
  onClose: () => void;
}

export default function PostDetailModal({
  postId,
  onClose,
}: PostDetailModalProps) {
  const queryClient = useQueryClient();
  useAuthStore(); // Keep for potential future use
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [replyingTo, setReplyingTo] = useState<{
    username: string;
    commentId: string;
  } | null>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);

  // Fetch post data
  const { data: post, isLoading: isPostLoading } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPostById(postId),
  });

  // Enrich user data with profilePicture if missing
  const enrichedUser = useEnrichedUser(post?.user) || post?.user;

  // Fetch comments
  const { data: commentsData, isLoading: isCommentsLoading } = useQuery({
    queryKey: ["post-comments", postId],
    queryFn: () => getPostComments(postId, 50, 0),
  });

  // Initialize state when post loads
  useEffect(() => {
    if (post) {
      // API returns isLiked/isSaved (not isLikedByCurrentUser)
      setIsLiked(post.isLiked ?? post.isLikedByCurrentUser ?? false);
      setIsSaved(post.isSaved ?? post.isSavedByCurrentUser ?? false);
      setLikesCount(post.likesCount || post.likes || 0);
    }
  }, [post]);

  // Like mutations - separate to avoid closure issues
  const doLikeMutation = useMutation({
    mutationFn: () => likePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["feed-posts"] });
      queryClient.invalidateQueries({ queryKey: ["post-like-status", postId] });
    },
  });

  const doUnlikeMutation = useMutation({
    mutationFn: () => unlikePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["feed-posts"] });
      queryClient.invalidateQueries({ queryKey: ["post-like-status", postId] });
    },
  });

  // Save mutation - separate save/unsave to avoid closure issues
  const doSaveMutation = useMutation({
    mutationFn: () => savePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["feed-posts"] });
    },
  });

  const doUnsaveMutation = useMutation({
    mutationFn: () => unsavePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["saved-posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["feed-posts"] });
    },
  });

  // Comment mutation
  const commentMutation = useMutation({
    mutationFn: (content: string) =>
      createComment(postId, {
        content,
        parentCommentId: replyingTo?.commentId || null,
      }),
    onSuccess: () => {
      setCommentText("");
      setReplyingTo(null);
      queryClient.invalidateQueries({ queryKey: ["post-comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });

  const comments: Comment[] = commentsData?.comments || [];
  // Use enriched user with profilePicture from cache
  const postUser = enrichedUser || post?.user || post?.userId;

  // Get media array
  const getMediaArray = () => {
    if (post?.media && post.media.length > 0) {
      return post.media;
    }
    if (post?.image) {
      return [{ url: post.image, type: "image" as const }];
    }
    if (post?.video) {
      return [{ url: post.video, type: "video" as const }];
    }
    return [];
  };

  const mediaArray = getMediaArray();
  const hasMultipleMedia = mediaArray.length > 1;

  const handleLike = () => {
    // Optimistic update
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikesCount((prev) => (newIsLiked ? prev + 1 : prev - 1));
    // Call correct API based on NEW state
    if (newIsLiked) {
      doLikeMutation.mutate();
    } else {
      doUnlikeMutation.mutate();
    }
  };

  const handleSave = () => {
    // Optimistic update
    const newIsSaved = !isSaved;
    setIsSaved(newIsSaved);
    // Call correct API based on NEW state
    if (newIsSaved) {
      doSaveMutation.mutate();
    } else {
      doUnsaveMutation.mutate();
    }
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      commentMutation.mutate(commentText.trim());
    }
  };

  const handleReply = (username: string, commentId: string) => {
    setReplyingTo({ username, commentId });
    setCommentText(`@${username} `);
    commentInputRef.current?.focus();
  };

  const cancelReply = () => {
    setReplyingTo(null);
    setCommentText("");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Hôm nay";
    if (diffDays === 1) return "Hôm qua";
    if (diffDays < 7) return `${diffDays} ngày trước`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần`;

    return date.toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (isPostLoading) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <Loader2 className="animate-spin text-white" size={48} />
      </div>
    );
  }

  if (!post || !postUser) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <div className="text-white text-center">
          <p className="text-xl">Không tìm thấy bài viết</p>
          <button
            onClick={onClose}
            className="mt-4 px-6 py-2 bg-white text-black rounded-lg"
          >
            Đóng
          </button>
        </div>
      </div>
    );
  }

  const userAvatarUrl = getAvatarUrl(
    postUser.profilePicture,
    postUser.fullName || postUser.username
  );

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:opacity-70 z-50"
      >
        <X size={28} />
      </button>

      {/* Modal container - 50/50 layout, taller height */}
      <div
        className="flex bg-black w-[calc(100vw-80px)] max-w-7xl h-[calc(100vh-80px)] max-h-[900px] rounded-md overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left side - Media (50%) */}
        <div className="relative w-1/2 bg-black flex items-center justify-center">
          {mediaArray.length > 0 ? (
            <>
              {mediaArray[currentMediaIndex].type === "video" ? (
                <video
                  src={getMediaUrl(mediaArray[currentMediaIndex].url)}
                  className="w-full h-full object-contain"
                  controls
                  autoPlay
                  muted
                />
              ) : (
                <img
                  src={getMediaUrl(mediaArray[currentMediaIndex].url)}
                  alt="Post"
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.dataset.error) {
                      target.dataset.error = "true";
                      target.src =
                        "https://placehold.co/600x600/1a1a1a/666?text=Image+Not+Found";
                    }
                  }}
                />
              )}

              {/* Navigation arrows */}
              {hasMultipleMedia && (
                <>
                  {currentMediaIndex > 0 && (
                    <button
                      onClick={() => setCurrentMediaIndex((prev) => prev - 1)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white"
                    >
                      <ChevronLeft size={20} className="text-black" />
                    </button>
                  )}
                  {currentMediaIndex < mediaArray.length - 1 && (
                    <button
                      onClick={() => setCurrentMediaIndex((prev) => prev + 1)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center hover:bg-white"
                    >
                      <ChevronRight size={20} className="text-black" />
                    </button>
                  )}

                  {/* Dots indicator */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                    {mediaArray.map((_, index) => (
                      <div
                        key={index}
                        className={`w-1.5 h-1.5 rounded-full transition-colors ${
                          index === currentMediaIndex
                            ? "bg-blue-500"
                            : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
              <p className="text-gray-500">Không có media</p>
            </div>
          )}
        </div>

        {/* Right side - Details (50%) */}
        <div className="w-1/2 flex flex-col bg-black border-l border-gray-800">
          {/* Header */}
          <div className="flex items-center gap-3 p-3 border-b border-gray-800">
            <Link
              to={`/profile/${postUser._id}`}
              onClick={onClose}
              className="shrink-0"
            >
              <img
                src={userAvatarUrl}
                alt={postUser.username}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-pink-500 ring-offset-2 ring-offset-black"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = getFallbackAvatarUrl(
                    postUser.fullName || postUser.username
                  );
                }}
              />
            </Link>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <Link
                  to={`/profile/${postUser._id}`}
                  onClick={onClose}
                  className="font-semibold text-white text-sm hover:underline"
                >
                  {postUser.username}
                </Link>
              </div>
            </div>
            <button className="text-white hover:opacity-70 p-1">
              <MoreHorizontal size={24} />
            </button>
          </div>

          {/* Comments section */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Caption */}
            {post.caption && (
              <div className="flex gap-3">
                <Link
                  to={`/profile/${postUser._id}`}
                  onClick={onClose}
                  className="shrink-0"
                >
                  <img
                    src={userAvatarUrl}
                    alt={postUser.username}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = getFallbackAvatarUrl(
                        postUser.fullName || postUser.username
                      );
                    }}
                  />
                </Link>
                <div className="flex-1">
                  <p className="text-white text-sm">
                    <Link
                      to={`/profile/${postUser._id}`}
                      onClick={onClose}
                      className="font-semibold mr-2 hover:underline"
                    >
                      {postUser.username}
                    </Link>
                    {post.caption}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {formatDate(post.createdAt)}
                  </p>
                </div>
              </div>
            )}

            {/* Comments */}
            {isCommentsLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="animate-spin text-gray-500" size={24} />
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-white text-xl font-semibold">
                  Chưa có bình luận nào.
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Bắt đầu trò chuyện.
                </p>
              </div>
            ) : (
              comments.map((comment) => (
                <CommentItem
                  key={comment._id}
                  comment={comment}
                  postId={postId}
                  onClose={onClose}
                  onReply={handleReply}
                />
              ))
            )}
          </div>

          {/* Actions */}
          <div className="border-t border-gray-800 px-4 py-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className="hover:opacity-70 transition-transform active:scale-110"
                >
                  <Heart
                    size={24}
                    className={
                      isLiked ? "text-red-500 fill-red-500" : "text-white"
                    }
                  />
                </button>
                <button
                  onClick={() => commentInputRef.current?.focus()}
                  className="hover:opacity-70"
                >
                  <MessageCircle size={24} className="text-white" />
                </button>
                <button className="hover:opacity-70">
                  <Send size={24} className="text-white" />
                </button>
              </div>
              <button
                onClick={handleSave}
                className="hover:opacity-70 transition-transform active:scale-110"
              >
                <Bookmark
                  size={24}
                  className={isSaved ? "text-white fill-white" : "text-white"}
                />
              </button>
            </div>

            {/* Likes count */}
            <p className="text-white text-sm font-semibold">
              {likesCount.toLocaleString()} lượt thích
            </p>

            {/* Date */}
            <p className="text-gray-500 text-[10px] uppercase mt-1">
              {formatDate(post.createdAt)}
            </p>
          </div>

          {/* Comment input */}
          <div className="border-t border-gray-800">
            {/* Reply indicator */}
            {replyingTo && (
              <div className="flex items-center justify-between px-4 py-2 bg-gray-900/50 text-sm">
                <span className="text-gray-400">
                  Đang trả lời{" "}
                  <span className="text-white font-semibold">
                    @{replyingTo.username}
                  </span>
                </span>
                <button
                  onClick={cancelReply}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
            )}
            <form
              onSubmit={handleComment}
              className="flex items-center gap-3 px-4 py-3"
            >
              <button type="button" className="text-white hover:opacity-70">
                <Smile size={24} />
              </button>
              <input
                ref={commentInputRef}
                type="text"
                placeholder="Bình luận..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 bg-transparent text-white text-sm placeholder-gray-500 outline-none"
              />
              <button
                type="submit"
                disabled={!commentText.trim() || commentMutation.isPending}
                className="text-blue-500 font-semibold text-sm disabled:opacity-30 hover:text-white disabled:hover:text-blue-500"
              >
                {commentMutation.isPending ? "..." : "Đăng"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
