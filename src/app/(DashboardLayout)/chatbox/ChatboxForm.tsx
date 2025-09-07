'use client';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  Stack,
  Paper,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  FormHelperText,
  FormControlLabel,
  Switch,
  CircularProgress,
  Chip,
  Avatar,
  Tooltip,
  Alert,
} from '@mui/material';
import {
  IconPlus,
  IconPalette,
  IconEye,
  IconRefresh
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { authenticatedFetch } from '@/utils/api';

type Props = {
  orgName: string;
  setOrgName: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
  domainUrl: string;
  setDomainUrl: (val: string) => void;
  customContent: string;
  setCustomContent: (val: string) => void;
  setFile: (val: File | null) => void;
  handleSave: () => void;
  onCancel: () => void;
  isEditing: boolean;
  allowAutoScrape: boolean;
  setAllowAutoScrape: (val: boolean) => void;
  isSaving: boolean; // ✅ Loader prop
  themeColor: string;
  setThemeColor: (val: string) => void;
  // Scraping props
  isScraping: boolean;
  scrapeStatus: string;
  onScrapeWebsite: (url: string) => Promise<string>;
};

const ChatboxForm = ({
  orgName,
  setOrgName,
  category,
  setCategory,
  domainUrl,
  setDomainUrl,
  customContent,
  setCustomContent,
  setFile,
  handleSave,
  onCancel,
  isEditing,
  allowAutoScrape,
  setAllowAutoScrape,
  isSaving,
  themeColor,
  setThemeColor,
  isScraping,
  scrapeStatus,
  onScrapeWebsite,
}: Props) => {
  const [errors, setErrors] = useState({
    orgName: '',
    category: '',
    domainUrl: '',
    customContent: '',
  });

  const [touched, setTouched] = useState({
    orgName: false,
    category: false,
    domainUrl: false,
    customContent: false,
  });

  const [suggestedColors, setSuggestedColors] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState('');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const getWordCount = (text: string) =>
    text.trim().split(/\s+/).filter(Boolean).length;

  const validate = useCallback(() => {
    const newErrors = { orgName: '', category: '', domainUrl: '', customContent: '' };

    if (touched.orgName) {
      if (!orgName.trim()) newErrors.orgName = 'Organization Name is required';
      else if (orgName.length > 30)
        newErrors.orgName = 'Must be 30 characters or fewer';
    }

    if (touched.category && !category) {
      newErrors.category = 'Please select a category';
    }

    if (touched.domainUrl && !domainUrl.trim()) {
      newErrors.domainUrl = 'Domain URL is required';
    }

    if (touched.customContent) {
      const wordCount = getWordCount(customContent);
      if (wordCount < 500) {
        newErrors.customContent = `Minimum 500 words required (currently ${wordCount})`;
      }
    }

    setErrors(newErrors);
    return newErrors;
  }, [orgName, category, domainUrl, customContent, touched]);

  // Function to extract colors from image data
  const extractColorsFromImage = (imageData: ImageData): string[] => {
    const data = imageData.data;
    const colors: { [key: string]: number } = {};

    // Sample pixels (every 10th pixel to improve performance)
    for (let i = 0; i < data.length; i += 40) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Skip white, black, and very light/dark colors
      const brightness = (r + g + b) / 3;
      if (brightness < 30 || brightness > 225) continue;

      // Create color key with reduced precision for grouping similar colors
      const colorKey = `${Math.floor(r / 10) * 10},${Math.floor(g / 10) * 10},${Math.floor(b / 10) * 10}`;
      colors[colorKey] = (colors[colorKey] || 0) + 1;
    }

    // Sort by frequency and convert to hex
    const sortedColors = Object.entries(colors)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([colorKey]) => {
        const [r, g, b] = colorKey.split(',').map(Number);
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      });

    return sortedColors;
  };

  // Function to analyze website colors
  const analyzeWebsiteColors = async (url: string) => {
    if (!url) return;

    setIsAnalyzing(true);
    setAnalysisError('');

    try {
      const response = await authenticatedFetch(`${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/api/chatboxes/analyze-colors?url=${encodeURIComponent(url)}`, {
        method: 'GET',
      });
      
      if (response.ok) {
        const data = await response.json();
        setSuggestedColors(data.colors || []);
      } else {
        setSuggestedColors([]);
      }
    } catch (error) {
      console.error('Error analyzing website colors:', error);
      setAnalysisError('Could not analyze website colors. Using default suggestions.');

      // Default color suggestions
      setSuggestedColors(['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Analyze colors when domain URL changes
  useEffect(() => {
    if (domainUrl && domainUrl.includes('.')) {
      const timeoutId = setTimeout(() => {
        analyzeWebsiteColors(domainUrl);
      }, 1000); // Debounce for 1 second
      
      return () => clearTimeout(timeoutId);
    }
  }, [domainUrl]);

  // Set initial theme color when suggested colors are loaded
  useEffect(() => {
    if (suggestedColors.length > 0 && !selectedColor) {
      const firstColor = suggestedColors[0];
      setSelectedColor(firstColor);
      setThemeColor(firstColor);
    }
  }, [suggestedColors, selectedColor, setThemeColor]);


  useEffect(() => {
    validate();
  }, [validate]);

  const onSubmit = () => {
    setTouched({
      orgName: true,
      category: true,
      domainUrl: true,
      customContent: true,
    });

    const finalErrors = validate();
    const hasError = Object.values(finalErrors).some((e) => e);
    if (!hasError) {
      handleSave();
    }
  };

  return (
    <Box maxWidth={800} width="100%" mx="auto">
      <Stack spacing={4}>
        {/* Basic Information Section */}
        <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid rgba(0,0,0,0.06)' }}>
          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: '#6366f1' }}>
              📋
            </Avatar>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Basic Information
            </Typography>
          </Stack>

          <Stack spacing={3}>
          <TextField
            label="Organization Name"
            fullWidth
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, orgName: true }))}
            error={!!errors.orgName}
            helperText={errors.orgName}
          />

          <FormControl fullWidth error={!!errors.category}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, category: true }))}
            >
              <MenuItem value="">
                <em>Select a category</em>
              </MenuItem>
              <MenuItem value="Support">Support</MenuItem>
              <MenuItem value="Sales">Sales</MenuItem>
              <MenuItem value="FAQ">FAQ</MenuItem>
              <MenuItem value="Feedback">Feedback</MenuItem>
            </Select>
            <FormHelperText>{errors.category}</FormHelperText>
          </FormControl>

          <Box>
            <Stack direction="row" justifyContent="space-between" spacing={2}>
              <Typography variant="caption" color="text.secondary">
                You can not change domain once entered
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={allowAutoScrape}
                    onChange={(e) => setAllowAutoScrape(e.target.checked)}
                    color="primary"
                  />
                }
                label="Allow Auto Scrape"
              />
            </Stack>
            
            {allowAutoScrape && (
              <Alert severity="info" sx={{ mt: 1, borderRadius: 2 }}>
                <Typography variant="body2">
                  <strong>Auto-scraping enabled!</strong> When you save, the system will automatically scrape content from the website and populate the content field. You can still manually edit the content if needed.
                </Typography>
              </Alert>
            )}

            <TextField
              label="Domain URL"
              fullWidth
              value={domainUrl}
              onChange={(e) => setDomainUrl(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, domainUrl: true }))}
              disabled={isEditing}
              error={!!errors.domainUrl}
              helperText={errors.domainUrl}
            />

            {/* Scraping Button and Status */}
            {domainUrl && !isEditing && (
              <Box sx={{ mt: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={async () => {
                      if (domainUrl) {
                        const scrapedContent = await onScrapeWebsite(domainUrl);
                        if (scrapedContent) {
                          setCustomContent(scrapedContent);
                        }
                      }
                    }}
                    disabled={isScraping || !domainUrl.trim()}
                    startIcon={isScraping ? <CircularProgress size={16} /> : <IconRefresh size={16} />}
                    sx={{ minWidth: 120 }}
                  >
                    {isScraping ? 'Scraping...' : 'Scrape Content'}
                  </Button>
                  
                  {scrapeStatus && (
                    <Typography 
                      variant="caption" 
                      color={scrapeStatus.includes('✅') ? 'success.main' : scrapeStatus.includes('❌') ? 'error.main' : 'text.secondary'}
                      sx={{ 
                        flex: 1,
                        fontStyle: scrapeStatus.includes('✅') || scrapeStatus.includes('❌') ? 'normal' : 'italic'
                      }}
                    >
                      {scrapeStatus}
                    </Typography>
                  )}
                </Stack>
              </Box>
            )}
          </Box>

          {/* Color Suggestions */}
          {suggestedColors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Box sx={{ mt: 2 }}>
                <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                  <IconPalette size={16} color="#6366f1" />
                  <Typography variant="subtitle2" sx={{ fontWeight: 500 }}>
                    Suggested Colors from Website
                  </Typography>
                  {isAnalyzing && <CircularProgress size={14} />}
                </Stack>

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {suggestedColors.map((color, index) => (
                    <Tooltip key={color} title={`Click to use ${color}`}>
                      <Box
                        onClick={() => {
                          setSelectedColor(color);
                          setThemeColor(color);
                        }}
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          bgcolor: color,
                          cursor: 'pointer',
                          border: selectedColor === color ? '3px solid white' : '2px solid transparent',
                          boxShadow: selectedColor === color 
                            ? `0 0 0 2px ${color}, 0 4px 12px ${color}40`
                            : '0 2px 8px rgba(0,0,0,0.1)',
                          transition: 'all 0.2s',
                          '&:hover': {
                            transform: 'scale(1.1)',
                            boxShadow: `0 4px 16px ${color}40`,
                          },
                        }}
                      />
                    </Tooltip>
                  ))}
                </Stack>

                {/* Theme Color Display */}
                {selectedColor && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 1 }}>
                      Selected Theme Color: {selectedColor}
                    </Typography>
                    <Box
                      sx={{
                        width: '100%',
                        height: 40,
                        borderRadius: 2,
                        bgcolor: selectedColor,
                        border: '2px solid rgba(0,0,0,0.1)',
                      }}
                    />
                  </Box>
                )}

                {analysisError && (
                  <Alert severity="info" sx={{ mt: 1, borderRadius: 2 }}>
                    {analysisError}
                  </Alert>
                )}
              </Box>
            </motion.div>
          )}

          <Button variant="outlined" component="label">
            Upload File
            <input
              type="file"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setFile(file);
              }}
            />
          </Button>

          <TextField
            label="Custom Content"
            multiline
            rows={6}
            fullWidth
            value={customContent}
            onChange={(e) => setCustomContent(e.target.value)}
            onBlur={() => setTouched((prev) => ({ ...prev, customContent: true }))}
            error={!!errors.customContent}
            helperText={
              errors.customContent || 
              (customContent && `Content length: ${customContent.length} characters (${Math.ceil(customContent.length / 5)} words)`)
            }
          />
          
          {customContent && customContent.includes('Content scraped from:') && (
            <Alert severity="success" sx={{ mt: 1, borderRadius: 2 }}>
              <Typography variant="body2">
                <strong>✅ Content successfully scraped!</strong> The content above was automatically extracted from the website. You can edit it manually if needed.
              </Typography>
            </Alert>
          )}
        </Stack>
      </Paper>

      {/* Action Buttons */}
      <Stack direction="row" justifyContent="flex-end" spacing={2}>
        <Button onClick={onCancel} disabled={isSaving}>Cancel</Button>
        <Button
          variant="contained"
          onClick={onSubmit}
          disabled={isSaving || Object.values(errors).some((e) => e)}
          startIcon={isSaving && <CircularProgress size={16} />}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </Stack>
    </Stack>
  </Box>
  );
};

export default ChatboxForm;