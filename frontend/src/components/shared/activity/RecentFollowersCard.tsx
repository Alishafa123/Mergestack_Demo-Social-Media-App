import React from 'react';
import { Users,Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

import { useGetRecentFollowers } from '@hooks/useUser';
import { userProfileController } from '@jotai/userprofile.atom';
import { formatRelativeTime } from '@utils/dateUtils';
import Avatar from '@components/shared/ui/Avatar';

interface RecentFollower {
  id: string;
  name: string;
  profileUrl?: string;
  followedAt: string;
  bio?: string;
}

const RecentFollowersCard: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = userProfileController.useState(['id']);
  const { data, isLoading, error } = useGetRecentFollowers(currentUser.id || '');

  const formatFollowedAt = (dateString: string) => {
    return formatRelativeTime(dateString);
  };

  // Transform API data to component format
  const recentFollowers: RecentFollower[] = data?.followers?.map(item => {
    const follower = item.follower;
    const displayName = follower.profile?.first_name && follower.profile?.last_name
      ? `${follower.profile.first_name} ${follower.profile.last_name}`
      : follower.name;

    return {
      id: follower.id,
      name: displayName,
      profileUrl: follower.profile?.profile_url,
      followedAt: formatFollowedAt(item.createdAt),
      bio: follower.profile?.bio
    };
  }) || [];

  const handleFollowerClick = (followerId: string) => {
    navigate(`/user/${followerId}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 rounded-full">
          <Users size={22} className="text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Recent Followers</h3>
          <p className="text-base text-gray-500">People who recently followed you</p>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={28} className="animate-spin text-gray-400" />
            <span className="ml-2 text-base text-gray-500">Loading followers...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-base">Failed to load followers</p>
            </div>
          </div>
        ) : recentFollowers.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-gray-500 text-base">No followers yet</p>
              <p className="text-gray-400 text-sm mt-1">Share your profile to get followers!</p>
            </div>
          </div>
        ) : (
          recentFollowers.map((follower) => (
            <div
              key={follower.id}
              onClick={() => handleFollowerClick(follower.id)}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
            >
              <div className="flex-shrink-0">
                <Avatar
                  src={follower.profileUrl}
                  name={follower.name}
                  size="lg"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-base text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                  {follower.name}
                </p>
                {follower.bio && (
                  <p className="text-base text-gray-500 truncate mt-1">
                    {follower.bio}
                  </p>
                )}
              </div>
              
              <div className="flex-shrink-0 flex flex-col items-end">
                <span className="text-sm text-gray-500 mb-1">
                  {follower.followedAt}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentFollowersCard;