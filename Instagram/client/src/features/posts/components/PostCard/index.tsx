import { useState, useEffect } from "react";
import type { Post } from "@/types/post.type";
import { usePostLike } from "../../hooks/usePostLike";
import { usePostSave } from "../../hooks/usePostSave";
import { useLikeStatus } from "../../hooks/useLikeStatus";
import { useAuthStore } from "@/store/auth.store";
import PostHeader from "./PostHeader";
import PostMedia from "./PostMedia";
import PostActions from "./PostActions";
import PostCaption from "./PostCaption";
import PostDetailModal from "@/features/profile/components/PostDetailModal";
import LikesModal from "./LikesModal";
import EditPostModal from "../EditPostModal";
import DeletePostModal from "../DeletePostModal";

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const hasLikeStatus =
    post.isLiked !== undefined || post.isLikedByCurrentUser !== undefined;

  const {
    isLiked: apiIsLiked,
    isSaved: apiIsSaved,
    likes: apiLikes,
    isLoading: isLoadingStatus,
  } = useLikeStatus(hasLikeStatus ? "" : post._id);

  const [isLiked, setIsLiked] = useState(
    post.isLiked ?? post.isLikedByCurrentUser ?? false
  );
  const [isSaved, setIsSaved] = useState(
    post.isSaved ?? post.isSavedByCurrentUser ?? false
  );
  const [likesCount, setLikesCount] = useState(post.likes);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!hasLikeStatus && !isLoadingStatus) {
      setIsLiked(apiIsLiked);
      setIsSaved(apiIsSaved);
      if (apiLikes > 0) {
        setLikesCount(apiLikes);
      }
    }
  }, [hasLikeStatus, apiIsLiked, apiIsSaved, apiLikes, isLoadingStatus]);

  const currentUser = useAuthStore((state) => state.user);
  const { like, unlike } = usePostLike(post._id);
  const { save, unsave } = usePostSave(post._id);

  if (!post.user) {
    return null;
  }

  const isOwnPost = currentUser?._id === post.user._id;

  const handleLike = () => {
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setLikesCount((prev) => (newIsLiked ? prev + 1 : prev - 1));

    // Call correct API based on NEW state
    if (newIsLiked) {
      like();
    } else {
      unlike();
    }
  };

  const handleDoubleClick = () => {
    if (!isLiked) {
      setIsLiked(true);
      setLikesCount((prev) => prev + 1);
      like();
    }
  };

  const handleComment = () => {
    setShowDetailModal(true);
  };

  const handleSave = () => {
    // Optimistic update
    const newIsSaved = !isSaved;
    setIsSaved(newIsSaved);
    // Call correct API based on NEW state
    if (newIsSaved) {
      save();
    } else {
      unsave();
    }
  };

  return (
    <article className="bg-black mb-6">
      <PostHeader
        author={post.user}
        createdAt={post.createdAt}
        postId={post._id}
        isOwnPost={isOwnPost}
        onEdit={() => setShowEditModal(true)}
        onDelete={() => setShowDeleteModal(true)}
      />

      <PostMedia
        imageUrl={post.image}
        video={post.video}
        caption={post.caption}
        onDoubleClick={handleDoubleClick}
      />

      <PostActions
        isLiked={isLiked}
        isSaved={isSaved}
        onLike={handleLike}
        onComment={handleComment}
        onSave={handleSave}
        likesCount={likesCount}
        onLikesClick={() => setShowLikesModal(true)}
      />

      <PostCaption
        userId={post.user._id}
        username={post.user.username}
        caption={post.caption}
      />

      {/* Post Detail Modal */}
      {showDetailModal && (
        <PostDetailModal
          postId={post._id}
          onClose={() => setShowDetailModal(false)}
        />
      )}

      {/* Likes Modal */}
      {showLikesModal && (
        <LikesModal
          postId={post._id}
          onClose={() => setShowLikesModal(false)}
        />
      )}

      {/* Edit Post Modal */}
      {showEditModal && (
        <EditPostModal
          postId={post._id}
          currentCaption={post.caption}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {/* Delete Post Modal */}
      {showDeleteModal && (
        <DeletePostModal
          postId={post._id}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </article>
  );
}
