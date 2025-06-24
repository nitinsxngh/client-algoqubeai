'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import Link from 'next/link';
import CustomTextField from '@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField';
import { Stack } from '@mui/system';
import axios from 'axios';

interface registerType {
  title?: string;
  subtitle?: React.ReactNode;
  subtext?: React.ReactNode;
}

const AuthRegister = ({ title, subtitle, subtext }: registerType) => {
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!agreeTerms) return;

    try {
      const res = await axios.post('http://localhost:4000/api/users/register', form);

      alert('Registration successful!');
      window.location.href = '/authentication/login'; // redirect
    } catch (err: any) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <>
      {title && (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      )}

      {subtext}

      <Box>
        <Stack mb={3}>
          <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="email" mb="5px">
            Email Address
          </Typography>
          <CustomTextField id="email" type="email" variant="outlined" fullWidth value={form.email} onChange={handleChange} />

          <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="password" mb="5px" mt="25px">
            Password
          </Typography>
          <CustomTextField id="password" type="password" variant="outlined" fullWidth value={form.password} onChange={handleChange} />

          <Typography variant="subtitle1" fontWeight={600} component="label" htmlFor="confirmPassword" mb="5px" mt="25px">
            Confirm Password
          </Typography>
          <CustomTextField id="confirmPassword" type="password" variant="outlined" fullWidth value={form.confirmPassword} onChange={handleChange} />

          <FormControlLabel
            sx={{ mt: 2 }}
            control={
              <Checkbox
                color="primary"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
            }
            label={
              <Typography variant="body2">
                I agree to the{' '}
                <Link href="/terms" style={{ textDecoration: 'underline' }}>
                  Terms and Conditions
                </Link>
              </Typography>
            }
          />
        </Stack>

        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          disabled={!agreeTerms}
          onClick={handleSubmit}
        >
          Sign Up
        </Button>
      </Box>

      {subtitle}
    </>
  );
};

export default AuthRegister;
