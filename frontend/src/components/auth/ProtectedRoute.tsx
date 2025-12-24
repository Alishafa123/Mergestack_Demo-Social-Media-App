import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { userController } from '@jotai/user.atom';
import { AuthUtils } from '@utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { id } = userController.useState(['id']);
  const location = useLocation();

  const isAuthenticated = id || AuthUtils.isAuthenticated();

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;