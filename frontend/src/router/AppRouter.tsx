import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "@pages/auth/Login";
import Signup from "@pages/auth/Signup";
import Profile from "@pages/profile/Profile";
import Dashboard from "@pages/dashboard/Dashboard";
import UserTimeline from "@pages/user/UserTimeline";
import { ClientComponent } from "@components/client";
import ResetPassword from "@pages/auth/ResetPassword";
import ForgotPassword from "@pages/auth/ForgotPassword";
import { ProtectedRoute, PublicRoute } from "@components/auth";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            <PublicRoute>
              <Navigate to="/login" replace />
            </PublicRoute>
          } 
        />
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/signup" 
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          } 
        />
        <Route 
          path="/forgot-password" 
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          } 
        />
        <Route 
          path="/reset-password" 
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          } 
        />

        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <ClientComponent>
                <Dashboard />
              </ClientComponent>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ClientComponent>
                <Profile />
              </ClientComponent>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/timeline" 
          element={
            <ProtectedRoute>
              <ClientComponent>
                <UserTimeline />
              </ClientComponent>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user/:userId" 
          element={
            <ProtectedRoute>
              <ClientComponent>
                <UserTimeline />
              </ClientComponent>
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
