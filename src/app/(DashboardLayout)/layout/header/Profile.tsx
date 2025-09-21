'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Avatar,
  Box,
  Menu,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Button,
  Typography,
  Divider,
} from '@mui/material';
import { 
  IconListCheck, 
  IconMail, 
  IconUser, 
  IconSettings, 
  IconActivity,
  IconLogout,
  IconShield,
  IconCreditCard
} from '@tabler/icons-react';
import { authenticatedFetch, clearAuth, getUser } from '@/utils/api';

const Profile = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [user, setUser] = useState<any>(null);

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT || 'http://localhost:4000';

  // Get user data on component mount
  React.useEffect(() => {
    const userData = getUser();
    setUser(userData);
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await authenticatedFetch(`${API_URL}/api/users/logout`, {
        method: 'POST',
      });
      clearAuth();
      window.location.href = '/authentication/login';
    } catch (err) {
      console.error('Logout failed', err);
      alert('Failed to logout');
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <Box>
      <IconButton
        size="large"
        color="inherit"
        onClick={handleClick}
        aria-label="profile options"
        aria-controls="profile-menu"
        aria-haspopup="true"
        sx={{
          ...(anchorEl && {
            color: 'primary.main',
          }),
        }}
      >
        <Avatar
          src="/images/profile/user-1.jpg"
          alt="profile"
          sx={{ width: 35, height: 35 }}
        />
      </IconButton>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: 280,
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          },
        }}
      >
        {/* User Info Header */}
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src="/images/profile/user-1.jpg"
              alt="profile"
              sx={{ width: 48, height: 48 }}
            />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {user?.name || 'User'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email || 'user@example.com'}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Profile Section */}
        <Box sx={{ py: 1 }}>
          <MenuItem onClick={handleClose} component={Link} href="/settings">
            <ListItemIcon>
              <IconSettings width={20} />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2">Settings</Typography>
              <Typography variant="caption" color="text.secondary">
                Configure your preferences
              </Typography>
            </ListItemText>
          </MenuItem>

          <MenuItem onClick={handleClose} component={Link} href="/activity">
            <ListItemIcon>
              <IconActivity width={20} />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2">Activity</Typography>
              <Typography variant="caption" color="text.secondary">
                View your activity history
              </Typography>
            </ListItemText>
          </MenuItem>

          <MenuItem onClick={handleClose} component={Link} href="/billing">
            <ListItemIcon>
              <IconCreditCard width={20} />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2">Billing</Typography>
              <Typography variant="caption" color="text.secondary">
                Manage subscriptions & payments
              </Typography>
            </ListItemText>
          </MenuItem>
        </Box>

        <Divider />

        {/* Logout Section */}
        <Box sx={{ p: 1 }}>
          <Button
            variant="outlined"
            color="error"
            fullWidth
            onClick={handleLogout}
            disabled={loggingOut}
            startIcon={<IconLogout size={18} />}
            sx={{ 
              justifyContent: 'flex-start',
              textTransform: 'none',
              py: 1.5
            }}
          >
            {loggingOut ? 'Logging out…' : 'Sign Out'}
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
