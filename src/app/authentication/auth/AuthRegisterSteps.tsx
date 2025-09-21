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
  Button,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Phone,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
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
import StepProgress from '@/components/forms/StepProgress';

interface RegisterStepsProps {
  title?: string;
  subtitle?: React.ReactNode;
  subtext?: React.ReactNode;
}

const steps = ['Personal Info', 'Account Details', 'Verification'];

const AuthRegisterSteps = ({ title, subtitle, subtext }: RegisterStepsProps) => {
  const [activeStep, setActiveStep] = useState(0);
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

  const validateCurrentStep = () => {
    let fieldsToValidate: string[] = [];
    
    switch (activeStep) {
      case 0: // Personal Info
        fieldsToValidate = ['name', 'email'];
        break;
      case 1: // Account Details
        fieldsToValidate = ['password', 'confirmPassword'];
        break;
      case 2: // Verification
        fieldsToValidate = ['phone', 'terms'];
        break;
    }

    // Mark fields as touched
    setTouchedFields(prev => new Set([...Array.from(prev), ...fieldsToValidate]));

    // Validate current step fields
    const stepValidation = validateRegistrationForm({
      name: form.name,
      email: form.email,
      password: form.password,
      confirmPassword: form.confirmPassword,
      phone: form.phone,
      agreeTerms: activeStep === 2 ? agreeTerms : true
    });

    // Filter errors for current step
    const stepErrors = stepValidation.errors.filter(error => 
      fieldsToValidate.includes(error.field)
    );

    setValidationErrors(stepErrors);
    
    // Set specific error message
    if (stepErrors.length > 0) {
      if (stepErrors.length === 1) {
        setError(stepErrors[0].message);
      } else {
        const fieldNames = stepErrors.map(error => {
          switch(error.field) {
            case 'name': return 'Full Name';
            case 'email': return 'Email';
            case 'password': return 'Password';
            case 'confirmPassword': return 'Confirm Password';
            case 'phone': return 'Phone Number';
            case 'terms': return 'Terms Agreement';
            default: return error.field;
          }
        });
        setError(`Please fill in: ${fieldNames.join(', ')}`);
      }
    } else {
      setError('');
    }
    
    return stepErrors.length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setError('');
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setError('');
  };

  const handleSubmit = async () => {
    // Mark all fields as touched
    setTouchedFields(new Set(['name', 'email', 'password', 'confirmPassword', 'phone']));
    
    // Validate entire form
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
      if (validation.errors.length === 1) {
        setError(validation.errors[0].message);
      } else {
        const fieldNames = validation.errors.map(error => {
          switch(error.field) {
            case 'name': return 'Full Name';
            case 'email': return 'Email';
            case 'password': return 'Password';
            case 'confirmPassword': return 'Confirm Password';
            case 'phone': return 'Phone Number';
            case 'terms': return 'Terms Agreement';
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
        window.location.href = '/authentication/login';
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
      if (activeStep < steps.length - 1) {
        handleNext();
      } else {
        handleSubmit();
      }
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0: // Personal Info
        return (
          <motion.div
            key="step-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Grid container spacing={1.5}>
              <Grid size={{ xs: 12 }}>
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
                  startIcon={<Person sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
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
                  startIcon={<Email sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />}
                />
              </Grid>
            </Grid>
          </motion.div>
        );

      case 1: // Account Details
        return (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Grid container spacing={1.5}>
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
          </motion.div>
        );

      case 2: // Verification
        return (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Grid container spacing={1.5}>
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
                  startIcon={<Phone sx={{ color: 'text.secondary', fontSize: '1.2rem' }} />}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Box sx={{ mt: 1, mb: 1 }}>
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
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem', lineHeight: 1.4 }}>
                        I agree to the{' '}
                        <a
                          href="/terms"
                          style={{
                            color: 'primary.main',
                            textDecoration: 'none',
                            fontWeight: 500,
                          }}
                        >
                          Terms of Service
                        </a>{' '}
                        and{' '}
                        <a
                          href="/privacy"
                          style={{
                            color: 'primary.main',
                            textDecoration: 'none',
                            fontWeight: 500,
                          }}
                        >
                          Privacy Policy
                        </a>
                      </Typography>
                    }
                  />
                </Box>
              </Grid>
            </Grid>
          </motion.div>
        );

      default:
        return null;
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



        {/* Step Content */}
        <AnimatePresence mode="wait">
          {renderStepContent(activeStep)}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{
              textTransform: 'none',
              fontWeight: 500,
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              },
            }}
          >
            Back
          </Button>

          {activeStep === steps.length - 1 ? (
            <ModernButton
              variant="primary"
              onClick={handleSubmit}
              loading={loading}
              loadingText="Creating account..."
            >
              Create Account
            </ModernButton>
          ) : (
            <ModernButton
              variant="primary"
              onClick={handleNext}
            >
              Next
            </ModernButton>
          )}
        </Box>
      </Box>

      {subtitle}
    </motion.div>
  );
};

export default AuthRegisterSteps;
