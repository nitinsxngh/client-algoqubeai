'use client';
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  CircularProgress,
  Divider,
  IconButton,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  Timeline as TimelineIcon,
  Computer as ComputerIcon,
  Language as LanguageIcon,
  Public as PublicIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { authenticatedFetch } from '@/utils/api';

interface LoginEntry {
  timestamp: string;
  ip: string;
  location: string;
  device: string;
  browser?: string;
  status: 'Success' | 'Failed';
}

interface ActivityData {
  lastLogin: LoginEntry;
  loginHistory: LoginEntry[];
}

const ActivityPage = () => {
  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const theme = useTheme();

  useEffect(() => {
    fetchActivity();
  }, []);

  const fetchActivity = async () => {
    try {
      setLoading(true);
      const response = await authenticatedFetch(`${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/api/users/activity`, {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        setActivity(data);
      } else {
        setError('Failed to fetch activity data');
      }
    } catch (error) {
      setError('Failed to fetch activity data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    return status === 'Success' ? <CheckCircleIcon fontSize="small" /> : <ErrorIcon fontSize="small" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Success':
        return 'success' as const;
      case 'Failed':
        return 'error' as const;
      default:
        return 'default' as const;
    }
  };

  const formatIP = (ip: string) => {
    if (ip === '::1' || ip === 'localhost') {
      return '127.0.0.1 (Local)';
    }
    return ip;
  };

  const formatLocation = (location: string) => {
    if (location === 'Unknown' || location === 'unknown, unknown') {
      return 'Local Development';
    }
    return location;
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  if (loading) {
    return (
      <PageContainer title="Activity" description="Track your recent login sessions and activity.">
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
            Loading activity data...
          </Typography>
        </Box>
      </PageContainer>
    );
  }

  if (error) {
    return (
      <PageContainer title="Activity" description="Track your recent login sessions and activity.">
        <Box 
          display="flex" 
          flexDirection="column"
          justifyContent="center" 
          alignItems="center" 
          minHeight="400px"
          gap={2}
        >
          <ErrorIcon sx={{ fontSize: 48, color: 'error.main' }} />
          <Typography color="error" variant="h6">{error}</Typography>
          <Typography color="text.secondary" variant="body2">
            Unable to load activity data. Please try again.
          </Typography>
        </Box>
      </PageContainer>
    );
  }

  if (!activity) {
    return (
      <PageContainer title="Activity" description="Track your recent login sessions and activity.">
        <Box 
          display="flex" 
          flexDirection="column"
          justifyContent="center" 
          alignItems="center" 
          minHeight="400px"
          gap={2}
        >
          <TimelineIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
          <Typography color="text.secondary" variant="h6">No activity data available</Typography>
          <Typography color="text.secondary" variant="body2">
            Your login activity will appear here once you start using the application.
          </Typography>
        </Box>
      </PageContainer>
    );
  }

  const { lastLogin, loginHistory } = activity;

  // Provide fallback values
  const safeLastLogin = lastLogin || {
    timestamp: new Date().toISOString(),
    ip: 'Unknown',
    location: 'Unknown',
    device: 'Unknown',
    browser: 'Unknown',
    status: 'Unknown' as any,
  };

  const safeLoginHistory = loginHistory || [];

  return (
    <PageContainer title="Activity" description="Track your recent login sessions and activity.">
      <Stack spacing={4}>
        {/* Header with refresh button */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Activity
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Monitor your account activity and login sessions
            </Typography>
          </Box>
          <Tooltip title="Refresh activity data">
            <IconButton 
              onClick={fetchActivity}
              sx={{ 
                bgcolor: 'background.paper',
                border: `1px solid ${theme.palette.divider}`,
                '&:hover': { bgcolor: 'background.paper' }
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Last Login Card */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[50]} 100%)`,
            border: `1px solid ${theme.palette.divider}`,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
            }
          }}
        >
          <Stack direction="row" alignItems="center" spacing={3} mb={3}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: theme.palette.primary.main,
                boxShadow: `0 4px 20px ${theme.palette.primary.main}40`,
              }}
            >
              <TimelineIcon sx={{ fontSize: 28 }} />
            </Avatar>
            <Box flex={1}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Last Login
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {formatTime(safeLastLogin.timestamp)}
              </Typography>
            </Box>
            <Chip
              icon={getStatusIcon(safeLastLogin.status)}
              label={safeLastLogin.status}
              color={getStatusColor(safeLastLogin.status)}
              size="medium"
              sx={{ 
                fontWeight: 600,
                px: 2,
                py: 1,
              }}
            />
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Stack direction="row" spacing={6} flexWrap="wrap">
            <Box display="flex" alignItems="center" gap={2} minWidth={200}>
              <Avatar sx={{ width: 40, height: 40, bgcolor: theme.palette.info.light }}>
                <PublicIcon sx={{ color: theme.palette.info.main }} />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  IP Address
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {formatIP(safeLastLogin.ip)}
                </Typography>
              </Box>
            </Box>

            <Box display="flex" alignItems="center" gap={2} minWidth={200}>
              <Avatar sx={{ width: 40, height: 40, bgcolor: theme.palette.success.light }}>
                <LanguageIcon sx={{ color: theme.palette.success.main }} />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  Location
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {formatLocation(safeLastLogin.location)}
                </Typography>
              </Box>
            </Box>

            <Box display="flex" alignItems="center" gap={2} minWidth={200}>
              <Avatar sx={{ width: 40, height: 40, bgcolor: theme.palette.warning.light }}>
                <ComputerIcon sx={{ color: theme.palette.warning.main }} />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  Browser
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {safeLastLogin.browser || 'Unknown'}
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Paper>

        {/* Login History Table */}
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
            <Typography variant="h6" fontWeight="bold">
              Login History
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Recent login attempts and sessions
            </Typography>
          </Box>

          {safeLoginHistory.length > 0 ? (
            <Box sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 700 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: theme.palette.grey[50] }}>
                    <TableCell sx={{ fontWeight: 600, py: 2 }}>Time</TableCell>
                    <TableCell sx={{ fontWeight: 600, py: 2 }}>IP Address</TableCell>
                    <TableCell sx={{ fontWeight: 600, py: 2 }}>Location</TableCell>
                    <TableCell sx={{ fontWeight: 600, py: 2 }}>Device</TableCell>
                    <TableCell sx={{ fontWeight: 600, py: 2 }}>Browser</TableCell>
                    <TableCell sx={{ fontWeight: 600, py: 2 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {safeLoginHistory.map((log, index) => (
                    <TableRow 
                      key={index}
                      sx={{ 
                        '&:hover': { bgcolor: theme.palette.action.hover },
                        '&:last-child td': { border: 0 }
                      }}
                    >
                      <TableCell sx={{ py: 2 }}>
                        <Typography variant="body2" fontWeight={500}>
                          {formatTime(log.timestamp)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(log.timestamp).toLocaleDateString()}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Typography variant="body2" fontWeight={500}>
                          {formatIP(log.ip)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Typography variant="body2">
                          {formatLocation(log.location)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {log.device}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Typography variant="body2" fontWeight={500}>
                          {log.browser || 'Unknown'}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ py: 2 }}>
                        <Chip
                          icon={getStatusIcon(log.status)}
                          label={log.status}
                          color={getStatusColor(log.status)}
                          size="small"
                          sx={{ 
                            fontWeight: 600,
                            minWidth: 80,
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          ) : (
            <Box sx={{ p: 6, textAlign: 'center' }}>
              <TimelineIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No login history available
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Your login activity will appear here once you start using the application.
              </Typography>
            </Box>
          )}
        </Paper>
      </Stack>
    </PageContainer>
  );
};

export default ActivityPage;
