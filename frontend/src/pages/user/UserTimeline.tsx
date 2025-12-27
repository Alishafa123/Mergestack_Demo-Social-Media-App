import React from 'react';
import { useParams } from 'react-router-dom';

import Feed from '@components/shared/post/Feed';
import Navbar from '@components/shared/navbar/Navbar';
import { UserProfileCard } from '@components/shared/profile';
import { userProfileController } from '@jotai/userprofile.atom';
import CreatePostPrompt from '@components/shared/post/CreatePostPrompt';

const UserTimeline: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const currentUser = userProfileController.useState(['id']);

  const isOwnProfile = !userId || userId === currentUser.id;
  const profileUserId = userId || currentUser.id || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="w-full px-2 sm:px-4 py-6">
        <div className="max-w-[3000px] mx-auto">
          <div className="flex items-start gap-6 lg:gap-12">
            <div className="hidden lg:block w-[25%] flex-shrink-0">
              <div className="fixed w-[25%] top-28 h-fit">
                <UserProfileCard />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="space-y-6">
                {isOwnProfile && <CreatePostPrompt />}

                <Feed feedType="general" userId={profileUserId} />
              </div>
            </div>
            <div className="hidden lg:block w-[25%] flex-shrink-0"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTimeline;
