import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { Post } from '@api/post.api';
import { userProfileController } from '@jotai/userprofile.atom';
import PostOptionsDropdown from '@components/shared/post/PostOptionsDropdown';
import DeleteConfirmModal from '@components/shared/modals/DeleteConfirmModal';
import { userProfileController } from '@jotai/userprofile.atom';
import type { Post } from '@api/post.api';
import { formatRelativeTime } from '@utils/dateUtils';
import Avatar from '@components/shared/ui/Avatar';

interface SharedPostHeaderProps {
  post: Post;
  onDeleteShare?: () => void;
  isDeleting?: boolean;
}

const SharedPostHeader: React.FC<SharedPostHeaderProps> = ({ post, onDeleteShare, isDeleting = false }) => {
  const navigate = useNavigate();
  const { id: currentUserId } = userProfileController.useState(['id']);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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
    setShowDeleteModal(false);
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
  };

  const handleUserClick = (userId: string) => {
    navigate(`/user/${userId}`);
  };

  return (
    <div className="bg-gray-50 border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Avatar
                  src={post.shared_by.profile?.profile_url}
                  name={getDisplayName(post.shared_by)}
                  size="xs"
                />
                
                <button
                  onClick={() => handleUserClick(post.shared_by!.id)}
                  className="font-medium text-gray-900 hover:text-blue-600 transition-colors text-sm"
                >
                  {getDisplayName(post.shared_by)}
                </button>
              </div>
              
              <span className="text-gray-500 text-sm">shared this</span>
              
              <span className="text-gray-400 text-xs">
                {formatSharedTime(post.shared_at!)}
              </span>
            </div>
            
            {post.shared_content && (
              <div className="mt-2">
                <p className="text-sm text-gray-700 bg-white rounded-lg px-3 py-2 border border-gray-200">
                  {post.shared_content}
                </p>
              </div>
            )}
          </div>
        </div>

        {currentUserId === post.shared_by?.id && onDeleteShare && (
          <PostOptionsDropdown
            onDelete={handleDeleteShare}
          />
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