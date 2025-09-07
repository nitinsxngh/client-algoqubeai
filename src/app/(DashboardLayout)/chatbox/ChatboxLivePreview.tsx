'use client';
import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Stack, 
  Avatar, 
  Chip,
  Fade,
  Slide,
  Grow,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import { 
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as UserIcon,
  ContentCopy as CopyIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import LeadCaptureForm, { LeadData } from '../../../components/forms/LeadCaptureForm';

type Message = {
  id: string;
  from: 'user' | 'bot';
  text: string;
  timestamp: Date;
  isTyping?: boolean;
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
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<string>('');
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const checkForLeadKeywords = (message: string): boolean => {
    const leadKeywords = ['contact', 'connect', 'reach out', 'get in touch', 'speak to', 'talk to', 'call me', 'email me'];
    const lowerMessage = message.toLowerCase();
    return leadKeywords.some(keyword => lowerMessage.includes(keyword));
  };

  const addBotMessage = (text: string) => {
    const botMessage: Message = {
      id: generateId(),
      from: 'bot',
      text: text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, botMessage]);
  };

  const simulateTyping = async (text: string) => {
    setIsTyping(true);
    const typingMessage: Message = {
      id: generateId(),
      from: 'bot',
      text: '',
      timestamp: new Date(),
      isTyping: true
    };
    setMessages(prev => [...prev, typingMessage]);

    // Simulate typing effect
    for (let i = 0; i < text.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 50));
      setMessages(prev => 
        prev.map(msg => 
          msg.isTyping 
            ? { ...msg, text: text.substring(0, i + 1) }
            : msg
        )
      );
    }

    // Remove typing indicator and add final message
    setMessages(prev => 
      prev.map(msg => 
        msg.isTyping 
          ? { ...msg, text, isTyping: false }
          : msg
      )
    );
    setIsTyping(false);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const messageText = input.trim();
    
    // Check if the message contains lead capture keywords
    if (checkForLeadKeywords(messageText)) {
      setPendingMessage(messageText);
      setShowLeadForm(true);
      setInput('');
      return;
    }

    const userMessage: Message = {
      id: generateId(),
      from: 'user',
      text: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "I understand your question. Let me help you with that.",
        "That's an interesting point! Here's what I can tell you about it.",
        "Based on the information available, I can provide you with the following insights.",
        "I'm here to assist you. Could you please provide more details?",
        "Thank you for reaching out. I'll do my best to help you with this."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      addBotMessage(randomResponse);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const copyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleLeadFormSubmit = async (leadData: LeadData) => {
    setIsSubmittingLead(true);
    
    try {
      // Add the user's original message
      const userMessage: Message = {
        id: generateId(),
        from: 'user',
        text: pendingMessage,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);

      // Add lead information as a system message (you could customize this)
      const leadMessage: Message = {
        id: generateId(),
        from: 'bot',
        text: `Thank you for your interest! I've received your contact information:\n\nName: ${leadData.name}\nEmail: ${leadData.email}\nPhone: ${leadData.phone}\nCompany: ${leadData.company}${leadData.message ? `\nMessage: ${leadData.message}` : ''}\n\nI'll make sure our team gets back to you soon!`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, leadMessage]);

      // Here you would typically send the lead data to your backend
      // For now, we'll just simulate a successful submission
      console.log('Lead data submitted:', leadData);
      
      // Close the form
      setShowLeadForm(false);
      setPendingMessage('');
      
    } catch (error) {
      console.error('Error submitting lead form:', error);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const handleLeadFormClose = () => {
    setShowLeadForm(false);
    setPendingMessage('');
  };

  const MessageBubble = ({ message }: { message: Message }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={{ marginBottom: '16px' }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: message.from === 'user' ? 'flex-end' : 'flex-start',
          alignItems: 'flex-start',
          gap: 1,
        }}
      >
        {message.from === 'bot' && (
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: themeColor,
              fontSize: '0.875rem',
            }}
          >
            <BotIcon sx={{ fontSize: 16 }} />
          </Avatar>
        )}
        
        <Box
          sx={{
            maxWidth: '70%',
            position: 'relative',
          }}
        >
          <Box
            sx={{
              p: 2,
              borderRadius: 3,
              backgroundColor: message.from === 'user' 
                ? themeColor 
                : 'rgba(0, 0, 0, 0.04)',
              color: message.from === 'user' ? 'white' : 'text.primary',
              border: message.from === 'bot' ? '1px solid rgba(0, 0, 0, 0.08)' : 'none',
              boxShadow: message.from === 'bot' ? '0 1px 3px rgba(0, 0, 0, 0.1)' : 'none',
              position: 'relative',
              '&:hover .message-actions': {
                opacity: 1,
              },
            }}
          >
            <Typography
              variant="body2"
              sx={{
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {message.text}
              {message.isTyping && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >
                  ▋
                </motion.span>
              )}
            </Typography>
            
            {/* Message Actions */}
            <Box
              className="message-actions"
              sx={{
                position: 'absolute',
                top: -8,
                right: message.from === 'user' ? -8 : 'auto',
                left: message.from === 'bot' ? -8 : 'auto',
                opacity: 0,
                transition: 'opacity 0.2s',
                display: 'flex',
                gap: 0.5,
              }}
            >
              <Tooltip title="Copy message">
                <IconButton
                  size="small"
                  onClick={() => copyMessage(message.text)}
                  sx={{
                    bgcolor: 'background.paper',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                    '&:hover': { bgcolor: 'background.paper' },
                  }}
                >
                  <CopyIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontSize: '0.75rem',
              mt: 0.5,
              display: 'block',
              textAlign: message.from === 'user' ? 'right' : 'left',
            }}
          >
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Typography>
        </Box>

        {message.from === 'user' && (
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor: 'primary.main',
              fontSize: '0.875rem',
            }}
          >
            <UserIcon sx={{ fontSize: 16 }} />
          </Avatar>
        )}
      </Box>
    </motion.div>
  );

  return (
    <Box
      sx={{
        border: '1px solid rgba(0, 0, 0, 0.12)',
        borderRadius: 3,
        fontFamily: font === 'default' ? 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' : font,
        bgcolor: '#ffffff',
        height: 500,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        position: 'relative',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          background: `linear-gradient(135deg, ${themeColor}, ${themeColor}dd)`,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: 'rgba(255, 255, 255, 0.2)',
          }}
        >
          <BotIcon sx={{ fontSize: 18 }} />
        </Avatar>
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {displayName || 'AI Assistant'}
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8 }}>
            Powered by algoqube
          </Typography>
        </Box>
        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            label="Online"
            size="small"
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontSize: '0.75rem',
            }}
          />
        </Box>
      </Box>

      {/* Messages Area */}
      <Box
        sx={{
          flex: 1,
          p: 2,
          overflowY: 'auto',
          bgcolor: '#fafafa',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '3px',
          },
        }}
      >
        <AnimatePresence>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginBottom: '16px' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: themeColor,
                  fontSize: '0.875rem',
                }}
              >
                <BotIcon sx={{ fontSize: 16 }} />
              </Avatar>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <CircularProgress size={16} />
                <Typography variant="body2" color="text.secondary">
                  Thinking...
                </Typography>
              </Box>
            </Box>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </Box>

      {/* Input Area */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid rgba(0, 0, 0, 0.08)',
          bgcolor: '#ffffff',
        }}
      >
        <Stack direction="row" spacing={1} alignItems="flex-end">
          <TextField
            ref={inputRef}
            fullWidth
            multiline
            maxRows={4}
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading || isTyping}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 3,
                bgcolor: '#f8f9fa',
                '&:hover': {
                  bgcolor: '#f1f3f4',
                },
                '&.Mui-focused': {
                  bgcolor: '#ffffff',
                  boxShadow: `0 0 0 2px ${themeColor}20`,
                },
              },
            }}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading || isTyping}
            variant="contained"
            sx={{
              minWidth: 48,
              height: 48,
              borderRadius: 3,
              bgcolor: themeColor,
              '&:hover': {
                bgcolor: themeColor,
                transform: 'scale(1.05)',
              },
              '&:disabled': {
                bgcolor: 'rgba(0, 0, 0, 0.12)',
              },
              transition: 'all 0.2s',
            }}
          >
            <SendIcon />
          </Button>
        </Stack>
        
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            mt: 1,
            display: 'block',
            textAlign: 'center',
            fontSize: '0.75rem',
          }}
        >
          Press Enter to send, Shift+Enter for new line
        </Typography>
      </Box>

      {/* Lead Capture Form */}
      <LeadCaptureForm
        isVisible={showLeadForm}
        onClose={handleLeadFormClose}
        onSubmit={handleLeadFormSubmit}
        themeColor={themeColor}
        font={font}
        isSubmitting={isSubmittingLead}
      />
    </Box>
  );
};

export default ChatboxLivePreview;
