'use client'
import { Grid, Box } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
// components
import SalesOverview from '@/app/(DashboardLayout)/components/dashboard/TokenOverview';
import YearlyBreakup from '@/app/(DashboardLayout)/components/dashboard/TokenUsageOverview';
import RecentTransactions from '@/app/(DashboardLayout)/components/dashboard/ChatBoxTheme';
import ProductPerformance from '@/app/(DashboardLayout)/components/dashboard/ChatBoxPerformance';
import MonthlyEarnings from '@/app/(DashboardLayout)/components/dashboard/ChatBoxOverview';

const Dashboard = () => {
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid
            size={{
              xs: 12,
              lg: 8
            }}>
            <SalesOverview />
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 4
            }}>
            <Grid container spacing={3}>
              <Grid size={12}>
                <MonthlyEarnings />
              </Grid>
              <Grid size={12}>
              <YearlyBreakup />
              </Grid>
            </Grid>
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 4
            }}>
            <RecentTransactions />
          </Grid>
          <Grid
            size={{
              xs: 12,
              lg: 8
            }}>
            <ProductPerformance />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
}

export default Dashboard;
