'use client';
import { Paper, Button, Typography } from '@mui/material';

const ChatboxEmbed = ({ frontendUrl, name }: { frontendUrl: string; name: string }) => {
  const embedCode = `<script src="${frontendUrl}/embed.js" data-name="${name}"></script>`;

  return (
    <>
      <Typography variant="subtitle1" mt={4}>Embed This Chatbot:</Typography>
      <Paper variant="outlined" sx={{ p: 2, mt: 1, backgroundColor: '#f0f0f0' }}>
        <code style={{ wordBreak: 'break-all' }}>{embedCode}</code>
      </Paper>
      <Button variant="text" size="small" sx={{ mt: 1 }} onClick={() => navigator.clipboard.writeText(embedCode)}>
        Copy Embed Script
      </Button>
    </>
  );
};

export default ChatboxEmbed;
