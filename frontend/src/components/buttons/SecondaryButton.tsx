import { Button } from "@mui/material";

const SecondaryButton = ({ title, ...otherProps } : any) => {
  return (
    <Button
      fullWidth
      variant="outlined"
      size="large"
      sx={{ py: 1.2 }}
      {...otherProps}
    >
      {title || "Button"}
    </Button>
  );
};

export default SecondaryButton;