'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
  TextField,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Stack,
  FormHelperText,
  Grid,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Phone,
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  validateRegistrationForm, 
  validateName, 
  validateEmail, 
  validatePassword,
  validateConfirmPassword,
  validatePhone,
  validateTermsAgreement,
  getFieldError,
  hasFieldError,
  ValidationError 
} from '@/utils/validation';
import PasswordStrengthIndicator from '@/components/forms/PasswordStrengthIndicator';
import ValidationSummary from '@/components/forms/ValidationSummary';

interface RegisterProps {
  title?: string;
  subtitle?: React.ReactNode;
  subtext?: React.ReactNode;
}

const AuthRegister = ({ title, subtitle, subtext }: RegisterProps) => {
  const router = useRouter();
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT || 'http://localhost:4000';

  // Real-time validation
  useEffect(() => {
    if (touchedFields.has('name')) {
      const nameValidation = validateName(form.name);
      updateValidationErrors('name', nameValidation.errors);
    }
    
    if (touchedFields.has('email')) {
      const emailValidation = validateEmail(form.email);
      updateValidationErrors('email', emailValidation.errors);
    }
    
    if (touchedFields.has('password')) {
      const passwordValidation = validatePassword(form.password, true);
      updateValidationErrors('password', passwordValidation.errors);
    }
    
    if (touchedFields.has('confirmPassword')) {
      const confirmPasswordValidation = validateConfirmPassword(form.password, form.confirmPassword);
      updateValidationErrors('confirmPassword', confirmPasswordValidation.errors);
    }
    
    if (touchedFields.has('phone')) {
      const phoneValidation = validatePhone(form.phone);
      updateValidationErrors('phone', phoneValidation.errors);
    }
  }, [form, touchedFields]);

  const updateValidationErrors = (field: string, errors: ValidationError[]) => {
    setValidationErrors(prev => {
      const filtered = prev.filter(error => error.field !== field);
      return [...filtered, ...errors];
    });
  };

  const handleFieldBlur = (field: string) => {
    setTouchedFields(prev => new Set(Array.from(prev).concat(field)));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    // Mark all fields as touched
    setTouchedFields(new Set(['name', 'email', 'password', 'confirmPassword', 'phone']));
    
    // Validate form
    const validation = validateRegistrationForm({
      name: form.name,
      email: form.email,
      password: form.password,
      confirmPassword: form.confirmPassword,
      phone: form.phone,
      agreeTerms
    });
    setValidationErrors(validation.errors);
    
    if (!validation.isValid) {
      setError('Please fix the validation errors below');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          phone: form.phone.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('Registration successful! Please sign in.');
        router.push('/authentication/login');
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
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

        <Grid container spacing={3}>
          {/* Row 1: Name and Email */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ mb: 1, fontWeight: 500, fontSize: '0.875rem' }}
              >
                Full Name *
              </Typography>
              <TextField
                id="name"
                type="text"
                variant="outlined"
                fullWidth
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                onBlur={() => handleFieldBlur('name')}
                onKeyPress={handleKeyPress}
                error={hasFieldError(validationErrors, 'name')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />
                    </InputAdornment>
                  ),
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
                }}
              />
              {hasFieldError(validationErrors, 'name') && (
                <FormHelperText error sx={{ mt: 0.5, ml: 1.5, fontSize: '0.75rem' }}>
                  {getFieldError(validationErrors, 'name')}
                </FormHelperText>
              )}
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ mb: 1, fontWeight: 500, fontSize: '0.875rem' }}
              >
                Email Address *
              </Typography>
              <TextField
                id="email"
                type="email"
                variant="outlined"
                fullWidth
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                onBlur={() => handleFieldBlur('email')}
                onKeyPress={handleKeyPress}
                error={hasFieldError(validationErrors, 'email')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />
                    </InputAdornment>
                  ),
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
                }}
              />
              {hasFieldError(validationErrors, 'email') && (
                <FormHelperText error sx={{ mt: 0.5, ml: 1.5, fontSize: '0.75rem' }}>
                  {getFieldError(validationErrors, 'email')}
                </FormHelperText>
              )}
            </Box>
          </Grid>

          {/* Row 2: Phone (full width) */}
          <Grid size={{ xs: 12 }}>
            <Box>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ mb: 1, fontWeight: 500, fontSize: '0.875rem' }}
              >
                Phone Number (Optional)
              </Typography>
              <TextField
                id="phone"
                type="tel"
                variant="outlined"
                fullWidth
                placeholder="Enter your phone number"
                value={form.phone}
                onChange={handleChange}
                onBlur={() => handleFieldBlur('phone')}
                onKeyPress={handleKeyPress}
                error={hasFieldError(validationErrors, 'phone')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />
                    </InputAdornment>
                  ),
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
                }}
              />
              {hasFieldError(validationErrors, 'phone') && (
                <FormHelperText error sx={{ mt: 0.5, ml: 1.5, fontSize: '0.75rem' }}>
                  {getFieldError(validationErrors, 'phone')}
                </FormHelperText>
              )}
            </Box>
          </Grid>

          {/* Row 3: Password (full width for better UX) */}
          <Grid size={{ xs: 12 }}>
            <Box>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ mb: 1, fontWeight: 500, fontSize: '0.875rem' }}
              >
                Password *
              </Typography>
              <TextField
                id="password"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                fullWidth
                placeholder="Create a strong password"
                value={form.password}
                onChange={handleChange}
                onBlur={() => handleFieldBlur('password')}
                onKeyPress={handleKeyPress}
                error={hasFieldError(validationErrors, 'password')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: 'text.secondary' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
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
                }}
              />
              <PasswordStrengthIndicator password={form.password} />
              {hasFieldError(validationErrors, 'password') && (
                <FormHelperText error sx={{ mt: 0.5, ml: 1.5 }}>
                  {getFieldError(validationErrors, 'password')}
                </FormHelperText>
              )}
            </Box>
          </Grid>

          {/* Row 4: Confirm Password (full width) */}
          <Grid size={{ xs: 12 }}>
            <Box>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ mb: 1, fontWeight: 500, fontSize: '0.875rem' }}
              >
                Confirm Password *
              </Typography>
              <TextField
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                variant="outlined"
                fullWidth
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={handleChange}
                onBlur={() => handleFieldBlur('confirmPassword')}
                onKeyPress={handleKeyPress}
                error={hasFieldError(validationErrors, 'confirmPassword')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        sx={{ color: 'text.secondary' }}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
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
                }}
              />
              {hasFieldError(validationErrors, 'confirmPassword') && (
                <FormHelperText error sx={{ mt: 0.5, ml: 1.5, fontSize: '0.75rem' }}>
                  {getFieldError(validationErrors, 'confirmPassword')}
                </FormHelperText>
              )}
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, mb: 4 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                color="primary"
                sx={{
                  '&.Mui-checked': {
                    color: 'primary.main',
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(102, 126, 234, 0.04)',
                  },
                }}
              />
            }
            label={
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', lineHeight: 1.5 }}>
                I agree to the{' '}
                <Link
                  href="/terms"
                  style={{
                    color: 'primary.main',
                    textDecoration: 'none',
                    fontWeight: 500,
                  }}
                >
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link
                  href="/privacy"
                  style={{
                    color: 'primary.main',
                    textDecoration: 'none',
                    fontWeight: 500,
                  }}
                >
                  Privacy Policy
                </Link>
              </Typography>
            }
          />
          {hasFieldError(validationErrors, 'terms') && (
            <FormHelperText error sx={{ mt: 0.5, ml: 1.5, fontSize: '0.75rem' }}>
              {getFieldError(validationErrors, 'terms')}
            </FormHelperText>
          )}
        </Box>

        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            borderRadius: 3,
            py: 2,
            textTransform: 'none',
            fontSize: '1.1rem',
            fontWeight: 600,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
            },
            '&:disabled': {
              background: 'rgba(0, 0, 0, 0.12)',
              transform: 'none',
              boxShadow: 'none',
            },
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            'Create your account'
          )}
        </Button>
      </Box>

      {subtitle}
    </motion.div>
  );
};

export default AuthRegister;
