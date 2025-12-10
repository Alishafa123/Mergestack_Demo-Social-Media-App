import { Button, CircularProgress } from '@mui/material';
import type { ButtonProps } from '@mui/material';

interface PrimaryButtonProps extends Omit<ButtonProps, 'variant' | 'color'> {
  loading?: boolean;
  children: React.ReactNode;
}

export default function PrimaryButton({ 
  loading = false, 
  children, 
  disabled,
  ...props 
}: PrimaryButtonProps) {
  return (
    <Button
      {...props}
      disabled={disabled || loading}
      sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        py: 1.5,
        px: 2,
        border: 'none',
        borderRadius: '12px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        fontSize: '0.875rem',
        fontWeight: 600,
        color: 'white',
        background: 'linear-gradient(to right, #2563eb, #9333ea)',
        textTransform: 'none',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          background: 'linear-gradient(to right, #1d4ed8, #7c3aed)',
          transform: 'scale(1.02)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        },
        '&:active': {
          transform: 'scale(0.98)',
        },
        '&:disabled': {
          opacity: 0.5,
          cursor: 'not-allowed',
          transform: 'none',
          background: 'linear-gradient(to right, #2563eb, #9333ea)',
        },
        '&:focus': {
          outline: 'none',
          boxShadow: '0 0 0 2px rgba(37, 99, 235, 0.5)',
        }
      }}
    >
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <CircularProgress 
            size={20} 
            sx={{ 
              color: 'white',
              marginRight: '12px'
            }} 
          />
          {children}
        </div>
      ) : (
        children
      )}
    </Button>
  );
}