'use client';
import React, { useState, useEffect, useCallback } from 'react';
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
  Chip,
  Avatar,
  Divider,
  IconButton,
  Tooltip,
  Alert,
  Fade,
  Grow,
  CircularProgress,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { 
  IconRobot, 
  IconTrash, 
  IconSettings, 
  IconCode, 
  IconCopy,
  IconCheck,
  IconPalette,
  IconTypography,
  IconBrandX,
  IconGlobe,
  IconSparkles,
  IconPlus,
  IconEdit,
  IconX,
  IconExternalLink,
  IconQrcode,
  IconDownload
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import ChatboxEmbed from './ChatboxEmbed';
import ChatboxLivePreview from './ChatboxLivePreview';
import { authenticatedFetch } from '@/utils/api';

// Dynamically import QRCode to avoid SSR issues
const QRCode = dynamic(
  () => import('qrcode.react').then((mod) => ({ default: mod.QRCodeSVG })),
  {
    ssr: false,
    loading: () => <CircularProgress size={24} />
  }
);

const ChatboxDetails = ({ chatbox, onDelete, onEdit, frontendUrl }: any) => {
  const [displayName, setDisplayName] = useState(chatbox?.configuration?.displayName || '');
  const [themeColor, setThemeColor] = useState(chatbox?.configuration?.themeColor || '#6366f1');
  const [textFont, setTextFont] = useState(chatbox?.configuration?.textFont || 'Inter');
  const [copied, setCopied] = useState(false);
  const [suggestedColors, setSuggestedColors] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [displayNameTimeout, setDisplayNameTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [predefinedQuestions, setPredefinedQuestions] = useState<any[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState('');
  const [newQuestionOrder, setNewQuestionOrder] = useState(0);
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  const [qrCodeRef, setQrCodeRef] = useState<HTMLDivElement | null>(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT!;

  // Generate chat page URL
  const getChatPageUrl = () => {
    return `${frontendUrl}/chat?chatboxId=${encodeURIComponent(chatbox.name)}`;
  };

  // Download QR code as PNG
  const downloadQRCode = () => {
    if (!qrCodeRef) return;

    const svgElement = qrCodeRef.querySelector('svg');
    if (!svgElement) return;

    try {
      // Create a canvas to convert SVG to PNG
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const svgData = new XMLSerializer().serializeToString(svgElement);
      const img = new Image();
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        // Set canvas size with padding for better quality
        const padding = 40;
        canvas.width = img.width * 2 + padding * 2;
        canvas.height = img.height * 2 + padding * 2;
        
        // Fill white background
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw the QR code image
        ctx.drawImage(img, padding, padding, img.width * 2, img.height * 2);

        // Convert to blob and download
        canvas.toBlob((blob) => {
          if (blob) {
            const downloadUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `chatbox-qr-${chatbox.name || 'chatbox'}-${Date.now()}.png`;
            link.href = downloadUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(downloadUrl);
          }
          URL.revokeObjectURL(url);
        }, 'image/png', 1.0);
      };

      img.onerror = () => {
        console.error('Failed to load SVG image');
        URL.revokeObjectURL(url);
      };

      img.src = url;
    } catch (error) {
      console.error('Error downloading QR code:', error);
    }
  };

  // Check backend connectivity
  const checkBackendConnectivity = useCallback(async () => {
    try {
      const response = await authenticatedFetch(`${BACKEND_URL}/api/chatboxes`, {
        method: 'GET',
      });
      return response.status !== 0; // Any response means server is reachable
    } catch (error) {
      console.error('Backend connectivity check failed:', error);
      return false;
    }
  }, [BACKEND_URL]);

  // Check if user is authenticated
  const checkAuthentication = useCallback(async () => {
    try {
      const response = await authenticatedFetch(`${BACKEND_URL}/api/users/me`, {
        method: 'GET',
      });
      return response.ok;
    } catch (error) {
      console.error('Authentication check failed:', error);
      return false;
    }
  }, [BACKEND_URL]);

  const analyzeWebsiteColors = useCallback(async (url: string) => {
    if (!url) return;
    
    setIsAnalyzing(true);
    try {
      const response = await authenticatedFetch(`${BACKEND_URL}/api/chatboxes/analyze-colors?url=${encodeURIComponent(url)}`);
      if (!response.ok) throw new Error('Failed to analyze website colors');
      const data = await response.json();
      setSuggestedColors(data.colors || []);
    } catch (error) {
      setSuggestedColors([]);
    } finally {
      setIsAnalyzing(false);
    }
  }, [BACKEND_URL]);

  // Fetch predefined questions
  const fetchPredefinedQuestions = useCallback(async () => {
    if (!chatbox?._id) return;
    setLoadingQuestions(true);
    try {
      const res = await authenticatedFetch(`${BACKEND_URL}/api/chatboxes/${chatbox._id}/predefined-questions`, {
        method: 'GET',
      });
      if (res.ok) {
        const data = await res.json();
        setPredefinedQuestions(data.questions || []);
      }
    } catch (err) {
      console.error('Failed to fetch predefined questions:', err);
    } finally {
      setLoadingQuestions(false);
    }
  }, [chatbox?._id, BACKEND_URL]);

  useEffect(() => {
    fetchPredefinedQuestions();
  }, [fetchPredefinedQuestions]);

  // Add predefined question
  const handleAddQuestion = async () => {
    if (!newQuestion.trim() || !chatbox?._id) return;
    try {
      const res = await authenticatedFetch(`${BACKEND_URL}/api/chatboxes/${chatbox._id}/predefined-questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: newQuestion.trim(),
          order: newQuestionOrder,
          isActive: true,
        }),
      });
      if (res.ok) {
        setNewQuestion('');
        setNewQuestionOrder(0);
        fetchPredefinedQuestions();
      }
    } catch (err) {
      console.error('Failed to add question:', err);
    }
  };

  // Update predefined question
  const handleUpdateQuestion = async (questionId: string, question: string, order: number, isActive: boolean) => {
    if (!chatbox?._id) return;
    try {
      const res = await authenticatedFetch(`${BACKEND_URL}/api/chatboxes/${chatbox._id}/predefined-questions/${questionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, order, isActive }),
      });
      if (res.ok) {
        setEditingQuestionId(null);
        fetchPredefinedQuestions();
      }
    } catch (err) {
      console.error('Failed to update question:', err);
    }
  };

  // Delete predefined question
  const handleDeleteQuestion = async (questionId: string) => {
    if (!chatbox?._id) return;
    try {
      const res = await authenticatedFetch(`${BACKEND_URL}/api/chatboxes/${chatbox._id}/predefined-questions/${questionId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchPredefinedQuestions();
      }
    } catch (err) {
      console.error('Failed to delete question:', err);
    }
  };

  // Check backend connectivity and analyze website colors when component loads
  useEffect(() => {
    const initializeComponent = async () => {
      // Check backend connectivity
      const connected = await checkBackendConnectivity();
      setIsBackendConnected(connected);
      
      // Check authentication
      const authenticated = await checkAuthentication();
      setIsAuthenticated(authenticated);
      
      // Analyze website colors
      if (chatbox?.domainUrl) {
        analyzeWebsiteColors(chatbox.domainUrl);
      }
    };
    
    initializeComponent();
  }, [chatbox?.domainUrl, checkBackendConnectivity, checkAuthentication, analyzeWebsiteColors]);

  const updateConfig = async (field: string, value: string, retryCount = 0) => {
    console.log('updateConfig called:', { field, value, chatboxId: chatbox?._id, isAuthenticated, isUpdating });
    
    if (!chatbox?._id) {
      console.error('Chatbox ID is missing');
      return;
    }

    if (!BACKEND_URL) {
      console.error('Backend URL is not configured');
      setUpdateError('Backend configuration error. Please check your environment settings.');
      return;
    }

    // Check authentication before making the request
    if (isAuthenticated === false) {
      console.error('User is not authenticated');
      setUpdateError('Authentication required. Please log in again.');
      return;
    }

    setIsUpdating(true);
    setUpdateError(null);

    try {
      const response = await authenticatedFetch(`${BACKEND_URL}/api/chatboxes/${chatbox._id}/configuration`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ configuration: { [field]: value } }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`HTTP ${response.status}: ${errorText}`);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`Successfully updated ${field}:`, data);
    } catch (err: any) {
      console.error(`Failed to update ${field}`, err);
      
      let errorMessage = `Failed to update ${field}. Please try again.`;
      
      // Provide more specific error messages
      if (err instanceof Error) {
        if (err.message.includes('401')) {
          errorMessage = 'Authentication required. Please log in again.';
          // Redirect to login after showing error
          setTimeout(() => {
            window.location.href = '/authentication/login';
          }, 3000);
        } else if (err.message.includes('403')) {
          errorMessage = 'Access denied. You may not have permission to update this chatbox.';
        } else if (err.message.includes('404')) {
          errorMessage = 'Chatbox not found. Please refresh the page.';
        } else if (err.message.includes('500')) {
          errorMessage = 'Server error. Please try again later.';
        } else if (err.message.includes('Failed to fetch')) {
          errorMessage = 'Network error. Please check your connection and try again.';
          
          // Retry network errors up to 2 times
          if (retryCount < 2) {
            console.log(`Retrying update for ${field} (attempt ${retryCount + 1})`);
            setTimeout(() => {
              updateConfig(field, value, retryCount + 1);
            }, 1000 * (retryCount + 1)); // Exponential backoff
            return;
          }
        }
      }
      
      setUpdateError(errorMessage);
      
      // Show error for 5 seconds then clear
      setTimeout(() => {
        setUpdateError(null);
      }, 5000);
    } finally {
      setIsUpdating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fontOptions = [
    { value: 'Inter', label: 'Inter' },
    { value: 'Roboto', label: 'Roboto' },
    { value: 'Open Sans', label: 'Open Sans' },
    { value: 'Poppins', label: 'Poppins' },
    { value: 'SF Pro Display', label: 'SF Pro Display' },
    { value: 'Segoe UI', label: 'Segoe UI' },
  ];



  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          gap: 4,
          maxWidth: 1400,
          mx: 'auto',
          mt: 2,
        }}
      >
        {/* Left Section: Chat Preview */}
        <Box flex={1} minWidth={0}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Paper 
              elevation={0}
              sx={{ 
                p: 3, 
                borderRadius: 4, 
                background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
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
                  background: `linear-gradient(90deg, ${themeColor}, ${themeColor}dd)`,
                }
              }}
            >
              {/* Authentication Warning */}
              {isAuthenticated === false && (
                <Fade in={isAuthenticated === false}>
                  <Alert 
                    severity="error" 
                    sx={{ mb: 2, borderRadius: 2 }}
                    action={
                      <Button 
                        color="inherit" 
                        size="small" 
                        onClick={() => window.location.href = '/authentication/login'}
                      >
                        Login
                      </Button>
                    }
                  >
                    You are not logged in. Please log in to use this feature.
                  </Alert>
                </Fade>
              )}

              {/* Connectivity Warning */}
              {isBackendConnected === false && (
                <Fade in={isBackendConnected === false}>
                  <Alert 
                    severity="warning" 
                    sx={{ mb: 2, borderRadius: 2 }}
                  >
                    Unable to connect to the server. Some features may not work properly.
                  </Alert>
                </Fade>
              )}

              {/* Error Alert */}
              {updateError && (
                <Fade in={!!updateError}>
                  <Alert 
                    severity="error" 
                    sx={{ mb: 2, borderRadius: 2 }}
                    onClose={() => setUpdateError(null)}
                  >
                    {updateError}
                  </Alert>
                </Fade>
              )}
              <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                <Avatar
                  sx={{
                    width: 28,
                    height: 28,
                    bgcolor: themeColor,
                    boxShadow: `0 2px 8px ${themeColor}40`,
                  }}
                >
                  <IconSparkles size={14} />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary', mb: 0 }}>
                    Live Preview
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    See how your AI assistant will look
                  </Typography>
                </Box>
                <Chip
                  label="Real-time"
                  size="small"
                  sx={{
                    bgcolor: 'success.light',
                    color: 'success.contrastText',
                    fontSize: '0.625rem',
                    height: 20,
                  }}
                />
              </Stack>
              
              <ChatboxLivePreview
                displayName={displayName}
                themeColor={themeColor}
                font={textFont}
              />
            </Paper>
          </motion.div>
        </Box>

        {/* Right Section: Configuration */}
        <Box flex={1} minWidth={0}>
          <Stack spacing={3}>
            {/* Chatbot Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3, 
                  borderRadius: 4, 
                  background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                  <Avatar
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: themeColor,
                      boxShadow: `0 4px 16px ${themeColor}40`,
                    }}
                  >
                    <IconRobot size={24} />
                  </Avatar>
                  <Box flex={1}>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary' }}>
                      {chatbox.organizationName}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={chatbox.category}
                        size="small"
                        sx={{
                          bgcolor: `${themeColor}15`,
                          color: themeColor,
                          fontWeight: 500,
                        }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {chatbox.domainUrl}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>

                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                  <Alert 
                    severity="info" 
                    sx={{ 
                      flex: 1,
                      borderRadius: 1,
                      py: 0.5,
                      px: 1.5,
                      '& .MuiAlert-icon': { color: themeColor },
                      '& .MuiAlert-message': { py: 0.5 }
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 500 }}>
                      {chatbox.customContent 
                        ? `Knowledge base: ${chatbox.customContent.length} characters`
                        : 'No custom knowledge base configured'
                      }
                    </Typography>
                  </Alert>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<IconExternalLink size={14} />}
                      onClick={() => {
                        const chatUrl = getChatPageUrl();
                        window.open(chatUrl, '_blank');
                      }}
                      sx={{
                        borderRadius: 1.5,
                        textTransform: 'none',
                        fontWeight: 500,
                        borderColor: themeColor,
                        color: themeColor,
                        px: 1.5,
                        py: 0.5,
                        fontSize: '0.75rem',
                        '&:hover': {
                          borderColor: themeColor,
                          bgcolor: `${themeColor}08`,
                          transform: 'translateY(-1px)',
                        },
                        transition: 'all 0.2s',
                      }}
                    >
                      Chat Page
                    </Button>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<IconQrcode size={14} />}
                      onClick={() => setShowQRCodeModal(true)}
                      sx={{
                        borderRadius: 1.5,
                        textTransform: 'none',
                        fontWeight: 500,
                        borderColor: themeColor,
                        color: themeColor,
                        px: 1.5,
                        py: 0.5,
                        fontSize: '0.75rem',
                        '&:hover': {
                          borderColor: themeColor,
                          bgcolor: `${themeColor}08`,
                          transform: 'translateY(-1px)',
                        },
                        transition: 'all 0.2s',
                      }}
                    >
                      QR Code
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<IconCode size={14} />}
                      onClick={() => setShowEmbedModal(true)}
                      sx={{
                        borderRadius: 1.5,
                        textTransform: 'none',
                        fontWeight: 500,
                        bgcolor: themeColor,
                        px: 1.5,
                        py: 0.5,
                        fontSize: '0.75rem',
                        '&:hover': {
                          bgcolor: themeColor,
                          transform: 'translateY(-1px)',
                          boxShadow: `0 4px 12px ${themeColor}40`,
                        },
                        transition: 'all 0.2s',
                      }}
                    >
                      Embed
                    </Button>
                  </Stack>
                </Stack>
              </Paper>
            </motion.div>

            {/* Configuration Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Paper 
                elevation={0}
                sx={{ 
                  p: 2, 
                  borderRadius: 3, 
                  background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                  <IconSettings size={20} color={themeColor} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    Configuration
                  </Typography>
                </Stack>

                <Stack spacing={2}>
                  {/* Display Name */}
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                      <IconBrandX size={14} color={themeColor} />
                      <Typography variant="caption" sx={{ fontWeight: 500 }}>
                        Display Name
                      </Typography>
                      {isUpdating && <CircularProgress size={12} color="primary" />}
                    </Stack>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Enter display name..."
                      value={displayName}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDisplayName(val);
                        
                        // Only update if authenticated
                        if (isAuthenticated !== false) {
                          // Clear existing timeout
                          if (displayNameTimeout) {
                            clearTimeout(displayNameTimeout);
                          }
                          
                          // Set new timeout for debounced update
                          const timeout = setTimeout(() => {
                            updateConfig('displayName', val);
                          }, 1000); // 1 second delay
                          
                          setDisplayNameTimeout(timeout);
                        }
                      }}
                      disabled={isAuthenticated === false}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 1.5,
                          '&:hover': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: themeColor,
                            },
                          },
                        },
                      }}
                    />
                  </Box>

                  {/* Theme Color */}
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                      <IconPalette size={14} color={themeColor} />
                      <Typography variant="caption" sx={{ fontWeight: 500 }}>
                        Theme Color
                      </Typography>
                      {isAnalyzing && <CircularProgress size={12} />}
                      {isUpdating && <CircularProgress size={12} color="primary" />}
                    </Stack>
                    
                    {/* Website Suggested Colors and Custom Color Picker */}
                    <Stack direction="row" alignItems="flex-start" spacing={3} mb={2}>
                      {/* Website Suggested Colors */}
                      {suggestedColors.length > 0 && (
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                            Suggested from website:
                          </Typography>
                                                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {suggestedColors.slice(0, 8).map((color) => (
                              <Tooltip key={color} title={`Website color: ${color}`}>
                                <Box
                                  sx={{
                                    width: 40,
                                    height: 40,
                                    borderRadius: 2,
                                    bgcolor: color,
                                    cursor: isUpdating ? 'not-allowed' : 'pointer',
                                    border: themeColor === color ? '3px solid white' : '2px solid transparent',
                                    boxShadow: themeColor === color 
                                      ? `0 0 0 2px ${color}, 0 4px 12px ${color}40`
                                      : '0 2px 8px rgba(0,0,0,0.1)',
                                    transition: 'all 0.2s',
                                    opacity: isUpdating ? 0.6 : 1,
                                    '&:hover': {
                                      transform: isUpdating ? 'none' : 'scale(1.1)',
                                      boxShadow: `0 4px 16px ${color}40`,
                                    },
                                  }}
                                  onClick={() => {
                                    if (!isUpdating && isAuthenticated !== false) {
                                      setThemeColor(color);
                                      updateConfig('themeColor', color);
                                    }
                                  }}
                                />
                              </Tooltip>
                            ))}
                          </Stack>
                        </Box>
                      )}

                      {/* Custom Color Picker */}
                      <Box sx={{ flex: '0 0 auto' }}>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                          Custom color:
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Box
                            sx={{
                              position: 'relative',
                              width: 40,
                              height: 40,
                              borderRadius: 2,
                              bgcolor: themeColor,
                              cursor: isUpdating ? 'not-allowed' : 'pointer',
                              border: '2px solid transparent',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                              transition: 'all 0.2s',
                              opacity: isUpdating ? 0.6 : 1,
                              '&:hover': {
                                transform: isUpdating ? 'none' : 'scale(1.05)',
                                boxShadow: `0 4px 16px ${themeColor}40`,
                              },
                            }}
                          >
                            <input
                              type="color"
                              value={themeColor}
                              onChange={(e) => {
                                if (!isUpdating && isAuthenticated !== false) {
                                  const newColor = e.target.value;
                                  setThemeColor(newColor);
                                  updateConfig('themeColor', newColor);
                                }
                              }}
                              disabled={isUpdating || isAuthenticated === false}
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                opacity: 0,
                                cursor: 'pointer',
                              }}
                            />
                          </Box>
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              fontFamily: 'monospace',
                              color: 'text.secondary',
                              fontWeight: 500
                            }}
                          >
                            {themeColor.toUpperCase()}
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack>
                  </Box>

                  {/* Font Selection */}
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                      <IconTypography size={14} color={themeColor} />
                      <Typography variant="caption" sx={{ fontWeight: 500 }}>
                        Font Family
                      </Typography>
                      {isUpdating && <CircularProgress size={12} color="primary" />}
                    </Stack>
                    <FormControl fullWidth size="small">
                      <Select
                        value={textFont}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTextFont(val);
                          updateConfig('textFont', val);
                        }}
                        disabled={isUpdating || isAuthenticated === false}
                        sx={{
                          borderRadius: 1.5,
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(0, 0, 0, 0.12)',
                          },
                        }}
                      >
                        {fontOptions.map((font) => (
                          <MenuItem key={font.value} value={font.value}>
                            <Typography sx={{ fontFamily: font.value }}>
                              {font.label}
                            </Typography>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>

                  {/* Predefined Questions */}
                  <Box>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <IconSparkles size={14} color={themeColor} />
                        <Typography variant="caption" sx={{ fontWeight: 500 }}>
                          Predefined Questions
                        </Typography>
                      </Stack>
                      <Typography variant="caption" color="text.secondary">
                        {predefinedQuestions.length} question{predefinedQuestions.length !== 1 ? 's' : ''}
                      </Typography>
                    </Stack>
                    
                    <Box sx={{ mb: 2 }}>
                      <Stack spacing={1}>
                        {loadingQuestions ? (
                          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                            <CircularProgress size={20} />
                          </Box>
                        ) : predefinedQuestions.length > 0 ? (
                          predefinedQuestions.map((q: any, index: number) => (
                            <Box
                              key={q._id || `question-${index}`}
                              sx={{
                                p: 1.5,
                                borderRadius: 1.5,
                                border: '1px solid rgba(0, 0, 0, 0.08)',
                                bgcolor: editingQuestionId === q._id ? 'action.hover' : 'background.paper',
                                transition: 'all 0.2s',
                              }}
                            >
                              {editingQuestionId === (q._id || `question-${index}`) ? (
                                <Stack spacing={1}>
                                  <TextField
                                    fullWidth
                                    size="small"
                                    value={q.question}
                                    onChange={(e) => {
                                      const updated = predefinedQuestions.map((item: any, idx: number) =>
                                        (item._id || `question-${idx}`) === (q._id || `question-${index}`) ? { ...item, question: e.target.value } : item
                                      );
                                      setPredefinedQuestions(updated);
                                    }}
                                    sx={{ mb: 1 }}
                                  />
                                  <Stack direction="row" spacing={1}>
                                    <TextField
                                      type="number"
                                      size="small"
                                      label="Order"
                                      value={q.order || 0}
                                      onChange={(e) => {
                                        const updated = predefinedQuestions.map((item: any, idx: number) =>
                                          (item._id || `question-${idx}`) === (q._id || `question-${index}`) ? { ...item, order: parseInt(e.target.value) || 0 } : item
                                        );
                                        setPredefinedQuestions(updated);
                                      }}
                                      sx={{ width: 100 }}
                                    />
                                    <FormControlLabel
                                      control={
                                        <Switch
                                          size="small"
                                          checked={q.isActive !== false}
                                          onChange={(e) => {
                                            const updated = predefinedQuestions.map((item: any, idx: number) =>
                                              (item._id || `question-${idx}`) === (q._id || `question-${index}`) ? { ...item, isActive: e.target.checked } : item
                                            );
                                            setPredefinedQuestions(updated);
                                          }}
                                        />
                                      }
                                      label="Active"
                                      sx={{ m: 0 }}
                                    />
                                    <Button
                                      size="small"
                                      variant="contained"
                                      onClick={() => {
                                        if (q._id) {
                                          handleUpdateQuestion(q._id, q.question, q.order || 0, q.isActive !== false);
                                        }
                                      }}
                                      disabled={!q._id}
                                      sx={{ ml: 'auto', bgcolor: themeColor }}
                                    >
                                      Save
                                    </Button>
                                    <IconButton
                                      size="small"
                                      onClick={() => {
                                        setEditingQuestionId(null);
                                        fetchPredefinedQuestions();
                                      }}
                                    >
                                      <IconX size={16} />
                                    </IconButton>
                                  </Stack>
                                </Stack>
                              ) : (
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  <Box sx={{ flex: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                      {q.question}
                                    </Typography>
                                    <Stack direction="row" spacing={1} mt={0.5}>
                                      <Chip
                                        label={`Order: ${q.order || 0}`}
                                        size="small"
                                        sx={{ height: 20, fontSize: '0.65rem' }}
                                      />
                                      <Chip
                                        label={q.isActive !== false ? 'Active' : 'Inactive'}
                                        size="small"
                                        color={q.isActive !== false ? 'success' : 'default'}
                                        sx={{ height: 20, fontSize: '0.65rem' }}
                                      />
                                    </Stack>
                                  </Box>
                                  <IconButton
                                    size="small"
                                    onClick={() => setEditingQuestionId(q._id || `question-${index}`)}
                                    sx={{ color: themeColor }}
                                    disabled={!q._id}
                                  >
                                    <IconEdit size={16} />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      if (q._id) {
                                        handleDeleteQuestion(q._id);
                                      }
                                    }}
                                    disabled={!q._id}
                                    sx={{ color: 'error.main' }}
                                  >
                                    <IconTrash size={16} />
                                  </IconButton>
                                </Stack>
                              )}
                            </Box>
                          ))
                        ) : (
                          <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                            No predefined questions yet. Add one below.
                          </Typography>
                        )}
                      </Stack>
                    </Box>

                    {/* Add New Question */}
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: 1.5,
                        border: '2px dashed rgba(0, 0, 0, 0.12)',
                        bgcolor: 'action.hover',
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: 500, mb: 1, display: 'block' }}>
                        Add New Question
                      </Typography>
                      <Stack spacing={1}>
                        <TextField
                          fullWidth
                          size="small"
                          placeholder="Enter question text..."
                          value={newQuestion}
                          onChange={(e) => setNewQuestion(e.target.value)}
                          disabled={isAuthenticated === false}
                        />
                        <Stack direction="row" spacing={1} alignItems="center">
                          <TextField
                            type="number"
                            size="small"
                            label="Order"
                            value={newQuestionOrder}
                            onChange={(e) => setNewQuestionOrder(parseInt(e.target.value) || 0)}
                            sx={{ width: 100 }}
                            disabled={isAuthenticated === false}
                          />
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<IconPlus size={16} />}
                            onClick={handleAddQuestion}
                            disabled={!newQuestion.trim() || isAuthenticated === false}
                            sx={{
                              bgcolor: themeColor,
                              '&:hover': { bgcolor: themeColor },
                            }}
                          >
                            Add Question
                          </Button>
                        </Stack>
                      </Stack>
                    </Box>
                  </Box>
                </Stack>

                <Divider sx={{ my: 2 }} />

                {/* Action Buttons */}
                <Stack spacing={2} sx={{ mt: 3 }}>
                  <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center" flexWrap="wrap">
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<IconTrash size={18} />}
                      onClick={() => onDelete(chatbox._id)}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 500,
                        flex: 1,
                        minWidth: 120,
                      }}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<IconExternalLink size={18} />}
                      onClick={() => {
                        const chatUrl = getChatPageUrl();
                        copyToClipboard(chatUrl);
                      }}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 500,
                        borderColor: themeColor,
                        color: themeColor,
                        flex: 1,
                        minWidth: 120,
                        '&:hover': {
                          borderColor: themeColor,
                          bgcolor: `${themeColor}08`,
                        },
                      }}
                    >
                      {copied ? 'Copied!' : 'Chat Link'}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<IconQrcode size={18} />}
                      onClick={() => setShowQRCodeModal(true)}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 500,
                        borderColor: themeColor,
                        color: themeColor,
                        flex: 1,
                        minWidth: 120,
                        '&:hover': {
                          borderColor: themeColor,
                          bgcolor: `${themeColor}08`,
                        },
                      }}
                    >
                      QR Code
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<IconCode size={18} />}
                      onClick={() => setShowEmbedModal(true)}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 500,
                        borderColor: themeColor,
                        color: themeColor,
                        flex: 1,
                        minWidth: 120,
                        '&:hover': {
                          borderColor: themeColor,
                          bgcolor: `${themeColor}08`,
                        },
                      }}
                    >
                      Embed
                    </Button>
                  </Stack>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<IconSettings size={18} />}
                    onClick={onEdit}
                    sx={{
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 500,
                      bgcolor: themeColor,
                      '&:hover': {
                        bgcolor: themeColor,
                        transform: 'translateY(-1px)',
                        boxShadow: `0 8px 25px ${themeColor}40`,
                      },
                      transition: 'all 0.2s',
                    }}
                  >
                    Edit
                  </Button>
                </Stack>
              </Paper>
            </motion.div>


          </Stack>
        </Box>
      </Box>

      {/* Embed Script Popup */}
      <ChatboxEmbed
        frontendUrl={frontendUrl}
        name={chatbox.name}
        backendUrl={BACKEND_URL}
        open={showEmbedModal}
        onClose={() => setShowEmbedModal(false)}
        themeColor={themeColor}
      />

      {/* QR Code Modal */}
      <Dialog
        open={showQRCodeModal}
        onClose={() => setShowQRCodeModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
          }
        }}
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: themeColor,
              }}
            >
              <IconQrcode size={18} />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                QR Code for Chat Page
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Scan to open the chat page
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} alignItems="center" sx={{ py: 2 }}>
            <Box
              ref={setQrCodeRef}
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: 'white',
                border: '1px solid rgba(0, 0, 0, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <QRCode
                value={getChatPageUrl()}
                size={256}
                level="H"
                includeMargin={true}
                fgColor={themeColor}
                bgColor="#ffffff"
              />
            </Box>
            <Box sx={{ textAlign: 'center', width: '100%' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Chat Page URL:
              </Typography>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 1.5,
                  bgcolor: 'action.hover',
                  border: '1px solid rgba(0, 0, 0, 0.08)',
                  wordBreak: 'break-all',
                }}
              >
                <Typography variant="caption" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                  {getChatPageUrl()}
                </Typography>
              </Box>
              <Button
                size="small"
                startIcon={<IconCopy size={14} />}
                onClick={() => {
                  copyToClipboard(getChatPageUrl());
                }}
                sx={{
                  mt: 1.5,
                  textTransform: 'none',
                  color: themeColor,
                }}
              >
                {copied ? 'Copied!' : 'Copy URL'}
              </Button>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => setShowQRCodeModal(false)}
            sx={{
              textTransform: 'none',
              color: 'text.secondary',
            }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            startIcon={<IconDownload size={18} />}
            onClick={downloadQRCode}
            sx={{
              textTransform: 'none',
              bgcolor: themeColor,
              '&:hover': {
                bgcolor: themeColor,
              },
            }}
          >
            Download QR Code
          </Button>
        </DialogActions>
      </Dialog>
    </motion.div>
  );
};

export default ChatboxDetails;
