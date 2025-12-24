import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useSignup } from "../../hooks/useAuth";
import { BackgroundDesign } from "../../components/shared/backgrounds";
import AuthIcon from "../../components/shared/Icons/AuthIcon";
import Button from "../../components/shared/buttons/Button";
import { Input } from "../../components/shared/form";
import { signupSchema } from "../../schemas/authSchemas";
import type { SignupFormData } from "../../schemas/authSchemas";
import { Link } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const signupMutation = useSignup();
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignupFormData>({
    resolver: yupResolver(signupSchema)
  });

  const onSubmit = (data: SignupFormData) => {
    signupMutation.mutate(data, {
      onSuccess: () => {
        navigate('/login', { 
          state: { 
            message: 'Account created! Please check your email and confirm your account before logging in.',
            email: data.email 
          } 
        });
      }
    });
  };

  const getButtonText = () => {
    if (signupMutation.isPending) {
      return 'Creating account...';
    }
    return 'Create Account';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <BackgroundDesign />
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <div className="text-center mb-8">
            <AuthIcon />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Create Account</h2>
            <p className="mt-2 text-sm text-gray-600">Join us and start your journey</p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input 
              name="name" 
              label="Full Name" 
              placeholder="Enter your full name"
              register={register} 
              errors={errors} 
            />
            
            <Input 
              name="email" 
              label="Email address" 
              type="email" 
              register={register} 
              errors={errors} 
            />
            
            <Input 
              name="password" 
              label="Password" 
              type="password" 
              register={register} 
              errors={errors} 
            />
            
            <Input 
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              register={register} 
              errors={errors} 
            />

            <Button 
              type="submit" 
              loading={signupMutation.isPending}
              disabled={signupMutation.isPending}
              fullWidth
              size="lg"
            >
              {getButtonText()}
            </Button>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Already have an account?{' '}
                <Link to={'/login'} className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
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