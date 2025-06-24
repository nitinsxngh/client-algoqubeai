'use client';

import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  Stack,
  useTheme,
} from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

const PlanPage = () => {
  const theme = useTheme();

  const currentPlanId = 'pro'; // Simulated current user plan

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: '$0',
      tokens: 1000,
      support: 'Email',
      features: ['Basic chatbot', 'Limited analytics'],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$49/mo',
      tokens: 50000,
      support: 'Priority',
      features: ['Everything in Basic', 'Advanced analytics', 'Custom training'],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 'Custom',
      tokens: 'Unlimited',
      support: '24/7 Dedicated',
      features: ['Everything in Pro', 'SLA guarantee', 'Account manager'],
    },
  ];

  const handlePlanSelect = (planId: string) => {
    alert(`Redirecting to manage/upgrade plan: ${planId}`);
  };

  return (
    <PageContainer title="Your Plan" description="Manage or upgrade your current subscription.">
      <DashboardCard title="Subscription Plans">
        <Stack spacing={3} direction={{ xs: 'column', md: 'row' }} flexWrap="wrap">
          {plans.map((plan) => {
            const isCurrent = plan.id === currentPlanId;

            return (
              <Paper
                key={plan.id}
                elevation={isCurrent ? 6 : 1}
                sx={{
                  flex: 1,
                  minWidth: 280,
                  p: 3,
                  borderRadius: 3,
                  border: isCurrent ? `2px solid ${theme.palette.primary.main}` : '1px solid #ddd',
                  backgroundColor: isCurrent ? theme.palette.background.default : 'inherit',
                }}
              >
                <Stack spacing={2} height="100%">
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6">{plan.name}</Typography>
                    {isCurrent && (
                      <Chip label="Current Plan" color="primary" size="small" />
                    )}
                  </Box>

                  <Typography variant="h4" fontWeight="bold">
                    {plan.price}
                  </Typography>

                  <Typography variant="body2" color="textSecondary">
                    Tokens: <strong>{plan.tokens}</strong>
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Support: <strong>{plan.support}</strong>
                  </Typography>

                  <Box>
                    {plan.features.map((feature, idx) => (
                      <Typography variant="body2" key={idx}>• {feature}</Typography>
                    ))}
                  </Box>

                  {!isCurrent && (
                    <Box mt="auto">
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => handlePlanSelect(plan.id)}
                      >
                        {plan.id === 'enterprise' ? 'Contact Sales' : 'Upgrade'}
                      </Button>
                    </Box>
                  )}
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      </DashboardCard>
    </PageContainer>
  );
};

export default PlanPage;
