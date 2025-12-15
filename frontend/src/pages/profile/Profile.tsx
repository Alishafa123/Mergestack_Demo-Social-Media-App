import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import Alert from "../../components/Alert";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import SecondaryButton from "../../components/buttons/SecondaryButton";
import { TextField, TextAreaField, SelectField, DateField } from "../../components/form";
import ProfileImageUpload from "../../components/form/ProfileImageUpload";
import { profileSchema } from "../../schemas/profileSchemas";
import type { ProfileFormData } from "../../schemas/profileSchemas";
import { useUpdateProfile, useGetProfile } from "../../hooks/useProfile";

interface AlertState {
  show: boolean;
  variant: 'success' | 'error';
  message: string;
}

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

export default function Profile() {
  const navigate = useNavigate();
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    variant: 'success',
    message: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const { data: profileData, isLoading } = useGetProfile();
  const updateProfileMutation = useUpdateProfile();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
    defaultValues: {}
  });

  useEffect(() => {
    if (profileData?.user?.profile) {
      reset(profileData.user.profile);
    }
  }, [profileData, reset]);

  const showAlert = (variant: 'success' | 'error', message: string) => {
    setAlert({ show: true, variant, message });
    setTimeout(() => {
      setAlert(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const onSubmit = (data: ProfileFormData) => {
    const submitData = {
      ...data,
      ...(selectedFile && { profileImage: selectedFile })
    };

    updateProfileMutation.mutate(submitData, {
      onSuccess: () => {
        showAlert('success', 'Profile updated successfully!');
        setSelectedFile(null);
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || 'Failed to update profile. Please try again.';
        showAlert('error', errorMessage);
      }
    });
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-50"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full opacity-50"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-blue-200 rounded-full opacity-30"></div>
        <div className="absolute top-1/4 right-1/4 w-24 h-24 bg-purple-200 rounded-full opacity-30"></div>
      </div>
      
      <div className="max-w-2xl w-full space-y-8 relative z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          
          
          {alert.show && (
            <Alert variant={alert.variant} message={alert.message} />
          )}
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Picture */}
            <ProfileImageUpload
              currentImageUrl={profileData?.user?.profile?.profile_url}
              onFileSelect={setSelectedFile}
              disabled={updateProfileMutation.isPending}
              error={errors.profile_url?.message}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextField 
                name="first_name" 
                label="First Name" 
                placeholder="Enter your first name"
                register={register} 
                errors={errors} 
              />
              
              <TextField 
                name="last_name" 
                label="Last Name" 
                placeholder="Enter your last name"
                register={register} 
                errors={errors} 
              />
            </div>

            <TextField 
              name="phone" 
              label="Phone Number" 
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
              <TextField 
                name="city" 
                label="City" 
                placeholder="Enter your city"
                register={register} 
                errors={errors} 
              />
              
              <TextField 
                name="country" 
                label="Country" 
                placeholder="Enter your country"
                register={register} 
                errors={errors} 
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <SecondaryButton
                  title="Back to Dashboard"
                  type="button"
                  onClick={handleBackToDashboard}
                />
              </div>
              
              <div className="flex-1">
                <PrimaryButton 
                  type="submit" 
                  loading={updateProfileMutation.isPending}
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? "Updating Profile..." : "Update Profile"}
                </PrimaryButton>
              </div>
            </div>
          </form>
          )}
        </div>
      </div>
    </div>
  );
}