import React from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '@components/shared/buttons/Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionPath?: string;
  showAction?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel = "Create Post",
  actionPath = "/create-post",
  showAction = true
}) => {
  const navigate = useNavigate();

  return (
    <div className="text-center py-12">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
        {icon && (
          <div className="flex justify-center mb-4">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          {title}
        </h3>
        <p className="text-gray-500 mb-4">
          {description}
        </p>
        {showAction && (
          <Button
            onClick={() => navigate(actionPath)}
            variant="primary"
            size="md"
          >
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;