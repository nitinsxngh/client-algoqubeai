'use client';

import React from 'react';
import { Button, ButtonProps, CircularProgress } from '@mui/material';

interface ModernButtonProps extends Omit<ButtonProps, 'variant'> {
  loading?: boolean;
  loadingText?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}

const ModernButton: React.FC<ModernButtonProps> = ({
  loading = false,
  loadingText = 'Loading...',
  variant = 'primary',
  children,
  disabled,
  sx = {},
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
          },
        };
      case 'secondary':
        return {
          background: 'rgba(102, 126, 234, 0.1)',
          color: 'primary.main',
          border: '1px solid rgba(102, 126, 234, 0.2)',
          '&:hover': {
            background: 'rgba(102, 126, 234, 0.15)',
            borderColor: 'primary.main',
          },
        };
      case 'outline':
        return {
          background: 'transparent',
          color: 'primary.main',
          border: '1px solid',
          borderColor: 'primary.main',
          '&:hover': {
            background: 'rgba(102, 126, 234, 0.05)',
            borderColor: 'primary.dark',
          },
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: 'text.primary',
          '&:hover': {
            background: 'rgba(0, 0, 0, 0.05)',
          },
        };
      default:
        return {};
    }
  };

  return (
    <Button
      {...props}
      disabled={disabled || loading}
      sx={{
        borderRadius: 3,
        py: 2,
        textTransform: 'none',
        fontSize: '1.1rem',
        fontWeight: 600,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:disabled': {
          background: 'rgba(0, 0, 0, 0.12)',
          transform: 'none',
          boxShadow: 'none',
          color: 'rgba(0, 0, 0, 0.26)',
        },
        ...getVariantStyles(),
        ...sx,
      }}
    >
      {loading ? (
        <>
          <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
};

export default ModernButton;
