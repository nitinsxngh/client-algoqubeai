'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Stack,
  Checkbox,
  FormControlLabel,
  TextField,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  FormHelperText,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  validateLoginForm, 
  validateEmail, 
  validatePassword,
  getFieldError,
  hasFieldError,
  ValidationError 
} from '@/utils/validation';
import ValidationSummary from '@/components/forms/ValidationSummary';

interface LoginProps {
  title?: string;
  subtitle?: React.ReactNode;
  subtext?: React.ReactNode;
}

const AuthLogin = ({ title, subtitle, subtext }: LoginProps) => {
  const router = useRouter();

  const [rememberMe, setRememberMe] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT || 'http://localhost:4000';

  // Real-time validation
  useEffect(() => {
    if (touchedFields.has('email')) {
      const emailValidation = validateEmail(email);
      updateValidationErrors('email', emailValidation.errors);
    }
    
    if (touchedFields.has('password')) {
      const passwordValidation = validatePassword(password, false);
      updateValidationErrors('password', passwordValidation.errors);
    }
  }, [email, password, touchedFields]);

  const updateValidationErrors = (field: string, errors: ValidationError[]) => {
    setValidationErrors(prev => {
      const filtered = prev.filter(error => error.field !== field);
      return [...filtered, ...errors];
    });
  };

  const handleFieldBlur = (field: string) => {
    setTouchedFields(prev => new Set(Array.from(prev).concat(field)));
  };

  const handleSubmit = async () => {
    // Mark all fields as touched
    setTouchedFields(new Set(['email', 'password']));
    
    // Validate form
    const validation = validateLoginForm({ email, password });
    setValidationErrors(validation.errors);
    
    if (!validation.isValid) {
      setError('Please fix the validation errors below');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log('Login successful:', data);
        
        // Store user data
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Store JWT token if it's in the response
        if (data.token) {
          localStorage.setItem('token', data.token);
          console.log('Token stored:', data.token.substring(0, 20) + '...');
        } else {
          console.warn('No token in response');
        }
        
        router.push('/');
      } else {
        console.error('Login failed:', data);
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {title && (
        <Typography 
          variant="h3" 
          fontWeight={700} 
          mb={1}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
          }}
        >
          {title}
        </Typography>
      )}

      {subtext}

      <Box mt={4}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <ValidationSummary errors={validationErrors} />

        <Stack spacing={3}>
          <Box>
            <TextField
              id="email"
              type="email"
              variant="outlined"
              fullWidth
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleFieldBlur('email')}
              onKeyPress={handleKeyPress}
              error={hasFieldError(validationErrors, 'email')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                  },
                  '&.Mui-focused': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                      borderWidth: 2,
                    },
                  },
                  '&.Mui-error': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'error.main',
                    },
                  },
                },
              }}
            />
            {hasFieldError(validationErrors, 'email') && (
              <FormHelperText error sx={{ mt: 0.5, ml: 1.5 }}>
                {getFieldError(validationErrors, 'email')}
              </FormHelperText>
            )}
          </Box>

          <Box>
            <TextField
              id="password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => handleFieldBlur('password')}
              onKeyPress={handleKeyPress}
              error={hasFieldError(validationErrors, 'password')}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  '&:hover': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                    },
                  },
                  '&.Mui-focused': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'primary.main',
                      borderWidth: 2,
                    },
                  },
                  '&.Mui-error': {
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'error.main',
                    },
                  },
                },
              }}
            />
            {hasFieldError(validationErrors, 'password') && (
              <FormHelperText error sx={{ mt: 0.5, ml: 1.5 }}>
                {getFieldError(validationErrors, 'password')}
              </FormHelperText>
            )}
          </Box>
        </Stack>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mt={2}
          mb={3}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                color="primary"
                sx={{
                  '&.Mui-checked': {
                    color: 'primary.main',
                  },
                }}
              />
            }
            label={
              <Typography variant="body2" color="text.secondary">
                Remember me
              </Typography>
            }
          />

          <Typography
            component={Link}
            href="/forgot-password"
            variant="body2"
            fontWeight={500}
            sx={{
              textDecoration: 'none',
              color: 'primary.main',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            Forgot password?
          </Typography>
        </Stack>

        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            borderRadius: 2,
            py: 1.5,
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              transform: 'translateY(-1px)',
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
            },
            '&:disabled': {
              background: 'rgba(0, 0, 0, 0.12)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            'Sign in to your account'
          )}
        </Button>
      </Box>

      {subtitle}
    </motion.div>
  );
};

export default AuthLogin;
