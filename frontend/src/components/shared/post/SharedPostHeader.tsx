import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import type { Post } from '@api/post.api';
import Avatar from '@components/shared/ui/Avatar';
import { formatRelativeTime } from '@utils/dateUtils';
import { userProfileController } from '@jotai/userprofile.atom';
import PostOptionsDropdown from '@components/shared/post/PostOptionsDropdown';
import DeleteConfirmModal from '@components/shared/modals/DeleteConfirmModal';

interface SharedPostHeaderProps {
  post: Post;
  onDeleteShare?: () => void;
  isDeleting?: boolean;
}

const SharedPostHeader: React.FC<SharedPostHeaderProps> = ({ post, onDeleteShare, isDeleting = false }) => {
  const navigate = useNavigate();
  const { id: currentUserId } = userProfileController.useState(['id']);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [wasDeleting, setWasDeleting] = useState(false);

  if (post.type !== 'shared' || !post.shared_by) {
    return null;
  }

  const getDisplayName = (user: any) => {
    if (user.profile?.first_name && user.profile?.last_name) {
      return `${user.profile.first_name} ${user.profile.last_name}`;
    }
    return user.name;
  };

  const formatSharedTime = (dateString: string) => {
    return formatRelativeTime(dateString);
  };

  const handleDeleteShare = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    onDeleteShare?.();
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
  };

  const handleUserClick = (userId: string) => {
    navigate(`/user/${userId}`);
  };

  useEffect(() => {
    if (wasDeleting && !isDeleting) {
      setShowDeleteModal(false);
      setWasDeleting(false);
    } else if (isDeleting && !wasDeleting) {
      setWasDeleting(true);
    }
  }, [isDeleting, wasDeleting]);

  return (
    <div className="bg-gray-50 border-b border-gray-200 px-2 sm:px-4 py-2 sm:py-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0">
          <div className="flex-shrink-0">
            <Avatar src={post.shared_by.profile?.profile_url} name={getDisplayName(post.shared_by)} size="xs" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
              <button
                onClick={() => handleUserClick(post.shared_by!.id)}
                className="font-medium text-gray-900 hover:text-blue-600 transition-colors text-xs sm:text-sm truncate max-w-[120px] sm:max-w-none"
                title={getDisplayName(post.shared_by)}
              >
                {getDisplayName(post.shared_by)}
              </button>

              <span className="text-gray-500 text-xs sm:text-sm whitespace-nowrap">shared this</span>

              <span className="text-gray-400 text-xs whitespace-nowrap">{formatSharedTime(post.shared_at!)}</span>
            </div>

            {post.shared_content && (
              <div className="mt-1 sm:mt-2">
                <p className="text-xs sm:text-sm text-gray-700 bg-white rounded-lg px-2 sm:px-3 py-1 sm:py-2 border border-gray-200 break-words">
                  {post.shared_content}
                </p>
              </div>
            )}
          </div>
        </div>

        {currentUserId === post.shared_by?.id && onDeleteShare && (
          <div className="flex-shrink-0">
            <PostOptionsDropdown onDelete={handleDeleteShare} />
          </div>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Shared Post"
        message="Are you sure you want to delete this shared post? This action cannot be undone."
      />
    </div>
  );
};

export default SharedPostHeader;
