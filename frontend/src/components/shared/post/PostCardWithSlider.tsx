import React, { useState } from 'react';
import { Heart, MessageCircle, Share } from 'lucide-react';
import Button from '../buttons/Button';
import PostImageSlider from './PostImageSlider';
import UserHeader from '../user/UserHeader';
import CommentSection from '../comment/CommentSection';
import ShareDropdown from './ShareDropdown';
import SharedPostHeader from './SharedPostHeader';
import PostOptionsDropdown from './PostOptionsDropdown';
import { userProfileController } from '../../../jotai/userprofile.atom';
import type { Post } from '../../../api/post.api';

interface PostCardWithSliderProps {
  post: Post;
  onLike?: (postId: string, postOwnerId?: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string, isCurrentlyShared: boolean) => void;
  onShareWithComment?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onEdit?: (postId: string) => void;
  isLiked?: boolean;
  isShared?: boolean;
  showComments?: boolean;
  useShareDropdown?: boolean;
}

const PostCardWithSlider: React.FC<PostCardWithSliderProps> = ({
  post,
  onLike,
  onShare,
  onShareWithComment,
  onDelete,
  onEdit,
  isLiked = false,
  isShared = false,
  showComments = false,
  useShareDropdown = false
}) => {
  const [commentsExpanded, setCommentsExpanded] = useState(showComments);
  const { id: currentUserId } = userProfileController.useState(['id']);
  
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

  const handleDelete = () => {
    onDelete?.(post.id);
  };

  const handleEdit = () => {
    onEdit?.(post.id);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 relative mb-8">
      {/* Shared Post Header - only show for shared posts */}
      {post.type === 'shared' && <SharedPostHeader post={post} />}
      
      {/* Post Header */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between">
          <UserHeader
            userId={post.user.id}
            displayName={displayName}
            profileUrl={post.user.profile?.profile_url}
            subtitle={formatDate(post.createdAt)}
            size="md"
          />
          
          {currentUserId === post.user.id && (
            <PostOptionsDropdown
              onDelete={handleDelete}
              onEdit={onEdit ? handleEdit : undefined}
            />
          )}
        </div>
      </div>

      {post.content && (
        <div className="px-6 pb-4">
          <p className="text-gray-900 whitespace-pre-wrap text-lg leading-relaxed">{post.content}</p>
        </div>
      )}

      {post.images && post.images.length > 0 && (
        <div className="overflow-hidden rounded-lg mx-6 mb-4">
          <PostImageSlider images={post.images} />
        </div>
      )}

      <div className="px-6 py-4">
        <div className="flex items-center justify-between text-base text-gray-600">
          <div className="flex items-center space-x-6">
            {post.likes_count > 0 && (
              <span className="font-medium">{post.likes_count} {post.likes_count === 1 ? 'like' : 'likes'}</span>
            )}
          </div>
          <div className="flex items-center space-x-6">
            {post.comments_count > 0 && (
              <span className="font-medium">{post.comments_count} {post.comments_count === 1 ? 'comment' : 'comments'}</span>
            )}
            {post.shares_count > 0 && (
              <span className="font-medium">{post.shares_count} {post.shares_count === 1 ? 'share' : 'shares'}</span>
            )}
          </div>
        </div>
      </div>

      {/* Post Actions */}
      <div className="px-6 py-4 border-t border-gray-100 relative">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="md"
            onClick={() => onLike?.(post.id, post.user.id)}
            className={`flex items-center space-x-3 px-4 py-3 transition-colors ${
              isLiked ? 'text-red-500 hover:text-red-600' : 'text-gray-600 hover:text-red-500'
            }`}
          >
            <Heart 
              size={22} 
              className={`transition-all duration-200 ${
                isLiked ? 'fill-current scale-110' : 'hover:scale-105'
              }`} 
            />
            <span className="font-medium">{isLiked ? 'Liked' : 'Like'}</span>
          </Button>

          <Button
            variant="ghost"
            size="md"
            onClick={() => {
              setCommentsExpanded(!commentsExpanded);
            }}
            className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:text-blue-500 transition-colors"
          >
            <MessageCircle size={22} />
            <span className="font-medium">Comment</span>
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
              size="md"
              onClick={() => onShare?.(post.id, isShared)}
              className={`flex items-center space-x-3 px-4 py-3 transition-colors ${
                isShared ? 'text-blue-500 hover:text-blue-600' : 'text-gray-600 hover:text-blue-500'
              }`}
            >
              <Share 
                size={22} 
                className={`transition-all duration-200 ${
                  isShared ? 'scale-110' : 'hover:scale-105'
                }`} 
              />
              <span className="font-medium">{isShared ? 'Shared' : 'Share'}</span>
            </Button>
          )}
        </div>
      </div>

      {commentsExpanded && (
        <CommentSection
          postId={post.id}
          commentsCount={post.comments_count}
          isExpanded={false}
        />
      )}
    </div>
  );
};

export default PostCardWithSlider;