import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle } from 'lucide-react';

import type { Post } from '@api/post.api';
import Button from '@components/shared/buttons/Button';
import UserHeader from '@components/shared/user/UserHeader';
import { userProfileController } from '@jotai/userprofile.atom';
import ShareDropdown from '@components/shared/post/ShareDropdown';
import PostImageSlider from '@components/shared/post/PostImageSlider';
import CommentSection from '@components/shared/comment/CommentSection';
import SharedPostHeader from '@components/shared/post/SharedPostHeader';
import PostOptionsDropdown from '@components/shared/post/PostOptionsDropdown';
import DeleteConfirmModal from '@components/shared/modals/DeleteConfirmModal';
import { formatRelativeTime } from '@utils/dateUtils';

interface PostCardWithSliderProps {
  post: Post;
  onLike?: (postId: string, postOwnerId?: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string, isCurrentlyShared: boolean) => void;
  onShareWithComment?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onEdit?: (postId: string) => void;
  onDeleteShare?: (postId: string) => void;
  isLiked?: boolean;
  isShared?: boolean;
  showComments?: boolean;
  isDeleting?: boolean;
  isDeletingShare?: boolean;
}

const PostCardWithSlider: React.FC<PostCardWithSliderProps> = ({
  post,
  onLike,
  onShare,
  onShareWithComment,
  onDelete,
  onEdit,
  onDeleteShare,
  isLiked = false,
  isShared = false,
  showComments = false,
  isDeleting = false,
  isDeletingShare = false,
}) => {
  const [commentsExpanded, setCommentsExpanded] = useState(showComments);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [wasDeleting, setWasDeleting] = useState(false);
  const { id: currentUserId } = userProfileController.useState(['id']);

  // Handle modal closing when deletion completes
  useEffect(() => {
    if (wasDeleting && !isDeleting) {
      // Deletion completed - close modal
      setShowDeleteModal(false);
      setWasDeleting(false);
    } else if (isDeleting && !wasDeleting) {
      // Deletion started
      setWasDeleting(true);
    }
  }, [isDeleting, wasDeleting]);

  const displayName =
    post.user.profile?.first_name && post.user.profile?.last_name
      ? `${post.user.profile.first_name} ${post.user.profile.last_name}`
      : post.user.name;

  const formatDate = (dateString: string) => {
    return formatRelativeTime(dateString);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete(post.id);
      // Don't close modal here - it will be closed when deletion succeeds
      // The isDeleting prop will handle the loading state
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleEdit = () => {
    onEdit?.(post.id);
  };

  const handleDeleteShare = () => {
    onDeleteShare?.(post.id);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 relative mb-8">
      {post.type === 'shared' && (
        <SharedPostHeader post={post} onDeleteShare={handleDeleteShare} isDeleting={isDeletingShare} />
      )}

      <div className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <UserHeader
            userId={post.user.id}
            displayName={displayName}
            profileUrl={post.user.profile?.profile_url}
            subtitle={formatDate(post.createdAt)}
            size="md"
          />

          {currentUserId === post.user.id && (
            <PostOptionsDropdown onDelete={handleDelete} onEdit={onEdit ? handleEdit : undefined} />
          )}
        </div>
      </div>

      {post.content && (
        <div className="px-6 pb-4">
          <p className="text-gray-900 whitespace-pre-wrap text-lg leading-relaxed">{post.content}</p>
        </div>
      )}

      {post.images && post.images.length > 0 && (
        <div className="overflow-hidden rounded-lg mx-6 mb-4">
          <PostImageSlider images={post.images} />
        </div>
      )}

      <div className="px-6 py-4">
        <div className="flex items-center justify-between text-base text-gray-600">
          <div className="flex items-center space-x-6">
            {post.likes_count > 0 && (
              <span className="font-medium">
                {post.likes_count} {post.likes_count === 1 ? 'like' : 'likes'}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-6">
            {post.comments_count > 0 && (
              <span className="font-medium">
                {post.comments_count} {post.comments_count === 1 ? 'comment' : 'comments'}
              </span>
            )}
            {post.shares_count > 0 && (
              <span className="font-medium">
                {post.shares_count} {post.shares_count === 1 ? 'share' : 'shares'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Post Actions */}
      <div className="px-6 py-4 border-t border-gray-100 relative">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="md"
            onClick={() => onLike?.(post.id, post.user.id)}
            className={`flex items-center space-x-3 px-4 py-3 transition-colors ${
              isLiked ? 'text-red-500 hover:text-red-600' : 'text-gray-600 hover:text-red-500'
            }`}
          >
            <Heart
              size={22}
              className={`transition-all duration-200 ${isLiked ? 'fill-current scale-110' : 'hover:scale-105'}`}
            />
            <span className="font-medium">{isLiked ? 'Liked' : 'Like'}</span>
          </Button>

          <Button
            variant="ghost"
            size="md"
            onClick={() => {
              setCommentsExpanded(!commentsExpanded);
            }}
            className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-blue-500 transition-colors"
          >
            <MessageCircle size={22} />
            <span className="font-medium">Comment</span>
          </Button>

          <ShareDropdown
            onQuickShare={() => onShare?.(post.id, isShared)}
            onShareWithComment={() => onShareWithComment?.(post.id)}
            isShared={isShared}
          />
        </div>
      </div>

      {commentsExpanded && <CommentSection postId={post.id} commentsCount={post.comments_count} isExpanded={false} />}

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone and will also remove all shares of this post."
      />
    </div>
  );
};

export default PostCardWithSlider;
