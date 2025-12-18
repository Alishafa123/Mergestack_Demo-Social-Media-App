import React from 'react';
import { MapPin, Edit3, UserPlus } from 'lucide-react';
import Button from '../buttons/Button';
import ProfileStats from './ProfileStats';
import { userProfileController } from '../../../jotai/userprofile.atom';

interface ProfileHeaderProps {
  userId: string;
  isOwnProfile: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userId, isOwnProfile }) => {
  const { first_name, last_name, profile_url, bio, city, country } = userProfileController.useState([
    'first_name', 'last_name', 'profile_url', 'bio', 'city', 'country'
  ]);

  const fullName = `${first_name || ''} ${last_name || ''}`.trim() || 'User';
  const location = [city, country].filter(Boolean).join(', ');
  
  const handleEditProfile = () => {
    console.log('Edit profile clicked');
  };

  const handleFollowToggle = () => {
    // Handle follow/unfollow logic
    console.log('Follow toggle clicked');
  };

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      {/* Profile Info */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="mb-6">
            <div className="w-32 h-32 rounded-full border-4 border-gray-100 shadow-lg bg-white overflow-hidden mx-auto">
              {profile_url ? (
                <img
                  src={profile_url}
                  alt={fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">
                    {fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{fullName}</h1>
            {bio && (
              <p className="text-lg text-gray-600 mb-2 max-w-2xl mx-auto">{bio}</p>
            )}
            
            {location && (
              <div className="flex items-center justify-center text-gray-500 mb-4">
                <MapPin size={16} className="mr-1" />
                <span>{location}</span>
              </div>
            )}
            
            <div className="mb-6">
              <ProfileStats userId={userId} />
            </div>
            
            <div className="flex justify-center space-x-4">
              {isOwnProfile ? (
                <Button
                  onClick={handleEditProfile}
                  variant="outline"
                  size="md"
                  className="flex items-center space-x-2"
                >
                  <Edit3 size={18} />
                  <span>Edit Profile</span>
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleFollowToggle}
                    variant="primary"
                    size="md"
                    className="flex items-center space-x-2"
                  >
                    <UserPlus size={18} />
                    <span>Follow</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="md"
                    className="flex items-center space-x-2"
                  >
                    <span>Message</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;