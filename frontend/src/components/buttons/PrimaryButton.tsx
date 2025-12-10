import { Button } from "@mui/material";

const PrimaryButton = ({ title, ...props } : any) => {
  return (
    <Button
      fullWidth
      variant="contained"
      size="large"
      sx={{ mt: 2, py: 1.2 }}
      {...props}
    >
      {title}
    </Button>
  );
};

export default PrimaryButton;
