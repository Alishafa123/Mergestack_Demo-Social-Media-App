import React from 'react';
import Button from '@components/shared/buttons/Button';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  message,
  onRetry = () => window.location.reload(),
  retryLabel = "Try Again"
}) => {
  return (
    <div className="text-center py-12">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-red-800 mb-2">
          {title}
        </h3>
        <p className="text-red-600 mb-4">
          {message}
        </p>
        <Button
          onClick={onRetry}
          variant="outline"
          size="sm"
        >
          {retryLabel}
        </Button>
      </div>
    </div>
  );
};

export default ErrorState;