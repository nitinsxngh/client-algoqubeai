'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  LinearProgress,
  Chip,
  Avatar,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Token as TokenIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { authenticatedFetch } from '@/utils/api';

interface TokenUsage {
  tokens: {
    allocated: number;
    used: number;
    remaining: number;
  };
  plan: string;
  planDetails: any;
  usagePercentage: number;
}

const TokenUsageOverview = () => {
  const [tokenUsage, setTokenUsage] = useState<TokenUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT!;

  const fetchTokenUsage = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      }
      
      const response = await authenticatedFetch(`${BACKEND_URL}/api/users/token-usage`, {
        method: 'GET',
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Token usage data received:', data); // Debug log
        setTokenUsage(data);
        setError(null);
      } else {
        console.error('Token usage fetch failed:', response.status, response.statusText);
        setError('Failed to fetch token usage');
      }
    } catch (error) {
      console.error('Error fetching token usage:', error);
      setError('Failed to fetch token usage');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTokenUsage();
    
    // Set up periodic refresh every 30 seconds
    const interval = setInterval(() => {
      fetchTokenUsage(true);
    }, 30000);

    return () => clearInterval(interval);
  }, [BACKEND_URL]);

  const handleRefresh = () => {
    fetchTokenUsage(true);
  };

  const handleInitializeTokens = async () => {
    try {
      const response = await authenticatedFetch(`${BACKEND_URL}/api/users/initialize-tokens`, {
        method: 'POST',
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Tokens initialized:', data);
        fetchTokenUsage(true); // Refresh the data
      } else {
        console.error('Failed to initialize tokens');
      }
    } catch (error) {
      console.error('Error initializing tokens:', error);
    }
  };

  const handleTestTokenConsumption = async () => {
    try {
      const response = await authenticatedFetch(`${BACKEND_URL}/api/users/test-token-consumption`, {
        method: 'POST',
        body: JSON.stringify({ amount: 5 }),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Test token consumption:', data);
        fetchTokenUsage(true); // Refresh the data
      } else {
        console.error('Failed to test token consumption');
      }
    } catch (error) {
      console.error('Error testing token consumption:', error);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'error';
    if (percentage >= 75) return 'warning';
    return 'success';
  };

  const getUsageMessage = (percentage: number) => {
    if (percentage >= 90) return 'Critical: Almost out of tokens!';
    if (percentage >= 75) return 'Warning: Consider upgrading your plan';
    return 'Good: Plenty of tokens remaining';
  };

  if (loading) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          border: '1px solid rgba(0, 0, 0, 0.06)',
        }}
      >
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  if (error || !tokenUsage) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          border: '1px solid rgba(0, 0, 0, 0.06)',
        }}
      >
        <Alert severity="error">
          {error || 'Unable to load token usage information'}
        </Alert>
        <Box mt={2}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleInitializeTokens}
            sx={{ textTransform: 'none', mr: 1 }}
          >
            Initialize Tokens
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={handleTestTokenConsumption}
            sx={{ textTransform: 'none' }}
          >
            Test Consumption (5 tokens)
          </Button>
        </Box>
      </Paper>
    );
  }

  // Ensure token values are numbers, fallback to 0 if null/undefined
  const tokens = {
    allocated: tokenUsage.tokens?.allocated || 0,
    used: tokenUsage.tokens?.used || 0,
    remaining: tokenUsage.tokens?.remaining || 0
  };

  const usageColor = getUsageColor(tokenUsage.usagePercentage);
  const usageMessage = getUsageMessage(tokenUsage.usagePercentage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
          border: '1px solid rgba(0, 0, 0, 0.06)',
        }}
      >
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={2} mb={3}>
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: 'primary.main',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
            }}
          >
            <TokenIcon />
          </Avatar>
          <Box flex={1}>
            <Typography variant="h6" fontWeight="600">
              Token Usage Overview
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {tokenUsage.planDetails?.name || 'Free'} Plan
            </Typography>
          </Box>
          <Stack direction="row" spacing={1}>
            <Tooltip title="Refresh token usage">
              <IconButton
                onClick={handleRefresh}
                disabled={refreshing}
                size="small"
                sx={{
                  bgcolor: 'background.paper',
                  '&:hover': { bgcolor: 'background.paper' },
                }}
              >
                <RefreshIcon 
                  sx={{ 
                    fontSize: 18,
                    animation: refreshing ? 'spin 1s linear infinite' : 'none',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' },
                    },
                  }} 
                />
              </IconButton>
            </Tooltip>
            <Button
              variant="outlined"
              size="small"
              onClick={() => router.push('/plan')}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 500,
              }}
            >
              Manage Plan
            </Button>
          </Stack>
        </Stack>

        {/* Usage Progress */}
        <Box mb={3}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body2" fontWeight="500">
              Usage Progress
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatNumber(tokens.used)} / {formatNumber(tokens.allocated)}
            </Typography>
          </Stack>
          <LinearProgress
            variant="determinate"
            value={tokenUsage.usagePercentage}
            color={usageColor}
            sx={{
              height: 8,
              borderRadius: 4,
              bgcolor: 'rgba(0, 0, 0, 0.1)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
              },
            }}
          />
        </Box>

        {/* Usage Stats */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            gap: 2,
            mb: 3,
          }}
        >
          <Box textAlign="center">
            <Typography variant="h4" fontWeight="700" color="primary.main">
              {formatNumber(tokens.allocated)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Allocated
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h4" fontWeight="700" color="warning.main">
              {formatNumber(tokens.used)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Used
            </Typography>
          </Box>
          <Box textAlign="center">
            <Typography variant="h4" fontWeight="700" color="success.main">
              {formatNumber(tokens.remaining)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Remaining
            </Typography>
          </Box>
        </Box>

        {/* Status Alert */}
        <Alert
          severity={usageColor}
          icon={
            usageColor === 'error' ? <WarningIcon /> :
            usageColor === 'warning' ? <TrendingUpIcon /> :
            <CheckCircleIcon />
          }
          sx={{
            borderRadius: 2,
            '& .MuiAlert-message': {
              fontWeight: 500,
            },
          }}
        >
          {usageMessage}
          {tokenUsage.usagePercentage >= 75 && (
            <Button
              size="small"
              sx={{ ml: 2, textTransform: 'none' }}
              onClick={() => router.push('/plan')}
            >
              Upgrade Plan
            </Button>
          )}
        </Alert>

        {/* Plan Details */}
        {tokenUsage.planDetails && (
          <Box mt={3} p={2} bgcolor="rgba(0, 0, 0, 0.02)" borderRadius={2}>
            <Typography variant="body2" fontWeight="500" mb={1}>
              Plan Details
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip
                label={`${tokenUsage.planDetails.name} Plan`}
                size="small"
                color="primary"
                variant="outlined"
              />
              <Chip
                label={`₹${tokenUsage.planDetails.price}/month`}
                size="small"
                variant="outlined"
              />
              <Chip
                label={`${formatNumber(tokenUsage.planDetails.tokenLimit)} tokens`}
                size="small"
                variant="outlined"
              />
            </Stack>
          </Box>
        )}
      </Paper>
    </motion.div>
  );
};

export default TokenUsageOverview;