import React, { useState, useEffect } from 'react';
import { X, Edit3 } from 'lucide-react';
import Button from '../buttons/Button';
import { showToast } from '../toast';
import PostTextArea from '../post/PostTextArea';
import UserHeader from '../user/UserHeader';
import { userProfileController } from '../../../jotai/userprofile.atom';

interface EditPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: string) => void;
  isLoading?: boolean;
  post?: {
    id: string;
    content?: string;
    user: {
      id: string;
      name: string;
      profile?: {
        first_name?: string;
        last_name?: string;
        profile_url?: string;
      };
    };
  };
}

const EditPostModal: React.FC<EditPostModalProps> = ({
  isOpen,
  onClose,
  onSave,
  isLoading = false,
  post
}) => {
  const [content, setContent] = useState('');

  const {
    first_name,
    last_name,
    profile_url
  } = userProfileController.useState([
    'first_name',
    'last_name',
    'profile_url'
  ]);

  useEffect(() => {
    if (isOpen && post) {
      setContent(post.content || '');
    }
  }, [isOpen, post]);

  const handleSave = () => {
    const trimmedContent = content.trim();
    
    if (!trimmedContent) {
      showToast.error('Post content cannot be empty');
      return;
    }

    if (trimmedContent.length > 2000) {
      showToast.error('Post content cannot exceed 2000 characters');
      return;
    }

    if (trimmedContent === (post?.content || '').trim()) {
      showToast.warning('No changes detected');
      return;
    }

    onSave(trimmedContent);
  };

  const handleClose = () => {
    setContent('');
    onClose();
  };

  const getButtonText = () => {
    if (isLoading) {
      return 'Saving changes...';
    }
    return 'Save Changes';
  };

  const displayName = first_name && last_name
    ? `${first_name} ${last_name}`
    : post?.user.name || 'User';

  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-gray-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Edit3 size={20} className="text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Edit Post</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isLoading}
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
          {/* User info */}
          <UserHeader
            userId={post.user.id}
            displayName={displayName}
            profileUrl={profile_url}
            subtitle="Editing post"
            size="md"
            className="mb-6"
          />

          {/* Text area */}
          <PostTextArea
            value={content}
            onChange={setContent}
            placeholder="What's on your mind?"
            maxLength={2000}
            disabled={isLoading}
            autoFocus
          />

          {/* Character counter */}
          <div className="flex justify-end mt-4">
            <div className="text-sm text-gray-500">
              {content.length}/2000 characters
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex items-center justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={isLoading}
              className="px-6 py-2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              loading={isLoading}
              disabled={isLoading || !content.trim()}
              className="px-8 py-2 text-base"
            >
              {getButtonText()}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPostModal;