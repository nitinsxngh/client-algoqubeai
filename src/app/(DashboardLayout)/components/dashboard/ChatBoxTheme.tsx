'use client';

import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import {
  Box,
  Typography,
  Stack,
  useTheme,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import ChatboxLivePreview from '@/app/(DashboardLayout)/chatbox/ChatboxLivePreview';
import { authenticatedFetch } from '@/utils/api';

const ChatboxTheme = () => {
  const theme = useTheme();
  const [chatbox, setChatbox] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT!;

  useEffect(() => {
    const fetchUserAndChatboxes = async () => {
        setLoading(true);
        try {
            const userRes = await authenticatedFetch(`${BACKEND_URL}/api/users/me`, {
                method: 'GET',
            });
            if (!userRes.ok) throw new Error('User not authenticated');
            const userData = await userRes.json();
            const chatboxRes = await authenticatedFetch(`${BACKEND_URL}/api/chatboxes?createdBy=${userData._id}`, {
                method: 'GET',
            });
            const chatboxData = await chatboxRes.json();
            setChatbox(Array.isArray(chatboxData) ? chatboxData[0] : chatboxData);
        } catch (err) {
            setChatbox(null);
        } finally {
            setLoading(false);
        }
    };

    fetchUserAndChatboxes();
  }, [BACKEND_URL]);

  if (loading) {
    return (
      <DashboardCard
        title="Chatbox Preview"
        action={
          <Tooltip title="Edit Chatbox Theme" arrow>
            <IconButton color="primary" size="small">
              <EditIcon />
            </IconButton>
          </Tooltip>
        }
      >
        <Box display="flex" justifyContent="center" alignItems="center" height={400}>
          <CircularProgress />
        </Box>
      </DashboardCard>
    );
  }

  if (error || !chatbox) {
    return (
      <DashboardCard
        title="Chatbox Preview"
        action={
          <Tooltip title="Edit Chatbox Theme" arrow>
            <IconButton color="primary" size="small">
              <EditIcon />
            </IconButton>
          </Tooltip>
        }
      >
        <Alert severity="info">
          {error || 'No chatbox found. Create your first chatbox to see a preview here.'}
        </Alert>
      </DashboardCard>
    );
  }

  const config = chatbox.configuration || {};
  const themeColor = config.themeColor || '#6366f1';
  const displayName = config.displayName || 'AI Assistant';
  const textFont = config.textFont || 'Inter';

  return (
    <DashboardCard
      title="Chatbox Preview"
      action={
        <Tooltip title="Edit Chatbox Theme" arrow>
          <IconButton color="primary" size="small">
            <EditIcon />
          </IconButton>
        </Tooltip>
      }
    >
      <Box>
        <Stack spacing={2}>
          {/* Chatbox Info */}
          <Box>
            <Typography variant="body2" color="text.secondary" mb={1}>
              {chatbox.organizationName} • {chatbox.category}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip
                label={`Theme: ${themeColor}`}
                size="small"
                sx={{
                  bgcolor: themeColor,
                  color: 'white',
                  fontSize: '0.75rem',
                  height: 24,
                }}
              />
              <Chip
                label={`Font: ${textFont}`}
                size="small"
                variant="outlined"
                sx={{
                  fontSize: '0.75rem',
                  height: 24,
                }}
              />
            </Stack>
          </Box>
          
          {/* Chatbox Preview */}
          <Box
            sx={{
              height: 400,
              overflow: 'hidden',
              borderRadius: 3,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: `0 4px 20px ${themeColor}20`,
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: `linear-gradient(90deg, ${themeColor}, ${themeColor}dd)`,
                zIndex: 1,
              }
            }}
          >
            <ChatboxLivePreview
              displayName={displayName}
              themeColor={themeColor}
              font={textFont}
            />
          </Box>
        </Stack>
      </Box>
    </DashboardCard>
  );
};

export default ChatboxTheme;
