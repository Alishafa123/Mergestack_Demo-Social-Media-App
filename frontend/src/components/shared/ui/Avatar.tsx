import React from 'react';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  name: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  onClick?: () => void;
  showBorder?: boolean;
  borderColor?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = 'md',
  className = '',
  onClick,
  showBorder = false,
  borderColor = 'border-white',
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-24 h-24 text-2xl',
    '2xl': 'w-32 h-32 text-4xl',
  };

  const borderClasses = showBorder ? `border-4 ${borderColor} shadow-lg` : '';
  const cursorClass = onClick ? 'cursor-pointer' : '';

  const getInitials = (name: string): string => {
    if (!name) return 'U';

    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }

    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <div
      className={`
        ${sizeClasses[size]} 
        bg-gradient-to-r from-blue-500 to-purple-500 
        rounded-full 
        flex items-center justify-center 
        overflow-hidden 
        ${borderClasses} 
        ${cursorClass} 
        ${className}
      `}
      onClick={onClick}
    >
      {src ? (
        <img
          src={src}
          alt={alt || name}
          className={`${sizeClasses[size]} rounded-full object-cover`}
          onError={(e) => {
            // Hide the image and show initials on error
            e.currentTarget.style.display = 'none';
          }}
        />
      ) : null}

      {/* Initials fallback - always rendered but hidden when image loads */}
      <span
        className={`
          text-white font-semibold 
          ${sizeClasses[size].split(' ')[2]} 
          ${src ? 'absolute' : ''}
        `}
        style={src ? { zIndex: -1 } : {}}
      >
        {getInitials(name)}
      </span>
    </div>
  );
};

export default Avatar;
