import React, { useState } from 'react';

import { userProfileController } from '@jotai/userprofile.atom';
import CreatePostModal from '@components/shared/modals/CreatePostModal';

interface CreatePostPromptProps {
  userInitial?: string;
  profileUrl?: string;
  placeholder?: string;
}

const CreatePostPrompt: React.FC<CreatePostPromptProps> = ({
  userInitial = "U",
  profileUrl,
  placeholder = "What's on your mind?"
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {profile_url} = userProfileController.useState(['profile_url']);
  
  const displayProfileUrl = profileUrl || profile_url;

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
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
            onClick={handleOpenModal}
            className="flex-1 bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-3 text-left text-gray-500 transition-colors text-base"
          >
            {placeholder}
          </button>
        </div>
      </div>

      <CreatePostModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </>
  );
};

export default CreatePostPrompt;