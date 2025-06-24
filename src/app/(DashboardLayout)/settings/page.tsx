'use client';

import React from 'react';
import {
  Box,
  Stack,
  Typography,
  TextField,
  Switch,
  Button,
  Divider,
  Paper,
  FormControlLabel,
} from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

const SettingsPage = () => {
  return (
    <PageContainer title="Settings" description="Manage your account and preferences.">
      <Stack spacing={4}>
        {/* Profile Settings */}
        <DashboardCard title="Profile Settings">
          <Paper sx={{ p: 4, borderRadius: 2 }}>
            <Stack spacing={3}>
              <TextField label="Full Name" defaultValue="John Doe" fullWidth />
              <TextField label="Email Address" defaultValue="john@example.com" fullWidth />
              <Button variant="contained" color="primary" sx={{ alignSelf: 'flex-end' }}>
                Save Changes
              </Button>
            </Stack>
          </Paper>
        </DashboardCard>

        {/* Password Change */}
        <DashboardCard title="Change Password">
          <Paper sx={{ p: 4, borderRadius: 2 }}>
            <Stack spacing={3}>
              <TextField label="Current Password" type="password" fullWidth />
              <TextField label="New Password" type="password" fullWidth />
              <TextField label="Confirm New Password" type="password" fullWidth />
              <Button variant="contained" color="primary" sx={{ alignSelf: 'flex-end' }}>
                Update Password
              </Button>
            </Stack>
          </Paper>
        </DashboardCard>

        {/* Notification Preferences */}
        <DashboardCard title="Notifications">
          <Paper sx={{ p: 4, borderRadius: 2 }}>
            <Stack spacing={2}>
              <FormControlLabel control={<Switch defaultChecked />} label="Email Alerts" />
              <FormControlLabel control={<Switch />} label="Chatbot Usage Reminders" />
              <FormControlLabel control={<Switch />} label="Product Updates" />
              <Button variant="contained" color="primary" sx={{ alignSelf: 'flex-end' }}>
                Save Preferences
              </Button>
            </Stack>
          </Paper>
        </DashboardCard>

        {/* Danger Zone */}
        <DashboardCard title="Account Settings">
          <Paper sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="subtitle1" color="error" fontWeight={600}>
              Danger Zone
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={2}>
              You can deactivate or delete your account. This action cannot be undone.
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" color="warning">
                Deactivate Account
              </Button>
              <Button variant="outlined" color="error">
                Delete Account
              </Button>
            </Stack>
          </Paper>
        </DashboardCard>
      </Stack>
    </PageContainer>
  );
};

export default SettingsPage;
