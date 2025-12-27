import { useEffect, useState, type ReactNode } from 'react';
import { userProfileController } from '@jotai/userprofile.atom';
import { getProfile } from '@api/profile.api';
import { FullScreenLoader } from '@components/shared/loading';

interface ClientComponentProps {
  children: ReactNode;
}

export const ClientComponent = ({ children }: ClientComponentProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setIsLoading(true);
        const response = await getProfile();
        if (response && response.user && response.user.profile) {
          const profile = response.user.profile;

          userProfileController.setUserProfile(
            profile.user_id,
            profile.first_name,
            profile.last_name,
            profile.phone,
            profile.date_of_birth,
            profile.gender,
            profile.bio,
            profile.profile_url,
            profile.city,
            profile.country,
          );
        }
      } catch (error) {
        console.error('Failed to load user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return <>{children}</>;
};
