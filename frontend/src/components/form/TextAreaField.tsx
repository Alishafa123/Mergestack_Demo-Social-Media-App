import { TextField } from '@mui/material';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';

interface TextAreaFieldProps {
  name: string;
  label: string;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  placeholder?: string;
  rows?: number;
}

export default function TextAreaField({
  name,
  label,
  register,
  errors,
  placeholder,
  rows = 4
}: TextAreaFieldProps) {
  return (
    <TextField
      {...register(name)}
      label={label}
      placeholder={placeholder}
      multiline
      rows={rows}
      fullWidth
      variant="outlined"
      error={!!errors[name]}
      helperText={errors[name]?.message as string}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '12px',
        },
      }}
    />
  );
}