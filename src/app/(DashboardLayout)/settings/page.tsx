'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  Avatar,
  IconButton,
  Tooltip,
  Alert,
  Chip,
  useTheme,
  InputAdornment,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Save as SaveIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Warning as WarningIcon,
  Delete as DeleteIcon,
  PowerSettingsNew as PowerIcon,
} from '@mui/icons-material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { authenticatedFetch } from '@/utils/api';

interface UserSettings {
  profile: {
    name: string;
    email: string;
    phone: string;
  };
  preferences: {
    notifications: {
      emailAlerts: boolean;
      usageReminders: boolean;
      productUpdates: boolean;
    };
  };
  account: {
    plan: string;
    role: string;
    createdAt: string;
    lastLogin: any;
  };
}

const SettingsPage = () => {
  const theme = useTheme();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form states
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [notificationForm, setNotificationForm] = useState({
    emailAlerts: true,
    usageReminders: false,
    productUpdates: false,
  });
  
  // UI states
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deactivateDialog, setDeactivateDialog] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT!;

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await authenticatedFetch(`${BACKEND_URL}/api/users/settings`, {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        setSettings(data);
        setProfileForm({
          name: data.profile.name || '',
          email: data.profile.email || '',
          phone: data.profile.phone || '',
        });
        setNotificationForm({
          emailAlerts: data.preferences?.notifications?.emailAlerts ?? true,
          usageReminders: data.preferences?.notifications?.usageReminders ?? false,
          productUpdates: data.preferences?.notifications?.productUpdates ?? false,
        });
      } else {
        setError('Failed to fetch settings');
      }
    } catch (error) {
      setError('Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  }, [BACKEND_URL]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateProfile = async (profileData: any) => {
    setSaving(true);
    try {
      const response = await authenticatedFetch(`${BACKEND_URL}/api/users/profile`, {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
      if (response.ok) {
        setSuccess('Profile updated successfully');
        fetchSettings();
      } else {
        setError('Failed to update profile');
      }
    } catch (error) {
      setError('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const updatePassword = async (passwordData: any) => {
    setSaving(true);
    try {
      const response = await authenticatedFetch(`${BACKEND_URL}/api/users/password`, {
        method: 'PUT',
        body: JSON.stringify(passwordData),
      });
      if (response.ok) {
        setSuccess('Password updated successfully');
      } else {
        setError('Failed to update password');
      }
    } catch (error) {
      setError('Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  const updateNotifications = async (notificationData: any) => {
    setSaving(true);
    try {
      const response = await authenticatedFetch(`${BACKEND_URL}/api/users/notifications`, {
        method: 'PUT',
        body: JSON.stringify(notificationData),
      });
      if (response.ok) {
        setSuccess('Notification settings updated successfully');
        fetchSettings();
      } else {
        setError('Failed to update notification settings');
      }
    } catch (error) {
      setError('Failed to update notification settings');
    } finally {
      setSaving(false);
    }
  };

  const deactivateAccount = async () => {
    setSaving(true);
    try {
      const response = await authenticatedFetch(`${BACKEND_URL}/api/users/deactivate`, {
        method: 'POST',
      });
      if (response.ok) {
        setSuccess('Account deactivated successfully');
      } else {
        setError('Failed to deactivate account');
      }
    } catch (error) {
      setError('Failed to deactivate account');
    } finally {
      setSaving(false);
    }
  };

  const deleteAccount = async () => {
    setSaving(true);
    try {
      const response = await authenticatedFetch(`${BACKEND_URL}/api/users/account`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setSuccess('Account deleted successfully');
      } else {
        setError('Failed to delete account');
      }
    } catch (error) {
      setError('Failed to delete account');
    } finally {
      setSaving(false);
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  if (loading) {
    return (
      <PageContainer title="Settings" description="Manage your account and preferences.">
        <Box 
          display="flex" 
          flexDirection="column"
          justifyContent="center" 
          alignItems="center" 
          minHeight="400px"
          gap={2}
        >
          <CircularProgress size={40} />
          <Typography variant="body2" color="text.secondary">
            Loading settings...
          </Typography>
        </Box>
      </PageContainer>
    );
  }

  if (!settings) {
    return (
      <PageContainer title="Settings" description="Manage your account and preferences.">
        <Box 
          display="flex" 
          flexDirection="column"
          justifyContent="center" 
          alignItems="center" 
          minHeight="400px"
          gap={2}
        >
          <SecurityIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
          <Typography color="error" variant="h6">Failed to load settings</Typography>
          <Typography color="text.secondary" variant="body2">
            Unable to load your settings. Please try refreshing the page.
          </Typography>
        </Box>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Settings" description="Manage your account and preferences.">
      <Stack spacing={4}>
        {/* Header */}
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Settings
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your account preferences, security settings, and notifications
          </Typography>
        </Box>

        {/* Error/Success Messages */}
        {error && (
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {/* Profile Settings */}
        <Paper 
          elevation={0}
          sx={{ 
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`,
            overflow: 'hidden',
          }}
        >
          <Box 
            sx={{ 
              p: 3, 
              borderBottom: `1px solid ${theme.palette.divider}`,
              background: theme.palette.grey[50]
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                <PersonIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  Profile Settings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Update your personal information and account details
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Box sx={{ p: 4 }}>
            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Full Name
                </Typography>
                <TextField 
                  value={profileForm.name}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
                  fullWidth 
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Box>
              
              <Box>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Email Address
                </Typography>
                <TextField 
                  value={profileForm.email}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                  fullWidth 
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Box>

              <Box>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Phone Number
                </Typography>
                <TextField 
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                  fullWidth 
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Box>

              <Box display="flex" justifyContent="flex-end">
                <Button 
                  variant="contained" 
                  startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />}
                  onClick={() => updateProfile(profileForm)}
                  disabled={saving}
                  sx={{ 
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </Stack>
          </Box>
        </Paper>

        {/* Security Settings */}
        <Paper 
          elevation={0}
          sx={{ 
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`,
            overflow: 'hidden',
          }}
        >
          <Box 
            sx={{ 
              p: 3, 
              borderBottom: `1px solid ${theme.palette.divider}`,
              background: theme.palette.grey[50]
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: theme.palette.warning.main }}>
                <LockIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  Security Settings
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Change your password and manage account security
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Box sx={{ p: 4 }}>
            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Current Password
                </Typography>
                <TextField 
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  fullWidth 
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility('current')}
                          edge="end"
                        >
                          {showPasswords.current ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Box>

              <Box>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  New Password
                </Typography>
                <TextField 
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  fullWidth 
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility('new')}
                          edge="end"
                        >
                          {showPasswords.new ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Box>

              <Box>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Confirm New Password
                </Typography>
                <TextField 
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  fullWidth 
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => togglePasswordVisibility('confirm')}
                          edge="end"
                        >
                          {showPasswords.confirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Box>

              <Box display="flex" justifyContent="flex-end">
                <Button 
                  variant="contained" 
                  startIcon={<LockIcon />}
                  onClick={() => updatePassword({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword })}
                  disabled={saving}
                  sx={{ 
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Update Password
                </Button>
              </Box>
            </Stack>
          </Box>
        </Paper>

        {/* Notification Preferences */}
        <Paper 
          elevation={0}
          sx={{ 
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`,
            overflow: 'hidden',
          }}
        >
          <Box 
            sx={{ 
              p: 3, 
              borderBottom: `1px solid ${theme.palette.divider}`,
              background: theme.palette.grey[50]
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: theme.palette.info.main }}>
                <NotificationsIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  Notification Preferences
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Choose how and when you want to be notified
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Box sx={{ p: 4 }}>
            <Stack spacing={3}>
              <Box>
                <FormControlLabel 
                  control={
                    <Switch 
                      checked={notificationForm.emailAlerts}
                      onChange={(e) => setNotificationForm(prev => ({ ...prev, emailAlerts: e.target.checked }))}
                    />
                  } 
                  label={
                    <Box>
                      <Typography variant="body1" fontWeight={500}>
                        Email Alerts
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Receive important updates via email
                      </Typography>
                    </Box>
                  }
                />
              </Box>
              
              <Box>
                <FormControlLabel 
                  control={
                    <Switch 
                      checked={notificationForm.usageReminders}
                      onChange={(e) => setNotificationForm(prev => ({ ...prev, usageReminders: e.target.checked }))}
                    />
                  } 
                  label={
                    <Box>
                      <Typography variant="body1" fontWeight={500}>
                        Chatbot Usage Reminders
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Get notified about your chatbot performance
                      </Typography>
                    </Box>
                  }
                />
              </Box>
              
              <Box>
                <FormControlLabel 
                  control={
                    <Switch 
                      checked={notificationForm.productUpdates}
                      onChange={(e) => setNotificationForm(prev => ({ ...prev, productUpdates: e.target.checked }))}
                    />
                  } 
                  label={
                    <Box>
                      <Typography variant="body1" fontWeight={500}>
                        Product Updates
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Stay informed about new features and improvements
                      </Typography>
                    </Box>
                  }
                />
              </Box>

              <Box display="flex" justifyContent="flex-end">
                <Button 
                  variant="contained" 
                  startIcon={<SaveIcon />}
                  onClick={() => updateNotifications(notificationForm)}
                  disabled={saving}
                  sx={{ 
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Save Preferences
                </Button>
              </Box>
            </Stack>
          </Box>
        </Paper>

        {/* Danger Zone */}
        <Paper 
          elevation={0}
          sx={{ 
            borderRadius: 3,
            border: `1px solid ${theme.palette.error.light}`,
            overflow: 'hidden',
            background: `linear-gradient(135deg, ${theme.palette.error.light}10 0%, ${theme.palette.error.light}05 100%)`,
          }}
        >
          <Box 
            sx={{ 
              p: 3, 
              borderBottom: `1px solid ${theme.palette.error.light}`,
              background: theme.palette.error.light + '20'
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: theme.palette.error.main }}>
                <SecurityIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="bold" color="error">
                  Danger Zone
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Irreversible actions that will affect your account
                </Typography>
              </Box>
            </Stack>
          </Box>

          <Box sx={{ p: 4 }}>
            <Alert 
              severity="warning" 
              icon={<WarningIcon />}
              sx={{ mb: 3, borderRadius: 2 }}
            >
              <Typography variant="body2" fontWeight={500}>
                Warning: These actions cannot be undone. Please proceed with caution.
              </Typography>
            </Alert>

            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Deactivate Account
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Temporarily disable your account. You can reactivate it later by logging in.
                </Typography>
                <Button 
                  variant="outlined" 
                  color="warning"
                  startIcon={<PowerIcon />}
                  onClick={() => setDeactivateDialog(true)}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Deactivate Account
                </Button>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Delete Account
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Permanently delete your account and all associated data. This action cannot be undone.
                </Typography>
                <Button 
                  variant="outlined" 
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => setDeleteDialog(true)}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Delete Account
                </Button>
              </Box>
            </Stack>
          </Box>
        </Paper>
      </Stack>

      {/* Deactivate Account Dialog */}
      <Dialog open={deactivateDialog} onClose={() => setDeactivateDialog(false)}>
        <DialogTitle>Deactivate Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to deactivate your account? You can reactivate it later by logging in.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Current Password"
            type="password"
            fullWidth
            variant="outlined"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeactivateDialog(false)}>Cancel</Button>
          <Button 
            onClick={deactivateAccount} 
            color="warning" 
            variant="contained"
            disabled={saving}
          >
            {saving ? 'Deactivating...' : 'Deactivate'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action cannot be undone. All your data will be permanently deleted.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Current Password"
            type="password"
            fullWidth
            variant="outlined"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
            sx={{ mt: 2 }}
          />
          <TextField
            margin="dense"
            label="Type 'DELETE' to confirm"
            fullWidth
            variant="outlined"
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button 
            onClick={deleteAccount} 
            color="error" 
            variant="contained"
            disabled={saving || deleteConfirmation !== 'DELETE'}
          >
            {saving ? 'Deleting...' : 'Delete Account'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default SettingsPage;
