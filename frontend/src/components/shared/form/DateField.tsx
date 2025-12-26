import type { UseFormRegister, FieldErrors, RegisterOptions } from 'react-hook-form';

interface DateFieldProps {
  name: string;
  label: string;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  validation?: RegisterOptions;
  className?: string;
}

export default function DateField({
  name,
  label,
  register,
  errors,
  validation,
  className = ''
}: DateFieldProps) {
  const error = errors[name];

  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        id={name}
        type="date"
        {...register(name, validation)}
        className={`w-full px-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
          error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50 focus:bg-white'
        }`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error.message as string}</p>
      )}
    </div>
  );
}