import { useState, useRef, useEffect } from "react";
import { X, MessageCircle, Smile } from "lucide-react";
import { usePostComments, useCreateComment } from "../hooks/usePostComments";
import type { Post } from "@/types/post.type";
import { getAvatarUrl, getFallbackAvatarUrl } from "@/utils/avatar";
import { useAuthStore } from "@/store/auth.store";
import CommentItem from "@/features/posts/components/CommentItem";

interface CommentsModalProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
}

export default function CommentsModal({
  post,
  isOpen,
  onClose,
}: CommentsModalProps) {
  const [commentText, setCommentText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const currentUser = useAuthStore((state) => state.user);

  const { data: commentsData, isLoading } = usePostComments(post._id);
  const createCommentMutation = useCreateComment(post._id);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Focus input when modal opens
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      await createCommentMutation.mutateAsync({
        content: commentText.trim(),
      });
      setCommentText("");
    } catch (error) {
      console.error("Failed to create comment:", error);
    }
  };

  const handleReply = (username: string, _commentId: string) => {
    setCommentText(`@${username} `);
    inputRef.current?.focus();
  };

  return (
    <>
      {/* Right Side Modal - Fixed position */}
      <div className="fixed top-1/2 right-24 -translate-y-1/2 w-[340px] max-h-[70vh] bg-[#262626] rounded-xl z-50 flex flex-col shadow-2xl animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <h2 className="text-white font-semibold text-base">Bình luận</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto px-4 py-3 min-h-[200px] max-h-[calc(70vh-120px)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
            </div>
          ) : commentsData?.comments.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle size={48} className="mx-auto text-gray-500 mb-3" />
              <p className="text-gray-400 text-sm">Chưa có bình luận nào</p>
              <p className="text-gray-500 text-xs mt-1">
                Hãy là người đầu tiên bình luận
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {commentsData?.comments.map((comment) => (
                <CommentItem
                  key={comment._id}
                  comment={comment}
                  postId={post._id}
                  onClose={onClose}
                  onReply={handleReply}
                />
              ))}
            </div>
          )}
        </div>

        {/* Comment Input */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-white/10 px-4 py-3 flex items-center gap-3 bg-[#1a1a1a] rounded-b-xl"
        >
          <img
            src={getAvatarUrl(
              currentUser?.profilePicture,
              currentUser?.fullName || currentUser?.username || "User"
            )}
            alt="Your avatar"
            className="w-8 h-8 rounded-full shrink-0 object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = getFallbackAvatarUrl(
                currentUser?.fullName || currentUser?.username || "User"
              );
            }}
          />
          <div className="flex-1 flex items-center bg-[#3a3a3a] rounded-full px-4 py-2">
            <input
              ref={inputRef}
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Bình luận..."
              className="flex-1 bg-transparent text-white placeholder:text-gray-500 outline-none text-sm"
              disabled={createCommentMutation.isPending}
            />
            <button
              type="button"
              className="text-gray-400 hover:text-gray-300 transition-colors ml-2"
            >
              <Smile size={18} />
            </button>
          </div>
        </form>
      </div>

      {/* Backdrop - Click to close */}
      <div className="fixed inset-0 z-40" onClick={onClose} />
    </>
  );
}
