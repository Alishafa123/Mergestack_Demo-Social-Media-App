import React from 'react';

interface UserHeaderProps {
  displayName: string;
  profileUrl?: string | null;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const UserHeader: React.FC<UserHeaderProps> = ({
  displayName,
  profileUrl,
  subtitle = "Sharing with everyone",
  size = 'md',
  className = ""
}) => {
  const sizeClasses = {
    sm: {
      container: "space-x-2",
      avatar: "w-8 h-8",
      text: "text-sm",
      name: "font-medium",
      subtitle: "text-xs"
    },
    md: {
      container: "space-x-3",
      avatar: "w-12 h-12",
      text: "text-lg",
      name: "font-semibold",
      subtitle: "text-sm"
    },
    lg: {
      container: "space-x-4",
      avatar: "w-16 h-16",
      text: "text-xl",
      name: "font-bold text-lg",
      subtitle: "text-base"
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`flex items-center ${currentSize.container} ${className}`}>
      <div className={`${currentSize.avatar} bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center`}>
        {profileUrl ? (
          <img
            src={profileUrl}
            alt={displayName}
            className={`${currentSize.avatar} rounded-full object-cover`}
          />
        ) : (
          <span className={`text-white font-semibold ${currentSize.text}`}>
            {displayName.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <div>
        <h2 className={`${currentSize.name} text-gray-900`}>
          {displayName}
        </h2>
        {subtitle && (
          <p className={`${currentSize.subtitle} text-gray-500`}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserHeader;