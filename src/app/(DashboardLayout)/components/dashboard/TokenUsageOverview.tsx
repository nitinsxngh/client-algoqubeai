'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Stack, Typography, Avatar } from '@mui/material';
import { IconArrowUpLeft } from '@tabler/icons-react';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const YearlyBreakup = () => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primarylight = '#ecf2ff';
  const successlight = theme.palette.success.light;

  const [tokenUsed, setTokenUsed] = useState(0);
  const [tokenRemaining, setTokenRemaining] = useState(0);

  useEffect(() => {
    // Simulated API data
    setTimeout(() => {
      setTokenUsed(3200);
      setTokenRemaining(1800);
    }, 300);
  }, []);

  const total = tokenUsed + tokenRemaining;
  const usagePercent = total > 0 ? ((tokenUsed / total) * 100).toFixed(1) : '0';

  const chartOptions: any = {
    chart: {
      type: 'donut',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      foreColor: '#adb0bb',
      toolbar: { show: false },
      height: 155,
    },
    colors: [primary, primarylight],
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          background: 'transparent',
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode === 'dark' ? 'dark' : 'light',
      fillSeriesColor: false,
    },
    stroke: { show: false },
    dataLabels: { enabled: false },
    legend: { show: false },
  };

  const chartSeries = [tokenUsed, tokenRemaining];

  return (
    <DashboardCard title="Token Usage">
      <Box
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems="flex-start"
        gap={4}
      >
        {/* Left Section: Text and Stats */}
        <Box flex={1}>
          <Typography variant="h5" fontWeight="700">
            {tokenUsed} / {total} tokens used
          </Typography>
          <Stack direction="row" spacing={1} mt={1} alignItems="center">
            <Avatar sx={{ bgcolor: successlight, width: 27, height: 27 }}>
              <IconArrowUpLeft width={20} color="#39B69A" />
            </Avatar>
            <Typography variant="subtitle2" fontWeight="600">
              {usagePercent}%
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              used
            </Typography>
          </Stack>

          <Stack spacing={3} mt={5} direction="row">
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar sx={{ width: 9, height: 9, bgcolor: primary }} />
              <Typography variant="subtitle2" color="textSecondary">
                Used
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <Avatar sx={{ width: 9, height: 9, bgcolor: primarylight }} />
              <Typography variant="subtitle2" color="textSecondary">
                Remaining
              </Typography>
            </Stack>
          </Stack>
        </Box>

        {/* Right Section: Donut Chart */}
        <Box width={{ xs: '100%', md: 180 }}>
          <Chart
            options={chartOptions}
            series={chartSeries}
            type="donut"
            height={150}
            width="100%"
          />
        </Box>
      </Box>
    </DashboardCard>
  );
};

export default YearlyBreakup;