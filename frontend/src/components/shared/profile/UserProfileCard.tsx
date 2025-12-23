import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Heart, MessageCircle, Share2, Edit, Loader2 } from 'lucide-react';
import { userController } from '../../../jotai/user.atom';
import { userProfileController } from '../../../jotai/userprofile.atom';
import { useGetUserStats } from '../../../hooks/useProfile';
import Button from '../buttons/Button';

const UserProfileCard: React.FC = () => {
  const navigate = useNavigate();
  const { name } = userController.useState(['name']);
  const { 
    first_name, 
    last_name, 
    profile_url, 
    bio, 
    city, 
    country 
  } = userProfileController.useState([
    'first_name', 
    'last_name', 
    'profile_url', 
    'bio', 
    'city', 
    'country'
  ]);

  const { data: statsData, isLoading: statsLoading, error: statsError } = useGetUserStats();
  
  const stats = {
    likes: statsData?.stats?.totalLikes || 0,
    comments: statsData?.stats?.totalComments || 0,
    shares: statsData?.stats?.totalShares || 0,
    posts: statsData?.stats?.totalPosts || 0
  };

  const displayName = first_name && last_name 
    ? `${first_name} ${last_name}` 
    : name || 'User';

  const location = city && country 
    ? `${city}, ${country}` 
    : city || country || null;

  const handleEditProfile = () => {
    navigate('/profile');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
      <div className="relative -m-8 mb-0 h-24 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-xl"></div>
      
      <div className="flex flex-col items-center text-center relative -mt-16 mb-8">
        {/* Profile Image */}
        <div className="w-32 h-32 mb-6">
          {profile_url ? (
            <img 
              src={profile_url} 
              alt="Profile" 
              className="w-full h-full object-cover rounded-full border-6 border-white shadow-xl"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center border-6 border-white shadow-xl">
              <span className="text-white text-4xl font-bold">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {displayName}
        </h3>

        {bio && (
          <p className="text-base text-gray-600 mb-4 px-2 leading-relaxed">
            {bio}
          </p>
        )}

        {location && (
          <div className="flex items-center text-base text-gray-500 mb-6">
            <MapPin size={18} className="mr-2" />
            <span>{location}</span>
          </div>
        )}

        <Button
          onClick={handleEditProfile}
          variant="primary"
          size="md"
          className="flex items-center space-x-2 px-6 py-3"
        >
          <Edit size={18} />
          <span>Edit Profile</span>
        </Button>
      </div>

      <div className="border-t border-gray-100 pt-6 mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">Activity Overview</h4>
        
        {statsLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : statsError ? (
          <div className="text-center py-4">
            <p className="text-sm text-red-500">Failed to load stats</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {/* Likes */}
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-red-50 rounded-full mx-auto mb-2 border-2 border-red-100">
                <Heart size={20} className="text-red-500" />
              </div>
              <div className="text-xl font-bold text-gray-900 mb-1">{stats.likes}</div>
              <div className="text-xs text-gray-500 font-medium">Likes</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-full mx-auto mb-2 border-2 border-blue-100">
                <MessageCircle size={20} className="text-blue-500" />
              </div>
              <div className="text-xl font-bold text-gray-900 mb-1">{stats.comments}</div>
              <div className="text-xs text-gray-500 font-medium">Comments</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-green-50 rounded-full mx-auto mb-2 border-2 border-green-100">
                <Share2 size={20} className="text-green-500" />
              </div>
              <div className="text-xl font-bold text-gray-900 mb-1">{stats.shares}</div>
              <div className="text-xs text-gray-500 font-medium">Shares</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-50 rounded-full mx-auto mb-2 border-2 border-purple-100">
                <Edit size={20} className="text-purple-500" />
              </div>
              <div className="text-xl font-bold text-gray-900 mb-1">{stats.posts}</div>
              <div className="text-xs text-gray-500 font-medium">Posts</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileCard;