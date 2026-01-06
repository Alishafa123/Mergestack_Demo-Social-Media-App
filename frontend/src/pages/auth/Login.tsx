import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, Link } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';

import { useLogin } from '@hooks/useAuth';
import { Input } from '@components/shared/form';
import { loginSchema } from '@schemas/authSchemas';
import { showToast } from '@components/shared/toast';
import { LOADING_MESSAGES } from '@constants/errors';
import Button from '@components/shared/buttons/Button';
import AuthIcon from '@components/shared/Icons/AuthIcon';
import type { LoginFormData } from '@schemas/authSchemas';
import { BackgroundDesign } from '@components/shared/backgrounds';

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const location = useLocation();
  const loginMutation = useLogin();
  const onSubmit = (data: LoginFormData) => loginMutation.mutate(data);
  const getButtonText = () => (loginMutation.isPending ? LOADING_MESSAGES.SIGNING_IN : 'Sign in');

  useEffect(() => {
    if (location.state?.message) {
      showToast.success(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <BackgroundDesign />

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="text-center mb-8">
            <AuthIcon />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-gray-600">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input name="email" label="Email address" type="email" register={register} errors={errors} />
            <Input name="password" label="Password" type="password" register={register} errors={errors} />

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
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
              >
                Forgot password?
              </Link>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                >
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
