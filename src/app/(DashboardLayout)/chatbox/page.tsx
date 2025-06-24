'use client';

import React, { useState } from 'react';
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
import { IconPlus, IconRobot } from '@tabler/icons-react';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

const ChatboxPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved] = useState(false);

  const [orgName, setOrgName] = useState('');
  const [category, setCategory] = useState('');
  const [domainUrl, setDomainUrl] = useState('');
  const [customContent, setCustomContent] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleToggleForm = () => setShowForm(true);

  const handleSave = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/chatboxes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationName: orgName,
          category,
          domainUrl,
          customContent,
          status: 'active',
          textFont: 'default',
          themeColor: '#000000',
          displayName: orgName,
        }),
      });
  
      if (!res.ok) throw new Error('Failed to create chatbot');
  
      const data = await res.json();
      console.log('Chatbot created:', data);
      setSaved(true);
    } catch (err) {
      alert('Error creating chatbot');
      console.error(err);
    }
  };
  

  return (
    <PageContainer title="Chatbox" description="Manage your chatbot here.">
      <DashboardCard title="Chatbox Manager">
        {!showForm ? (
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
              onClick={handleToggleForm}
            >
              Add Chatbot
            </Button>
          </Box>
        ) : (
          <Stack
            direction={isMobile ? 'column' : 'row'}
            spacing={4}
            justifyContent="center"
            alignItems="flex-start"
            flexWrap="wrap"
          >
            {/* Chatbot Form */}
            <Fade in timeout={400}>
              <Box flex={1} maxWidth={600} width="100%">
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                  <Typography variant="h6" mb={3}>
                    Create Chatbot
                  </Typography>

                  <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} mb={3}>
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
                  </Stack>

                  <Box mb={1}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      Inject Content
                    </Typography>
                    <Typography variant="caption" color="error">
                      [Note: Domain URL once injected cannot be reversed]
                    </Typography>
                  </Box>

                  <Stack spacing={2}>
                    <TextField
                      label="Domain URL"
                      placeholder="https://yourdomain.com"
                      fullWidth
                      value={domainUrl}
                      onChange={(e) => setDomainUrl(e.target.value)}
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
                      placeholder="Paste some reference content..."
                      fullWidth
                      value={customContent}
                      onChange={(e) => setCustomContent(e.target.value)}
                    />
                  </Stack>

                  <Stack direction="row" justifyContent="flex-end" spacing={1} mt={3}>
                    <Button onClick={() => setShowForm(false)}>Cancel</Button>
                    <Button variant="contained" color="primary" onClick={handleSave}>
                      Save
                    </Button>
                  </Stack>
                </Paper>
              </Box>
            </Fade>

            {/* Confirmation Box */}
            <Slide direction="up" in={saved} mountOnEnter unmountOnExit>
              <Box flex={1} maxWidth={600} width="100%">
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                  <Typography variant="h6" mb={2}>
                    🎉 Chatbot Created
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Your chatbot is now active. You can configure responses or view usage in analytics.
                  </Typography>
                  <Box mt={3}>
                    <Button variant="outlined" color="primary" href="/chatbox">
                      Go to Dashboard
                    </Button>
                  </Box>
                </Paper>
              </Box>
            </Slide>
          </Stack>
        )}
      </DashboardCard>
    </PageContainer>
  );
};

export default ChatboxPage;
