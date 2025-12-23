import React, { useState } from 'react';
import { X, ImageIcon, Smile, MapPin, Calendar } from 'lucide-react';
import { userProfileController } from '../../../jotai/userprofile.atom';
import { useCreatePost } from '../../../hooks/usePost';
import { validatePost } from '../../../schemas/postSchemas';
import Button from '../buttons/Button';
import Alert from '../Alert';
import PostTextArea from '../post/PostTextArea';
import PostImageUpload from '../post/PostImageUpload';
import UserHeader from '../user/UserHeader';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AlertState {
  show: boolean;
  variant: 'success' | 'error';
  message: string;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
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
  const [content, setContent] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    variant: 'success',
    message: ''
  });

  const showAlert = (variant: 'success' | 'error', message: string) => {
    setAlert({ show: true, variant, message });
    setTimeout(() => {
      setAlert(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const handleSubmit = async () => {
    const validation = validatePost(content, selectedImages);
    
    if (!validation.isValid) {
      showAlert('error', validation.errors[0]);
      return;
    }

    createPostMutation.mutate(
      {
        content: content.trim() || undefined,
        images: selectedImages.length > 0 ? selectedImages : undefined,
      },
      {
        onSuccess: () => {
          showAlert('success', 'Post created successfully!');
          setTimeout(() => {
            handleClose();
          }, 1500);
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data?.message || 'Failed to create post. Please try again.';
          showAlert('error', errorMessage);
        }
      }
    );
  };

  const handleClose = () => {
    setContent('');
    setSelectedImages([]);
    setAlert({ show: false, variant: 'success', message: '' });
    onClose();
  };

  const isSubmitDisabled = createPostMutation.isPending || (!content.trim() && selectedImages.length === 0);

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
          {alert.show && (
            <div className="mb-4">
              <Alert variant={alert.variant} message={alert.message} />
            </div>
          )}

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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-base font-medium text-gray-700">Add to your post</span>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ImageIcon size={20} className="text-green-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Smile size={20} className="text-yellow-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <MapPin size={20} className="text-red-500" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Calendar size={20} className="text-blue-500" />
              </button>
            </div>
          </div>

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
              {createPostMutation.isPending ? 'Publishing...' : 'Post'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePostModal;