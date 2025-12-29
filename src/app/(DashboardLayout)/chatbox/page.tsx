'use client';
import React, { useState, useEffect, useCallback } from 'react';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import ChatboxEmptyState from './ChatboxEmptyState';
import ChatboxForm from './ChatboxForm';
import ChatboxDetails from './ChatboxDetails';
import AIChatLoader from './AIChatLoader';
import { 
  Fade, 
  Slide, 
  Box, 
  Typography, 
  LinearProgress, 
  Paper,
  Stack,
  Chip,
  Avatar,
  Alert,
  Button,
  CircularProgress
} from '@mui/material';
import { 
  IconRobot, 
  IconSparkles, 
  IconBrain, 
  IconCheck,
  IconLoader
} from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authenticatedFetch } from '@/utils/api';

const ChatboxPage = () => {
  const [chatbox, setChatbox] = useState<any>(undefined);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [currentStatusIndex, setCurrentStatusIndex] = useState<number>(0);
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeStatus, setScrapeStatus] = useState('');

  const [orgName, setOrgName] = useState('');
  const [category, setCategory] = useState('');
  const [domainUrl, setDomainUrl] = useState('');
  const [customContent, setCustomContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [allowAutoScrape, setAllowAutoScrape] = useState(false);
  const [themeColor, setThemeColor] = useState('#6366f1');
  const [organizationImage, setOrganizationImage] = useState<string | null>(null);
  const [organizationImageFile, setOrganizationImageFile] = useState<File | null>(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT!;
  const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL!;

  const statusSteps = [
    'Initializing AI setup...',
    'Processing knowledge base...',
    'Training response patterns...',
    'Optimizing conversation flow...',
    'AI assistant ready! 🚀',
  ];

  const fetchChatbox = useCallback(async () => {
    try {
      const res = await authenticatedFetch(`${BACKEND_URL}/api/chatboxes`, {
        method: 'GET',
      });
      if (!res.ok) throw new Error(`Fetch error ${res.status}`);
      const data = await res.json();
      setChatbox(data);
    } catch (err) {
      console.error(err);
      setChatbox(null);
    }
  }, [BACKEND_URL]);

  useEffect(() => {
    fetchChatbox();
  }, [fetchChatbox]);

  const scrapeWebsiteContent = async (url: string): Promise<string> => {
    setIsScraping(true);
    setScrapeStatus('Initializing scraping process...');
    
    try {
      // Validate URL format
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        throw new Error('Please enter a valid URL starting with http:// or https://');
      }

      setScrapeStatus('Connecting to website...');
      const res = await authenticatedFetch(`${BACKEND_URL}/api/scrape`, {
        method: 'POST',
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || `HTTP ${res.status}: Scraping failed`);
      }

      const content = data.content || '';
      
      if (!content || content.length < 30) {
        throw new Error(`Insufficient content found (only ${content.length} characters). The website may have very little text, be blocking scraping, or load content dynamically via JavaScript. Try using manual content input instead.`);
      }

      // Log content length for debugging
      console.log(`Scraped content length: ${content.length} characters`);
      if (content.length < 100) {
        console.log('Warning: Website has minimal content, but proceeding with what was found');
      }

      const method = data.method || 'unknown';
      setScrapeStatus(`✅ Scraping successful using ${method}! Fetched ${content.length} characters.`);
      
      return content;
    } catch (err: any) {
      console.error('Scrape error:', err);
      const errorMessage = err.message || 'Failed to scrape content. Please check the URL or try manual input.';
      setScrapeStatus(`❌ ${errorMessage}`);
      
      // Show more detailed error information
      if (err.message.includes('network') || err.message.includes('timeout')) {
        setScrapeStatus('❌ Network error. Please check your internet connection and try again.');
      } else if (err.message.includes('CORS') || err.message.includes('blocked')) {
        setScrapeStatus('❌ Website blocked scraping. Try using manual content input instead.');
      } else if (err.message.includes('Invalid URL')) {
        setScrapeStatus('❌ Invalid URL format. Please enter a complete URL starting with http:// or https://');
      } else if (err.message.includes('Insufficient content')) {
        setScrapeStatus('❌ Website has minimal text content. This often happens with: visual-heavy sites, JavaScript-heavy SPAs, or sites with anti-scraping measures. Try manual content input or check other pages on the site.');
      } else if (err.message.includes('JavaScript')) {
        setScrapeStatus('❌ Website loads content via JavaScript. Our enhanced scraper will try to handle this, but manual input may work better.');
      }
      
      return '';
    } finally {
      setIsScraping(false);
    }
  };

  const handleSave = async () => {
    if (!orgName || !category || !domainUrl) {
      alert('Please fill all required fields');
      return;
    }

    try {
      setIsSaving(true);
      let finalContent = customContent;

      if (allowAutoScrape) {
        // Always scrape when auto-scrape is enabled
        const scrapedContent = await scrapeWebsiteContent(domainUrl);
        if (scrapedContent) {
          // If there's manual content, append scraped content to it
          // If no manual content, use scraped content
          finalContent = customContent 
            ? `${customContent}\n\n--- AUTO-SCRAPED CONTENT ---\n\n${scrapedContent}`
            : scrapedContent;
          setCustomContent(finalContent);
        }
      }

      // If there's a new image file and we're creating a new chatbox, we'll upload it after creation
      // If editing, the image should already be uploaded via the upload endpoint
      const payload = {
        organizationName: orgName,
        category,
        domainUrl,
        customContent: finalContent,
        status: 'active',
        textFont: 'Inter',
        themeColor: themeColor,
        displayName: orgName,
        allowAutoScrape,
        organizationLogo: organizationImage || undefined,
      };

      const endpoint = isEditing
        ? `${BACKEND_URL}/api/chatboxes/${chatbox._id}`
        : `${BACKEND_URL}/api/chatboxes`;

      const res = await authenticatedFetch(endpoint, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Save failed');
      }

      // If there's a new image file and we just created a chatbox, upload it
      if (organizationImageFile && !isEditing && data.chatbox?._id) {
        try {
          const formData = new FormData();
          formData.append('image', organizationImageFile);

          const uploadRes = await authenticatedFetch(`${BACKEND_URL}/api/chatboxes/${data.chatbox._id}/upload-image`, {
            method: 'POST',
            body: formData,
          });

          if (uploadRes.ok) {
            const uploadData = await uploadRes.json();
            data.chatbox.organizationLogo = uploadData.imageUrl;
            data.chatbox.configuration.profileAvatar = uploadData.imageUrl;
            setOrganizationImage(uploadData.imageUrl);
          }
        } catch (uploadErr) {
          console.error('Failed to upload image after chatbox creation:', uploadErr);
          // Don't fail the entire save if image upload fails
        }
      }

      setChatbox(data.chatbox);
      setShowForm(false);
      setIsEditing(false);
      setIsSaving(false);

      // Animate finalization
      setIsFinalizing(true);
      setCurrentStatusIndex(0);
      let step = 0;
      const interval = setInterval(() => {
        if (step < statusSteps.length - 1) {
          setCurrentStatusIndex(step);
          step++;
        } else {
          clearInterval(interval);
          setCurrentStatusIndex(step);
          setTimeout(() => {
            setIsFinalizing(false);
          }, 2000);
        }
      }, 1800);
    } catch (err: any) {
      const errorMessage = err.message || `Error ${isEditing ? 'updating' : 'creating'} chatbot`;
      alert(errorMessage);
      console.error(err);
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this chatbot?')) return;
    try {
      const res = await authenticatedFetch(`${BACKEND_URL}/api/chatboxes/${id}`, {
        method: 'DELETE',
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
    <PageContainer title="AI Chatbot" description="Create and manage your AI assistant">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <DashboardCard>
          {/* Compact Header */}
          <Box sx={{ mb: 2 }}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: 'primary.main',
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
                }}
              >
                <IconBrain size={16} />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 0 }}>
                  AI Chatbot Manager
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Create, customize, and deploy your intelligent AI assistant
                </Typography>
              </Box>
            </Stack>
          </Box>
          
          <AnimatePresence mode="wait">
            {chatbox === undefined ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Box 
                  display="flex" 
                  justifyContent="center" 
                  alignItems="center" 
                  minHeight={400}
                  sx={{
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    borderRadius: 3,
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                  }}
                >
                  <Stack alignItems="center" spacing={3}>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <IconLoader size={48} color="#6366f1" />
                    </motion.div>
                    <Typography variant="h6" color="text.secondary">
                      Loading your AI assistant...
                    </Typography>
                  </Stack>
                </Box>
              </motion.div>
            ) : !chatbotExists && !showForm ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
              >
                <ChatboxEmptyState
                  onAdd={() => {
                    setOrgName('');
                    setCategory('');
                    setDomainUrl('');
                    setCustomContent('');
                    setFile(null);
                    setAllowAutoScrape(false);
                    setIsEditing(false);
                    setOrganizationImage(null);
                    setOrganizationImageFile(null);
                    setShowForm(true);
                  }}
                />
              </motion.div>
            ) : showForm ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {/* Form Header */}
                <Box sx={{ mb: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: isEditing ? '#f59e0b' : '#6366f1',
                      }}
                    >
                      {isEditing ? '✏️' : '➕'}
                    </Avatar>
                    <Box>
                      <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                        {isEditing ? 'Edit AI Assistant' : 'Create New AI Assistant'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {isEditing ? 'Update your chatbot configuration' : 'Set up your intelligent AI assistant'}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                {/* Main Form Container */}
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 4,
                    background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: isEditing 
                        ? 'linear-gradient(90deg, #f59e0b, #f97316)' 
                        : 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                    }
                  }}
                >
                  <Box sx={{ p: 4 }}>
                    <ChatboxForm
                      orgName={orgName}
                      setOrgName={setOrgName}
                      category={category}
                      setCategory={setCategory}
                      domainUrl={domainUrl}
                      setDomainUrl={setDomainUrl}
                      customContent={customContent}
                      setCustomContent={setCustomContent}
                      setFile={setFile}
                      handleSave={handleSave}
                      onCancel={() => {
                        setShowForm(false);
                        setIsEditing(false);
                      }}
                      isEditing={isEditing}
                      allowAutoScrape={allowAutoScrape}
                      setAllowAutoScrape={setAllowAutoScrape}
                      isSaving={isSaving || isScraping}
                      themeColor={themeColor}
                      setThemeColor={setThemeColor}
                      isScraping={isScraping}
                      scrapeStatus={scrapeStatus}
                      onScrapeWebsite={scrapeWebsiteContent}
                      organizationImage={organizationImage}
                      setOrganizationImage={setOrganizationImage}
                      organizationImageFile={organizationImageFile}
                      setOrganizationImageFile={setOrganizationImageFile}
                      chatboxId={chatbox?._id}
                    />
                  </Box>
                  
                  {/* Enhanced Status Indicators */}
                  {(scrapeStatus || isScraping) && (
                    <Box sx={{ px: 4, pb: 4 }}>
                      {scrapeStatus && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Alert 
                            severity={scrapeStatus.includes('✅') ? 'success' : scrapeStatus.includes('❌') ? 'error' : 'info'}
                            sx={{ 
                              mb: 2,
                              borderRadius: 2,
                              '& .MuiAlert-icon': { 
                                color: scrapeStatus.includes('✅') ? '#10b981' : 
                                       scrapeStatus.includes('❌') ? '#ef4444' : '#6366f1' 
                              }
                            }}
                          >
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {scrapeStatus}
                            </Typography>
                          </Alert>
                        </motion.div>
                      )}
                      
                      {isScraping && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Paper
                            elevation={0}
                            sx={{
                              p: 3,
                              borderRadius: 2,
                              background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                              border: '1px solid rgba(99, 102, 241, 0.1)',
                            }}
                          >
                            <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                              <CircularProgress size={20} sx={{ color: '#6366f1' }} />
                              <Typography variant="body2" sx={{ fontWeight: 500, color: '#6366f1' }}>
                                Scraping website content...
                              </Typography>
                            </Stack>
                            <LinearProgress 
                              sx={{ 
                                height: 6, 
                                borderRadius: 3,
                                bgcolor: 'rgba(99, 102, 241, 0.1)',
                                '& .MuiLinearProgress-bar': {
                                  bgcolor: '#6366f1',
                                  borderRadius: 3,
                                }
                              }} 
                            />
                          </Paper>
                        </motion.div>
                      )}
                    </Box>
                  )}
                </Paper>
              </motion.div>
            ) : isFinalizing ? (
              <motion.div
                key="finalizing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              >
                <Box 
                  display="flex" 
                  flexDirection="column"
                  justifyContent="center" 
                  alignItems="center" 
                  minHeight={400}
                  sx={{
                    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    borderRadius: 4,
                    border: '1px solid rgba(0, 0, 0, 0.06)',
                    p: 4,
                  }}
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: '#6366f1',
                        boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
                        mb: 3,
                      }}
                    >
                      <IconSparkles size={40} />
                    </Avatar>
                  </motion.div>
                  
                  <motion.div
                    key={currentStatusIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 600, 
                        textAlign: 'center',
                        color: 'text.primary',
                        mb: 2,
                      }}
                    >
                      {statusSteps[currentStatusIndex]}
                    </Typography>
                  </motion.div>
                  
                  <Box sx={{ width: '100%', maxWidth: 400, mt: 3 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={((currentStatusIndex + 1) / statusSteps.length) * 100}
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        bgcolor: 'rgba(99, 102, 241, 0.1)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: '#6366f1',
                          borderRadius: 4,
                        }
                      }} 
                    />
                  </Box>
                  
                  <Stack direction="row" spacing={1} mt={3}>
                    {statusSteps.map((_, index) => (
                      <motion.div
                        key={index}
                        animate={{ 
                          scale: index <= currentStatusIndex ? 1.2 : 1,
                          opacity: index <= currentStatusIndex ? 1 : 0.3
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <Avatar
                          sx={{
                            width: 24,
                            height: 24,
                            bgcolor: index <= currentStatusIndex ? '#6366f1' : 'rgba(0,0,0,0.1)',
                            fontSize: '0.75rem',
                          }}
                        >
                          {index <= currentStatusIndex ? (
                            <IconCheck size={12} />
                          ) : (
                            index + 1
                          )}
                        </Avatar>
                      </motion.div>
                    ))}
                  </Stack>
                </Box>
              </motion.div>
            ) : (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <ChatboxDetails
                  chatbox={chatbox}
                  onDelete={handleDelete}
                  onEdit={() => {
                    setOrgName(chatbox.organizationName);
                    setCategory(chatbox.category);
                    setDomainUrl(chatbox.domainUrl);
                    setCustomContent(chatbox.customContent);
                    setAllowAutoScrape(chatbox.allowAutoScrape ?? false);
                    setThemeColor(chatbox.configuration?.themeColor || '#6366f1');
                    setOrganizationImage(chatbox.organizationLogo || chatbox.configuration?.profileAvatar || null);
                    setOrganizationImageFile(null);
                    setFile(null);
                    setIsEditing(true);
                    setShowForm(true);
                  }}
                  frontendUrl={FRONTEND_URL}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </DashboardCard>
      </motion.div>
    </PageContainer>
  );
};

export default ChatboxPage;
