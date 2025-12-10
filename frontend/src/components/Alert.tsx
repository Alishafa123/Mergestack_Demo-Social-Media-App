import { Alert as MuiAlert } from '@mui/material';
import type { AlertProps } from '@mui/material';
import { forwardRef } from 'react';

interface CustomAlertProps extends Omit<AlertProps, 'severity' | 'variant'> {
  variant: 'success' | 'error';
  message: string;
}

const Alert = forwardRef<HTMLDivElement, CustomAlertProps>(
  ({ variant, message, ...props }, ref) => {
    return (
      <MuiAlert
        ref={ref}
        severity={variant === 'success' ? 'success' : 'error'}
        sx={{ mb: 2 }}
        {...props}
      >
        {message}
      </MuiAlert>
    );
  }
);

Alert.displayName = 'Alert';

export default Alert;