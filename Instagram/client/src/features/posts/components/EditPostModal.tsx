import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Loader2 } from "lucide-react";
import { updatePost } from "@/apis/post.api";
import { toast } from "sonner";

interface EditPostModalProps {
  postId: string;
  currentCaption: string;
  onClose: () => void;
}

export default function EditPostModal({
  postId,
  currentCaption,
  onClose,
}: EditPostModalProps) {
  const [caption, setCaption] = useState(currentCaption);
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: () => updatePost(postId, caption),
    onSuccess: () => {
      toast.success("Đã cập nhật bài viết");
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["feed-posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["user-posts"] });
      queryClient.invalidateQueries({ queryKey: ["explore-posts"] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Không thể cập nhật bài viết"
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate();
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#262626] rounded-xl w-full max-w-lg overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <button
            onClick={onClose}
            className="text-white hover:opacity-70 transition-opacity"
          >
            <X size={24} />
          </button>
          <h2 className="text-white font-semibold">Chỉnh sửa bài viết</h2>
          <button
            onClick={handleSubmit}
            disabled={updateMutation.isPending || caption === currentCaption}
            className="text-blue-500 font-semibold hover:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateMutation.isPending ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Xong"
            )}
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4">
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Viết chú thích..."
            className="w-full h-40 bg-transparent text-white resize-none outline-none placeholder:text-gray-500"
            autoFocus
          />
          <div className="flex justify-between items-center text-gray-500 text-sm mt-2">
            <span>{caption.length}/2,200</span>
          </div>
        </form>
      </div>
    </div>
  );
}
