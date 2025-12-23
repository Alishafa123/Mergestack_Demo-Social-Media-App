import type { FieldErrors, UseFormRegister, RegisterOptions } from 'react-hook-form';

interface TextAreaFieldProps {
  name: string;
  label: string;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  placeholder?: string;
  rows?: number;
  validation?: RegisterOptions;
  className?: string;
}

export default function TextAreaField({
  name,
  label,
  register,
  errors,
  placeholder,
  rows = 4,
  validation,
  className = ''
}: TextAreaFieldProps) {
  const error = errors[name];

  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <textarea
        id={name}
        {...register(name, validation)}
        rows={rows}
        placeholder={placeholder}
        className={`w-full px-4 py-3 border rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-vertical ${
          error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50 focus:bg-white'
        }`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error.message as string}</p>
      )}
    </div>
  );
}