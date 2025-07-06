'use client';
import React, { useState, useEffect } from 'react';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import ChatboxEmptyState from './ChatboxEmptyState';
import ChatboxForm from './ChatboxForm';
import ChatboxDetails from './ChatboxDetails';
import AIChatLoader from './AIChatLoader';
import { Fade, Slide, Box, Typography } from '@mui/material';

const ChatboxPage = () => {
  const [chatbox, setChatbox] = useState<any>(undefined);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [currentStatusIndex, setCurrentStatusIndex] = useState<number>(0);

  const [orgName, setOrgName] = useState('');
  const [category, setCategory] = useState('');
  const [domainUrl, setDomainUrl] = useState('');
  const [customContent, setCustomContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [allowAutoScrape, setAllowAutoScrape] = useState(false);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT!;
  const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL!;

  const statusSteps = [
    'Initializing setup...',
    'Processing input details...',
    'Training and optimizing response logic...',
    'Finalizing knowledge base...',
    'Chatbox successfully configured. Ready to respond.',
  ];

  const fetchChatbox = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/chatboxes`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`Fetch error ${res.status}`);
      const data = await res.json();
      setChatbox(data);
    } catch (err) {
      console.error(err);
      setChatbox(null);
    }
  };

  useEffect(() => {
    fetchChatbox();
  }, []);

  const handleSave = async () => {
    if (!orgName || !category || !domainUrl) {
      alert('Please fill all required fields');
      return;
    }

    const payload = {
      organizationName: orgName,
      category,
      domainUrl,
      customContent,
      status: 'active',
      textFont: 'default',
      themeColor: '#000000',
      displayName: orgName,
      allowAutoScrape,
    };

    try {
      setIsSaving(true);
      const endpoint = isEditing
        ? `${BACKEND_URL}/api/chatboxes/${chatbox._id}`
        : `${BACKEND_URL}/api/chatboxes`;

      const res = await fetch(endpoint, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Save failed');

      const data = await res.json();
      setChatbox(data.chatbox);
      setShowForm(false);
      setIsEditing(false);
      setIsSaving(false);

      // Start finalizing animation
      setIsFinalizing(true);
      setCurrentStatusIndex(0);

      let step = 0;
      const interval = setInterval(() => {
        if (step < statusSteps.length - 1) {
          setCurrentStatusIndex(step);
          step++;
        } else {
          clearInterval(interval);
          setCurrentStatusIndex(step);
          setTimeout(() => {
            setIsFinalizing(false);
          }, 1000);
        }
      }, 1600);
    } catch (err) {
      alert(`Error ${isEditing ? 'updating' : 'creating'} chatbot`);
      console.error(err);
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this chatbot?')) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/chatboxes/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Delete failed');
      setChatbox(null);
    } catch (err) {
      alert('Error deleting chatbot');
      console.error(err);
    }
  };

  const chatbotExists = !!chatbox && chatbox._id;

  return (
    <PageContainer title="Chatbox" description="Manage your chatbot here.">
      <DashboardCard title="Chatbox Manager">
        {chatbox === undefined ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
            <AIChatLoader />
          </Box>
        ) : !chatbotExists && !showForm ? (
          <ChatboxEmptyState
            onAdd={() => {
              setOrgName('');
              setCategory('');
              setDomainUrl('');
              setCustomContent('');
              setFile(null);
              setAllowAutoScrape(false);
              setIsEditing(false);
              setShowForm(true);
            }}
          />
        ) : showForm ? (
          <Fade in timeout={400}>
            <div>
              <ChatboxForm
                orgName={orgName}
                setOrgName={setOrgName}
                category={category}
                setCategory={setCategory}
                domainUrl={domainUrl}
                setDomainUrl={setDomainUrl}
                customContent={customContent}
                setCustomContent={setCustomContent}
                setFile={setFile}
                handleSave={handleSave}
                onCancel={() => {
                  setShowForm(false);
                  setIsEditing(false);
                }}
                isEditing={isEditing}
                allowAutoScrape={allowAutoScrape}
                setAllowAutoScrape={setAllowAutoScrape}
                isSaving={isSaving}
              />
            </div>
          </Fade>
        ) : isFinalizing ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight={200}
            sx={{ transition: 'height 0.3s ease' }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 500, fontSize: '1.1rem', textAlign: 'center' }}
            >
              {statusSteps[currentStatusIndex]}
            </Typography>
          </Box>
        ) : (
          <Slide direction="up" in={chatbotExists} mountOnEnter unmountOnExit>
            <div>
              <ChatboxDetails
                chatbox={chatbox}
                onDelete={handleDelete}
                onEdit={() => {
                  setOrgName(chatbox.organizationName);
                  setCategory(chatbox.category);
                  setDomainUrl(chatbox.domainUrl);
                  setCustomContent(chatbox.customContent);
                  setAllowAutoScrape(chatbox.allowAutoScrape ?? false);
                  setFile(null);
                  setIsEditing(true);
                  setShowForm(true);
                }}
                frontendUrl={FRONTEND_URL}
              />
            </div>
          </Slide>
        )}
      </DashboardCard>
    </PageContainer>
  );
};

export default ChatboxPage;
