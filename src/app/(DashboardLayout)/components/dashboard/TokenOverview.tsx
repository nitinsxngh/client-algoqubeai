import React, { useState, useEffect, useCallback } from 'react';
import { Select, MenuItem, Typography, Box, CircularProgress, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import dynamic from "next/dynamic";
import { authenticatedFetch } from '@/utils/api';

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

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
  const [period, setPeriod] = useState('7'); // period in days
  const [tokenUsage, setTokenUsage] = useState<TokenUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any>(null);

  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const secondary = theme.palette.secondary.main;

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT!;

  const fetchConversationData = useCallback(async (tokenData: TokenUsage) => {
    try {
      const response = await authenticatedFetch(`${BACKEND_URL}/api/chatboxes`, {
        method: 'GET',
      });

      if (response.ok) {
        const chatboxes = await response.json();
        console.log('Raw chatboxes response:', chatboxes);
        
        // Handle null, undefined, or empty responses
        if (!chatboxes) {
          console.warn('No chatboxes data received');
          generateChartData(tokenData);
          return;
        }
        
        // Ensure chatboxes is always an array
        const chatboxArray = Array.isArray(chatboxes) ? chatboxes : [chatboxes];
        console.log('Processed chatbox array:', chatboxArray);
        
        generateChartDataFromConversations(tokenData, chatboxArray);
      } else {
        // Fallback to basic chart if conversation data not available
        generateChartData(tokenData);
      }
    } catch (err) {
      console.error('Error fetching conversation data:', err);
      // Fallback to basic chart
      generateChartData(tokenData);
    }
  }, [BACKEND_URL]);

  const fetchTokenUsage = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await authenticatedFetch(`${BACKEND_URL}/api/users/token-usage`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch token usage');
      }

      const data = await response.json();
      console.log('Token usage data:', data);
      
      // Ensure all token values are numbers
      const safeData = {
        ...data,
        tokens: {
          allocated: Number(data.tokens?.allocated) || 0,
          used: Number(data.tokens?.used) || 0,
          remaining: Number(data.tokens?.remaining) || 0,
        },
      };
      
      setTokenUsage(safeData);
      
      // Fetch actual conversation data for day-wise consumption
      await fetchConversationData(safeData);
    } catch (err) {
      console.error('Error fetching token usage:', err);
      setError('Failed to load token usage data');
      setTokenUsage(null);
    } finally {
      setLoading(false);
    }
  }, [BACKEND_URL, fetchConversationData]);

  const generateChartDataFromConversations = useCallback((data: TokenUsage, chatboxes: any[]) => {
    const days = parseInt(period);
    const dates = [];
    const tokensUsed = [];
    const tokensRemaining = [];
    
    // Create a map to store daily usage
    const dailyUsageMap = new Map<string, number>();
    
    // Ensure chatboxes is an array and handle edge cases
    if (!Array.isArray(chatboxes)) {
      console.error('chatboxes is not an array:', chatboxes);
      generateChartData(data);
      return;
    }
    
    // Aggregate conversation data from all chatboxes
    chatboxes.forEach(chatbox => {
      // Skip null or undefined chatboxes
      if (!chatbox) {
        console.warn('Skipping null/undefined chatbox');
        return;
      }
      
      if (chatbox.conversations && Array.isArray(chatbox.conversations)) {
        chatbox.conversations.forEach((conversation: any) => {
          // Skip null or undefined conversations
          if (!conversation) {
            console.warn('Skipping null/undefined conversation');
            return;
          }
          
          if (conversation.tokensUsed && conversation.timestamp) {
            // Handle MongoDB $date format
            let timestamp;
            if (conversation.timestamp.$date) {
              // MongoDB $date format
              timestamp = new Date(conversation.timestamp.$date.$numberLong || conversation.timestamp.$date);
            } else {
              // Regular date format
              timestamp = new Date(conversation.timestamp);
            }
            
            const dateString = timestamp.toISOString().split('T')[0];
            const currentUsage = dailyUsageMap.get(dateString) || 0;
            dailyUsageMap.set(dateString, currentUsage + conversation.tokensUsed);
          }
        });
      }
    });

    console.log('Daily usage map:', Object.fromEntries(dailyUsageMap));

    // Get the earliest conversation date to determine the start date
    const conversationDates = Array.from(dailyUsageMap.keys()).sort();
    const earliestDate = conversationDates.length > 0 ? new Date(conversationDates[0]) : new Date();
    
    // Calculate how many days back to show based on earliest conversation
    const today = new Date();
    const daysSinceEarliest = Math.floor((today.getTime() - earliestDate.getTime()) / (1000 * 60 * 60 * 24));
    const actualDaysToShow = Math.min(days, Math.max(1, daysSinceEarliest + 1));

    // Generate chart data only for the relevant period
    for (let i = actualDaysToShow - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const dailyUsage = dailyUsageMap.get(dateString) || 0;
      
      dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      tokensUsed.push(dailyUsage);
      
      // Calculate remaining tokens based on cumulative usage up to this day
      let cumulativeUsed = 0;
      for (let j = actualDaysToShow - 1; j >= i; j--) {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - j);
        const pastDateString = pastDate.toISOString().split('T')[0];
        cumulativeUsed += dailyUsageMap.get(pastDateString) || 0;
      }
      tokensRemaining.push(Math.max(0, data.tokens.allocated - cumulativeUsed));
    }

    console.log('Chart data:', { dates, tokensUsed, tokensRemaining, actualDaysToShow });

    // Calculate better y-axis range
    const maxUsed = Math.max(...tokensUsed);
    const yAxisMax = maxUsed > 0 ? Math.max(maxUsed * 1.5, 10) : 10;

    const options = {
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
      dataLabels: { 
        enabled: true,
        formatter: function(val: number) {
          return val > 0 ? val.toString() : '';
        },
        style: {
          fontSize: '12px',
          colors: ['#fff']
        }
      },
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
        categories: dates,
        axisBorder: { show: false },
      },
      yaxis: {
        tickAmount: 5,
        title: { text: 'Tokens' },
        min: 0,
        max: yAxisMax,
      },
      tooltip: {
        theme: 'dark',
        fillSeriesColor: false,
        y: {
          formatter: function(value: number) {
            return value.toLocaleString() + ' tokens';
          }
        }
      },
    };

    const series = [
      {
        name: 'Tokens Used',
        data: tokensUsed,
      },
      {
        name: 'Tokens Remaining',
        data: tokensRemaining,
      },
    ];

    setChartData({ options, series });
  }, [period, primary, secondary]);

  const generateChartData = useCallback((data: TokenUsage) => {
    const days = parseInt(period);
    const dates = [];
    const tokensUsed = [];
    const tokensRemaining = [];
    
    // Get chatbox creation date and actual usage data
    const today = new Date();
    const chatboxCreatedDate = new Date(); // We'll need to get this from chatbox data
    
    // For now, let's show data only from today if chatbox was created today
    // In a real implementation, we'd fetch actual conversation dates from backend
    
    if (data.tokens.used === 0) {
      // No usage yet - show empty chart for the period
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        tokensUsed.push(0);
        tokensRemaining.push(data.tokens.allocated);
      }
    } else {
      // Show actual usage - for now, put all usage on today
      // In a real implementation, this would come from backend conversation data
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        let dailyUsage = 0;
        if (i === 0) {
          // Today - show all usage
          dailyUsage = data.tokens.used;
        }
        
        dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
        tokensUsed.push(dailyUsage);
        tokensRemaining.push(data.tokens.allocated - (i === 0 ? data.tokens.used : 0));
      }
    }

    // Calculate better y-axis range
    const maxUsed = Math.max(...tokensUsed);
    const yAxisMax = maxUsed > 0 ? Math.max(maxUsed * 1.5, 10) : 10;

    const options = {
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
      dataLabels: { 
        enabled: true,
        formatter: function(val: number) {
          return val > 0 ? val.toString() : '';
        },
        style: {
          fontSize: '12px',
          colors: ['#fff']
        }
      },
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
        categories: dates,
        axisBorder: { show: false },
      },
      yaxis: {
        tickAmount: 5,
        title: { text: 'Tokens' },
        min: 0,
        max: yAxisMax,
      },
      tooltip: {
        theme: 'dark',
        fillSeriesColor: false,
        y: {
          formatter: function(value: number) {
            return value.toLocaleString() + ' tokens';
          }
        }
      },
    };

    const series = [
      {
        name: 'Tokens Used',
        data: tokensUsed,
      },
      {
        name: 'Tokens Remaining',
        data: tokensRemaining,
      },
    ];

    setChartData({ options, series });
  }, [period, primary, secondary]);

  const handleChange = (event: any) => {
    const newPeriod = event.target.value;
    console.log('Period changed to:', newPeriod);
    setPeriod(newPeriod);
    if (tokenUsage) {
      // Re-fetch conversation data with new period
      console.log('Re-fetching conversation data with new period');
      fetchConversationData(tokenUsage);
    } else {
      console.log('No tokenUsage available for re-fetch');
    }
  };

  useEffect(() => {
    fetchTokenUsage();
  }, [fetchTokenUsage]);

  if (loading) {
    return (
      <DashboardCard title="Token Usage Overview">
        <Box display="flex" justifyContent="center" alignItems="center" height={370}>
          <CircularProgress />
        </Box>
      </DashboardCard>
    );
  }

  if (error) {
    return (
      <DashboardCard title="Token Usage Overview">
        <Alert severity="error">
          {error}
        </Alert>
      </DashboardCard>
    );
  }

  if (!tokenUsage || !chartData) {
    return (
      <DashboardCard title="Token Usage Overview">
        <Alert severity="info">
          No token usage data available. Please initialize your tokens.
        </Alert>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard
      title="Token Usage Overview"
      action={
        <Box display="flex" flexDirection="column" alignItems="flex-end">
          <Typography variant="caption">
            Current Plan: {tokenUsage.planDetails?.name || 'Free'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {tokenUsage.tokens.used} / {tokenUsage.tokens.allocated} tokens used
          </Typography>
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
      <Chart 
        options={chartData.options} 
        series={chartData.series} 
        type="bar" 
        height={370} 
        width="100%" 
      />
    </DashboardCard>
  );
};

export default TokenUsageOverview;
