'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  IconButton,
  Alert,
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
import ModernTextField from '@/components/forms/ModernTextField';
import ModernButton from '@/components/forms/ModernButton';

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
      {subtext}

      <Box mt={4}>
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <ValidationSummary errors={validationErrors} />

        <Grid container spacing={2}>
          {/* Row 1: Name and Email */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <ModernTextField
              id="name"
              type="text"
              fullWidth
              label="Full Name *"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              onBlur={() => handleFieldBlur('name')}
              onKeyPress={handleKeyPress}
              error={hasFieldError(validationErrors, 'name')}
              errorMessage={hasFieldError(validationErrors, 'name') ? getFieldError(validationErrors, 'name') : undefined}
              startIcon={<Person sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <ModernTextField
              id="email"
              type="email"
              fullWidth
              label="Email Address *"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              onBlur={() => handleFieldBlur('email')}
              onKeyPress={handleKeyPress}
              error={hasFieldError(validationErrors, 'email')}
              errorMessage={hasFieldError(validationErrors, 'email') ? getFieldError(validationErrors, 'email') : undefined}
              startIcon={<Email sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />}
            />
          </Grid>

          {/* Row 2: Phone (full width) */}
          <Grid size={{ xs: 12 }}>
            <ModernTextField
              id="phone"
              type="tel"
              fullWidth
              label="Phone Number (Optional)"
              placeholder="Enter your phone number"
              value={form.phone}
              onChange={handleChange}
              onBlur={() => handleFieldBlur('phone')}
              onKeyPress={handleKeyPress}
              error={hasFieldError(validationErrors, 'phone')}
              errorMessage={hasFieldError(validationErrors, 'phone') ? getFieldError(validationErrors, 'phone') : undefined}
              startIcon={<Phone sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />}
            />
          </Grid>

          {/* Row 3: Password (full width for better UX) */}
          <Grid size={{ xs: 12 }}>
            <ModernTextField
              id="password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              label="Password *"
              placeholder="Create a strong password"
              value={form.password}
              onChange={handleChange}
              onBlur={() => handleFieldBlur('password')}
              onKeyPress={handleKeyPress}
              error={hasFieldError(validationErrors, 'password')}
              errorMessage={hasFieldError(validationErrors, 'password') ? getFieldError(validationErrors, 'password') : undefined}
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
            <PasswordStrengthIndicator password={form.password} />
          </Grid>

          {/* Row 4: Confirm Password (full width) */}
          <Grid size={{ xs: 12 }}>
            <ModernTextField
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              fullWidth
              label="Confirm Password *"
              placeholder="Confirm your password"
              value={form.confirmPassword}
              onChange={handleChange}
              onBlur={() => handleFieldBlur('confirmPassword')}
              onKeyPress={handleKeyPress}
              error={hasFieldError(validationErrors, 'confirmPassword')}
              errorMessage={hasFieldError(validationErrors, 'confirmPassword') ? getFieldError(validationErrors, 'confirmPassword') : undefined}
              startIcon={<Lock sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />}
              endIcon={
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                  sx={{ color: 'text.secondary' }}
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              }
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 2, mb: 2 }}>
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

        <ModernButton
          variant="primary"
          fullWidth
          onClick={handleSubmit}
          loading={loading}
          loadingText="Creating account..."
        >
          Create your account
        </ModernButton>
      </Box>

      {subtitle}
    </motion.div>
  );
};

export default AuthRegister;
