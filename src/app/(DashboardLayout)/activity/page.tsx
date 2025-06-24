'use client';

import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Chip,
  Stack,
} from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

// 🇮🇳 Simulated activity logs (India-specific)
const activityLogs = [
  {
    timestamp: '2025-06-24 09:45 AM',
    ip: '49.205.117.10',
    location: 'Mumbai, India',
    device: 'Chrome on Windows',
    status: 'Success',
  },
  {
    timestamp: '2025-06-22 06:20 PM',
    ip: '103.27.9.88',
    location: 'Delhi, India',
    device: 'Edge on Windows',
    status: 'Success',
  },
  {
    timestamp: '2025-06-20 01:12 PM',
    ip: '182.79.114.52',
    location: 'Bengaluru, India',
    device: 'Chrome on Android',
    status: 'Failed',
  },
  {
    timestamp: '2025-06-18 10:30 AM',
    ip: '106.51.72.180',
    location: 'Hyderabad, India',
    device: 'Safari on iPhone',
    status: 'Success',
  },
];

const ActivityPage = () => {
  const lastLogin = activityLogs[0];

  return (
    <PageContainer title="Activity" description="Track your recent login sessions and activity.">
      <Stack spacing={4}>
        {/* Last login summary */}
        <DashboardCard title="Last Login">
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="body1" mb={1}>
              <strong>Time:</strong> {lastLogin.timestamp}
            </Typography>
            <Typography variant="body1" mb={1}>
              <strong>IP Address:</strong> {lastLogin.ip}
            </Typography>
            <Typography variant="body1" mb={1}>
              <strong>Location:</strong> {lastLogin.location}
            </Typography>
            <Typography variant="body1">
              <strong>Device:</strong> {lastLogin.device}
            </Typography>
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
                {activityLogs.map((log, index) => (
                  <TableRow key={index}>
                    <TableCell>{log.timestamp}</TableCell>
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
