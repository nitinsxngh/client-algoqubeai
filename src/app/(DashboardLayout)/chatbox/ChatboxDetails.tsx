'use client';
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { IconRobot, IconTrash } from '@tabler/icons-react';
import ChatboxEmbed from './ChatboxEmbed';
import ChatboxLivePreview from './ChatboxLivePreview';

const ChatboxDetails = ({ chatbox, onDelete, onEdit, frontendUrl }: any) => {
  const [displayName, setDisplayName] = useState(chatbox?.configuration?.displayName || '');
  const [themeColor, setThemeColor] = useState(chatbox?.configuration?.themeColor || '#333333');
  const [textFont, setTextFont] = useState(chatbox?.configuration?.textFont || 'default');

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT!;

  const updateConfig = async (field: string, value: string) => {
    try {
      await fetch(`${BACKEND_URL}/api/chatboxes/${chatbox._id}/configuration`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ configuration: { [field]: value } }),
      });
    } catch (err) {
      console.error(`Failed to update ${field}`, err);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection={{ xs: 'column', md: 'row' }}
      gap={4}
      maxWidth={1000}
      mx="auto"
      mt={4}
    >
      {/* Left Section */}
      <Box flex={1}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2, backgroundColor: '#fdfdfd' }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <IconRobot size={32} />
            <Box>
              <Typography variant="h6">{chatbox.organizationName}</Typography>
              <Typography variant="body2" color="text.secondary">
                {chatbox.category} | {chatbox.domainUrl}
              </Typography>
            </Box>
          </Stack>
          <Typography variant="body2" color="text.secondary" mb={2}>
            {chatbox.customContent || 'No custom content provided.'}
          </Typography>
        </Paper>
      </Box>

      {/* Right Section */}
      <Box flex={1}>
        {/* Live Preview */}
        <Paper elevation={2} sx={{ p: 2, borderRadius: 2, backgroundColor: '#fff', mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Live Chat Preview
          </Typography>
          <ChatboxLivePreview
            displayName={displayName}
            themeColor={themeColor}
            font={textFont}
          />
        </Paper>

        {/* Configuration */}
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2, backgroundColor: '#f9f9f9', mb: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            Configuration
          </Typography>

          <Stack spacing={2}>
            <TextField
              label="Display Name"
              fullWidth
              value={displayName}
              onChange={(e) => {
                const val = e.target.value;
                setDisplayName(val);
                updateConfig('displayName', val);
              }}
            />
            <TextField
              label="Theme Color"
              type="color"
              value={themeColor}
              onChange={(e) => {
                const val = e.target.value;
                setThemeColor(val);
                updateConfig('themeColor', val);
              }}
              sx={{ width: '120px' }}
            />
            <FormControl fullWidth>
              <InputLabel id="font-label">Text Font</InputLabel>
              <Select
                labelId="font-label"
                value={textFont}
                label="Text Font"
                onChange={(e) => {
                  const val = e.target.value;
                  setTextFont(val);
                  updateConfig('textFont', val);
                }}
              >
                <MenuItem value="Inter">Inter</MenuItem>
                <MenuItem value="Roboto">Roboto</MenuItem>
                <MenuItem value="Open Sans">Open Sans</MenuItem>
                <MenuItem value="Arial">Arial</MenuItem>
                <MenuItem value="default">Default</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <Stack direction="row" spacing={2} mt={4}>
            <Button
              variant="contained"
              color="error"
              startIcon={<IconTrash />}
              onClick={() => onDelete(chatbox._id)}
            >
              Delete Chatbot
            </Button>
            <Button variant="outlined" onClick={onEdit}>
              Edit
            </Button>
          </Stack>
        </Paper>

        {/* Embed Script */}
        <Paper elevation={2} sx={{ p: 2, borderRadius: 2, backgroundColor: '#fff' }}>
          <Typography variant="subtitle2" gutterBottom>
            Embed Script
          </Typography>
          <ChatboxEmbed
            frontendUrl={frontendUrl}
            name={chatbox.name}
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default ChatboxDetails;
