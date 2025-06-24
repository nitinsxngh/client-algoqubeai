'use client';

import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Avatar,
  useTheme,
  IconButton,
  Tooltip,
} from '@mui/material';
import { blue, grey, green } from '@mui/material/colors';
import { Edit as EditIcon } from '@mui/icons-material';

const ChatboxTheme = () => {
  const theme = useTheme();

  const messages = [
    {
      time: '09:00 am',
      text: 'Hi! Can you help me understand your pricing?',
      color: blue[100],
      borderColor: blue[300],
      align: 'left',
      avatar: '/images/profile/user-1.jpg',
    },
    {
      time: '09:01 am',
      text: 'Of course! We have Free, Pro, and Enterprise plans. Would you like details?',
      color: grey[200],
      borderColor: grey[400],
      align: 'right',
      avatar: '/images/profile/bot-avatar.png',
    },
    {
      time: '09:02 am',
      text: 'Yes, I’m interested in the Pro plan.',
      color: blue[100],
      borderColor: blue[300],
      align: 'left',
      avatar: '/images/profile/user-1.jpg',
    },
    {
      time: '09:03 am',
      text: 'Pro plan gives you up to 100K tokens/month, advanced analytics, and chat history. Need more info?',
      color: grey[200],
      borderColor: grey[400],
      align: 'right',
      avatar: '/images/profile/bot-avatar.png',
    },
    {
      time: '09:04 am',
      text: 'Sounds good. How do I upgrade?',
      color: blue[100],
      borderColor: blue[300],
      align: 'left',
      avatar: '/images/profile/user-1.jpg',
    },
    {
      time: '09:05 am',
      text: 'You can upgrade from the billing section of your dashboard.',
      color: grey[200],
      borderColor: grey[400],
      align: 'right',
      avatar: '/images/profile/bot-avatar.png',
    },
    {
      time: '09:06 am',
      text: 'Thank you!',
      color: blue[100],
      borderColor: blue[300],
      align: 'left',
      avatar: '/images/profile/user-1.jpg',
    },
    {
      time: '09:06 am',
      text: 'You’re welcome 😊',
      color: grey[200],
      borderColor: grey[400],
      align: 'right',
      avatar: '/images/profile/bot-avatar.png',
    },
  ];

  return (
    <DashboardCard
      title="Chatbox Theme"
      action={
        <Tooltip title="Edit Chatbox Theme" arrow>
          <IconButton color="primary" size="small">
            <EditIcon />
          </IconButton>
        </Tooltip>
      }
    >
      <Box
        sx={{
          maxHeight: 360,
          overflowY: 'auto',
          p: 2,
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: theme.palette.background.default,
        }}
      >
        <Stack spacing={2}>
          {messages.map((msg, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={msg.align === 'right' ? 'flex-end' : 'flex-start'}
            >
              <Stack
                direction={msg.align === 'right' ? 'row-reverse' : 'row'}
                spacing={1}
                alignItems="flex-end"
              >
                <Avatar src={msg.avatar} alt="user" sx={{ width: 32, height: 32 }} />
                <Box>
                  <Paper
                    elevation={0}
                    sx={{
                      px: 2,
                      py: 1.5,
                      bgcolor: msg.color,
                      border: `1px solid ${msg.borderColor}`,
                      maxWidth: 280,
                      borderRadius: 3,
                    }}
                  >
                    <Typography variant="body2">{msg.text}</Typography>
                  </Paper>
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    textAlign={msg.align === 'right' ? 'right' : 'left'}
                    mt={0.5}
                  >
                    {msg.time}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </DashboardCard>
  );
};

export default ChatboxTheme;
