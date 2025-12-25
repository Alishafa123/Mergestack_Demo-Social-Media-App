import React from 'react';
import { Navigate } from 'react-router-dom';
import { userController } from '@jotai/user.atom';
import { AuthUtils } from '@utils/auth';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ 
  children, 
  redirectTo = '/dashboard' 
}) => {
  const { id } = userController.useState(['id']);

  const isAuthenticated = id || AuthUtils.isAuthenticated();

  if (isAuthenticated) {
    // Redirect authenticated users away from public routes (like login/signup)
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;