'use client'
import { Grid, Box } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
// components
import SalesOverview from '@/app/(DashboardLayout)/components/dashboard/TokenOverview';
import YearlyBreakup from '@/app/(DashboardLayout)/components/dashboard/TokenUsageOverview';
import ProductPerformance from '@/app/(DashboardLayout)/components/dashboard/ChatBoxPerformance';
import MonthlyEarnings from '@/app/(DashboardLayout)/components/dashboard/ChatBoxOverview';

const Dashboard = () => {
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          {/* Top Row - Token Overview and Right Side Cards */}
          <Grid
            size={{
              xs: 12,
              lg: 8
            }}>
            <Grid container spacing={3}>
              <Grid size={12}>
                <SalesOverview />
              </Grid>
              <Grid size={12}>
                <ProductPerformance />
              </Grid>
            </Grid>
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
        </Grid>
      </Box>
    </PageContainer>
  );
}

export default Dashboard;
