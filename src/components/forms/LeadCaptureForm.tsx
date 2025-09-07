'use client';
import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Fade,
  Slide,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface LeadCaptureFormProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (leadData: LeadData) => void;
  themeColor?: string;
  font?: string;
  isSubmitting?: boolean;
}

export interface LeadData {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
}

const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({
  isVisible,
  onClose,
  onSubmit,
  themeColor = '#6366f1',
  font = 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState<LeadData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [errors, setErrors] = useState<Partial<LeadData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<LeadData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof LeadData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  if (!isVisible) return null;

  return (
    <Fade in={isVisible} timeout={300}>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          fontFamily: font
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Box
            sx={{
              background: '#ffffff',
              borderRadius: 3,
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              maxWidth: 400,
              width: '90%',
              maxHeight: '90vh',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            {/* Header */}
            <Box
              sx={{
                p: 2,
                background: `linear-gradient(135deg, ${themeColor}, ${themeColor}dd)`,
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Get in Touch
              </Typography>
              <IconButton
                onClick={onClose}
                sx={{
                  color: '#ffffff',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Form */}
            <Box sx={{ p: 3, maxHeight: 'calc(90vh - 80px)', overflowY: 'auto' }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 3, textAlign: 'center' }}
              >
                Please fill out your details and we&apos;ll get back to you soon!
              </Typography>

              <form onSubmit={handleSubmit}>
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    error={!!errors.name}
                    helperText={errors.name}
                    InputProps={{
                      startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                    disabled={isSubmitting}
                  />

                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    error={!!errors.email}
                    helperText={errors.email}
                    InputProps={{
                      startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                    disabled={isSubmitting}
                  />

                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange('phone')}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    InputProps={{
                      startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                    disabled={isSubmitting}
                  />

                  <TextField
                    fullWidth
                    label="Company Name"
                    value={formData.company}
                    onChange={handleInputChange('company')}
                    error={!!errors.company}
                    helperText={errors.company}
                    InputProps={{
                      startAdornment: <BusinessIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    }}
                    disabled={isSubmitting}
                  />

                  <TextField
                    fullWidth
                    label="Message (Optional)"
                    multiline
                    rows={3}
                    value={formData.message}
                    onChange={handleInputChange('message')}
                    disabled={isSubmitting}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{
                      mt: 2,
                      py: 1.5,
                      bgcolor: themeColor,
                      '&:hover': {
                        bgcolor: themeColor,
                        transform: 'translateY(-1px)',
                        boxShadow: `0 4px 12px ${themeColor}40`
                      },
                      '&:disabled': {
                        bgcolor: 'rgba(0, 0, 0, 0.12)'
                      },
                      transition: 'all 0.2s'
                    }}
                  >
                    {isSubmitting ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      'Submit & Continue Chat'
                    )}
                  </Button>
                </Stack>
              </form>
            </Box>
          </Box>
        </motion.div>
      </Box>
    </Fade>
  );
};

export default LeadCaptureForm;
