import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForgotPassword } from "../../hooks/useAuth";
import { BackgroundDesign } from "../../components/shared/backgrounds";
import AuthIcon from "../../components/shared/Icons/AuthIcon";
import Button from "../../components/shared/buttons/Button";
import { Input } from "../../components/shared/form";
import { forgotPasswordSchema } from "../../schemas/authSchemas";
import type { ForgotPasswordFormData } from "../../schemas/authSchemas";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const forgotPasswordMutation = useForgotPassword();
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema)
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPasswordMutation.mutate(data);
  };

  const getButtonText = () => {
    if (forgotPasswordMutation.isPending) {
      return 'Sending reset link...';
    }
    return 'Send Reset Link';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <BackgroundDesign />
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="text-center mb-8">
            <AuthIcon />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Forgot Password</h2>
            <p className="mt-2 text-sm text-gray-600">Enter your email to receive a password reset link</p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input 
              name="email" 
              label="Email address" 
              type="email" 
              placeholder="Enter your email"
              register={register} 
              errors={errors} 
            />

            <Button 
              type="submit" 
              loading={forgotPasswordMutation.isPending}
              disabled={forgotPasswordMutation.isPending}
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
