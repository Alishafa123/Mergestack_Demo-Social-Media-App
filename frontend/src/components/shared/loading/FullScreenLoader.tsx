import React from 'react';

const FullScreenLoader: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="relative">
        <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200 border-t-blue-600"></div>
        <div
          className="absolute inset-2 animate-spin rounded-full h-16 w-16 border-4 border-gray-100 border-b-purple-500"
          style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-600 to-purple-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default FullScreenLoader;
