import { Link } from "react-router-dom";

interface PostCommentsProps {
  postId: string;
  commentsCount: number;
  onCommentClick?: () => void;
}

export default function PostComments({
  postId,
  commentsCount,
  onCommentClick,
}: PostCommentsProps) {
  if (commentsCount === 0) return null;

  const handleClick = (e: React.MouseEvent) => {
    if (onCommentClick) {
      e.preventDefault();
      onCommentClick();
    }
  };

  return (
    <div className="px-3 pt-1">
      <Link
        to={`/post/${postId}`}
        onClick={handleClick}
        className="text-sm text-gray-500 hover:text-gray-400 transition-colors"
      >
        Xem tất cả {commentsCount} bình luận
      </Link>
    </div>
  );
}
