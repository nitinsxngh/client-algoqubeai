'use client';

import dynamic from 'next/dynamic';
import { useTheme } from '@mui/material/styles';
import {
  Stack,
  Typography,
  Avatar,
  Fab,
  Switch,
  Box,
  Chip,
} from '@mui/material';
import {
  IconRefresh,
  IconPlugConnected,
  IconPlugConnectedX,
} from '@tabler/icons-react';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { useState } from 'react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const MonthlyEarnings = () => {
  const theme = useTheme();
  const secondary = theme.palette.secondary.main;
  const secondarylight = '#f5fcff';

  // Simulated daily status: 1 = active, 0 = inactive
  const [dailyStatus, setDailyStatus] = useState([1, 1, 1, 0, 1, 0, 1]);
  const [isActive, setIsActive] = useState(true);

  const Chatbox = {
    website_name: 'algoqube.ai',
    Chatbox_id: 'cb_786XYZ',
    current_plan: 'Pro',
    last_updated: 'June 24, 2025 • 11:45 AM',
  };

  const toggleActive = () => {
    setIsActive((prev) => !prev);
  };

  const options: any = {
    chart: {
      type: 'area',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: '#adb0bb',
      toolbar: { show: false },
      height: 60,
      sparkline: { enabled: true },
      group: 'sparklines',
    },
    stroke: {
      curve: 'straight',
      width: 2,
    },
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
      categories: ['Jun 18', 'Jun 19', 'Jun 20', 'Jun 21', 'Jun 22', 'Jun 23', 'Jun 24'],
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

  const series = [
    {
      name: 'Status',
      data: dailyStatus,
      color: secondary,
    },
  ];

  return (
    <DashboardCard
      title="Chatbox Overview"
      action={
        <Fab color="secondary" size="medium" sx={{ color: '#ffffff' }}>
          <IconRefresh width={24} />
        </Fab>
      }
      footer={
        <Chart
          options={options}
          series={series}
          type="area"
          height={60}
          width="100%"
        />
      }
    >
      {/* Website & ID */}
      <Typography variant="h6" fontWeight={600}>
        Website: {Chatbox.website_name}
      </Typography>

      <Typography variant="body2" color="textSecondary" mt={0.5}>
        Chatbox ID: <strong>{Chatbox.Chatbox_id}</strong>
      </Typography>

      {/* Plan & Active status */}
      <Stack direction="row" spacing={2} alignItems="center" my={2}>
        <Chip
          label={`Plan: ${Chatbox.current_plan}`}
          color="primary"
          variant="outlined"
        />
        <Box display="flex" alignItems="center">
          <Switch
            checked={isActive}
            color="success"
            size="small"
            onChange={toggleActive}
          />
          <Typography variant="body2" ml={1} display="flex" alignItems="center" gap={0.5}>
            {isActive ? (
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

      {/* Last Updated */}
      <Typography variant="caption" color="textSecondary">
        Last Updated: {Chatbox.last_updated}
      </Typography>
    </DashboardCard>
  );
};

export default MonthlyEarnings;
