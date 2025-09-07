'use client';

import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Button, Paper, Chip, Stack, useTheme, Avatar, Divider, IconButton, Tooltip, Alert, CircularProgress, Snackbar, Grid,
} from '@mui/material';
import {
  Check as CheckIcon, Star as StarIcon, TrendingUp as TrendingUpIcon, Support as SupportIcon, Security as SecurityIcon, Speed as SpeedIcon, Analytics as AnalyticsIcon, Business as BusinessIcon, Rocket as RocketIcon, Info as InfoIcon, ArrowForward as ArrowForwardIcon, Diamond as DiamondIcon, WorkspacePremium as WorkspacePremiumIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { useRouter } from 'next/navigation';
import { authenticatedFetch } from '@/utils/api';

interface Plan {
  id: string;
  name: string;
  price: number;
  tokenLimit: number;
  features: string[];
  description: string;
  popular?: boolean;
  color: string;
}

interface UserTokenUsage {
  tokens: {
    allocated: number;
    used: number;
    remaining: number;
  };
  plan: string;
  planDetails: {
    name: string;
    price: number;
    tokenLimit: number;
    features: string[];
    startDate: string;
    endDate: string;
    isActive: boolean;
  };
  usagePercentage: number;
}

const PlanPage = () => {
  const theme = useTheme();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentPlanId, setCurrentPlanId] = useState('free');
  const [loading, setLoading] = useState(true);
  const [selectingPlan, setSelectingPlan] = useState(false);
  const [tokenUsage, setTokenUsage] = useState<UserTokenUsage | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const router = useRouter();

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT!;

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await authenticatedFetch(`${BACKEND_URL}/api/users/plans`);
        if (response.ok) {
          const data = await response.json();
          setPlans(data.plans);
        }
      } catch (error) {
        console.error('Error fetching plans:', error);
      }
    };

    const fetchUserData = async () => {
      try {
        const response = await authenticatedFetch(`${BACKEND_URL}/api/users/token-usage`);
        if (response.ok) {
          const data = await response.json();
          setTokenUsage(data);
          setCurrentPlanId(data.plan);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
    fetchUserData();
  }, [BACKEND_URL]);

  const handlePlanSelect = async (planId: string) => {
    if (planId === 'free') return;
    
    setSelectingPlan(true);
    try {
      const response = await authenticatedFetch(`${BACKEND_URL}/api/users/select-plan`, {
        method: 'POST',
        body: JSON.stringify({ planId }),
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentPlanId(planId);
        setTokenUsage(prev => prev ? {
          ...prev,
          plan: planId,
          planDetails: data.plan,
          tokens: data.user.tokens
        } : null);
        setSnackbar({
          open: true,
          message: `Successfully upgraded to ${data.plan.name} plan!`,
          severity: 'success'
        });
      } else {
        const errorData = await response.json();
        setSnackbar({
          open: true,
          message: errorData.message || 'Failed to select plan',
          severity: 'error'
        });
      }
    } catch (error) {
      console.error('Error selecting plan:', error);
      setSnackbar({
        open: true,
        message: 'Failed to select plan',
        severity: 'error'
      });
    } finally {
      setSelectingPlan(false);
    }
  };

  const getCurrentPlan = () => plans.find(plan => plan.id === currentPlanId);
  const formatPrice = (price: number) => {
    if (price === 0) return 'Free';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };
  const formatTokens = (tokens: number) => {
    if (tokens === 0) return 'Unlimited';
    return new Intl.NumberFormat('en-IN').format(tokens);
  };
  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'starter': return <TrendingUpIcon />;
      case 'professional': return <WorkspacePremiumIcon />;
      case 'enterprise': return <BusinessIcon />;
      default: return <StarIcon />;
    }
  };

  if (loading) {
    return (
      <PageContainer title="Plans & Pricing" description="Choose the perfect plan for your AI chatbot needs">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  const currentPlan = getCurrentPlan();
  const paidPlans = plans.filter(plan => plan.id !== 'free');

  return (
    <PageContainer title="Plans & Pricing" description="Choose the perfect plan for your AI chatbot needs">
      <Stack spacing={4}>
        {/* Current Plan Banner */}
        {currentPlan && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Paper
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 4,
                background: currentPlan.id === 'free' 
                  ? 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
                  : `linear-gradient(135deg, ${currentPlan.color}15 0%, ${currentPlan.color}08 100%)`,
                border: `2px solid ${currentPlan.id === 'free' ? '#e2e8f0' : currentPlan.color + '30'}`,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: currentPlan.id === 'free' ? '#94a3b8' : currentPlan.color,
                }
              }}
            >
              <Stack direction="row" alignItems="center" spacing={3}>
                <Avatar
                  sx={{
                    width: 64,
                    height: 64,
                    bgcolor: currentPlan.id === 'free' ? '#94a3b8' : currentPlan.color,
                    boxShadow: `0 8px 32px ${currentPlan.color}40`,
                  }}
                >
                  {currentPlan.id === 'free' ? <StarIcon sx={{ fontSize: 32 }} /> : getPlanIcon(currentPlan.id)}
                </Avatar>
                <Box flex={1}>
                  <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {currentPlan.name} Plan
                    </Typography>
                    <Chip
                      label="Current Plan"
                      size="small"
                      sx={{
                        bgcolor: currentPlan.id === 'free' ? '#94a3b8' : currentPlan.color,
                        color: 'white',
                        fontWeight: 600,
                      }}
                    />
                  </Stack>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    {currentPlan.description}
                  </Typography>
                  {tokenUsage && (
                    <Stack direction="row" spacing={4}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Tokens Used
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {formatTokens(tokenUsage.tokens.used)} / {formatTokens(tokenUsage.tokens.allocated)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Remaining
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'success.main' }}>
                          {formatTokens(tokenUsage.tokens.remaining)}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Usage
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {tokenUsage.usagePercentage}%
                        </Typography>
                      </Box>
                    </Stack>
                  )}
                </Box>
              </Stack>
            </Paper>
          </motion.div>
        )}

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Box textAlign="center" mb={2}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Choose Your Perfect Plan
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Scale your AI chatbot capabilities with our flexible pricing plans designed for businesses of all sizes
            </Typography>
          </Box>
        </motion.div>

        {/* Plans Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Grid container spacing={3} justifyContent="center">
            {paidPlans.map((plan, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={plan.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      height: '100%',
                      borderRadius: 4,
                      background: plan.popular 
                        ? `linear-gradient(135deg, ${plan.color}08 0%, ${plan.color}15 100%)`
                        : 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
                      border: plan.popular 
                        ? `2px solid ${plan.color}`
                        : '2px solid rgba(0, 0, 0, 0.08)',
                      position: 'relative',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: plan.popular 
                          ? `0 20px 40px ${plan.color}20`
                          : '0 20px 40px rgba(0, 0, 0, 0.1)',
                      },
                    }}
                    onClick={() => handlePlanSelect(plan.id)}
                  >
                    {plan.popular && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: -12,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          bgcolor: plan.color,
                          color: 'white',
                          px: 3,
                          py: 0.5,
                          borderRadius: 2,
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          zIndex: 1,
                        }}
                      >
                        Most Popular
                      </Box>
                    )}

                    <Stack spacing={3} height="100%">
                      {/* Plan Header */}
                      <Box textAlign="center">
                        <Avatar
                          sx={{
                            width: 80,
                            height: 80,
                            bgcolor: plan.color,
                            mx: 'auto',
                            mb: 2,
                            boxShadow: `0 8px 32px ${plan.color}40`,
                          }}
                        >
                          {getPlanIcon(plan.id)}
                        </Avatar>
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                          {plan.name}
                        </Typography>
                        <Typography variant="h3" sx={{ fontWeight: 800, color: plan.color, mb: 1 }}>
                          {formatPrice(plan.price)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          per month
                        </Typography>
                      </Box>

                      <Divider />

                      {/* Features */}
                      <Box flex={1}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                          What&apos;s included:
                        </Typography>
                        <Stack spacing={1.5}>
                          {plan.features.map((feature, idx) => (
                            <Stack key={idx} direction="row" spacing={1.5} alignItems="flex-start">
                              <CheckIcon 
                                sx={{ 
                                  color: plan.color, 
                                  fontSize: 20, 
                                  mt: 0.25,
                                  flexShrink: 0 
                                }} 
                              />
                              <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                                {feature}
                              </Typography>
                            </Stack>
                          ))}
                        </Stack>
                      </Box>

                      {/* Action Button */}
                      <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        disabled={selectingPlan || currentPlanId === plan.id}
                        onClick={() => handlePlanSelect(plan.id)}
                        sx={{
                          bgcolor: plan.color,
                          color: 'white',
                          py: 1.5,
                          borderRadius: 2,
                          fontWeight: 600,
                          textTransform: 'none',
                          fontSize: '1rem',
                          '&:hover': {
                            bgcolor: plan.color,
                            transform: 'translateY(-2px)',
                            boxShadow: `0 8px 25px ${plan.color}40`,
                          },
                          '&:disabled': {
                            bgcolor: 'rgba(0, 0, 0, 0.12)',
                            color: 'rgba(0, 0, 0, 0.38)',
                          },
                        }}
                      >
                        {selectingPlan ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : currentPlanId === plan.id ? (
                          'Current Plan'
                        ) : (
                          'Select Plan'
                        )}
                      </Button>
                    </Stack>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              border: '1px solid rgba(0, 0, 0, 0.06)',
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, textAlign: 'center' }}>
              Frequently Asked Questions
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Can I change my plan anytime?
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    What happens to unused tokens?
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Unused tokens roll over to the next billing cycle, so you never lose what you&apos;ve paid for.
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Is there a setup fee?
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    No setup fees! All plans include instant activation and full access to all features.
                  </Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Do you offer refunds?
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    We offer a 30-day money-back guarantee. If you&apos;re not satisfied, we&apos;ll refund your payment.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>
      </Stack>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default PlanPage;
