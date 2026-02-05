import { useState } from "react";
import { Link } from "react-router-dom";

interface PostCaptionProps {
  userId: string;
  username: string;
  caption: string;
  maxLength?: number;
}

export default function PostCaption({
  userId,
  username,
  caption,
  maxLength = 100,
}: PostCaptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = caption.length > maxLength;

  return (
    <div className="px-3 pt-1">
      <p className="text-sm">
        <Link
          to={`/profile/${userId}`}
          className="font-semibold hover:text-gray-400 transition-colors mr-2"
        >
          {username}
        </Link>
        {shouldTruncate && !isExpanded ? (
          <>
            {caption.slice(0, maxLength)}...{" "}
            <button
              onClick={() => setIsExpanded(true)}
              className="text-gray-500 hover:text-gray-400"
            >
              xem thêm
            </button>
          </>
        ) : (
          caption
        )}
      </p>
    </div>
  );
}
