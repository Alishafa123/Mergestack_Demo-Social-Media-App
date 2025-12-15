import { Button } from "@mui/material";

const PrimaryButton = ({ title, ...otherProps } : any) => {
  return (
    <Button
      fullWidth
      variant="contained"
      size="large"
      sx={{ py: 1.2 }}
      {...otherProps}
    >
      {title}
    </Button>
  );
};

export default PrimaryButton;
