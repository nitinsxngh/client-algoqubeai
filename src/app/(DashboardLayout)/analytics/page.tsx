'use client';

import React from 'react';
import { Box, Stack, useMediaQuery, useTheme } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';

import TokenUsageOverview from '@/app/(DashboardLayout)/components/dashboard/TokenUsageOverview';
import ProductPerformance from '@/app/(DashboardLayout)/components/dashboard/ChatBoxPerformance';

const AnalyticsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <PageContainer title="Analytics" description="Detailed analytics for your chatbot">
      {/* Token Usage - Full Width */}
      <Box mb={3}>
        <TokenUsageOverview />
      </Box>

      {/* Chatbox Performance - Flexible Grid Layout */}
      <Stack
        direction={isMobile ? 'column' : 'row'}
        spacing={3}
        useFlexGap
        flexWrap="wrap"
        alignItems="stretch"
      >
        <Box flex={1} minWidth={300}>
          <ProductPerformance />
        </Box>

        {/* Placeholder for future analytics cards */}
        {/* <Box flex={1} minWidth={300}>AnotherAnalyticsCard</Box> */}
      </Stack>
    </PageContainer>
  );
};

export default AnalyticsPage;
