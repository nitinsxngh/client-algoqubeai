'use client';
import React, { useState, useEffect } from 'react';
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
} from '@mui/material';

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

  const getWordCount = (text: string) =>
    text.trim().split(/\s+/).filter(Boolean).length;

  const validate = () => {
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
  };

  useEffect(() => {
    validate();
  }, [orgName, category, domainUrl, customContent, touched]);

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
                You can't change domain once entered
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
            helperText={errors.customContent}
          />
        </Stack>

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
      </Paper>
    </Box>
  );
};

export default ChatboxForm;