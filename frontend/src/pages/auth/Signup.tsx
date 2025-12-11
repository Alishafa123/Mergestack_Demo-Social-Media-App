import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSignup } from "../../hooks/useAuth";
import Alert from "../../components/Alert";
import AuthIcon from "../../components/AuthIcon";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import { EmailField, PasswordField, TextField } from "../../components/form";
import { signupSchema } from "../../schemas/authSchemas";
import type { SignupFormData } from "../../schemas/authSchemas";

interface AlertState {
  show: boolean;
  variant: 'success' | 'error';
  message: string;
}

export default function Signup() {
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    variant: 'success',
    message: ''
  });
  
  const signupMutation = useSignup();
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<SignupFormData>({
    resolver: yupResolver(signupSchema)
  });

  const showAlert = (variant: 'success' | 'error', message: string) => {
    setAlert({ show: true, variant, message });
    setTimeout(() => {
      setAlert(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  const onSubmit = (data: SignupFormData) => {
    signupMutation.mutate(data, {
      onSuccess: () => {
        showAlert('success', 'Account created successfully! Welcome aboard.');
      },
      onError: (error: any) => {
        const errorMessage = error?.response?.data?.message || 'Failed to create account. Please try again.';
        showAlert('error', errorMessage);
      }
    });
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
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Create Account</h2>
            <p className="mt-2 text-sm text-gray-600">Join us and start your journey</p>
          </div>
          
          {alert.show && (
            <Alert variant={alert.variant} message={alert.message} />
          )}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <TextField 
              name="name" 
              label="Full Name" 
              placeholder="Enter your full name"
              register={register} 
              errors={errors} 
            />
            
            <EmailField register={register} errors={errors} />
            
            <PasswordField register={register} errors={errors} />
            
            <PasswordField 
              name="confirmPassword"
              label="Confirm Password"
              placeholder="Confirm your password"
              register={register} 
              errors={errors} 
            />

            <PrimaryButton type="submit" loading={signupMutation.isPending}>
              {signupMutation.isPending ? "Creating Account..." : "Create Account"}
            </PrimaryButton>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Already have an account?{' '}
                <a href="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                  Sign in here
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}