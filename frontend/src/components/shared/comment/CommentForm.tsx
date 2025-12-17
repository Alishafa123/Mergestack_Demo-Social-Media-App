import React, { useState } from 'react';
import { Send } from 'lucide-react';
import Button from '../buttons/Button';
import { useCreateComment } from '../../../hooks/useComment';
import { validateComment } from '../../../schemas/commentSchemas';

interface CommentFormProps {
  postId?: string;
  parentCommentId?: string;
  initialValue?: string;
  placeholder?: string;
  submitText?: string;
  onSubmit?: (content: string) => void;
  onSuccess?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

const CommentForm: React.FC<CommentFormProps> = ({
  postId,
  parentCommentId,
  initialValue = '',
  placeholder = 'Write a comment...',
  submitText = 'Post',
  onSubmit,
  onSuccess,
  onCancel,
  isLoading = false
}) => {
  const [content, setContent] = useState(initialValue);
  const [error, setError] = useState<string>('');
  
  const createCommentMutation = useCreateComment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate content
    const validation = validateComment(content);
    if (!validation.isValid) {
      setError(validation.errors[0]);
      return;
    }

    setError('');

    if (onSubmit) {
      onSubmit(content);
      return;
    }

    if (!postId) {
      setError('Post ID is required');
      return;
    }

    try {
      await createCommentMutation.mutateAsync({
        postId,
        data: {
          content,
          parentCommentId
        }
      });
      
      setContent('');
      onSuccess?.();
    } catch (error) {
      setError('Failed to post comment. Please try again.');
    }
  };

  const handleCancel = () => {
    setContent(initialValue);
    setError('');
    onCancel?.();
  };

  const isSubmitting = isLoading || createCommentMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex space-x-3">
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={2}
            disabled={isSubmitting}
          />
          {error && (
            <p className="text-red-500 text-sm mt-1">{error}</p>
          )}
        </div>
        
        <div className="flex flex-col space-y-2">
          <Button
            type="submit"
            size="sm"
            disabled={!content.trim() || isSubmitting}
            className="flex items-center space-x-1"
          >
            <Send size={14} />
            <span>{submitText}</span>
          </Button>
          
          {onCancel && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </form>
  );
};

export default CommentForm;