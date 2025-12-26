import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { AuthUtils } from '@utils/auth';
import { userController } from '@jotai/user.atom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { id } = userController.useState(['id']);
  const location = useLocation();

  const isAuthenticated = id || AuthUtils.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;