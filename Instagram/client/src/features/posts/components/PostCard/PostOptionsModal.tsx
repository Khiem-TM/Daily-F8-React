interface PostOptionsModalProps {
  postId: string;
  isOwnPost: boolean;
  onClose: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
}

export default function PostOptionsModal({
  postId,
  isOwnPost,
  onClose,
  onDelete,
  onEdit,
}: PostOptionsModalProps) {
  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
    onClose();
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    }
    onClose();
  };

  const handleReport = () => {
    // TODO: Implement report functionality
    alert("Báo cáo bài viết");
    onClose();
  };

  const handleCopyLink = () => {
    // Copy post link to clipboard
    const postUrl = `${window.location.origin}/p/${postId}`;
    navigator.clipboard.writeText(postUrl);
    alert("Đã sao chép liên kết");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[#262626] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {isOwnPost ? (
          <>
            <button
              onClick={handleDelete}
              className="w-full py-3 px-4 text-sm font-bold text-red-500 hover:bg-white/5 transition-colors border-b border-gray-700"
            >
              Xóa
            </button>
            <button
              onClick={handleEdit}
              className="w-full py-3 px-4 text-sm hover:bg-white/5 transition-colors border-b border-gray-700"
            >
              Chỉnh sửa
            </button>
            <button
              onClick={handleCopyLink}
              className="w-full py-3 px-4 text-sm hover:bg-white/5 transition-colors border-b border-gray-700"
            >
              Sao chép liên kết
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 px-4 text-sm hover:bg-white/5 transition-colors"
            >
              Hủy
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleReport}
              className="w-full py-3 px-4 text-sm font-bold text-red-500 hover:bg-white/5 transition-colors border-b border-gray-700"
            >
              Báo cáo
            </button>
            <button className="w-full py-3 px-4 text-sm hover:bg-white/5 transition-colors border-b border-gray-700">
              Bỏ theo dõi
            </button>
            <button
              onClick={handleCopyLink}
              className="w-full py-3 px-4 text-sm hover:bg-white/5 transition-colors border-b border-gray-700"
            >
              Sao chép liên kết
            </button>
            <button className="w-full py-3 px-4 text-sm hover:bg-white/5 transition-colors border-b border-gray-700">
              Nhúng
            </button>
            <button className="w-full py-3 px-4 text-sm hover:bg-white/5 transition-colors border-b border-gray-700">
              Giới thiệu về tài khoản này
            </button>
            <button
              onClick={onClose}
              className="w-full py-3 px-4 text-sm hover:bg-white/5 transition-colors"
            >
              Hủy
            </button>
          </>
        )}
      </div>
    </div>
  );
}
