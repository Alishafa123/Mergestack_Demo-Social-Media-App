import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLocation } from "react-router-dom";
import { useLogin } from "../../hooks/useAuth";
import { showToast } from "../../components/shared/toast";
import AuthIcon from "../../components/shared/Icons/AuthIcon";
import Button from "../../components/shared/buttons/Button";
import { CommonInput } from "../../components/shared/form";
import { loginSchema } from "../../schemas/authSchemas";
import type { LoginFormData } from "../../schemas/authSchemas";
import { Link } from "react-router-dom";

export default function Login() {
  const location = useLocation();
  const loginMutation = useLogin();
  
  useEffect(() => {
    if (location.state?.message) {
      showToast.success(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location]);
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema)
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  const getButtonText = () => {
    if (loginMutation.isPending) {
      return 'Signing in...';
    }
    return 'Sign in';
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
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-600">Sign in to your account to continue</p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <CommonInput 
              name="email" 
              label="Email address" 
              type="email" 
              register={register} 
              errors={errors} 
            />
            <CommonInput 
              name="password" 
              label="Password" 
              type="password" 
              register={register} 
              errors={errors} 
            />

            <Button 
              type="submit" 
              loading={loginMutation.isPending}
              disabled={loginMutation.isPending}
              fullWidth
              size="lg"
            >
              {getButtonText()}
            </Button>

            <div className="text-right">
              <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                Forgot password?
              </Link>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Don't have an account?{' '}
                <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                  Sign up here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
