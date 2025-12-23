import {useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageIcon } from 'lucide-react';
import { userProfileController } from '../../jotai/userprofile.atom';
import { useCreatePost } from '../../hooks/usePost';
import { validatePost } from '../../schemas/postSchemas';
import Button from '../../components/shared/buttons/Button';
import Alert from '../../components/shared/Alert';
import PostTextArea from '../../components/shared/post/PostTextArea';
import PostImageUpload from '../../components/shared/post/PostImageUpload';
import UserHeader from '../../components/shared/user/UserHeader';
import Navbar from '../../components/shared/navbar/Navbar';

interface AlertState {
  show: boolean;
  variant: 'success' | 'error';
  message: string;
}

export default function CreatePost() {
  const navigate = useNavigate();
  const {id,first_name,last_name,profile_url} = userProfileController.useState(['id','first_name','last_name','profile_url'])
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
            navigate('/dashboard');
          }, 1500);
        },
        onError: (error: any) => {
          const errorMessage = error?.response?.data?.message || 'Failed to create post. Please try again.';
          showAlert('error', errorMessage);
        }
      }
    );
  };


  const isSubmitDisabled = createPostMutation.isPending || (!content.trim() && selectedImages.length === 0);

  const displayName = first_name && last_name
    ? `${first_name} ${last_name}`
    :  'User';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="flex items-center space-x-2 text-base"
              > */}
                {/* <ArrowLeft size={20} />
                <span>Back</span>
              </Button> */}
              <h1 className="text-3xl font-semibold text-gray-900">Create Post</h1>
            </div>
            
            <Button
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
              loading={createPostMutation.isPending}
              size="md"
              className="text-base px-6 py-3"
            >
              {createPostMutation.isPending ? 'Publishing...' : 'Publish'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {alert.show && (
            <div className="mb-6">
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
              placeholder="What's on your mind?"
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

          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <ImageIcon size={20} />
                  <span className="text-base">
                    {selectedImages.length > 0 
                      ? `${selectedImages.length} image${selectedImages.length > 1 ? 's' : ''} selected`
                      : 'Add photos to your post'
                    }
                  </span>
                </div>
              </div>
              
              <div className="text-base text-gray-500">
                {content.length}/2000 characters
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2 text-lg">Tips for great posts:</h3>
          <ul className="text-base text-blue-800 space-y-1">
            <li>• Share what's meaningful to you</li>
            <li>• Add photos to make your post more engaging</li>
            <li>• Keep it authentic and respectful</li>
            <li>• Use up to 10 images and 2000 characters</li>
          </ul>
        </div>
      </div>
    </div>
  );
}