import { useState } from 'react';
import { Heart, MessageCircle, Share, MoreHorizontal } from 'lucide-react';
import Button from '../buttons/Button';

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
  createdAt: string;
  user: PostUser;
  images?: PostImage[];
}

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
  isLiked?: boolean;
  currentUserId?: string;
}

export default function PostCard({
  post,
  onLike,
  onComment,
  onShare,
  isLiked = false,
  currentUserId
}: PostCardProps) {
  const [showAllImages, setShowAllImages] = useState(false);
  
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

  const renderImages = () => {
    if (!post.images || post.images.length === 0) return null;

    const sortedImages = [...post.images].sort((a, b) => a.image_order - b.image_order);
    const imagesToShow = showAllImages ? sortedImages : sortedImages.slice(0, 4);

    return (
      <div className="mt-3">
        <div className={`grid gap-2 ${
          sortedImages.length === 1 ? 'grid-cols-1' :
          sortedImages.length === 2 ? 'grid-cols-2' :
          sortedImages.length === 3 ? 'grid-cols-2' :
          'grid-cols-2'
        }`}>
          {imagesToShow.map((image, index) => (
            <div
              key={image.id}
              className={`relative ${
                sortedImages.length === 3 && index === 0 ? 'row-span-2' : ''
              }`}
            >
              <img
                src={image.image_url}
                alt={`Post image ${index + 1}`}
                className="w-full h-64 object-cover rounded-lg"
              />
              {!showAllImages && index === 3 && sortedImages.length > 4 && (
                <div
                  className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center cursor-pointer"
                  onClick={() => setShowAllImages(true)}
                >
                  <span className="text-white text-xl font-semibold">
                    +{sortedImages.length - 4}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
        {showAllImages && sortedImages.length > 4 && (
          <button
            onClick={() => setShowAllImages(false)}
            className="mt-2 text-blue-600 text-sm hover:underline"
          >
            Show less
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            {post.user.profile?.profile_url ? (
              <img
                src={post.user.profile.profile_url}
                alt={displayName}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-white font-semibold text-sm">
                {displayName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{displayName}</h3>
            <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
          </div>
        </div>
        
        {currentUserId === post.user.id && (
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <MoreHorizontal size={20} className="text-gray-500" />
          </button>
        )}
      </div>

      {post.content && (
        <div className="mb-4">
          <p className="text-gray-900 whitespace-pre-wrap">{post.content}</p>
        </div>
      )}

      {renderImages()}

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-1 text-sm text-gray-500">
          {post.likes_count > 0 && (
            <span>{post.likes_count} {post.likes_count === 1 ? 'like' : 'likes'}</span>
          )}
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          {post.comments_count > 0 && (
            <span>{post.comments_count} {post.comments_count === 1 ? 'comment' : 'comments'}</span>
          )}
        </div>
      </div>

      {/* Post actions */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onLike?.(post.id)}
          className={`flex items-center space-x-2 ${isLiked ? 'text-red-500' : 'text-gray-600'}`}
        >
          <Heart size={18} className={isLiked ? 'fill-current' : ''} />
          <span>Like</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onComment?.(post.id)}
          className="flex items-center space-x-2 text-gray-600"
        >
          <MessageCircle size={18} />
          <span>Comment</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onShare?.(post.id)}
          className="flex items-center space-x-2 text-gray-600"
        >
          <Share size={18} />
          <span>Share</span>
        </Button>
      </div>
    </div>
  );
}