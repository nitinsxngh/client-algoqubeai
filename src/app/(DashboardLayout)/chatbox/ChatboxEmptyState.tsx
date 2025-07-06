'use client';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { IconPlus, IconRobot } from '@tabler/icons-react';

const ChatboxEmptyState = ({ onAdd }: { onAdd: () => void }) => (
  <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={6} border="2px dashed #ccc" borderRadius={2} textAlign="center">
    <IconButton color="primary" size="large"><IconRobot size={48} /></IconButton>
    <Typography variant="h6" mt={2} mb={1}>No Chatbot Found</Typography>
    <Typography variant="body2" color="textSecondary">Click below to create your first chatbot.</Typography>
    <Button variant="contained" startIcon={<IconPlus />} sx={{ mt: 3 }} onClick={onAdd}>Add Chatbot</Button>
  </Box>
);

export default ChatboxEmptyState;
