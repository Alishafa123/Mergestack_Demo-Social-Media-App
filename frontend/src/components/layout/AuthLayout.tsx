import { Box, Card, CardContent, Typography } from "@mui/material";

const AuthLayout = ({ title, children }:any) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f5f5f5"
    >
      <Card sx={{ width: 400, p: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" mb={2} textAlign="center">
            {title}
          </Typography>
          {children}
        </CardContent>
      </Card>
    </Box>
  );
};

export default AuthLayout;
