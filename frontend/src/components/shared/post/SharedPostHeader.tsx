import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import PostOptionsDropdown from './PostOptionsDropdown';
import DeleteConfirmModal from '../modals/DeleteConfirmModal';
import { userProfileController } from '../../../jotai/userprofile.atom';
import type { Post } from '../../../api/post.api';

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
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Recently';
    }
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
                <div className="w-6 h-6 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  {post.shared_by.profile?.profile_url ? (
                    <img
                      src={post.shared_by.profile.profile_url}
                      alt={getDisplayName(post.shared_by)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-semibold text-xs">
                      {getDisplayName(post.shared_by).charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                
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