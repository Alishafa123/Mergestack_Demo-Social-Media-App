import { TextField } from "@mui/material";

const PasswordInput = ({ label, register, errors, name } :any) => {
  return (
    <TextField
      fullWidth
      type="password"
      label={label}
      margin="normal"
      {...register(name)}
      error={!!errors[name]}
      helperText={errors[name]?.message}
    />
  );
};

export default PasswordInput;
