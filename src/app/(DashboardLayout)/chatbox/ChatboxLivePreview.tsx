'use client';
import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Stack } from '@mui/material';

type Message = {
  from: 'user' | 'bot';
  text: string;
};

const ChatboxLivePreview = ({
  displayName,
  themeColor,
  font,
}: {
  displayName: string;
  themeColor: string;
  font: string;
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { from: 'user', text: input.trim() };
    const botMessage: Message = {
      from: 'bot',
      text: `Hello, you said: "${input.trim()}"`,
    };

    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      setMessages((prev) => [...prev, botMessage]);
    }, 700); // simulate delay

    setInput('');
  };

  return (
    <Box
      sx={{
        border: '1px solid #ccc',
        borderRadius: 2,
        fontFamily: font === 'default' ? 'sans-serif' : font,
        bgcolor: '#fafafa',
        height: 400,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          p: 2,
          bgcolor: themeColor,
          color: '#fff',
          fontWeight: 600,
        }}
      >
        {displayName || 'Chatbot'}
      </Box>

      <Box
        sx={{
          flex: 1,
          p: 2,
          overflowY: 'auto',
        }}
      >
        {messages.map((msg, i) => (
          <Box
            key={i}
            sx={{
              mb: 1,
              textAlign: msg.from === 'user' ? 'right' : 'left',
              color: msg.from === 'bot' ? themeColor : '#333',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                display: 'inline-block',
                px: 1,
                py: 0.5,
                borderRadius: 1,
                bgcolor: msg.from === 'user' ? '#e0e0e0' : '#f1f1f1',
              }}
            >
              {msg.text}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ p: 1, borderTop: '1px solid #ddd' }}>
        <Stack direction="row" spacing={1}>
          <TextField
            fullWidth
            size="small"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button
            onClick={handleSend}
            variant="contained"
            sx={{
              bgcolor: themeColor,
              '&:hover': {
                bgcolor: themeColor,
                opacity: 0.9,
              },
            }}
          >
            Send
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default ChatboxLivePreview;
