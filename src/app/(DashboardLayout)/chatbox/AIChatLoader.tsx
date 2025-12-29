'use client';
import React from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

const AIChatLoader = () => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2} py={6}>
      <CircularProgress thickness={4} sx={{ color: '#5C6BC0' }} />

      <Typography variant="subtitle1" color="text.secondary">
        Initializing your AI Chatbot...
      </Typography>

      <Box display="flex" gap={1}>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            initial={{ y: 0 }}
            animate={{ y: [-2, -6, 0] }}
            transition={{
              repeat: Infinity,
              repeatType: 'loop',
              duration: 0.8,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: '#5C6BC0',
              display: 'inline-block',
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default AIChatLoader;