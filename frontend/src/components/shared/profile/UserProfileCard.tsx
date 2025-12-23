import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MapPin, Heart, MessageCircle, Share2, Edit, Loader2, UserPlus, UserMinus, Users } from 'lucide-react';
import { userController } from '../../../jotai/user.atom';
import { userProfileController } from '../../../jotai/userprofile.atom';
import { useGetUserStats, useGetProfileById, useGetUserStatsById } from '../../../hooks/useProfile';
import { useFollowUser, useUnfollowUser, useGetFollowStatus } from '../../../hooks/useUser';
import Button from '../buttons/Button';

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
  const { data: otherUserStats, isLoading: otherStatsLoading, error: otherStatsError } = useGetUserStatsById(userId || '');
  const { data: currentUserStats, isLoading: currentStatsLoading, error: currentStatsError } = useGetUserStats({
    enabled: !isViewingOtherUser
  });

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

  const statsData = isViewingOtherUser ? otherUserStats : currentUserStats;
  const statsLoading = isViewingOtherUser ? otherStatsLoading : currentStatsLoading;
  const statsError = isViewingOtherUser ? otherStatsError : currentStatsError;
  
  const stats = {
    likes: statsData?.stats?.totalLikes || 0,
    comments: statsData?.stats?.totalComments || 0,
    shares: statsData?.stats?.totalShares || 0,
    posts: statsData?.stats?.totalPosts || 0,
    followers: statsData?.stats?.followersCount || 0,
    following: statsData?.stats?.followingCount || 0
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

  const statsConfig = [
  {
    label: "Likes",
    value: stats.likes,
    icon: Heart,
    bg: "bg-red-50",
    border: "border-red-100",
    text: "text-red-500",
  },
  {
    label: "Comments",
    value: stats.comments,
    icon: MessageCircle,
    bg: "bg-blue-50",
    border: "border-blue-100",
    text: "text-blue-500",
  },
  {
    label: "Shares",
    value: stats.shares,
    icon: Share2,
    bg: "bg-green-50",
    border: "border-green-100",
    text: "text-green-500",
  },
  {
    label: "Posts",
    value: stats.posts,
    icon: Edit,
    bg: "bg-purple-50",
    border: "border-purple-100",
    text: "text-purple-500",
  },
  {
    label: "Followers",
    value: stats.followers,
    icon: Users,
    bg: "bg-indigo-50",
    border: "border-indigo-100",
    text: "text-indigo-500",
  },
  {
    label: "Following",
    value: stats.following,
    icon: UserPlus,
    bg: "bg-teal-50",
    border: "border-teal-100",
    text: "text-teal-500",
  },
];

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
          <div className="w-24 h-24">
            {profileData?.profile_url ? (
              <img 
                src={profileData.profile_url} 
                alt="Profile" 
                className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                <span className="text-white text-2xl font-bold">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
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
                <span className="text-gray-700">{new Date(profileData.date_of_birth).toLocaleDateString()}</span>
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
            
            {profileData?.id && (
              <div className="flex items-center text-base">
                <div className="w-5 h-5 mr-3 flex-shrink-0 flex items-center justify-center">
                  <span className="text-gray-400 text-sm">#</span>
                </div>
                <span className="text-gray-700 font-mono text-sm truncate">{profileData.id}</span>
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
          
          {statsLoading ? (
            <div className="flex justify-center py-6">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          ) : statsError ? (
            <div className="text-center py-4">
              <p className="text-sm text-red-500">Failed to load stats</p>
            </div>
          ) : (<div className="grid grid-cols-2 gap-4">
  {statsConfig.map(({ label, value, icon: Icon, bg, border, text }) => (
    <div
      key={label}
      className={`flex flex-col items-center p-4 rounded-xl border ${border} bg-white 
                 hover:shadow-md transition-shadow duration-200`}
    >
      <div
        className={`flex items-center justify-center w-11 h-11 rounded-full mb-3 border ${bg} ${border}`}
      >
        <Icon size={18} className={text} />
      </div>

      <div className="text-xl font-semibold text-gray-900">
        {value}
      </div>

      <div className="text-sm text-gray-500">
        {label}
      </div>
    </div>
  ))}
</div>

          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;