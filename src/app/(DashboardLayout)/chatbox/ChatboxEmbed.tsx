'use client';
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Paper,
  Stack,
  IconButton,
  Tooltip,
  Alert,
  Box,
  Chip,
  Divider,
  TextField,
  FormControlLabel,
  Switch,
  Snackbar,
  Fade,
  Grow
} from '@mui/material';
import {
  IconCode,
  IconCopy,
  IconCheck,
  IconX,
  IconExternalLink,
  IconBrandHtml5,
  IconBrandReact,
  IconBrandWordpress,
  IconBrandSpotify,
  IconBrandWix,
  IconBrandGithub
} from '@tabler/icons-react';
import { motion } from 'framer-motion';

interface ChatboxEmbedProps {
  frontendUrl: string;
  name: string;
  backendUrl: string;
  open: boolean;
  onClose: () => void;
  themeColor?: string;
}

const ChatboxEmbed = ({
  frontendUrl,
  name,
  backendUrl,
  open,
  onClose,
  themeColor = '#6366f1'
}: ChatboxEmbedProps) => {
  const [copied, setCopied] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('html');
  const [customPosition, setCustomPosition] = useState('bottom-right');
  const [showSnackbar, setShowSnackbar] = useState(false);

  const embedCode = `<script src="${frontendUrl}/embed.js" data-name="${name}" data-endpoint="${backendUrl}"></script>`;

  const reactCode = `import { ChatWidget } from '${frontendUrl}/embed.js';

function App() {
  return (
    <div>
      <ChatWidget 
        name="${name}"
        endpoint="${backendUrl}"
        position="${customPosition}"
      />
    </div>
  );
}`;

  const platforms = [
    { id: 'html', name: 'HTML', icon: IconBrandHtml5, color: '#e34f26' },
    { id: 'react', name: 'React', icon: IconBrandReact, color: '#61dafb' },
    { id: 'wordpress', name: 'WordPress', icon: IconBrandWordpress, color: '#21759b' },
    { id: 'shopify', name: 'Shopify', icon: IconBrandSpotify, color: '#95bf47' },
    { id: 'wix', name: 'Wix', icon: IconBrandWix, color: '#000000' },
    { id: 'squarespace', name: 'Squarespace', icon: IconBrandGithub, color: '#000000' }
  ];

  const positions = [
    { value: 'bottom-right', label: 'Bottom Right' },
    { value: 'bottom-left', label: 'Bottom Left' },
    { value: 'top-right', label: 'Top Right' },
    { value: 'top-left', label: 'Top Left' }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setShowSnackbar(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCodeForPlatform = () => {
    switch (selectedPlatform) {
      case 'react':
        return reactCode;
      case 'html':
      default:
        return embedCode;
    }
  };

  const getInstallationSteps = () => {
    switch (selectedPlatform) {
      case 'html':
        return [
          'Copy the embed script below',
          'Paste it in the <head> section of your HTML',
          'The chat widget will appear automatically'
        ];
      case 'react':
        return [
          'Install the package: npm install @algoqube/chat-widget',
          'Import and use the component as shown below',
          'Customize the position and styling as needed'
        ];
      case 'wordpress':
        return [
          'Go to your WordPress admin panel',
          'Navigate to Appearance > Theme Editor',
          'Add the script to your header.php file',
          'Save and refresh your site'
        ];
      case 'shopify':
        return [
          'Go to your Shopify admin panel',
          'Navigate to Online Store > Themes',
          'Click "Actions" > "Edit code"',
          'Add the script to your theme.liquid file'
        ];
      default:
        return [
          'Copy the embed script below',
          'Add it to your website\'s HTML',
          'The chat widget will appear automatically'
        ];
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
            border: '1px solid rgba(0, 0, 0, 0.06)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${themeColor}, ${themeColor}dd)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <IconCode size={20} />
            </Box>
            <Box flex={1}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary' }}>
                Embed Chat Widget
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add your AI assistant to your website
              </Typography>
            </Box>
            <IconButton onClick={onClose} size="small">
              <IconX size={20} />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          <Stack spacing={4}>
            {/* Platform Selection */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                Choose Your Platform
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {platforms.map((platform) => {
                  const IconComponent = platform.icon;
                  return (
                    <motion.div
                      key={platform.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Chip
                        icon={<IconComponent size={16} />}
                        label={platform.name}
                        onClick={() => setSelectedPlatform(platform.id)}
                        sx={{
                          bgcolor: selectedPlatform === platform.id ? themeColor : 'rgba(0,0,0,0.04)',
                          color: selectedPlatform === platform.id ? 'white' : 'text.primary',
                          fontWeight: selectedPlatform === platform.id ? 600 : 400,
                          '&:hover': {
                            bgcolor: selectedPlatform === platform.id ? themeColor : 'rgba(0,0,0,0.08)',
                          },
                          transition: 'all 0.2s',
                        }}
                      />
                    </motion.div>
                  );
                })}
              </Stack>
            </Box>

            {/* Installation Steps */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                Installation Steps
              </Typography>
              <Stack spacing={1}>
                {getInstallationSteps().map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          bgcolor: themeColor,
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}
                      >
                        {index + 1}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {step}
                      </Typography>
                    </Stack>
                  </motion.div>
                ))}
              </Stack>
            </Box>

            {/* Position Configuration */}
            {selectedPlatform === 'react' && (
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
                  Widget Position
                </Typography>
                <FormControlLabel
                  control={
                    <TextField
                      select
                      value={customPosition}
                      onChange={(e) => setCustomPosition(e.target.value)}
                      size="small"
                      sx={{ minWidth: 200 }}
                    >
                      {positions.map((position) => (
                        <option key={position.value} value={position.value}>
                          {position.label}
                        </option>
                      ))}
                    </TextField>
                  }
                  label=""
                  sx={{ m: 0 }}
                />
              </Box>
            )}

            {/* Code Display */}
            <Box>
              <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  Embed Code
                </Typography>
                <Tooltip title="Copy code">
                  <IconButton
                    onClick={() => copyToClipboard(getCodeForPlatform())}
                    sx={{
                      bgcolor: copied ? 'success.main' : 'rgba(0,0,0,0.04)',
                      color: copied ? 'white' : 'text.primary',
                      '&:hover': {
                        bgcolor: copied ? 'success.main' : 'rgba(0,0,0,0.08)',
                      },
                    }}
                  >
                    {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                  </IconButton>
                </Tooltip>
              </Stack>
              
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  background: '#1e1e1e',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    display: 'flex',
                    gap: 0.5,
                  }}
                >
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ff5f56' }} />
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ffbd2e' }} />
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#27ca3f' }} />
                </Box>
                
                <pre style={{ 
                  margin: 0, 
                  color: '#d4d4d4', 
                  fontSize: '0.875rem',
                  lineHeight: 1.5,
                  fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}>
                  <code>{getCodeForPlatform()}</code>
                </pre>
              </Paper>
            </Box>

            {/* Help & Support */}
            <Alert 
              severity="info" 
              sx={{ 
                borderRadius: 2,
                '& .MuiAlert-icon': { color: themeColor }
              }}
              action={
                <Button 
                  color="inherit" 
                  size="small" 
                  startIcon={<IconExternalLink size={16} />}
                  onClick={() => window.open('https://docs.algoqube.ai/embedding', '_blank')}
                >
                  Docs
                </Button>
              }
            >
              <Typography variant="body2">
                Need help? Check our documentation for detailed integration guides and troubleshooting.
              </Typography>
            </Alert>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
            Close
          </Button>
          <Button
            variant="contained"
            onClick={() => copyToClipboard(getCodeForPlatform())}
            startIcon={<IconCopy size={16} />}
            sx={{
              borderRadius: 2,
              bgcolor: themeColor,
              '&:hover': { bgcolor: themeColor },
            }}
          >
            Copy Code
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setShowSnackbar(false)} 
          severity="success" 
          sx={{ width: '100%' }}
        >
          Code copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
};

export default ChatboxEmbed;
