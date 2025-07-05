'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Stack,
  IconButton,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Fade,
  Slide,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { IconPlus, IconRobot, IconTrash } from '@tabler/icons-react';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

const ChatboxPage = () => {
  const [chatbox, setChatbox] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [orgName, setOrgName] = useState('');
  const [category, setCategory] = useState('');
  const [domainUrl, setDomainUrl] = useState('');
  const [customContent, setCustomContent] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT!;
  const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL!;

  const fetchChatbox = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/chatboxes`, {
        method: 'GET',
        credentials: 'include', // ✅ Send cookie with the request
      });
  
      if (!res.ok) {
        throw new Error(`Failed to fetch chatbox: ${res.status}`);
      }
  
      const data = await res.json();
      setChatbox(data);
    } catch (err) {
      console.error('Failed to fetch chatbot:', err);
    }
  };
  

  useEffect(() => {
    fetchChatbox();
  }, []);

  const handleSave = async () => {
    if (!orgName || !category || !domainUrl) {
      alert('Please fill all required fields');
      return;
    }

    const payload = {
      organizationName: orgName,
      category,
      domainUrl,
      customContent,
      status: 'active',
      textFont: 'default',
      themeColor: '#000000',
      displayName: orgName,
    };

    try {
      const endpoint = isEditing
        ? `${BACKEND_URL}/api/chatboxes/${chatbox._id}`
        : `${BACKEND_URL}/api/chatboxes`;

        const res = await fetch(endpoint, {
          method: isEditing ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          credentials: 'include', // ✅ This line is critical
        });
        

      if (!res.ok) throw new Error('Save failed');

      const data = await res.json();
      setChatbox(data.chatbox);
      setShowForm(false);
      setIsEditing(false);
    } catch (err) {
      alert(`Error ${isEditing ? 'updating' : 'creating'} chatbot`);
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) {
      alert('Invalid chatbot ID');
      return;
    }
  
    if (!confirm('Are you sure you want to delete this chatbot?')) return;
  
    try {
      const res = await fetch(`${BACKEND_URL}/api/chatboxes/${id}`, {
        method: 'DELETE',
        credentials: 'include', // ✅ ADD THIS LINE
      });
  
      if (!res.ok) throw new Error('Delete failed');
      setChatbox(null);
    } catch (err) {
      alert('Error deleting chatbot');
      console.error(err);
    }
  };
  

  const chatbotExists = !!chatbox && chatbox._id;

  return (
    <PageContainer title="Chatbox" description="Manage your chatbot here.">
      <DashboardCard title="Chatbox Manager">
        {!chatbotExists && !showForm ? (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            p={6}
            border="2px dashed #ccc"
            borderRadius={2}
            textAlign="center"
          >
            <IconButton color="primary" size="large">
              <IconRobot size={48} />
            </IconButton>
            <Typography variant="h6" mt={2} mb={1}>
              No Chatbot Found
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Click below to create your first chatbot.
            </Typography>
            <Button
              variant="contained"
              startIcon={<IconPlus />}
              sx={{ mt: 3 }}
              onClick={() => {
                setOrgName('');
                setCategory('');
                setDomainUrl('');
                setCustomContent('');
                setFile(null);
                setIsEditing(false);
                setShowForm(true);
              }}
            >
              Add Chatbot
            </Button>
          </Box>
        ) : showForm ? (
          <Fade in timeout={400}>
            <Box maxWidth={600} width="100%" mx="auto">
              <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h6" mb={3}>
                  {isEditing ? 'Edit Chatbot' : 'Create Chatbot'}
                </Typography>

                <Stack spacing={2} mb={3}>
                  <TextField
                    label="Organization Name"
                    fullWidth
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                  />
                  <FormControl fullWidth>
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                      labelId="category-label"
                      value={category}
                      label="Category"
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <MenuItem value="Support">Support</MenuItem>
                      <MenuItem value="Sales">Sales</MenuItem>
                      <MenuItem value="FAQ">FAQ</MenuItem>
                      <MenuItem value="Feedback">Feedback</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    label="Domain URL"
                    placeholder="https://yourdomain.com"
                    fullWidth
                    value={domainUrl}
                    onChange={(e) => setDomainUrl(e.target.value)}
                    disabled={isEditing}
                  />
                  <Button variant="outlined" component="label">
                    Upload File
                    <input
                      type="file"
                      hidden
                      onChange={(e) => {
                        if (e.target.files?.[0]) setFile(e.target.files[0]);
                      }}
                    />
                  </Button>
                  <TextField
                    label="Custom Content"
                    multiline
                    rows={4}
                    fullWidth
                    value={customContent}
                    onChange={(e) => setCustomContent(e.target.value)}
                  />
                </Stack>

                <Stack direction="row" justifyContent="flex-end" spacing={2}>
                  <Button
                    onClick={() => {
                      setShowForm(false);
                      setIsEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button variant="contained" onClick={handleSave}>
                    Save
                  </Button>
                </Stack>
              </Paper>
            </Box>
          </Fade>
        ) : (
          <Slide direction="up" in={chatbotExists} mountOnEnter unmountOnExit>
            <Box maxWidth={600} width="100%" mx="auto">
              <Paper elevation={4} sx={{ p: 4, borderRadius: 3, backgroundColor: '#f9f9f9' }}>
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

                <Typography variant="subtitle1" mt={4}>
                  Embed This Chatbot:
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, mt: 1, backgroundColor: '#f0f0f0' }}>
                  <code style={{ wordBreak: 'break-all' }}>
                    {`<script src="${FRONTEND_URL}/embed.js" data-name="${chatbox.name}"></script>`}
                  </code>
                </Paper>
                <Button
                  variant="text"
                  size="small"
                  sx={{ mt: 1 }}
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `<script src="${FRONTEND_URL}/embed.js" data-name="${chatbox.name}"></script>`
                    )
                  }
                >
                  Copy Embed Script
                </Button>

                <Stack direction="row" spacing={2} mt={4}>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<IconTrash />}
                    onClick={() => handleDelete(chatbox._id)}
                  >
                    Delete Chatbot
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setOrgName(chatbox.organizationName);
                      setCategory(chatbox.category);
                      setDomainUrl(chatbox.domainUrl);
                      setCustomContent(chatbox.customContent);
                      setFile(null);
                      setIsEditing(true);
                      setShowForm(true);
                    }}
                  >
                    Edit
                  </Button>
                </Stack>
              </Paper>
            </Box>
          </Slide>
        )}
      </DashboardCard>
    </PageContainer>
  );
};

export default ChatboxPage;
