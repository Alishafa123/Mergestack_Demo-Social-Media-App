import React, { useState } from 'react';
import { Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react';
import Button from '../buttons/Button';
import PostImageSlider from './PostImageSlider';
import UserHeader from '../user/UserHeader';
import CommentSection from '../comment/CommentSection';
import ShareDropdown from './ShareDropdown';

interface PostUser {
  id: string;
  name: string;
  profile?: {
    profile_url?: string;
    first_name?: string;
    last_name?: string;
  };
}

interface PostImage {
  id: string;
  image_url: string;
  image_order: number;
}

interface Post {
  id: string;
  content?: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  createdAt: string;
  user: PostUser;
  images?: PostImage[];
}

interface PostCardWithSliderProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string, isCurrentlyShared: boolean) => void;
  onShareWithComment?: (postId: string) => void;
  isLiked?: boolean;
  isShared?: boolean;
  currentUserId?: string;
  showComments?: boolean;
  useShareDropdown?: boolean;
}

const PostCardWithSlider: React.FC<PostCardWithSliderProps> = ({
  post,
  onLike,
  onComment,
  onShare,
  onShareWithComment,
  isLiked = false,
  isShared = false,
  currentUserId,
  showComments = false,
  useShareDropdown = false
}) => {
  const [commentsExpanded, setCommentsExpanded] = useState(showComments);
  const displayName = post.user.profile?.first_name && post.user.profile?.last_name
    ? `${post.user.profile.first_name} ${post.user.profile.last_name}`
    : post.user.name;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 relative">
      {/* Post Header */}
      <div className="p-4 pb-3">
        <div className="flex items-center justify-between">
          <UserHeader
            displayName={displayName}
            profileUrl={post.user.profile?.profile_url}
            subtitle={formatDate(post.createdAt)}
            size="sm"
          />
          
          {currentUserId === post.user.id && (
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <MoreHorizontal size={20} className="text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* Post Content */}
      {post.content && (
        <div className="px-4 pb-3">
          <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
        </div>
      )}

      {/* Post Images */}
      {post.images && post.images.length > 0 && (
        <div className="overflow-hidden">
          <PostImageSlider images={post.images} />
        </div>
      )}

      {/* Post Stats */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            {post.likes_count > 0 && (
              <span>{post.likes_count} {post.likes_count === 1 ? 'like' : 'likes'}</span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {post.comments_count > 0 && (
              <span>{post.comments_count} {post.comments_count === 1 ? 'comment' : 'comments'}</span>
            )}
            {post.shares_count > 0 && (
              <span>{post.shares_count} {post.shares_count === 1 ? 'share' : 'shares'}</span>
            )}
          </div>
        </div>
      </div>

      {/* Post Actions */}
      <div className="px-4 py-3 border-t border-gray-100 relative">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLike?.(post.id)}
            className={`flex items-center space-x-2 transition-colors ${
              isLiked ? 'text-red-500 hover:text-red-600' : 'text-gray-600 hover:text-red-500'
            }`}
          >
            <Heart 
              size={18} 
              className={`transition-all duration-200 ${
                isLiked ? 'fill-current scale-110' : 'hover:scale-105'
              }`} 
            />
            <span>{isLiked ? 'Liked' : 'Like'}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setCommentsExpanded(!commentsExpanded);
              onComment?.(post.id);
            }}
            className="flex items-center space-x-2 text-gray-600"
          >
            <MessageCircle size={18} />
            <span>Comment</span>
          </Button>

          {useShareDropdown ? (
            <ShareDropdown
              onQuickShare={() => onShare?.(post.id, isShared)}
              onShareWithComment={() => onShareWithComment?.(post.id)}
              isShared={isShared}
            />
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShare?.(post.id, isShared)}
              className={`flex items-center space-x-2 transition-colors ${
                isShared ? 'text-blue-500 hover:text-blue-600' : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              <Share 
                size={18} 
                className={`transition-all duration-200 ${
                  isShared ? 'scale-110' : 'hover:scale-105'
                }`} 
              />
              <span>{isShared ? 'Shared' : 'Share'}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Comments Section */}
      <CommentSection
        postId={post.id}
        commentsCount={post.comments_count}
        isExpanded={commentsExpanded}
        onToggle={() => setCommentsExpanded(!commentsExpanded)}
      />
    </div>
  );
};

export default PostCardWithSlider;