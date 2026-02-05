import React, { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Heart,
  Loader2,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  Check,
} from "lucide-react";
import { getAvatarUrl, getFallbackAvatarUrl } from "@/utils/avatar";
import {
  likeComment,
  unlikeComment,
  updateComment,
  deleteComment,
} from "@/apis/post.api";
import { useAuthStore } from "@/store/auth.store";
import type { Comment } from "@/types/comment.type";

interface CommentItemProps {
  comment: Comment;
  postId: string;
  onClose?: () => void;
  onReply?: (username: string, commentId: string) => void;
}

export default function CommentItem({
  comment,
  postId,
  onClose,
  onReply,
}: CommentItemProps): React.ReactElement | null {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();
  const commentUser = comment.userId;
  const menuRef = useRef<HTMLDivElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  const [isLiked, setIsLiked] = useState(comment.isLikedByCurrentUser || false);
  const [likesCount, setLikesCount] = useState(comment.likes || 0);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Check if current user owns this comment
  const isOwnComment = currentUser?._id === commentUser?._id;

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  // Focus input when editing
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  // Like comment mutation
  const likeMutation = useMutation({
    mutationFn: () =>
      isLiked
        ? unlikeComment(postId, comment._id)
        : likeComment(postId, comment._id),
    onMutate: () => {
      setIsLiked(!isLiked);
      setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));
    },
    onError: () => {
      setIsLiked(isLiked);
      setLikesCount((prev) => (isLiked ? prev + 1 : prev - 1));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-comments", postId] });
    },
  });

  if (!commentUser) return null;

  const commentAvatarUrl = getAvatarUrl(
    commentUser.profilePicture,
    commentUser.fullName || commentUser.username
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);

    if (diffMinutes < 1) return "Vừa xong";
    if (diffMinutes < 60) return `${diffMinutes} phút`;
    if (diffHours < 24) return `${diffHours} giờ`;
    if (diffDays < 7) return `${diffDays} ngày`;
    if (diffWeeks < 52) return `${diffWeeks} tuần`;

    return date.toLocaleDateString("vi-VN");
  };

  const handleLike = () => {
    likeMutation.mutate();
  };

  const handleReply = () => {
    onReply?.(commentUser.username, comment._id);
  };

  // Edit comment mutation
  const editMutation = useMutation({
    mutationFn: () => updateComment(postId, comment._id, editContent),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-comments", postId] });
      setIsEditing(false);
    },
  });

  // Delete comment mutation
  const deleteMutation = useMutation({
    mutationFn: () => deleteComment(postId, comment._id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-comments", postId] });
      setShowDeleteConfirm(false);
    },
  });

  const handleEdit = () => {
    if (editContent.trim() && editContent !== comment.content) {
      editMutation.mutate();
    } else {
      setIsEditing(false);
      setEditContent(comment.content);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent(comment.content);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  return (
    <>
      <div className="flex gap-3 group">
        <Link
          to={`/profile/${commentUser._id}`}
          onClick={onClose}
          className="shrink-0"
        >
          <img
            src={commentAvatarUrl}
            alt={commentUser.username}
            className="w-8 h-8 rounded-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = getFallbackAvatarUrl(
                commentUser.fullName || commentUser.username
              );
            }}
          />
        </Link>
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                ref={editInputRef}
                type="text"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-white text-sm border-b border-gray-600 focus:border-blue-500 outline-none py-1"
                disabled={editMutation.isPending}
              />
              <button
                onClick={handleEdit}
                disabled={editMutation.isPending || !editContent.trim()}
                className="text-green-500 hover:text-green-400 disabled:opacity-50"
              >
                {editMutation.isPending ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Check size={14} />
                )}
              </button>
              <button
                onClick={handleCancelEdit}
                disabled={editMutation.isPending}
                className="text-gray-500 hover:text-gray-300"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <p className="text-white text-sm break-words">
              <Link
                to={`/profile/${commentUser._id}`}
                onClick={onClose}
                className="font-semibold mr-2 hover:underline"
              >
                {commentUser.username}
              </Link>
              {comment.content}
            </p>
          )}
          <div className="flex items-center gap-3 mt-1 text-gray-500 text-xs">
            <span>{formatDate(comment.createdAt)}</span>
            {likesCount > 0 && (
              <span className="font-semibold">{likesCount} lượt thích</span>
            )}
            <button
              onClick={handleReply}
              className="font-semibold hover:text-gray-300"
            >
              Trả lời
            </button>
          </div>

          {/* Show replies count if any */}
          {comment.repliesCount && comment.repliesCount > 0 && (
            <button className="text-gray-500 text-xs font-semibold mt-3 hover:text-gray-300 flex items-center gap-3">
              <span className="w-6 h-px bg-gray-600"></span>
              Xem câu trả lời ({comment.repliesCount})
            </button>
          )}
        </div>

        {/* Actions: Like + More menu */}
        <div className="flex items-center gap-2 shrink-0 self-start mt-1">
          {/* More menu for own comments */}
          {isOwnComment && !isEditing && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal size={14} />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-5 bg-[#262626] rounded-lg shadow-lg py-1 z-10 min-w-[100px]">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-white hover:bg-[#363636] transition-colors"
                  >
                    <Pencil size={14} />
                    Sửa
                  </button>
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(true);
                      setShowMenu(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-[#363636] transition-colors"
                  >
                    <Trash2 size={14} />
                    Xóa
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Like button */}
          <button
            onClick={handleLike}
            disabled={likeMutation.isPending}
            className="text-gray-500 hover:text-white"
          >
            {likeMutation.isPending ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <Heart
                size={12}
                className={isLiked ? "text-red-500 fill-red-500" : ""}
              />
            )}
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#262626] rounded-xl w-full max-w-sm overflow-hidden">
            <div className="p-6 text-center">
              <h3 className="text-white font-semibold text-lg mb-2">
                Xóa bình luận?
              </h3>
              <p className="text-gray-400 text-sm">
                Bình luận này sẽ bị xóa vĩnh viễn.
              </p>
            </div>
            <div className="border-t border-gray-700">
              <button
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
                className="w-full py-3 text-red-500 font-semibold hover:bg-[#363636] transition-colors"
              >
                {deleteMutation.isPending ? (
                  <Loader2 size={16} className="animate-spin mx-auto" />
                ) : (
                  "Xóa"
                )}
              </button>
            </div>
            <div className="border-t border-gray-700">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteMutation.isPending}
                className="w-full py-3 text-white hover:bg-[#363636] transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
