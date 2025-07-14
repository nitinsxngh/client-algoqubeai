'use client';

import React, { useEffect, useState } from 'react';
import {
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Chip,
  Stack,
  CircularProgress,
  Box,
  Alert,
} from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

interface LoginEntry {
  timestamp: string;
  ip: string;
  location: string;
  device: string;
  status: 'Success' | 'Failed';
}

interface ActivityData {
  lastLogin: LoginEntry;
  loginHistory: LoginEntry[];
}

const ActivityPage = () => {
  const [activity, setActivity] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/api/users/activity`, {
          credentials: 'include',
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Failed to fetch activity.');
        }

        const data: ActivityData = await res.json();
        setActivity(data);
      } catch (err: any) {
        console.error('Error fetching activity:', err);
        setError(err.message || 'An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!activity) {
    return (
      <Typography variant="h6" color="text.secondary" mt={4}>
        No activity data available.
      </Typography>
    );
  }

  const { lastLogin, loginHistory } = activity;

  return (
    <PageContainer title="Activity" description="Track your recent login sessions and activity.">
      <Stack spacing={4}>
        {/* Last Login */}
        <DashboardCard title="Last Login">
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="body1" mb={1}><strong>Time:</strong> {new Date(lastLogin.timestamp).toLocaleString()}</Typography>
            <Typography variant="body1" mb={1}><strong>IP Address:</strong> {lastLogin.ip}</Typography>
            <Typography variant="body1" mb={1}><strong>Location:</strong> {lastLogin.location}</Typography>
            <Typography variant="body1"><strong>Device:</strong> {lastLogin.device}</Typography>
          </Paper>
        </DashboardCard>

        {/* Login History Table */}
        <DashboardCard title="Login History">
          <Paper sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 700 }}>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Date & Time</strong></TableCell>
                  <TableCell><strong>IP Address</strong></TableCell>
                  <TableCell><strong>Location</strong></TableCell>
                  <TableCell><strong>Device</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loginHistory.map((log, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                    <TableCell>{log.ip}</TableCell>
                    <TableCell>{log.location}</TableCell>
                    <TableCell>{log.device}</TableCell>
                    <TableCell>
                      <Chip
                        label={log.status}
                        color={log.status === 'Success' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </DashboardCard>
      </Stack>
    </PageContainer>
  );
};

export default ActivityPage;
