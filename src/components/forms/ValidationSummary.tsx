import React from 'react';
import { Box, Typography, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Error } from '@mui/icons-material';
import { ValidationError } from '@/utils/validation';

interface ValidationSummaryProps {
  errors: ValidationError[];
  title?: string;
}

const ValidationSummary: React.FC<ValidationSummaryProps> = ({ 
  errors, 
  title = 'Please fix the following errors:' 
}) => {
  if (errors.length === 0) {
    return null;
  }

  // Group errors by field for better organization
  const groupedErrors = errors.reduce((acc, error) => {
    if (!acc[error.field]) {
      acc[error.field] = [];
    }
    acc[error.field].push(error.message);
    return acc;
  }, {} as Record<string, string[]>);

  const fieldLabels: Record<string, string> = {
    name: 'Name',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    phone: 'Phone Number',
    terms: 'Terms Agreement'
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography 
        variant="subtitle2" 
        color="error" 
        sx={{ 
          fontWeight: 600, 
          mb: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <Error fontSize="small" />
        {title}
      </Typography>
      
      <List dense sx={{ py: 0 }}>
        {Object.entries(groupedErrors).map(([field, messages]) => (
          <ListItem key={field} sx={{ py: 0.5, px: 0 }}>
            <ListItemIcon sx={{ minWidth: 24 }}>
              <Error fontSize="small" color="error" />
            </ListItemIcon>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" color="error">
                <strong>{fieldLabels[field] || field}:</strong> {messages[0]}
              </Typography>
              {messages.length > 1 && (
                <Box component="ul" sx={{ mt: 0.5, mb: 0, pl: 2 }}>
                  {messages.slice(1).map((message, index) => (
                    <Typography 
                      key={index} 
                      component="li" 
                      variant="body2" 
                      color="error"
                      sx={{ fontSize: '0.75rem' }}
                    >
                      {message}
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default ValidationSummary; 