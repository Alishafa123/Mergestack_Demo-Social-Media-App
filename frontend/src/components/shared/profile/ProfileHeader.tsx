import React from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Edit3, UserPlus, UserMinus} from 'lucide-react';
import Button from '../buttons/Button';
import ProfileStats from './ProfileStats';
import { useGetProfile, useGetProfileById } from '../../../hooks/useProfile';
import { useGetFollowStatus, useFollowUser, useUnfollowUser } from '../../../hooks/useUser';
import { userController } from '../../../jotai/user.atom';

interface ProfileHeaderProps {
  userId?: string;
  isOwnProfile?: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userId: propUserId, isOwnProfile: propIsOwnProfile }) => {
  const { userId: paramUserId } = useParams();
  const currentUser = userController.useState(['id']);
  
  const userId = propUserId || paramUserId;
  const isOwnProfile = propIsOwnProfile ?? (!userId || userId === currentUser.id);
  
  const { data: ownProfileData } = useGetProfile();
  const { data: otherProfileData } = useGetProfileById(userId || '');
  const { data: followStatusData, isLoading: followStatusLoading } = useGetFollowStatus(userId || '');
  
  const followUserMutation = useFollowUser();
  const unfollowUserMutation = useUnfollowUser();
  
  const profileData = isOwnProfile ? ownProfileData : otherProfileData;
  const profile = profileData?.user?.profile;
  const isFollowing = followStatusData?.isFollowing || false;

  const first_name = profile?.first_name || '';
  const last_name = profile?.last_name || '';
  const profile_url = profile?.profile_url || '';
  const bio = profile?.bio || '';
  const city = profile?.city || '';
  const country = profile?.country || '';

  const fullName = `${first_name} ${last_name}`.trim() || 'User';
  const location = [city, country].filter(Boolean).join(', ');
  
  const handleEditProfile = () => {
    console.log('Edit profile clicked');
  };

  const handleFollowToggle = async () => {
    if (!userId) return;
    
    try {
      if (isFollowing) {
        await unfollowUserMutation.mutateAsync(userId);
      } else {
        await followUserMutation.mutateAsync(userId);
      }
    } catch (error) {
      console.error('Follow toggle failed:', error);
    }
  };
  const isFollowLoading = followUserMutation.isPending || unfollowUserMutation.isPending;

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
              <ProfileStats userId={userId || ''} />
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
                    variant={isFollowing ? "outline" : "primary"}
                    size="md"
                    className="flex items-center space-x-2"
                    disabled={isFollowLoading || followStatusLoading}
                  >
                    {isFollowLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-current"></div>
                    ) : isFollowing ? (
                      <UserMinus size={18} />
                    ) : (
                      <UserPlus size={18} />
                    )}
                    <span>
                      {isFollowLoading 
                        ? 'Loading...' 
                        : isFollowing 
                          ? 'Unfollow' 
                          : 'Follow'
                      }
                    </span>
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