import React from 'react';
import { Loader2 } from 'lucide-react';
import { useGetUserStats, useGetUserStatsById } from '../../../hooks/useProfile';
import { userController } from '../../../jotai/user.atom';

interface ProfileStatsProps {
  userId: string;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ userId }) => {
  const currentUser = userController.useState(['id']);
  const isOwnProfile = userId === currentUser.id;
  
  // Use appropriate hook based on profile type
  const ownStatsQuery = useGetUserStats();
  const otherStatsQuery = useGetUserStatsById(userId);
  
  const { data: stats, isLoading, error } = isOwnProfile ? ownStatsQuery : otherStatsQuery;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 size={20} className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex justify-center space-x-8 py-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">-</div>
          <div className="text-sm text-gray-500">Posts</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">-</div>
          <div className="text-sm text-gray-500">Followers</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">-</div>
          <div className="text-sm text-gray-500">Following</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">-</div>
          <div className="text-sm text-gray-500">Likes</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center space-x-6">
      <div className="text-center cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
        <div className="text-2xl font-bold text-gray-900">
          {stats.stats.totalPosts || 0}
        </div>
        <div className="text-sm text-gray-500">Posts</div>
      </div>
      
      <div className="text-center cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
        <div className="text-2xl font-bold text-gray-900">
          {stats.stats.followersCount || 0}
        </div>
        <div className="text-sm text-gray-500">Followers</div>
      </div>
      
      <div className="text-center cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
        <div className="text-2xl font-bold text-gray-900">
          {stats.stats.followingCount || 0}
        </div>
        <div className="text-sm text-gray-500">Following</div>
      </div>
      
      <div className="text-center cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
        <div className="text-2xl font-bold text-gray-900">
          {stats.stats.totalLikes || 0}
        </div>
        <div className="text-sm text-gray-500">Likes</div>
      </div>
    </div>
  );
};

export default ProfileStats;