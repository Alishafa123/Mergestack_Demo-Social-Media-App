import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Edit, Loader2, UserPlus, UserMinus } from 'lucide-react';

import { userController } from '@jotai/user.atom';
import { useGetProfileById } from '@hooks/useProfile';
import Button from '@components/shared/buttons/Button';
import UserStats from '@components/shared/profile/UserStats';
import { userProfileController } from '@jotai/userprofile.atom';
import { useFollowUser, useUnfollowUser, useGetFollowStatus } from '@hooks/useUser';
import Button from '@components/shared/buttons/Button';
import UserStats from './UserStats';
import { formatLocalDate } from '@utils/dateUtils';
import Avatar from '@components/shared/ui/Avatar';

const UserProfileCard: React.FC = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const { name } = userController.useState(['name']);
  var isViewingOtherUser;
    
  const { 
    id: currentUserId,
    first_name: currentFirstName, 
    last_name: currentLastName, 
    phone: currentPhone,
    date_of_birth: currentDateOfBirth,
    gender: currentGender,
    profile_url: currentProfileUrl, 
    bio: currentBio, 
    city: currentCity, 
    country: currentCountry 
  } = userProfileController.useState([
    'id',
    'first_name', 
    'last_name', 
    'phone',
    'date_of_birth',
    'gender',
    'profile_url', 
    'bio', 
    'city', 
    'country'
  ]);

  if(userId){
     isViewingOtherUser = currentUserId!=userId;
  }
  else{
   isViewingOtherUser = false;
  }
  
  const { data: otherUserProfile, isLoading: profileLoading } = useGetProfileById(userId || '');
  const { data: followStatus, isLoading: followStatusLoading } = useGetFollowStatus(userId || '');
  const followMutation = useFollowUser();
  const unfollowMutation = useUnfollowUser();

  const profileData = isViewingOtherUser ? otherUserProfile?.user?.profile : {
    id: currentUserId,
    first_name: currentFirstName,
    last_name: currentLastName,
    phone: currentPhone,
    date_of_birth: currentDateOfBirth,
    gender: currentGender,
    profile_url: currentProfileUrl,
    bio: currentBio,
    city: currentCity,
    country: currentCountry
  };

  const displayName = profileData?.first_name && profileData?.last_name 
    ? `${profileData.first_name} ${profileData.last_name}` 
    : (isViewingOtherUser ? otherUserProfile?.user?.name : name) || 'User';

  const location = profileData?.city && profileData?.country 
    ? `${profileData.city}, ${profileData.country}` 
    : profileData?.city || profileData?.country || null;

  const handleEditProfile = () => {
    navigate('/profile?mode=edit');
  };

  const handleFollowToggle = () => {
    if (!userId) return;
    
    const isFollowing = followStatus?.isFollowing;
    if (isFollowing) {
      unfollowMutation.mutate(userId);
    } else {
      followMutation.mutate(userId);
    }
  };

  if (isViewingOtherUser && profileLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="relative h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
        <div className="relative px-6 pb-6">
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="relative h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      
      <div className="relative px-6 pb-6">
        <div className="flex justify-center -mt-12 mb-4">
          <Avatar
            src={profileData?.profile_url}
            name={displayName}
            size="xl"
            showBorder={true}
            borderColor="border-white"
          />
        </div>

        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            {displayName}
          </h3>
          {profileData?.bio && (
            <p className="text-base text-gray-600 leading-relaxed">
              {profileData.bio}
            </p>
          )}
        </div>

        <div className="space-y-4 mb-6">
          <h4 className="text-base font-semibold text-gray-800 border-b border-gray-200 pb-2">
            Personal Information
          </h4>
          
          <div className="grid grid-cols-1 gap-3">
            {location && (
              <div className="flex items-center text-base">
                <MapPin size={18} className="text-gray-400 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{location}</span>
              </div>
            )}
            
            {profileData?.phone && (
              <div className="flex items-center text-base">
                <div className="w-5 h-5 mr-3 flex-shrink-0 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">📞</span>
                </div>
                <span className="text-gray-700">{profileData.phone}</span>
              </div>
            )}
            
            {profileData?.date_of_birth && (
              <div className="flex items-center text-base">
                <div className="w-5 h-5 mr-3 flex-shrink-0 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">🎂</span>
                </div>
                <span className="text-gray-700">{formatLocalDate(profileData.date_of_birth)}</span>
              </div>
            )}
            
            {profileData?.gender && (
              <div className="flex items-center text-base">
                <div className="w-5 h-5 mr-3 flex-shrink-0 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">👤</span>
                </div>
                <span className="text-gray-700 capitalize">{profileData.gender}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mb-6">
          {!isViewingOtherUser ? (
            <Button
              onClick={handleEditProfile}
              variant="primary"
              size="md"
              className="w-full flex items-center justify-center space-x-2 py-3 text-base"
            >
              <Edit size={18} />
              <span>Edit Profile</span>
            </Button>
          ) : (
            <Button
              onClick={handleFollowToggle}
              variant={followStatus?.isFollowing ? "secondary" : "primary"}
              size="md"
              loading={followMutation.isPending || unfollowMutation.isPending || followStatusLoading}
              disabled={followMutation.isPending || unfollowMutation.isPending || followStatusLoading}
              className="w-full flex items-center justify-center space-x-2 py-3 text-base"
            >
              {followStatus?.isFollowing ? (
                <>
                  <UserMinus size={18} />
                  <span>Unfollow</span>
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  <span>Follow</span>
                </>
              )}
            </Button>
          )}
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-base font-semibold text-gray-800 mb-4 text-center">Activity Overview</h4>
          
          <UserStats 
            userId={userId}
            isViewingOtherUser={isViewingOtherUser}
          />
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;