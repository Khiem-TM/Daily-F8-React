interface PostLikesProps {
  likesCount: number;
  onLikesClick?: () => void;
}

export default function PostLikes({
  likesCount,
  onLikesClick,
}: PostLikesProps) {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  if (likesCount === 0) {
    return null;
  }

  return (
    <div className="px-3 pt-2">
      <button
        onClick={onLikesClick}
        className="text-sm font-semibold hover:text-gray-400 transition-colors"
      >
        {formatNumber(likesCount)} lượt thích
      </button>
    </div>
  );
}
