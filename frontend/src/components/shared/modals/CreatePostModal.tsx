import React, { useState } from 'react';
import { X, ImageIcon } from 'lucide-react';
import { userProfileController } from '@jotai/userprofile.atom';
import { useCreatePost } from '@hooks/usePost';
import { validatePost } from '@schemas/postSchemas';
import { showToast } from '@components/shared/toast';
import Button from '@components/shared/buttons/Button';
import PostTextArea from '@components/shared/post/PostTextArea';
import PostImageUpload from '@components/shared/post/PostImageUpload';
import UserHeader from '@components/shared/user/UserHeader';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
  const [content, setContent] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const {
    id,
    first_name,
    last_name,
    profile_url
  } = userProfileController.useState([
    'id',
    'first_name',
    'last_name',
    'profile_url'
  ]);

  const createPostMutation = useCreatePost();
  const handleSubmit = async () => {
  const validation = validatePost(content, selectedImages);

    if (!validation.isValid) {
      showToast.error(validation.errors[0]);
      return;
    }

    createPostMutation.mutate(
      {
        content: content.trim() || undefined,
        images: selectedImages.length > 0 ? selectedImages : undefined,
      },
      {
        onSuccess: () => {
          showToast.success('Post created successfully! 🎉');

          setTimeout(() => {
            handleClose();
          }, 1500);
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data?.message || 'Failed to create post. Please try again.';
          showToast.error(errorMessage);
        }
      }
    );
  };

  const handleClose = () => {
    setContent('');
    setSelectedImages([]);
    onClose();
  };

  const isSubmitDisabled = createPostMutation.isPending || (!content.trim() && selectedImages.length === 0);

  const getButtonText = () => {
    if (createPostMutation.isPending) {
      const hasImages = selectedImages.length > 0;
      if (hasImages) {
        return `Publishing with ${selectedImages.length} image${selectedImages.length > 1 ? 's' : ''}...`;
      }
      return 'Publishing...';
    }
    return 'Post';
  };

  const displayName = first_name && last_name
    ? `${first_name} ${last_name}`
    : 'User';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-gray-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create Post</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={createPostMutation.isPending}
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 max-h-[calc(90vh-140px)] overflow-y-auto">
          {id && (
            <UserHeader
              userId={id}
              displayName={displayName}
              profileUrl={profile_url}
              subtitle="Sharing with everyone"
              size="md"
              className="mb-6"
            />
          )}

          <div className="space-y-6">
            <PostTextArea
              value={content}
              onChange={setContent}
              placeholder="What's on your mind? Share your thoughts, stories, or updates..."
              maxLength={2000}
              disabled={createPostMutation.isPending}
              autoFocus
            />

            <PostImageUpload
              onImagesChange={setSelectedImages}
              maxImages={10}
              disabled={createPostMutation.isPending}
            />
          </div>

          <div className="flex justify-end mt-4">
            <div className="text-sm text-gray-500">
              {content.length}/2000 characters remaining
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 p-6">
          {selectedImages.length > 0 && (
            <div className="flex items-center space-x-2 text-gray-600 mb-4">
              <ImageIcon size={16} />
              <span className="text-sm">
                {selectedImages.length} image{selectedImages.length > 1 ? 's' : ''} selected
              </span>
            </div>
          )}

          <div className="flex items-center justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={createPostMutation.isPending}
              className="px-6 py-2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
              loading={createPostMutation.isPending}
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

export default CreatePostModal;