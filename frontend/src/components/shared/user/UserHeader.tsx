import React from 'react';
import { useNavigate } from 'react-router-dom';

interface UserHeaderProps {
  userId:string
  displayName: string;
  profileUrl?: string | null;
  subtitle?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const UserHeader: React.FC<UserHeaderProps> = ({
  userId,
  displayName,
  profileUrl,
  subtitle = "Sharing with everyone",
  size = 'md',
  className = ""
}) => {
  const navigate = useNavigate();
  const sizeClasses = {
    sm: {
      container: "space-x-3",
      avatar: "w-10 h-10",
      text: "text-base",
      name: "font-medium",
      subtitle: "text-sm"
    },
    md: {
      container: "space-x-4",
      avatar: "w-14 h-14",
      text: "text-xl",
      name: "font-semibold",
      subtitle: "text-base"
    },
    lg: {
      container: "space-x-5",
      avatar: "w-18 h-18",
      text: "text-2xl",
      name: "font-bold text-xl",
      subtitle: "text-lg"
    }
  };

  const currentSize = sizeClasses[size];
  const handleprofileclick=()=>{
  navigate(`/user/${userId}`)
  }

  return (
    <div className={`flex items-center cursor-pointer ${currentSize.container} ${className}`} onClick={handleprofileclick}>
      <div className={`${currentSize.avatar} bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center`} >
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