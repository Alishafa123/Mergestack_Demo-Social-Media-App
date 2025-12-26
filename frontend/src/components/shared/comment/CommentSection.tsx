import React, { useState } from 'react';
import { MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';

import Button from '@components/shared/buttons/Button';
import CommentForm from '@components/shared/comment/CommentForm';
import CommentList from '@components/shared/comment/CommentList';

interface CommentSectionProps {
  postId: string;
  commentsCount: number;
  isExpanded?: boolean;
  onToggle?: () => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  postId,
  commentsCount,
  isExpanded = false,
  onToggle
}) => {
  const [showComments, setShowComments] = useState(isExpanded);

  const handleToggle = () => {
    const newState = !showComments;
    setShowComments(newState);
    onToggle?.();
  };

  return (
    <div className="border-t border-gray-100">
      {/* Comments Toggle */}
      {commentsCount > 0 && (
        <div className="px-4 py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggle}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
          >
            <MessageCircle size={16} />
            <span>
              {showComments ? 'Hide' : 'View'} {commentsCount} {commentsCount === 1 ? 'comment' : 'comments'}
            </span>
            {showComments ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </Button>
        </div>
      )}

      {/* Comment Form */}
      <div className="px-4 py-3">
        <CommentForm
          postId={postId}
          placeholder="Write a comment..."
        />
      </div>

      {/* Comments List */}
      {showComments && (
        <div className="px-4 pb-4">
          <CommentList postId={postId} />
        </div>
      )}
    </div>
  );
};

export default CommentSection;