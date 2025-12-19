import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/shared/navbar/Navbar';
import { ProfileHeader } from '../../components/shared/profile';
import CreatePostPrompt from '../../components/shared/post/CreatePostPrompt';
import PostFeed from '../../components/shared/post/PostFeed';
import { userController } from '../../jotai/user.atom';

const UserTimeline: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const currentUser = userController.useState(['id']);
  
  const isOwnProfile = !userId || userId === currentUser.id;
  const profileUserId = userId || currentUser.id || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <ProfileHeader userId={profileUserId} isOwnProfile={isOwnProfile} />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {isOwnProfile && (
            <CreatePostPrompt />
          )}
          
          {/* Posts Feed */}
          <PostFeed userId={profileUserId} useShareDropdown={true} />
        </div>
      </div>
    </div>
  );
};

export default UserTimeline;