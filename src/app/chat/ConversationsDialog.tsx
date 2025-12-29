"use client";

import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { authenticatedFetch } from '@/utils/api';

interface Message {
  role: 'user' | 'bot';
  content: string;
  timestamp?: string;
  tokensUsed?: number;
}

interface Conversation {
  _id?: string;
  conversationId: string;
  timestamp: string;
  status: 'active' | 'completed' | 'abandoned';
  duration?: number;
  messageCount?: number;
  tokensUsed?: number;
  messages: Message[];
}

interface ConversationsResponse {
  conversations: Conversation[];
  chatboxName?: string;
  organizationName?: string;
}

interface ConversationsDialogProps {
  open: boolean;
  onClose: () => void;
  chatboxId: string;
  leadName: string;
  chatbotDisplayName?: string;
  conversationId?: string;
}

const formatDateTime = (value: string) => {
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(new Date(value));
  } catch {
    return value;
  }
};

const formatDuration = (seconds?: number) => {
  if (!seconds || seconds <= 0) return '—';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) {
    return `${secs}s`;
  }
  return `${mins}m ${secs}s`;
};

const ConversationsDialog = ({
  open,
  onClose,
  chatboxId,
  leadName,
  chatbotDisplayName,
  conversationId,
}: ConversationsDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    if (!open || !chatboxId) {
      return;
    }

    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        // If conversationId is provided, fetch only that specific conversation
        // Otherwise, fetch all conversations for the chatbox
        let url: string;
        if (conversationId) {
          url = `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/api/conversations/${encodeURIComponent(chatboxId)}/${encodeURIComponent(conversationId)}`;
        } else {
          url = `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/api/conversations/${encodeURIComponent(chatboxId)}`;
        }

        const response = await authenticatedFetch(url, { method: 'GET' });

        if (!response.ok) {
          throw new Error(`Failed to fetch conversations (${response.status})`);
        }

        const data: ConversationsResponse | { conversation: Conversation } = await response.json();
        if (isMounted) {
          // If we fetched a single conversation, wrap it in an array
          if (conversationId && 'conversation' in data) {
            setConversations([data.conversation]);
          } else if ('conversations' in data) {
            setConversations(data.conversations ?? []);
          } else {
            setConversations([]);
          }
        }
      } catch (err) {
        console.error('Failed to load conversations:', err);
        if (isMounted) {
          setError('Unable to load conversations. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [open, chatboxId, conversationId]);

  const title = useMemo(() => {
    if (chatbotDisplayName) {
      return `${chatbotDisplayName} • Conversations`;
    }
    return 'Lead Conversations';
  }, [chatbotDisplayName]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" scroll="paper">
      <DialogTitle sx={{ m: 0, p: 2 }}>
        {title}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
          size="large"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Box px={3} pt={1} pb={2}>
        <Typography variant="subtitle2" color="text.secondary">
          Viewer: {leadName || 'Lead'}
        </Typography>
      </Box>
      <DialogContent dividers sx={{ p: 0 }}>
        {loading ? (
          <Box py={6} display="flex" flexDirection="column" alignItems="center" gap={2}>
            <CircularProgress size={32} />
            <Typography variant="body2" color="text.secondary">
              Loading conversations…
            </Typography>
          </Box>
        ) : error ? (
          <Box p={3}>
            <Alert severity="error">{error}</Alert>
          </Box>
        ) : conversations.length === 0 ? (
          <Box py={6} display="flex" flexDirection="column" alignItems="center" gap={1}>
            <Avatar sx={{ bgcolor: 'primary.light', width: 56, height: 56 }}>💬</Avatar>
            <Typography variant="h6">No conversations yet</Typography>
            <Typography variant="body2" color="text.secondary">
              Once this lead interacts with your chatbot, their conversation history will appear here.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2} py={2} px={3}>
            {conversations.map((conversation) => (
              <Card key={conversation.conversationId} variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
                        <Chip
                          label={`Status: ${conversation.status}`}
                          color={conversation.status === 'completed' ? 'success' : conversation.status === 'active' ? 'primary' : 'default'}
                          variant="outlined"
                          size="small"
                        />
                        <Chip
                          label={`${conversation.messageCount ?? conversation.messages?.length ?? 0} messages`}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          label={`Duration: ${formatDuration(conversation.duration)}`}
                          size="small"
                          variant="outlined"
                        />
                      </Stack>
                      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                        Conversation #{conversation.conversationId}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Started {formatDateTime(conversation.timestamp)}
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  <Stack spacing={1.5}>
                    {conversation.messages?.map((message, index) => (
                      <Stack
                        key={`${conversation.conversationId}-${index}`}
                        alignItems={message.role === 'user' ? 'flex-end' : 'flex-start'}
                      >
                        <Box
                          sx={{
                            bgcolor: message.role === 'user' ? 'primary.main' : 'grey.100',
                            color: message.role === 'user' ? 'primary.contrastText' : 'text.primary',
                            px: 2,
                            py: 1.25,
                            borderRadius: 2,
                            maxWidth: '90%',
                          }}
                        >
                          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                            {message.role === 'user' ? 'Lead' : chatbotDisplayName || 'Assistant'}
                          </Typography>
                          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                            {message.content}
                          </Typography>
                          <Typography variant="caption" sx={{ display: 'block', opacity: 0.75, mt: 0.5 }}>
                            {message.timestamp ? formatDateTime(message.timestamp) : '—'}
                          </Typography>
                        </Box>
                      </Stack>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ConversationsDialog;

