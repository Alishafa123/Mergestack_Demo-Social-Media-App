import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Button from '../buttons/Button';
import { userProfileController } from '../../../jotai/userprofile.atom';

interface CreatePostPromptProps {
  userInitial?: string;
  profileUrl?: string;
  placeholder?: string;
  createPostPath?: string;
}

const CreatePostPrompt: React.FC<CreatePostPromptProps> = ({
  userInitial = "U",
  profileUrl,
  placeholder = "What's on your mind?",
  createPostPath = "/create-post"
}) => {
  const navigate = useNavigate();
  const {profile_url} = userProfileController.useState(['profile_url']);
  
  // Use prop profileUrl if provided, otherwise use profile_url from controller
  const displayProfileUrl = profileUrl || profile_url;

  const handleCreatePost = () => {
    navigate(createPostPath);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center overflow-hidden">
          {displayProfileUrl ? (
            <img 
              src={displayProfileUrl} 
              alt="Profile" 
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span className="text-white font-semibold text-lg">{userInitial}</span>
          )}
        </div>
        <button
          onClick={handleCreatePost}
          className="flex-1 bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-3 text-left text-gray-500 transition-colors"
        >
          {placeholder}
        </button>
        <Button
          onClick={handleCreatePost}
          variant="primary"
          size="md"
          className="flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Create Post</span>
        </Button>
      </div>
    </div>
  );
};

export default CreatePostPrompt;