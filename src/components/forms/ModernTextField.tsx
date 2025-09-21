'use client';

import React from 'react';
import { TextField, TextFieldProps, InputAdornment, FormHelperText, Box } from '@mui/material';

interface ModernTextFieldProps extends Omit<TextFieldProps, 'error'> {
  error?: boolean;
  errorMessage?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  label?: string;
  helperText?: string;
}

const ModernTextField: React.FC<ModernTextFieldProps> = ({
  error = false,
  errorMessage,
  startIcon,
  endIcon,
  label,
  helperText,
  sx = {},
  ...props
}) => {
  return (
    <Box>
      {label && (
        <Box
          sx={{
            mb: 1,
            fontSize: '0.875rem',
            fontWeight: 500,
            color: 'text.secondary',
          }}
        >
          {label}
        </Box>
      )}
      <TextField
        {...props}
        error={error}
        InputProps={{
          startAdornment: startIcon ? (
            <InputAdornment position="start">
              {startIcon}
            </InputAdornment>
          ) : undefined,
          endAdornment: endIcon ? (
            <InputAdornment position="end">
              {endIcon}
            </InputAdornment>
          ) : undefined,
          ...props.InputProps,
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2.5,
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.95)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
                borderWidth: 1.5,
              },
            },
            '&.Mui-focused': {
              bgcolor: 'rgba(255, 255, 255, 1)',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'primary.main',
                borderWidth: 2,
              },
              boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.1)',
            },
            '&.Mui-error': {
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'error.main',
              },
            },
          },
          ...sx,
        }}
      />
      {(error && errorMessage) && (
        <FormHelperText error sx={{ mt: 0.5, ml: 1.5, fontSize: '0.75rem' }}>
          {errorMessage}
        </FormHelperText>
      )}
      {helperText && !error && (
        <FormHelperText sx={{ mt: 0.5, ml: 1.5, fontSize: '0.75rem' }}>
          {helperText}
        </FormHelperText>
      )}
    </Box>
  );
};

export default ModernTextField;
