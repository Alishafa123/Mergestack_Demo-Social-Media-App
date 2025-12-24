import React from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';

interface TopPost {
  id: string;
  content: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  createdAt: string;
}

interface TopPostItemProps {
  post: TopPost;
  rank: number;
  onClick?: (postId: string) => void;
}

const TopPostItem: React.FC<TopPostItemProps> = ({ post, rank, onClick }) => {
  const truncateText = (text: string, maxLength: number = 80) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div 
      className="group p-4 rounded-lg border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all duration-200 cursor-pointer relative"
      onClick={() => onClick?.(post.id)}
    >
      {/* Rank Badge */}
      <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-md">
        <span className="text-white text-sm font-bold">#{rank}</span>
      </div>

      {/* Post Content */}
      <p className="text-base text-gray-700 mb-4 leading-relaxed">
        {truncateText(post.content)}
      </p>

      {/* Post Stats */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-red-500">
            <Heart size={16} className="fill-current" />
            <span className="font-semibold">{post.likes_count}</span>
          </div>
          <div className="flex items-center space-x-1 text-blue-500">
            <MessageCircle size={16} />
            <span className="font-medium">{post.comments_count}</span>
          </div>
          <div className="flex items-center space-x-1 text-green-500">
            <Share2 size={16} />
            <span className="font-medium">{post.shares_count}</span>
          </div>
        </div>
        <span className="text-gray-400 text-sm">{post.createdAt}</span>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 opacity-0 group-hover:opacity-20 rounded-lg transition-opacity pointer-events-none"></div>
    </div>
  );
};

export default TopPostItem;