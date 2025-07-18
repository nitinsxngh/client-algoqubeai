'use client';
import { Paper, Button, Typography } from '@mui/material';

const ChatboxEmbed = ({
  frontendUrl,
  name,
  backendUrl,
}: {
  frontendUrl: string;
  name: string;
  backendUrl: string;
}) => {
  const embedCode = `<script src="${frontendUrl}/embed.js" data-name="${name}" data-endpoint="${backendUrl}"></script>`;

  return (
    <>
      <Typography variant="subtitle1" mt={4}>
        Embed This Chatbot:
      </Typography>
      <Paper variant="outlined" sx={{ p: 2, mt: 1, backgroundColor: '#f0f0f0' }}>
        <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>
          <code>{embedCode}</code>
        </pre>
      </Paper>
      <Button
        variant="text"
        size="small"
        sx={{ mt: 1 }}
        onClick={() => navigator.clipboard.writeText(embedCode)}
      >
        Copy Embed Script
      </Button>
    </>
  );
};

export default ChatboxEmbed;
