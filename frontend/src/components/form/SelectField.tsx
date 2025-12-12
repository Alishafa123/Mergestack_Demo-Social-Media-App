import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  name: string;
  label: string;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  options: SelectOption[];
  placeholder?: string;
}

export default function SelectField({
  name,
  label,
  register,
  errors,
  options,
  placeholder = "Select an option"
}: SelectFieldProps) {
  return (
    <FormControl fullWidth error={!!errors[name]}>
      <InputLabel>{label}</InputLabel>
      <Select
        {...register(name)}
        label={label}
        displayEmpty
        sx={{
          borderRadius: '12px',
        }}
      >
        <MenuItem value="">
          <em>{placeholder}</em>
        </MenuItem>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {errors[name] && (
        <FormHelperText>{errors[name]?.message as string}</FormHelperText>
      )}
    </FormControl>
  );
}