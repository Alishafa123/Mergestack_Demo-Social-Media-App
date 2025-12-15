import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import InputField from './InputField';

interface TextFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  className?: string;
}

export default function TextField({ 
  name,
  label,
  placeholder,
  register, 
  errors, 
  className 
}: TextFieldProps) {
  return (
    <InputField
      name={name}
      label={label}
      type="text"
      placeholder={placeholder || `Enter your ${label.toLowerCase()}`}
      register={register}
      errors={errors}
      className={className}
    />
  );
}