import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Loader2 } from 'lucide-react';

import TopPostItem from './TopPostItem';
import { useGetUserTopPosts } from '@hooks/usePost';
import { formatRelativeTime } from '@utils/dateUtils';
import Button from '@components/shared/buttons/Button';
import { userProfileController } from '@jotai/userprofile.atom';

interface TopPost {
  id: string;
  content: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  createdAt: string;
}

const TopPostsCard: React.FC = () => {
  const navigate = useNavigate();
  const { id: currentUserId } = userProfileController.useState(['id']);
  const { data, isLoading, error } = useGetUserTopPosts();

  const formatCreatedAt = (dateString: string) => {
    return formatRelativeTime(dateString);
  };

  const topPosts: TopPost[] =
    data?.posts?.map((post) => ({
      ...post,
      createdAt: formatCreatedAt(post.createdAt),
    })) || [];

  const handleviewpost = () => {
    navigate(`/user/${currentUserId}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full">
          <TrendingUp size={22} className="text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Top Posts</h3>
          <p className="text-base text-gray-500">Your most liked posts</p>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={28} className="animate-spin text-gray-400" />
            <span className="ml-2 text-base text-gray-500">Loading top posts...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-base">Failed to load top posts</p>
            </div>
          </div>
        ) : topPosts.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-gray-500 text-base">No posts yet</p>
              <p className="text-gray-400 text-sm mt-1">Create your first post to see it here!</p>
            </div>
          </div>
        ) : (
          topPosts.map((post, index) => <TopPostItem key={post.id} post={post} rank={index + 1} />)
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <Button
          variant="ghost"
          size="md"
          className="w-full text-base text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text hover:from-blue-600 hover:via-purple-600 hover:to-pink-600"
          onClick={handleviewpost}
        >
          View All My Posts
        </Button>
      </div>
    </div>
  );
};

export default TopPostsCard;
