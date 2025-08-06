import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { getPasswordStrength } from '@/utils/validation';

interface PasswordStrengthIndicatorProps {
  password: string;
  showLabel?: boolean;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({
  password,
  showLabel = true
}) => {
  const strength = getPasswordStrength(password);
  
  if (!password) {
    return null;
  }

  const getProgressColor = () => {
    switch (strength.color) {
      case 'error':
        return '#f44336';
      case 'warning':
        return '#ff9800';
      case 'info':
        return '#2196f3';
      case 'success':
        return '#4caf50';
      default:
        return '#e0e0e0';
    }
  };

  const getProgressValue = () => {
    return (strength.score / 5) * 100;
  };

  return (
    <Box sx={{ mt: 1, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        {showLabel && (
          <Typography variant="caption" color="text.secondary">
            Password strength:
          </Typography>
        )}
        <Typography 
          variant="caption" 
          sx={{ 
            color: getProgressColor(),
            fontWeight: 500,
            fontSize: '0.75rem'
          }}
        >
          {strength.label}
        </Typography>
      </Box>
      
      <LinearProgress
        variant="determinate"
        value={getProgressValue()}
        sx={{
          height: 4,
          borderRadius: 2,
          backgroundColor: '#e0e0e0',
          '& .MuiLinearProgress-bar': {
            backgroundColor: getProgressColor(),
            borderRadius: 2,
          }
        }}
      />
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
        <Typography variant="caption" color="text.secondary" fontSize="0.65rem">
          Weak
        </Typography>
        <Typography variant="caption" color="text.secondary" fontSize="0.65rem">
          Strong
        </Typography>
      </Box>
    </Box>
  );
};

export default PasswordStrengthIndicator; 