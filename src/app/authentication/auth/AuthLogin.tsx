'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Stack,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Alert,
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
import ModernTextField from '@/components/forms/ModernTextField';
import ModernButton from '@/components/forms/ModernButton';

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
      if (validation.errors.length === 1) {
        setError(validation.errors[0].message);
      } else {
        const fieldNames = validation.errors.map(error => {
          switch(error.field) {
            case 'email': return 'Email';
            case 'password': return 'Password';
            default: return error.field;
          }
        });
        setError(`Please fill in: ${fieldNames.join(', ')}`);
      }
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
      {subtext}

      <Box mt={4}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}


        <Stack spacing={2}>
          <ModernTextField
            id="email"
            type="email"
            fullWidth
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => handleFieldBlur('email')}
            onKeyPress={handleKeyPress}
            error={hasFieldError(validationErrors, 'email')}
            startIcon={<Email sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />}
          />

          <ModernTextField
            id="password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => handleFieldBlur('password')}
            onKeyPress={handleKeyPress}
            error={hasFieldError(validationErrors, 'password')}
            startIcon={<Lock sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />}
            endIcon={
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                sx={{ color: 'text.secondary' }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            }
          />
        </Stack>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mt={1.5}
          mb={2}
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

        <ModernButton
          variant="primary"
          fullWidth
          onClick={handleSubmit}
          loading={loading}
          loadingText="Signing in..."
        >
          Sign in to your account
        </ModernButton>
      </Box>

      {subtitle}
    </motion.div>
  );
};

export default AuthLogin;
