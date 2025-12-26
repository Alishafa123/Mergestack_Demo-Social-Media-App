import React from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@components/shared/ui/Avatar';

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
      avatar: "sm",
      text: "text-base",
      name: "font-medium",
      subtitle: "text-sm"
    },
    md: {
      container: "space-x-4",
      avatar: "lg",
      text: "text-xl",
      name: "font-semibold",
      subtitle: "text-base"
    },
    lg: {
      container: "space-x-5",
      avatar: "xl",
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
      <Avatar
        src={profileUrl}
        name={displayName}
        size={currentSize.avatar as any}
        onClick={handleprofileclick}
      />
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