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
import { useEffect, useState, useCallback } from 'react';
import { authenticatedFetch } from '@/utils/api';

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
  loading: () => <div>Loading chart...</div>,
});

const ChatBoxOverview = () => {
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
  const [userPlan, setUserPlan] = useState<any>(null);

  const generateDailyStatus = useCallback((chatbox: any) => {
    // Generate last 7 days of status based on chatbox data
    const status = [];
    const today = new Date();
    const chatboxCreated = new Date(chatbox.createdAt || chatbox.updatedAt);
    
    console.log('Generating daily status for chatbox:', {
      status: chatbox.status,
      createdAt: chatbox.createdAt,
      updatedAt: chatbox.updatedAt,
      analytics: chatbox.analytics
    });
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      let dayStatus = 0;
      
      // Check if chatbox was created before or on this date
      if (chatboxCreated <= date) {
        // If chatbox has analytics data, use that to determine activity
        if (chatbox.analytics && chatbox.analytics.websiteVisits) {
          // For now, show as active if status is active (we can enhance this with actual daily analytics later)
          dayStatus = chatbox.status === 'active' ? 1 : 0;
        } else {
          // For new chatboxes without analytics, show as active if status is active
          dayStatus = chatbox.status === 'active' ? 1 : 0;
        }
      }
      
      status.push(dayStatus);
    }
    
    console.log('Generated daily status:', status, 'for chatbox status:', chatbox.status);
    setDailyStatus(status);
  }, []);

  const fetchUserAndChatbox = useCallback(async () => {
    setLoading(true);
    try {
      const userRes = await authenticatedFetch(`${BACKEND_URL}/api/users/me`, {
        method: 'GET',
      });

      if (!userRes.ok) {
        console.error('User not authenticated');
        setChatbox(null);
        return;
      }

      const userData = await userRes.json();
      setUserId(userData._id);
      
      // Handle different plan data structures
      let planData = { name: 'Free' };
      if (userData.planDetails && userData.planDetails.name) {
        planData = userData.planDetails;
      } else if (userData.plan) {
        planData = { name: userData.plan.charAt(0).toUpperCase() + userData.plan.slice(1) };
      }
      setUserPlan(planData);

      const chatboxRes = await authenticatedFetch(`${BACKEND_URL}/api/chatboxes?createdBy=${userData._id}`, {
        method: 'GET',
      });

      const chatboxData = await chatboxRes.json();
      
      // Handle both array and single object responses
      let chatbox = null;
      if (Array.isArray(chatboxData)) {
        chatbox = chatboxData.length > 0 ? chatboxData[0] : null;
      } else {
        chatbox = chatboxData && chatboxData._id ? chatboxData : null;
      }

      if (chatbox) {
        setChatbox(chatbox);
        setIsActive(chatbox.status === 'active');
        
        // Generate dynamic daily status based on actual data
        generateDailyStatus(chatbox);
      } else {
        setChatbox(null);
      }
    } catch (err) {
      console.error('Failed to fetch user or chatbox:', err);
      setChatbox(null);
    } finally {
      setLoading(false);
    }
  }, [BACKEND_URL, generateDailyStatus]);

  useEffect(() => {
    fetchUserAndChatbox();
  }, [fetchUserAndChatbox]);

  // Debug effect to monitor isActive state changes
  useEffect(() => {
    console.log('isActive state changed to:', isActive);
  }, [isActive]);

  // Regenerate chart data when chatbox status changes
  useEffect(() => {
    if (chatbox) {
      console.log('Chatbox status changed, regenerating chart data');
      generateDailyStatus(chatbox);
    }
  }, [chatbox, generateDailyStatus]);

  const toggleActive = async () => {
    if (!chatbox || !chatbox._id) return;

    const newStatus = !isActive ? 'active' : 'inactive';
    console.log('Toggling status to:', newStatus, 'from current isActive:', isActive);

    try {
      setToggleLoading(true);

      const res = await authenticatedFetch(`${BACKEND_URL}/api/chatboxes/${chatbox._id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const errorData = await res.text();
        console.error('Failed to update status:', errorData);
        throw new Error('Failed to update status');
      }

      const updated = await res.json();
      console.log('Updated chatbox response:', updated);
      
      // Ensure we get the correct status from the response
      const updatedStatus = updated.chatbox?.status || updated.status || newStatus;
      const updatedIsActive = updatedStatus === 'active';
      
      console.log('Setting isActive to:', updatedIsActive, 'based on status:', updatedStatus);
      setIsActive(updatedIsActive);
      
      // Update chatbox state with the full updated data
      const updatedChatbox = {
        ...chatbox,
        status: updatedStatus,
        updatedAt: updated.chatbox?.updatedAt || updated.updatedAt || new Date(),
      };
      
      console.log('Updating chatbox state with:', updatedChatbox);
      setChatbox(updatedChatbox);
      
      // Regenerate daily status with the updated chatbox
      generateDailyStatus(updatedChatbox);
      
    } catch (err) {
      console.error('Error updating chatbox status:', err);
      // Revert the switch state on error
      console.log('Reverting isActive to original state:', isActive);
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
      height: 80,
      sparkline: { enabled: false },
    },
    stroke: { 
      curve: 'smooth', 
      width: 3,
      colors: [secondary]
    },
    fill: {
      colors: [secondarylight],
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.3,
        gradientToColors: [secondary],
        inverseColors: false,
        opacityFrom: 0.8,
        opacityTo: 0.2,
        stops: [0, 100]
      }
    },
    markers: { 
      size: 6,
      colors: [secondary],
      strokeColors: '#ffffff',
      strokeWidth: 2,
      hover: {
        size: 8
      }
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      y: {
        formatter: (val: number) => (val === 1 ? 'Active' : 'Inactive'),
      },
      x: {
        formatter: (val: string) => `Date: ${val}`
      }
    },
    xaxis: {
      categories: (() => {
        const categories = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          categories.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        }
        return categories;
      })(),
      labels: {
        show: true,
        style: {
          fontSize: '11px',
          fontWeight: 500
        },
        rotate: 0
      },
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: false
      }
    },
    yaxis: {
      min: 0,
      max: 1,
      tickAmount: 1,
      labels: {
        formatter: (val: number) => (val === 1 ? 'Active' : 'Inactive'),
        style: {
          fontSize: '10px',
          fontWeight: 500
        }
      }
    },
    grid: {
      show: false
    },
    dataLabels: {
      enabled: true,
      formatter: (val: number) => (val === 1 ? '✓' : '✗'),
      style: {
        fontSize: '12px',
        fontWeight: 'bold',
        colors: ['#ffffff']
      },
      offsetY: -5
    }
  };

  const chartSeries = [
    {
      name: 'Status',
      data: dailyStatus,
      color: secondary,
    },
  ];

  // Debug chart data
  console.log('Chart series data:', chartSeries);
  console.log('Daily status for chart:', dailyStatus);

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
        <Fab 
          color="secondary" 
          size="medium" 
          sx={{ color: '#ffffff' }} 
          onClick={fetchUserAndChatbox}
          disabled={loading}
        >
          <IconRefresh width={24} />
        </Fab>
      }
      footer={
        <Chart options={chartOptions} series={chartSeries} type="line" height={100} width="100%" />
      }
    >
      <Typography variant="h6" fontWeight={600}>
        Website: {chatbox.domainUrl || chatbox.website_name}
      </Typography>

      <Typography variant="body2" color="textSecondary" mt={0.5}>
        Chatbox ID: <strong>{chatbox._id}</strong>
      </Typography>

      <Stack direction="row" spacing={2} alignItems="center" my={2}>
        <Chip 
          label={`Plan: ${userPlan?.name || 'Free'}`} 
          color="primary" 
          variant="outlined" 
        />
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

export default ChatBoxOverview;
