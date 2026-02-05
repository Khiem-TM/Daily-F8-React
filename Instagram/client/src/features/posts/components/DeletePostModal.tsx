import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { deletePost } from "@/apis/post.api";
import { toast } from "sonner";

interface DeletePostModalProps {
  postId: string;
  onClose: () => void;
  onDeleted?: () => void;
}

export default function DeletePostModal({
  postId,
  onClose,
  onDeleted,
}: DeletePostModalProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => deletePost(postId),
    onSuccess: () => {
      toast.success("Đã xóa bài viết");
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["feed-posts"] });
      queryClient.invalidateQueries({ queryKey: ["user-posts"] });
      queryClient.invalidateQueries({ queryKey: ["explore-posts"] });
      queryClient.removeQueries({ queryKey: ["post", postId] });
      onClose();
      onDeleted?.();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Không thể xóa bài viết");
    },
  });

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#262626] rounded-xl w-full max-w-sm overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 text-center border-b border-gray-700">
          <h2 className="text-white font-semibold text-xl mb-2">
            Xóa bài viết?
          </h2>
          <p className="text-gray-400 text-sm">
            Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không
            thể hoàn tác.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col">
          <button
            onClick={() => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
            className="w-full py-3 px-4 text-sm font-bold text-red-500 hover:bg-white/5 transition-colors border-b border-gray-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {deleteMutation.isPending ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Đang xóa...
              </>
            ) : (
              "Xóa"
            )}
          </button>
          <button
            onClick={onClose}
            disabled={deleteMutation.isPending}
            className="w-full py-3 px-4 text-sm hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
}
