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
} from '@mui/material';

import { IconListCheck, IconMail, IconUser } from '@tabler/icons-react';

const Profile = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    try {
      // Invalidate the server-side cookie
      await fetch('http://localhost:4000/api/users/logout', {
        method: 'POST',
        credentials: 'include',
      });
  
      // Remove client-side token (if stored)
      localStorage.removeItem('token');
      localStorage.removeItem('user');
  
      // Redirect to login
      window.location.href = '/authentication/login';
    } catch (err) {
      console.error('Logout failed', err);
      alert('Failed to logout');
    }
  };
  

  return (
    <Box>
      <IconButton
        size="large"
        color="inherit"
        onClick={handleClick}
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
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: 200,
          },
        }}
      >
        <MenuItem>
          <ListItemIcon>
            <IconUser width={20} />
          </ListItemIcon>
          <ListItemText>My Profile</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <IconMail width={20} />
          </ListItemIcon>
          <ListItemText>My Account</ListItemText>
        </MenuItem>

        <Box mt={1} py={1} px={2}>
          <Button variant="outlined" color="primary" fullWidth onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;