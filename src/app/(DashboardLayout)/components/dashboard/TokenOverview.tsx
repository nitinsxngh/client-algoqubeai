import React from 'react';
import { Select, MenuItem, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const TokenUsageOverview = () => {
  const [period, setPeriod] = React.useState('7'); // period in days
  const handleChange = (event: any) => {
    setPeriod(event.target.value);
  };

  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  // Simulated daily token stats
  const current_plan = "Pro";
  const tokenStats = {
    tokens_used: [500, 450, 600, 400, 550, 500, 200], // for each day
    tokens_remaining: [1500, 1550, 1400, 1600, 1450, 1500, 1800],
    dates: ['June 18', 'June 19', 'June 20', 'June 21', 'June 22', 'June 23', 'June 24'],
  };

  const options: any = {
    chart: {
      type: 'bar',
      height: 370,
      toolbar: { show: true },
      foreColor: '#adb0bb',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    },
    colors: [primary, secondary],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '42%',
        borderRadius: [6],
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'all',
      },
    },
    dataLabels: { enabled: false },
    legend: { show: true },
    stroke: {
      show: true,
      width: 5,
      colors: ['transparent'],
    },
    grid: {
      borderColor: 'rgba(0,0,0,0.1)',
      strokeDashArray: 3,
    },
    xaxis: {
      categories: tokenStats.dates,
      axisBorder: { show: false },
    },
    yaxis: {
      tickAmount: 5,
      title: { text: 'Tokens' },
    },
    tooltip: {
      theme: 'dark',
      fillSeriesColor: false,
    },
  };

  const series = [
    {
      name: 'Tokens Used',
      data: tokenStats.tokens_used,
    },
    {
      name: 'Tokens Remaining',
      data: tokenStats.tokens_remaining,
    },
  ];

  return (
    <DashboardCard
      title="Token Usage Overview"
      action={
        <Box display="flex" flexDirection="column" alignItems="flex-end">
          <Typography variant="caption">Current Plan: {current_plan}</Typography>
          <Select
            labelId="token-period"
            id="token-period"
            value={period}
            size="small"
            onChange={handleChange}
          >
            <MenuItem value={'7'}>Last 7 Days</MenuItem>
            <MenuItem value={'14'}>Last 14 Days</MenuItem>
            <MenuItem value={'30'}>Last 30 Days</MenuItem>
          </Select>
        </Box>
      }
    >
      <Chart options={options} series={series} type="bar" height={370} width="100%" />
    </DashboardCard>
  );
};

export default TokenUsageOverview;
