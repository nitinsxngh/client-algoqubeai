'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  styled,
  Stack,
  IconButton,
  Badge,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Avatar,
  Chip,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Slide,
  Backdrop,
} from '@mui/material';
import Link from 'next/link';
import Profile from './Profile';
import { authenticatedFetch, isAuthenticated } from '../../../../utils/api';
import { 
  IconBellRinging, 
  IconMenu, 
  IconSettings, 
  IconActivity,
  IconCheck,
  IconAlertCircle,
  IconInfoCircle,
  IconX
} from '@tabler/icons-react';

interface ItemType {
  toggleMobileSidebar: (event: React.MouseEvent<HTMLElement>) => void;
}

const AppBarStyled = styled(AppBar)(({ theme }) => ({
  boxShadow: 'none',
  background: theme.palette.background.paper,
  justifyContent: 'center',
  backdropFilter: 'blur(4px)',
  [theme.breakpoints.up('lg')]: {
    minHeight: '70px',
  },
}));

const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
  width: '100%',
  color: theme.palette.text.secondary,
}));

const Header = ({ toggleMobileSidebar }: ItemType) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT || 'http://localhost:4000';

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      setIsLoggedIn(false);
      setIsLoading(false);
      return;
    }
    
    authenticatedFetch(`${API_URL}/api/users/me`)
      .then((res) => {
        console.log('Header auth check status:', res.status);
        setIsLoggedIn(res.ok);
      })
      .catch((error) => {
        console.error('Header auth check error:', error);
        setIsLoggedIn(false);
      })
      .finally(() => setIsLoading(false));
  }, [API_URL]);

  const fetchNotifications = useCallback(async () => {
    setLoadingNotifications(true);
    try {
      const response = await authenticatedFetch(`${API_URL}/api/notifications?limit=10`);
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoadingNotifications(false);
    }
  }, [API_URL]);

  // Fetch notifications when user is logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchNotifications();
    }
  }, [isLoggedIn, fetchNotifications]);

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await authenticatedFetch(`${API_URL}/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
      });
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => 
          n._id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return date.toLocaleDateString();
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationPanelOpen(true);
  };

  const handleNotificationClose = () => {
    setNotificationPanelOpen(false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <IconCheck size={16} color="#10b981" />;
      case 'warning':
        return <IconAlertCircle size={16} color="#f59e0b" />;
      case 'error':
        return <IconX size={16} color="#ef4444" />;
      default:
        return <IconInfoCircle size={16} color="#6366f1" />;
    }
  };

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        <IconButton
          color="inherit"
          aria-label="menu"
          onClick={toggleMobileSidebar}
          sx={{ display: { lg: 'none', xs: 'inline' } }}
        >
          <IconMenu width="20" height="20" />
        </IconButton>

        <IconButton
          size="large"
          aria-label="notifications"
          color="inherit"
          onClick={handleNotificationClick}
          aria-controls="notifications-menu"
          aria-haspopup="true"
          sx={{
            ...(notificationAnchor && {
              color: 'primary.main',
            }),
          }}
        >
          <Badge badgeContent={unreadCount} color="error" max={99}>
            <IconBellRinging size="21" stroke="1.5" />
          </Badge>
        </IconButton>

        {/* Notification Panel */}
        <Drawer
          anchor="right"
          open={notificationPanelOpen}
          onClose={handleNotificationClose}
          sx={{
            '& .MuiDrawer-paper': {
              width: 400,
              maxWidth: '90vw',
              boxShadow: '-4px 0 20px rgba(0, 0, 0, 0.15)',
            },
          }}
          SlideProps={{
            direction: 'left',
          }}
        >
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Box sx={{ 
              p: 3, 
              borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              bgcolor: 'background.paper',
              position: 'sticky',
              top: 0,
              zIndex: 1,
            }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Notifications
                </Typography>
                {unreadCount > 0 && (
                  <Chip
                    label={`${unreadCount} unread`}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                )}
              </Box>
              <IconButton 
                onClick={handleNotificationClose}
                size="small"
                sx={{ 
                  bgcolor: 'rgba(0, 0, 0, 0.04)',
                  '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.08)' }
                }}
              >
                <IconX size={20} />
              </IconButton>
            </Box>

            {/* Content */}
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              {loadingNotifications ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Loading notifications...
                  </Typography>
                </Box>
              ) : notifications.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <IconBellRinging size={48} color="#ccc" style={{ marginBottom: 16 }} />
                  <Typography variant="body2" color="text.secondary">
                    No notifications yet
                  </Typography>
                </Box>
              ) : (
                <List sx={{ p: 0 }}>
                  {notifications.map((notification, index) => (
                    <ListItem key={notification._id} disablePadding>
                      <ListItemButton
                        onClick={() => {
                          markNotificationAsRead(notification._id);
                        }}
                        sx={{
                          py: 2,
                          px: 3,
                          borderBottom: index < notifications.length - 1 ? '1px solid rgba(0, 0, 0, 0.04)' : 'none',
                          ...(!notification.read && {
                            bgcolor: 'rgba(99, 102, 241, 0.04)',
                            borderLeft: '3px solid',
                            borderLeftColor: 'primary.main',
                          }),
                          '&:hover': {
                            bgcolor: 'rgba(0, 0, 0, 0.02)',
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 48, mr: 2 }}>
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: notification.read ? 'rgba(0, 0, 0, 0.04)' : 'primary.light',
                            }}
                          >
                            {getNotificationIcon(notification.type)}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography 
                              variant="subtitle2" 
                              component="span" 
                              sx={{ 
                                fontWeight: notification.read ? 400 : 600, 
                                display: 'block',
                                mb: 0.5,
                              }}
                            >
                              {notification.title}
                            </Typography>
                          }
                          secondary={
                            <Box component="span" sx={{ display: 'block' }}>
                              <Typography 
                                variant="body2" 
                                color="text.secondary" 
                                component="span" 
                                sx={{ 
                                  display: 'block',
                                  mb: 0.5,
                                  lineHeight: 1.4,
                                }}
                              >
                                {notification.message}
                              </Typography>
                              <Typography 
                                variant="caption" 
                                color="text.secondary" 
                                component="span" 
                                sx={{ display: 'block' }}
                              >
                                {formatTimeAgo(notification.createdAt)}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>

            {/* Footer */}
            {notifications.length > 0 && (
              <Box sx={{ 
                p: 2, 
                borderTop: '1px solid rgba(0, 0, 0, 0.06)',
                bgcolor: 'background.paper',
                position: 'sticky',
                bottom: 0,
              }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleNotificationClose}
                  sx={{ textTransform: 'none', fontWeight: 500 }}
                >
                  View All Notifications
                </Button>
              </Box>
            )}
          </Box>
        </Drawer>

        <Box flexGrow={1} />

        <Stack spacing={1} direction="row" alignItems="center">
          {!isLoading && !isLoggedIn && (
            <Button
              variant="contained"
              component={Link}
              href="/authentication/login"
              disableElevation
              color="primary"
            >
              Login
            </Button>
          )}
          {!isLoading && isLoggedIn && <Profile />}
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

export default Header;
