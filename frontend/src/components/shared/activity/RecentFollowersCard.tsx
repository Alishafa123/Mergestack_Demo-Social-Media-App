import React from 'react';
import { Users,Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../buttons/Button';
import { useGetRecentFollowers } from '../../../hooks/useUser';
import { userProfileController } from '../../../jotai/userprofile.atom';
import { formatDistanceToNow } from 'date-fns';

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
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'Recently';
    }
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

  const handleViewAllFollowers = () => {
    if (currentUser.id) {
      navigate(`/user/${currentUser.id}`); // Navigate to own profile to see followers
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 rounded-full">
          <Users size={20} className="text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Recent Followers</h3>
          <p className="text-sm text-gray-500">People who recently followed you</p>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={24} className="animate-spin text-gray-400" />
            <span className="ml-2 text-gray-500">Loading followers...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm">Failed to load followers</p>
            </div>
          </div>
        ) : recentFollowers.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-gray-500 text-sm">No followers yet</p>
              <p className="text-gray-400 text-xs mt-1">Share your profile to get followers!</p>
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
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  {follower.profileUrl ? (
                    <img
                      src={follower.profileUrl}
                      alt={follower.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-semibold text-lg">
                      {follower.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                  {follower.name}
                </p>
                {follower.bio && (
                  <p className="text-sm text-gray-500 truncate mt-1">
                    {follower.bio}
                  </p>
                )}
              </div>
              
              <div className="flex-shrink-0 flex flex-col items-end">
                <span className="text-xs text-gray-500 mb-1">
                  {follower.followedAt}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-transparent bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 bg-clip-text hover:from-green-600 hover:via-teal-600 hover:to-blue-600"
          onClick={handleViewAllFollowers}
        >
          View All Followers
        </Button>
      </div>
    </div>
  );
};

export default RecentFollowersCard;