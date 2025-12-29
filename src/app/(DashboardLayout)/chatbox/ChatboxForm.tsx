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
  IconButton,
} from '@mui/material';
import {
  IconPlus,
  IconPalette,
  IconEye,
  IconRefresh,
  IconUpload,
  IconX,
  IconPhoto,
  IconFileText
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
  // Image upload props
  organizationImage: string | null;
  setOrganizationImage: (val: string | null) => void;
  organizationImageFile: File | null;
  setOrganizationImageFile: (val: File | null) => void;
  chatboxId?: string;
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
  organizationImage,
  setOrganizationImage,
  organizationImageFile,
  setOrganizationImageFile,
  chatboxId,
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
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(organizationImage || null);
  const [documentFiles, setDocumentFiles] = useState<File[]>([]);
  const [isUploadingDocument, setIsUploadingDocument] = useState(false);
  const [documentUploadStatus, setDocumentUploadStatus] = useState<string>('');

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT!;

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

  // Update image preview when organizationImage changes
  useEffect(() => {
    setImagePreview(organizationImage);
  }, [organizationImage]);

  // Handle image file selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit.');
      return;
    }

    setOrganizationImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle image upload to backend
  const handleImageUpload = async () => {
    if (!organizationImageFile || !chatboxId) return;

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', organizationImageFile);

      const res = await authenticatedFetch(`${BACKEND_URL}/api/chatboxes/${chatboxId}/upload-image`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to upload image');
      }

      const data = await res.json();
      setOrganizationImage(data.imageUrl);
      setImagePreview(data.imageUrl);
      alert('Image uploaded successfully!');
    } catch (err: any) {
      console.error('Image upload error:', err);
      alert(err.message || 'Failed to upload image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Handle document file selection (multiple files)
  const handleDocumentSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach((file) => {
      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name}: Invalid file type. Only PDF and Word documents are allowed.`);
        return;
      }

      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        errors.push(`${file.name}: File size exceeds 10MB limit.`);
        return;
      }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      alert(errors.join('\n'));
    }

    if (validFiles.length > 0) {
      setDocumentFiles((prev) => [...prev, ...validFiles]);
      setDocumentUploadStatus('');
    }

    // Reset input so same files can be selected again if needed
    e.target.value = '';
  };

  // Handle document upload and text extraction (multiple files)
  const handleDocumentUpload = async () => {
    if (documentFiles.length === 0 || !orgName) {
      alert('Please select at least one document and ensure organization name is filled.');
      return;
    }

    setIsUploadingDocument(true);
    setDocumentUploadStatus(`Uploading and processing ${documentFiles.length} document(s)...`);
    
    try {
      const formData = new FormData();
      // Append all files with the same field name 'documents'
      documentFiles.forEach((file) => {
        formData.append('documents', file);
      });
      formData.append('organizationName', orgName);

      const res = await authenticatedFetch(`${BACKEND_URL}/api/chatboxes/upload-document`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to upload documents');
      }

      const data = await res.json();
      
      // Merge extracted text with existing custom content
      const existingContent = customContent || '';
      const mergedContent = existingContent && data.extractedText
        ? `${existingContent}\n\n${data.extractedText}`
        : existingContent || data.extractedText || '';
      
      if (data.extractedText) {
        setCustomContent(mergedContent);
      }

      // Build status message
      let statusMessage = `✅ ${data.documentsProcessed || documentFiles.length} document(s) processed successfully!`;
      if (data.extractedTextLength) {
        statusMessage += ` Extracted ${data.extractedTextLength} characters.`;
      }
      if (data.errors && data.errors.length > 0) {
        statusMessage += `\n⚠️ Some errors: ${data.errors.join(', ')}`;
      }
      
      setDocumentUploadStatus(statusMessage);
      setDocumentFiles([]); // Clear selected files
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"][accept*="pdf"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err: any) {
      console.error('Document upload error:', err);
      setDocumentUploadStatus(`❌ Error: ${err.message || 'Failed to upload documents'}`);
    } finally {
      setIsUploadingDocument(false);
    }
  };

  // Remove a document from the list
  const handleRemoveDocument = (index: number) => {
    setDocumentFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove image
  const handleRemoveImage = () => {
    setOrganizationImageFile(null);
    setImagePreview(null);
    setOrganizationImage(null);
  };


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

          {/* Organization Image Upload */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
              Organization Logo/Image
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Upload an image that will be displayed in the chatbox header and chat page. Supported formats: JPEG, PNG, GIF, WebP (Max 5MB)
            </Typography>

            {imagePreview ? (
              <Box sx={{ mb: 2 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    border: '1px solid rgba(0,0,0,0.1)',
                    display: 'inline-block',
                    position: 'relative',
                  }}
                >
                  <Box
                    component="img"
                    src={imagePreview}
                    alt="Organization preview"
                    sx={{
                      maxWidth: 200,
                      maxHeight: 200,
                      borderRadius: 2,
                      objectFit: 'contain',
                    }}
                  />
                  {organizationImageFile && !organizationImage && isEditing && chatboxId && (
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleImageUpload}
                        disabled={isUploadingImage}
                        startIcon={isUploadingImage ? <CircularProgress size={16} /> : <IconUpload size={16} />}
                      >
                        {isUploadingImage ? 'Uploading...' : 'Upload Image'}
                      </Button>
                    </Box>
                  )}
                  <IconButton
                    size="small"
                    onClick={handleRemoveImage}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      bgcolor: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' },
                    }}
                  >
                    <IconX size={16} />
                  </IconButton>
                </Paper>
              </Box>
            ) : (
              <Button
                variant="outlined"
                component="label"
                startIcon={<IconPhoto size={20} />}
                sx={{ mb: 2 }}
              >
                Upload Organization Image
                <input
                  type="file"
                  hidden
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleImageSelect}
                />
              </Button>
            )}
          </Box>

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

          {/* Document Upload Section */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Upload Documents (PDF/Word)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Upload one or more PDF or Word documents to extract content and add it to your custom content. Supported formats: PDF, DOC, DOCX (Max 10MB per file)
            </Typography>

            <Stack spacing={2}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<IconFileText size={20} />}
                  disabled={isUploadingDocument || !orgName}
                >
                  {documentFiles.length > 0 
                    ? `Add More Documents (${documentFiles.length} selected)`
                    : 'Select Document(s)'}
                  <input
                    type="file"
                    hidden
                    multiple
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={handleDocumentSelect}
                  />
                </Button>

                {documentFiles.length > 0 && (
                  <Button
                    variant="contained"
                    onClick={handleDocumentUpload}
                    disabled={isUploadingDocument || !orgName}
                    startIcon={isUploadingDocument ? <CircularProgress size={16} /> : <IconUpload size={16} />}
                  >
                    {isUploadingDocument ? `Processing ${documentFiles.length} file(s)...` : `Upload & Extract Text (${documentFiles.length} file(s))`}
                  </Button>
                )}
              </Stack>

              {/* Display selected files */}
              {documentFiles.length > 0 && (
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                    Selected Documents:
                  </Typography>
                  <Stack spacing={1}>
                    {documentFiles.map((file, index) => (
                      <Paper
                        key={index}
                        elevation={0}
                        sx={{
                          p: 1.5,
                          borderRadius: 1,
                          border: '1px solid rgba(0,0,0,0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1 }}>
                          <IconFileText size={20} color="#666" />
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography variant="body2" noWrap>
                              {file.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </Typography>
                          </Box>
                        </Stack>
                        <IconButton
                          size="small"
                          onClick={() => handleRemoveDocument(index)}
                          disabled={isUploadingDocument}
                          sx={{ ml: 1 }}
                        >
                          <IconX size={16} />
                        </IconButton>
                      </Paper>
                    ))}
                  </Stack>
                </Box>
              )}

              {documentUploadStatus && (
                <Alert 
                  severity={documentUploadStatus.includes('✅') ? 'success' : documentUploadStatus.includes('❌') ? 'error' : 'info'} 
                  sx={{ mt: 1, borderRadius: 2 }}
                >
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-line' }}>
                    {documentUploadStatus}
                  </Typography>
                </Alert>
              )}
            </Stack>
          </Box>
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