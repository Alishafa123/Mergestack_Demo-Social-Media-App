import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useResetPassword } from "../../hooks/useAuth";
import { showToast } from "../../components/shared/toast";
import AuthIcon from "../../components/shared/Icons/AuthIcon";
import Button from "../../components/shared/buttons/Button";
import { CommonInput } from "../../components/shared/form";
import { resetPasswordSchema } from "../../schemas/authSchemas";
import type { ResetPasswordFormData } from "../../schemas/authSchemas";
import { Link } from "react-router-dom";

export default function ResetPassword() {
  const [token, setToken] = useState<string | null>(null);
  const resetPasswordMutation = useResetPassword();
  
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      const tokenType = params.get('type');
      
      console.log('URL Hash params:', {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
        tokenType
      });
      
      if (accessToken && tokenType === 'recovery') {
        const tokenData = JSON.stringify({
          access_token: accessToken,
          refresh_token: refreshToken || ''
        });
        setToken(tokenData);
      } else {
        showToast.error('Invalid or missing reset token. Please request a new password reset link.');
      }
    } else {
      showToast.error('Invalid or missing reset token. Please request a new password reset link.');
    }
  }, []);
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordSchema)
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!token) {
      showToast.error('Invalid reset token. Please request a new password reset link.');
      return;
    }
    
    resetPasswordMutation.mutate({ ...data, token });
  };

  const getButtonText = () => {
    if (resetPasswordMutation.isPending) {
      return 'Resetting password...';
    }
    return 'Reset Password';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-50"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full opacity-50"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-blue-200 rounded-full opacity-30"></div>
        <div className="absolute top-1/4 right-1/4 w-24 h-24 bg-purple-200 rounded-full opacity-30"></div>
      </div>
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="text-center mb-8">
            <AuthIcon />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Reset Password</h2>
            <p className="mt-2 text-sm text-gray-600">Enter your new password</p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <CommonInput 
              name="password" 
              label="New Password" 
              type="password" 
              placeholder="Enter new password"
              register={register} 
              errors={errors} 
            />
            
            <CommonInput 
              name="confirmPassword"
              label="Confirm New Password"
              type="password"
              placeholder="Confirm new password"
              register={register} 
              errors={errors} 
            />

            <Button 
              type="submit" 
              loading={resetPasswordMutation.isPending}
              disabled={resetPasswordMutation.isPending || !token}
              fullWidth
              size="lg"
            >
              {getButtonText()}
            </Button>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Remember your password?{' '}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
