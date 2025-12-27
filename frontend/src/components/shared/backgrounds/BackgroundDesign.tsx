import React from 'react';

interface BackgroundDesignProps {
  className?: string;
}

const BackgroundDesign: React.FC<BackgroundDesignProps> = ({ className = '' }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-50"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full opacity-50"></div>
      <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-blue-200 rounded-full opacity-30"></div>
      <div className="absolute top-1/4 right-1/4 w-24 h-24 bg-purple-200 rounded-full opacity-30"></div>
    </div>
  );
};

export default BackgroundDesign;
