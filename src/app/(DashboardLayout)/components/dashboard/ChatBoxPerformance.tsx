'use client';

import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Stack,
  useTheme,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  AccessTime as AccessTimeIcon,
  ChatBubbleOutline as ChatIcon,
  ForumOutlined as ForumIcon,
  Timelapse as TimelapseIcon,
} from '@mui/icons-material';

import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

const ProductPerformance = () => {
  const theme = useTheme();

  // Dummy data
  const data = {
    website_visits: 1200,
    avg_session_time: '00:03:24',
    conversations_initiated: 400,
    total_conversations: 950,
    conversation_session_time: {
      min: '00:01:10',
      max: '00:07:20',
      average: '00:03:24',
    },
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
        bgcolor: index < 4 ? theme.palette.background.default : 'transparent',
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
      {/* Row 1 with background color, no shadow */}
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap mb={3}>
        {card(<TrendingUpIcon />, 'Website Visits', data.website_visits, 0)}
        {card(<AccessTimeIcon />, 'Avg. Session Time', data.avg_session_time, 1)}
        {card(<ChatIcon />, 'Conversations Initiated', data.conversations_initiated, 2)}
        {card(<ForumIcon />, 'Total Conversations', data.total_conversations, 3)}
      </Stack>

      {/* Session Time Summary */}
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
            <Typography variant="subtitle2">Conversation Session Time</Typography>
          </Box>
          <Stack direction="row" spacing={4}>
            <Box>
              <Typography variant="body2" color="textSecondary">Min</Typography>
              <Typography variant="h6">{data.conversation_session_time.min}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="textSecondary">Average</Typography>
              <Typography variant="h6">{data.conversation_session_time.average}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="textSecondary">Max</Typography>
              <Typography variant="h6">{data.conversation_session_time.max}</Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </DashboardCard>
  );
};

export default ProductPerformance;
