// Validation utility functions for authentication forms

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  const errors: ValidationError[] = [];
  
  if (!email) {
    errors.push({ field: 'email', message: 'Email is required' });
    return { isValid: false, errors };
  }
  
  // Basic email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push({ field: 'email', message: 'Please enter a valid email address' });
  }
  
  // Length validation
  if (email.length > 254) {
    errors.push({ field: 'email', message: 'Email address is too long' });
  }
  
  // Check for common invalid patterns
  if (email.includes('..') || email.includes('--') || email.startsWith('.') || email.endsWith('.')) {
    errors.push({ field: 'email', message: 'Email address contains invalid characters' });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Password validation
export const validatePassword = (password: string, isRegistration: boolean = false): ValidationResult => {
  const errors: ValidationError[] = [];
  
  if (!password) {
    errors.push({ field: 'password', message: 'Password is required' });
    return { isValid: false, errors };
  }
  
  // Minimum length
  if (password.length < 8) {
    errors.push({ field: 'password', message: 'Password must be at least 8 characters long' });
  }
  
  // Maximum length
  if (password.length > 128) {
    errors.push({ field: 'password', message: 'Password is too long' });
  }
  
  if (isRegistration) {
    // Additional validation for registration
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    
    if (!hasUpperCase) {
      errors.push({ field: 'password', message: 'Password must contain at least one uppercase letter' });
    }
    
    if (!hasLowerCase) {
      errors.push({ field: 'password', message: 'Password must contain at least one lowercase letter' });
    }
    
    if (!hasNumbers) {
      errors.push({ field: 'password', message: 'Password must contain at least one number' });
    }
    
    if (!hasSpecialChar) {
      errors.push({ field: 'password', message: 'Password must contain at least one special character' });
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Name validation
export const validateName = (name: string): ValidationResult => {
  const errors: ValidationError[] = [];
  
  if (!name) {
    errors.push({ field: 'name', message: 'Name is required' });
    return { isValid: false, errors };
  }
  
  // Trim whitespace
  const trimmedName = name.trim();
  
  if (trimmedName.length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters long' });
  }
  
  if (trimmedName.length > 50) {
    errors.push({ field: 'name', message: 'Name is too long (maximum 50 characters)' });
  }
  
  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  const nameRegex = /^[a-zA-Z\s\-'\.]+$/;
  if (!nameRegex.test(trimmedName)) {
    errors.push({ field: 'name', message: 'Name can only contain letters, spaces, hyphens, apostrophes, and periods' });
  }
  
  // Check for consecutive special characters
  if (/(\s{2,}|-{2,}|'{2,}|\.{2,})/.test(trimmedName)) {
    errors.push({ field: 'name', message: 'Name contains invalid character sequences' });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Phone validation (optional field)
export const validatePhone = (phone: string): ValidationResult => {
  const errors: ValidationError[] = [];
  
  if (!phone) {
    // Phone is optional, so empty is valid
    return { isValid: true, errors: [] };
  }
  
  // Remove all non-digit characters for validation
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Check if it's a valid phone number (7-15 digits)
  if (digitsOnly.length < 7 || digitsOnly.length > 15) {
    errors.push({ field: 'phone', message: 'Please enter a valid phone number' });
  }
  
  // Check for valid phone number patterns
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  if (!phoneRegex.test(digitsOnly)) {
    errors.push({ field: 'phone', message: 'Please enter a valid phone number' });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Confirm password validation
export const validateConfirmPassword = (password: string, confirmPassword: string): ValidationResult => {
  const errors: ValidationError[] = [];
  
  if (!confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'Please confirm your password' });
    return { isValid: false, errors };
  }
  
  if (password !== confirmPassword) {
    errors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Terms agreement validation
export const validateTermsAgreement = (agreed: boolean): ValidationResult => {
  const errors: ValidationError[] = [];
  
  if (!agreed) {
    errors.push({ field: 'terms', message: 'You must agree to the terms and conditions' });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Comprehensive form validation
export const validateRegistrationForm = (formData: {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
  agreeTerms: boolean;
}): ValidationResult => {
  const allErrors: ValidationError[] = [];
  
  // Validate each field
  const nameValidation = validateName(formData.name);
  const emailValidation = validateEmail(formData.email);
  const passwordValidation = validatePassword(formData.password, true);
  const confirmPasswordValidation = validateConfirmPassword(formData.password, formData.confirmPassword);
  const phoneValidation = validatePhone(formData.phone || '');
  const termsValidation = validateTermsAgreement(formData.agreeTerms);
  
  // Collect all errors
  allErrors.push(...nameValidation.errors);
  allErrors.push(...emailValidation.errors);
  allErrors.push(...passwordValidation.errors);
  allErrors.push(...confirmPasswordValidation.errors);
  allErrors.push(...phoneValidation.errors);
  allErrors.push(...termsValidation.errors);
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
};

// Login form validation
export const validateLoginForm = (formData: {
  email: string;
  password: string;
}): ValidationResult => {
  const allErrors: ValidationError[] = [];
  
  // Validate each field
  const emailValidation = validateEmail(formData.email);
  const passwordValidation = validatePassword(formData.password, false);
  
  // Collect all errors
  allErrors.push(...emailValidation.errors);
  allErrors.push(...passwordValidation.errors);
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
};

// Real-time validation helpers
export const getFieldError = (errors: ValidationError[], field: string): string => {
  const fieldError = errors.find(error => error.field === field);
  return fieldError ? fieldError.message : '';
};

export const hasFieldError = (errors: ValidationError[], field: string): boolean => {
  return errors.some(error => error.field === field);
};

// Password strength indicator
export const getPasswordStrength = (password: string): {
  score: number;
  label: string;
  color: 'error' | 'warning' | 'info' | 'success';
} => {
  if (!password) {
    return { score: 0, label: '', color: 'error' };
  }
  
  let score = 0;
  
  // Length
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  
  // Character variety
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;
  
  // Bonus for mixed case and numbers
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password) && /[a-zA-Z]/.test(password)) score += 1;
  
  // Penalty for common patterns
  if (/(.)\1{2,}/.test(password)) score -= 1; // Repeated characters
  if (/123|abc|qwe/i.test(password)) score -= 1; // Common sequences
  
  score = Math.max(0, Math.min(score, 5));
  
  const strengthMap = [
    { label: 'Very Weak', color: 'error' as const },
    { label: 'Weak', color: 'error' as const },
    { label: 'Fair', color: 'warning' as const },
    { label: 'Good', color: 'info' as const },
    { label: 'Strong', color: 'success' as const },
    { label: 'Very Strong', color: 'success' as const }
  ];
  
  return {
    score,
    ...strengthMap[score]
  };
}; 