'use client';

import dynamic from 'next/dynamic';
import { useTheme } from '@mui/material/styles';
import {
  Stack,
  Typography,
  Fab,
  Switch,
  Box,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  IconRefresh,
  IconPlugConnected,
  IconPlugConnectedX,
} from '@tabler/icons-react';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { useEffect, useState } from 'react';

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => <div>Loading chart...</div>,
});

const MonthlyEarnings = () => {
  const theme = useTheme();
  const secondary = theme.palette.secondary.main;
  const secondarylight = '#f5fcff';

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT!;

  const [userId, setUserId] = useState<string | null>(null);
  const [chatbox, setChatbox] = useState<any>(null);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [dailyStatus, setDailyStatus] = useState([1, 1, 1, 0, 1, 0, 1]);

  const fetchUserAndChatbox = async () => {
    setLoading(true);
    try {
      const userRes = await fetch(`${BACKEND_URL}/api/users/me`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!userRes.ok) {
        console.error('User not authenticated');
        setChatbox(null);
        return;
      }

      const userData = await userRes.json();
      setUserId(userData._id);

      const chatboxRes = await fetch(
        `${BACKEND_URL}/api/chatboxes?createdBy=${userData._id}`,
        { credentials: 'include' }
      );

      const chatboxData = await chatboxRes.json();
      if (chatboxData && chatboxData._id) {
        setChatbox(chatboxData);
        setIsActive(chatboxData.status === 'active');
      } else {
        setChatbox(null);
      }
    } catch (err) {
      console.error('Failed to fetch user or chatbox:', err);
      setChatbox(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAndChatbox();
  }, []);

  const toggleActive = async () => {
    if (!chatbox || !chatbox._id) return;

    const newStatus = !isActive ? 'active' : 'inactive';

    try {
      setToggleLoading(true);

      const res = await fetch(`${BACKEND_URL}/api/chatboxes/${chatbox._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status');

      const updated = await res.json();
      const updatedIsActive = updated.status === 'active';

      setIsActive(updatedIsActive);
      setChatbox((prev: any) => ({
        ...prev,
        status: updated.status,
        updatedAt: updated.updatedAt,
      }));
    } catch (err) {
      console.error('Error updating chatbox status:', err);
    } finally {
      setToggleLoading(false);
    }
  };

  const chartOptions: any = {
    chart: {
      type: 'area',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: '#adb0bb',
      toolbar: { show: false },
      height: 60,
      sparkline: { enabled: true },
      group: 'sparklines',
    },
    stroke: { curve: 'straight', width: 2 },
    fill: {
      colors: [secondarylight],
      type: 'solid',
      opacity: 0.2,
    },
    markers: { size: 4 },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      y: {
        formatter: (val: number) => (val === 1 ? 'Active' : 'Inactive'),
      },
    },
    xaxis: {
      categories: [
        'Jun 18',
        'Jun 19',
        'Jun 20',
        'Jun 21',
        'Jun 22',
        'Jun 23',
        'Jun 24',
      ],
      labels: {
        show: true,
        style: {
          fontSize: '10px',
        },
      },
    },
    yaxis: {
      min: 0,
      max: 1,
      tickAmount: 1,
      labels: {
        formatter: (val: number) => (val === 1 ? 'Active' : 'Inactive'),
      },
    },
  };

  const chartSeries = [
    {
      name: 'Status',
      data: dailyStatus,
      color: secondary,
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (!chatbox) {
    return (
      <DashboardCard title="Chatbox Overview">
        <Typography>No chatbox found for this user.</Typography>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard
      title="Chatbox Overview"
      action={
        <Fab color="secondary" size="medium" sx={{ color: '#ffffff' }} onClick={fetchUserAndChatbox}>
          <IconRefresh width={24} />
        </Fab>
      }
      footer={
        <Chart options={chartOptions} series={chartSeries} type="area" height={60} width="100%" />
      }
    >
      <Typography variant="h6" fontWeight={600}>
        Website: {chatbox.domainUrl || chatbox.website_name}
      </Typography>

      <Typography variant="body2" color="textSecondary" mt={0.5}>
        Chatbox ID: <strong>{chatbox._id}</strong>
      </Typography>

      <Stack direction="row" spacing={2} alignItems="center" my={2}>
        <Chip label={`Plan: ${chatbox.plan || 'Free'}`} color="primary" variant="outlined" />
        <Box display="flex" alignItems="center">
          <Switch
            checked={isActive}
            color="success"
            size="small"
            onChange={toggleActive}
            disabled={toggleLoading}
          />
          <Typography variant="body2" ml={1} display="flex" alignItems="center" gap={0.5}>
            {toggleLoading ? (
              <CircularProgress size={14} />
            ) : isActive ? (
              <>
                <IconPlugConnected color="green" size={16} /> Active
              </>
            ) : (
              <>
                <IconPlugConnectedX color="gray" size={16} /> Inactive
              </>
            )}
          </Typography>
        </Box>
      </Stack>

      <Typography variant="caption" color="textSecondary">
        Last Updated:{' '}
        {chatbox.updatedAt
          ? new Date(chatbox.updatedAt).toLocaleString()
          : 'N/A'}
      </Typography>
    </DashboardCard>
  );
};

export default MonthlyEarnings;
