import { useState } from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';

interface PasswordFieldProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  name?: string;
  label?: string;
  placeholder?: string;
  minLength?: number;
  className?: string;
}

export default function PasswordField({ 
  register, 
  errors, 
  name = 'password',
  label = 'Password',
  placeholder = 'Enter your password',
  className = ''
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const error = errors[name];

  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          id={name}
          type={showPassword ? 'text' : 'password'}
          {...register(name)}
          className={`w-full px-4 py-3 pr-12 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
            error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50 focus:bg-white'
          }`}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          {showPassword ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error.message as string}</p>
      )}
    </div>
  );
}