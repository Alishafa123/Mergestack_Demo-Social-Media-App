import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import InputField from './InputField';

interface EmailFieldProps {
  register: UseFormRegister<any>;
  errors: FieldErrors;
  className?: string;
}

export default function EmailField({ register, errors, className }: EmailFieldProps) {
  return (
    <InputField
      name="email"
      label="Email address"
      type="email"
      placeholder="Enter your email"
      register={register}
      errors={errors}
      className={className}
    />
  );
}