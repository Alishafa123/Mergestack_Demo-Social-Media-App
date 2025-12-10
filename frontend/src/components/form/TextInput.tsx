import { TextField } from "@mui/material";

const TextInput = ({ label, register, errors, name, ...props }: any) => {
  return (
    <TextField
      fullWidth
      label={label}
      size="medium"
      margin="normal"
      {...register(name)}
      error={!!errors[name]}
      helperText={errors[name]?.message}
      {...props}
    />
  );
};

export default TextInput;
