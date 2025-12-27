import { useState } from "react";
import { Edit, Eye } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useSearchParams } from "react-router-dom";

import { showToast } from "@components/shared/toast";
import { useUpdateProfile } from "@hooks/useProfile";
import Navbar from "@components/shared/navbar/Navbar";
import Button from "@components/shared/buttons/Button";
import { profileSchema } from "@schemas/profileSchemas";
import type { ProfileFormData } from "@schemas/profileSchemas";
import { userProfileController } from "@jotai/userprofile.atom";
import { formatLocalDate } from "@utils/dateUtils";
import Avatar from "@components/shared/ui/Avatar";

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

export default function Profile() {
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'view'; // Default to view mode
  const isEditMode = mode === 'edit';
  
  const {first_name, last_name, phone, date_of_birth, gender, bio, profile_url, city, country} = userProfileController.useState([
    'first_name', 'last_name', 'phone', 'date_of_birth', 
    'gender', 'bio', 'profile_url', 'city', 'country'
  ]);
  
  
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const updateProfileMutation = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      first_name: first_name || '',
      last_name: last_name || '',
      phone: phone || '',
      date_of_birth: date_of_birth || '',
      gender: (gender as 'male' | 'female' )|| '',
      bio: bio || '',
      city: city || '',
      country: country || '',
    }
  });

  const displayName = first_name && last_name 
    ? `${first_name} ${last_name}` 
    : 'User';

  const location = city && country 
    ? `${city}, ${country}` 
    : city || country || null;

  const onSubmit = (data: ProfileFormData) => {
    const submitData = {
      ...data,
      ...(selectedFile && { profileImage: selectedFile })
    };

    updateProfileMutation.mutate(submitData, {
      onSuccess: () => {
        showToast.success('Profile updated successfully! 👤');
        setSelectedFile(null);
        // Switch back to view mode after successful update
        setSearchParams({ mode: 'view' });
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || 'Failed to update profile. Please try again.';
        showToast.error(errorMessage);
      }
    });
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const handleModeToggle = () => {
    const newMode = isEditMode ? 'view' : 'edit';
    setSearchParams({ mode: newMode });
    
    // Clear selected file when switching modes
    if (newMode === 'view') {
      setSelectedFile(null);
    }
  };

  const getButtonText = () => {
    if (updateProfileMutation.isPending) {
      return 'Updating profile...';
    }
    return 'Update Profile';
  };

  const renderViewMode = () => (
    <div className="space-y-6">
      {/* Profile Image Display */}
      <div className="flex justify-center mb-6">
        <Avatar
          src={profile_url}
          name={displayName}
          size="2xl"
          showBorder={true}
          borderColor="border-white"
        />
      </div>

      {/* Name */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{displayName}</h2>
        {bio && (
          <p className="text-lg text-gray-600 leading-relaxed">{bio}</p>
        )}
      </div>

      {/* Profile Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {phone && (
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <p className="text-base text-gray-900">{phone}</p>
          </div>
        )}

        {date_of_birth && (
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <p className="text-base text-gray-900">{formatLocalDate(date_of_birth)}</p>
          </div>
        )}

        {gender && (
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <p className="text-base text-gray-900 capitalize">{gender}</p>
          </div>
        )}

        {location && (
          <div className="bg-gray-50 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <p className="text-base text-gray-900">{location}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <Button
          variant="secondary"
          type="button"
          onClick={handleBackToDashboard}
          fullWidth
          size="lg"
        >
          Back to Dashboard
        </Button>

        <Button
          type="button"
          onClick={handleModeToggle}
          fullWidth
          size="lg"
          className="flex items-center justify-center space-x-2"
        >
          <Edit size={20} />
          <span>Edit Profile</span>
        </Button>
      </div>
    </div>
  );

  const renderEditMode = () => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <ProfileImageUpload
        currentImageUrl={profile_url}
        onFileSelect={setSelectedFile}
        disabled={updateProfileMutation.isPending}
        error={errors.profile_url?.message}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          name="first_name"
          label="First Name"
          placeholder="Enter your first name"
          register={register}
          errors={errors}
        />

        <Input
          name="last_name"
          label="Last Name"
          placeholder="Enter your last name"
          register={register}
          errors={errors}
        />
      </div>

      <Input
        name="phone"
        label="Phone Number"
        type="tel"
        placeholder="Enter your phone number"
        register={register}
        errors={errors}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DateField
          name="date_of_birth"
          label="Date of Birth"
          register={register}
          errors={errors}
        />

        <SelectField
          name="gender"
          label="Gender"
          register={register}
          errors={errors}
          options={genderOptions}
          placeholder="Select gender"
          defaultValue={gender || ''}
        />
      </div>

      <TextAreaField
        name="bio"
        label="Bio"
        register={register}
        errors={errors}
        placeholder="Tell us about yourself..."
        rows={4}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          name="city"
          label="City"
          placeholder="Enter your city"
          register={register}
          errors={errors}
        />

        <Input
          name="country"
          label="Country"
          placeholder="Enter your country"
          register={register}
          errors={errors}
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="secondary"
          type="button"
          onClick={handleModeToggle}
          fullWidth
          size="lg"
          className="flex items-center justify-center space-x-2"
        >
          <Eye size={20} />
          <span>Cancel Edit</span>
        </Button>

        <Button
          type="submit"
          loading={updateProfileMutation.isPending}
          disabled={updateProfileMutation.isPending}
          fullWidth
          size="lg"
        >
          {getButtonText()}
        </Button>
      </div>
    </form>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <div className="flex-1 bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <BackgroundDesign />

        <div className="max-w-2xl w-full space-y-8 relative z-10">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditMode ? 'Edit Profile' : 'My Profile'}
              </h1>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span className={`px-3 py-1 rounded-full ${
                  isEditMode 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {isEditMode ? 'Edit Mode' : 'View Mode'}
                </span>
              </div>
            </div>

            {isEditMode ? renderEditMode() : renderViewMode()}
          </div>
        </div>
      </div>
    </div>
  );
}