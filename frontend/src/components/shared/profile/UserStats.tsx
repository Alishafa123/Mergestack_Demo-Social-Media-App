import React from 'react';
import { Heart, MessageCircle, Share2, Edit, Loader2, UserPlus, Users } from 'lucide-react';
import { useGetUserStats, useGetUserStatsById } from '@hooks/useProfile';

interface UserStatsProps {
  userId?: string;
  isViewingOtherUser: boolean;
}

const UserStats: React.FC<UserStatsProps> = ({ userId, isViewingOtherUser }) => {
  const { data: otherUserStats, isLoading: otherStatsLoading, error: otherStatsError } = useGetUserStatsById(userId || '');
  const { data: currentUserStats, isLoading: currentStatsLoading, error: currentStatsError } = useGetUserStats({
    enabled: !isViewingOtherUser
  });

  const statsData = isViewingOtherUser ? otherUserStats : currentUserStats;
  const statsLoading = isViewingOtherUser ? otherStatsLoading : currentStatsLoading;
  const statsError = isViewingOtherUser ? otherStatsError : currentStatsError;
  
  const stats = {
    likes: statsData?.stats?.totalLikes || 0,
    comments: statsData?.stats?.totalComments || 0,
    shares: statsData?.stats?.totalShares || 0,
    posts: statsData?.stats?.totalPosts || 0,
    followers: statsData?.stats?.followersCount || 0,
    following: statsData?.stats?.followingCount || 0
  };

  const statsConfig = [
    {
      label: "Likes",
      value: stats.likes,
      icon: Heart,
      bg: "bg-red-50",
      border: "border-red-100",
      text: "text-red-500",
    },
    {
      label: "Comments",
      value: stats.comments,
      icon: MessageCircle,
      bg: "bg-blue-50",
      border: "border-blue-100",
      text: "text-blue-500",
    },
    {
      label: "Shares",
      value: stats.shares,
      icon: Share2,
      bg: "bg-green-50",
      border: "border-green-100",
      text: "text-green-500",
    },
    {
      label: "Posts",
      value: stats.posts,
      icon: Edit,
      bg: "bg-purple-50",
      border: "border-purple-100",
      text: "text-purple-500",
    },
    {
      label: "Followers",
      value: stats.followers,
      icon: Users,
      bg: "bg-indigo-50",
      border: "border-indigo-100",
      text: "text-indigo-500",
    },
    {
      label: "Following",
      value: stats.following,
      icon: UserPlus,
      bg: "bg-teal-50",
      border: "border-teal-100",
      text: "text-teal-500",
    },
  ];

  if (statsLoading) {
    return (
      <div className="flex justify-center py-6">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-red-500">Failed to load stats</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {statsConfig.map(({ label, value, icon: Icon, bg, border, text }) => (
        <div
          key={label}
          className={`flex flex-col items-center p-4 rounded-xl border ${border} bg-white 
                     hover:shadow-md transition-shadow duration-200`}
        >
          <div
            className={`flex items-center justify-center w-11 h-11 rounded-full mb-3 border ${bg} ${border}`}
          >
            <Icon size={18} className={text} />
          </div>

          <div className="text-xl font-semibold text-gray-900">
            {value}
          </div>

          <div className="text-sm text-gray-500">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserStats;