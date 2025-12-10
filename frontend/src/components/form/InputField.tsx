import type { UseFormRegister, FieldErrors, RegisterOptions } from 'react-hook-form';

interface InputFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  validation?: RegisterOptions;
  className?: string;
}

export default function InputField({
  name,
  label,
  type = 'text',
  placeholder,
  register,
  errors,
  validation,
  className = ''
}: InputFieldProps) {
  const error = errors[name];

  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        id={name}
        type={type}
        {...register(name, validation)}
        className={`w-full px-4 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
          error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50 focus:bg-white'
        }`}
        placeholder={placeholder}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error.message as string}</p>
      )}
    </div>
  );
}