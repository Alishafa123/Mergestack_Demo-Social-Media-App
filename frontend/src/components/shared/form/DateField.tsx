import { TextField } from '@mui/material';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';

interface DateFieldProps {
  name: string;
  label: string;
  register: UseFormRegister<any>;
  errors: FieldErrors;
}

export default function DateField({
  name,
  label,
  register,
  errors
}: DateFieldProps) {
  return (
    <TextField
      {...register(name)}
      label={label}
      type="date"
      fullWidth
      variant="outlined"
      error={!!errors[name]}
      helperText={errors[name]?.message as string}
      InputLabelProps={{
        shrink: true,
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '12px',
          height: '56px',
        },
        '& .MuiInputLabel-root': {
          '&.MuiInputLabel-shrink': {
            transform: 'translate(14px, -9px) scale(0.75)',
          },
        },
      }}
    />
  );
}