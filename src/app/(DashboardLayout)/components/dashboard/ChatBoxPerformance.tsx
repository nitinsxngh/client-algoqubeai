'use client';

import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Stack,
  useTheme,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  ChatBubbleOutline as ChatIcon,
  ForumOutlined as ForumIcon,
  Timelapse as TimelapseIcon,
} from '@mui/icons-material';

import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { useEffect, useState, useCallback } from 'react';
import { authenticatedFetch } from '@/utils/api';

type ChatboxAnalytics = {
  websiteVisits?: number;
  avgSessionTime?: number;
  conversationsInitiated?: number;
  totalConversations?: number;
  avgConversationTime?: number;
  lastUpdated?: string;
};

type Chatbox = {
  _id: string;
  name: string;
  organizationName: string;
  analytics?: ChatboxAnalytics;
};

const ProductPerformance = () => {
  const theme = useTheme();
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT!;
  const [chatboxes, setChatboxes] = useState<Chatbox[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatTime = (seconds: number): string => {
    if (!seconds || seconds <= 0) return '00:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const fetchChatboxes = useCallback(async () => {
    try {
      const userRes = await authenticatedFetch(`${BACKEND_URL}/api/users/me`, {
        method: 'GET',
      });
      
      if (!userRes.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const userData = await userRes.json();
      const user = userData; // API now returns user object directly

      const chatboxRes = await authenticatedFetch(`${BACKEND_URL}/api/chatboxes?createdBy=${user._id}`, {
        method: 'GET',
      });
      
      if (!chatboxRes.ok) {
        throw new Error('Failed to fetch chatbox data');
      }
      
      const chatboxData = await chatboxRes.json();
      setChatboxes(Array.isArray(chatboxData) ? chatboxData : [chatboxData]);
    } catch (err) {
      console.error('Error fetching chatbox analytics:', err);
      setError('Failed to load chatbots. Please try again later.');
      setChatboxes([]);
    } finally {
      setLoading(false);
    }
  }, [BACKEND_URL]);

  useEffect(() => {
    fetchChatboxes();
  }, [fetchChatboxes]);

  if (loading) {
    return (
      <DashboardCard title="Bot Analytics Overview">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      </DashboardCard>
    );
  }

  if (error) {
    return (
      <DashboardCard title="Bot Analytics Overview">
        <Alert severity="error">
          {error}
        </Alert>
      </DashboardCard>
    );
  }

  // If no chatboxes, show empty state
  if (!chatboxes || chatboxes.length === 0) {
    return (
      <DashboardCard title="Bot Analytics Overview">
        <Box textAlign="center" py={4}>
          <Typography variant="body1" color="text.secondary" mb={2}>
            No chatbots found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create your first chatbot to see analytics here
          </Typography>
        </Box>
      </DashboardCard>
    );
  }

  // Aggregate analytics from all chatboxes
  const aggregatedAnalytics = chatboxes.reduce((acc, chatbox) => {
    // Skip null or undefined chatboxes
    if (!chatbox) return acc;
    
    const analytics = chatbox.analytics || {};
    return {
      websiteVisits: (acc.websiteVisits || 0) + (analytics.websiteVisits || 0),
      conversationsInitiated: (acc.conversationsInitiated || 0) + (analytics.conversationsInitiated || 0),
      totalConversations: (acc.totalConversations || 0) + (analytics.totalConversations || 0),
      avgConversationTime: (acc.avgConversationTime || 0) + (analytics.avgConversationTime || 0),
    };
  }, {
    websiteVisits: 0,
    conversationsInitiated: 0,
    totalConversations: 0,
    avgConversationTime: 0,
  });

  // Calculate average conversation time across all chatboxes
  const avgConversationTime = chatboxes.length > 0 
    ? Math.round(aggregatedAnalytics.avgConversationTime / chatboxes.length) 
    : 0;

  const data = {
    website_visits: aggregatedAnalytics.websiteVisits || 0,
    conversations_initiated: aggregatedAnalytics.conversationsInitiated || 0,
    total_conversations: aggregatedAnalytics.totalConversations || 0,
    avg_conversation_time: `${avgConversationTime}s`,
  };

  const card = (
    icon: React.ReactNode,
    label: string,
    value: string | number,
    index: number
  ) => (
    <Card
      key={label}
      elevation={0}
      sx={{
        minWidth: 220,
        flex: 1,
        boxShadow: 'none',
        bgcolor: index < 3 ? theme.palette.background.default : 'transparent',
      }}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar
          sx={{
            bgcolor: theme.palette.primary.main,
            color: '#fff',
            width: 40,
            height: 40,
          }}
        >
          {icon}
        </Avatar>
        <Box>
          <Typography variant="subtitle2">{label}</Typography>
          <Typography variant="h6">{value}</Typography>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <DashboardCard title="Bot Analytics Overview">
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap mb={3}>
        {card(<TrendingUpIcon />, 'Website Visits', data.website_visits, 0)}
        {card(<ChatIcon />, 'Conversations Initiated', data.conversations_initiated, 1)}
        {card(<ForumIcon />, 'Total Conversations', data.total_conversations, 2)}
      </Stack>

      <Card elevation={0} sx={{ boxShadow: 'none' }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Avatar
              sx={{
                bgcolor: theme.palette.secondary.main,
                color: '#fff',
                width: 40,
                height: 40,
              }}
            >
              <TimelapseIcon />
            </Avatar>
            <Typography variant="subtitle2">Average Conversation Time</Typography>
          </Box>
          <Typography variant="h6">{data.avg_conversation_time}</Typography>
        </CardContent>
      </Card>
    </DashboardCard>
  );
};

export default ProductPerformance;
