import React, { useState } from 'react';
import { MoreHorizontal, Reply, Edit, Trash2 } from 'lucide-react';
import UserHeader from '../user/UserHeader';
import Button from '../buttons/Button';
import CommentForm from './CommentForm';
import { useDeleteComment, useUpdateComment } from '../../../hooks/useComment';
import { AuthUtils } from '../../../utils/auth';
import type { Comment } from '../../../api/comment.api';

interface CommentItemProps {
  comment: Comment;
  postId: string;
  onReply?: (parentCommentId: string) => void;
  isReply?: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({ 
  comment, 
  postId, 
  onReply, 
  isReply = false 
}) => {
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  
  const currentUser = AuthUtils.getCurrentUser();
  const deleteCommentMutation = useDeleteComment();
  const updateCommentMutation = useUpdateComment();

  const isOwner = currentUser?.id === comment.user_id;

  const displayName = comment.user.profile?.first_name && comment.user.profile?.last_name
    ? `${comment.user.profile.first_name} ${comment.user.profile.last_name}`
    : comment.user.name;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const handleEdit = (content: string) => {
    updateCommentMutation.mutate(
      { commentId: comment.id, content },
      {
        onSuccess: () => {
          setIsEditing(false);
        }
      }
    );
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      deleteCommentMutation.mutate(comment.id);
    }
  };

  const handleReply = () => {
    if (onReply) {
      onReply(comment.id);
    } else {
      setShowReplyForm(true);
    }
  };

  return (
    <div className={`${isReply ? 'ml-8 mt-3' : 'mt-4'}`}>
      <div className="flex space-x-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            {comment.user.profile?.profile_url ? (
              <img
                src={comment.user.profile.profile_url}
                alt={displayName}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <span className="text-white font-semibold text-xs">
                {displayName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* Comment Content */}
        <div className="flex-1 min-w-0">
          {/* Comment Bubble */}
          <div className="bg-gray-100 rounded-2xl px-4 py-2 relative">
            {/* User Info */}
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-sm text-gray-900">
                {displayName}
              </span>
              {isOwner && (
                <div className="relative">
                  <button
                    onClick={() => setShowActions(!showActions)}
                    className="p-1 hover:bg-gray-200 rounded-full"
                  >
                    <MoreHorizontal size={14} className="text-gray-500" />
                  </button>
                  
                  {showActions && (
                    <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
                      <button
                        onClick={() => {
                          setIsEditing(true);
                          setShowActions(false);
                        }}
                        className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                      >
                        <Edit size={14} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => {
                          handleDelete();
                          setShowActions(false);
                        }}
                        className="flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                      >
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Comment Text */}
            {isEditing ? (
              <CommentForm
                initialValue={comment.content}
                onSubmit={handleEdit}
                onCancel={() => setIsEditing(false)}
                placeholder="Edit your comment..."
                submitText="Save"
                isLoading={updateCommentMutation.isPending}
              />
            ) : (
              <p className="text-gray-900 text-sm whitespace-pre-wrap">
                {comment.content}
              </p>
            )}
          </div>

          {/* Comment Actions */}
          <div className="flex items-center space-x-4 mt-1 ml-2">
            <span className="text-xs text-gray-500">
              {formatDate(comment.createdAt)}
            </span>
            
            {!isReply && (
              <button
                onClick={handleReply}
                className="flex items-center space-x-1 text-xs text-gray-500 hover:text-blue-600 font-medium"
              >
                <Reply size={12} />
                <span>Reply</span>
              </button>
            )}
          </div>

          {/* Reply Form */}
          {showReplyForm && (
            <div className="mt-3">
              <CommentForm
                postId={postId}
                parentCommentId={comment.id}
                onSuccess={() => setShowReplyForm(false)}
                onCancel={() => setShowReplyForm(false)}
                placeholder="Write a reply..."
                submitText="Reply"
              />
            </div>
          )}

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  postId={postId}
                  isReply={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;