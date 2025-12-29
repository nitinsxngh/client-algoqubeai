'use client';

import React from 'react';
import { Button, CircularProgress } from '@mui/material';
import { Google } from '@mui/icons-material';

interface GoogleOAuthButtonProps {
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'login' | 'signup';
  fullWidth?: boolean;
  sx?: any;
}

const GoogleOAuthButton: React.FC<GoogleOAuthButtonProps> = ({
  onClick,
  loading = false,
  disabled = false,
  variant = 'login',
  fullWidth = true,
  sx = {},
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Default Google OAuth implementation
      // You can integrate with your preferred OAuth provider here
      console.log('Google OAuth clicked');
    }
  };

  return (
    <Button
      fullWidth={fullWidth}
      variant="outlined"
      startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Google />}
      onClick={handleClick}
      disabled={disabled || loading}
      sx={{
        py: 1.5,
        mb: 3,
        borderRadius: 2,
        textTransform: 'none',
        fontSize: '1rem',
        fontWeight: 500,
        borderColor: '#dadce0',
        color: '#3c4043',
        '&:hover': {
          borderColor: '#dadce0',
          backgroundColor: '#f8f9fa',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        },
        '&:disabled': {
          borderColor: '#dadce0',
          backgroundColor: '#f8f9fa',
          color: '#9aa0a6',
        },
        ...sx,
      }}
    >
      {loading 
        ? 'Connecting...' 
        : variant === 'login' 
          ? 'Continue with Google' 
          : 'Sign up with Google'
      }
    </Button>
  );
};

export default GoogleOAuthButton;
