import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import Button from '@components/shared/buttons/Button';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  title?: string;
  message?: string;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  title = "Delete Post",
  message = "Are you sure you want to delete this post? This action cannot be undone."
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-gray-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle size={20} className="text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isLoading}
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-600 text-base leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            loading={isLoading}
            disabled={isLoading}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? 'Deleting...' : 'Delete Post'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;