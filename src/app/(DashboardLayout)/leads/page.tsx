'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { authenticatedFetch } from '@/utils/api';
import ConversationsDialog from '@/app/chat/ConversationsDialog';

type Lead = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  message?: string;
  sourceMessage?: string;
  chatbotName: string;
  chatbotDisplayName?: string;
  organizationName?: string;
  conversationId?: string;
  status?: 'new' | 'in_progress' | 'contacted' | 'converted' | 'closed';
  createdAt: string;
};

const STATUS_META: Record<NonNullable<Lead['status']>, { label: string; color: 'default' | 'primary' | 'warning' | 'success' | 'error' }> = {
  new: { label: 'New', color: 'primary' },
  in_progress: { label: 'In Progress', color: 'warning' },
  contacted: { label: 'Contacted', color: 'primary' },
  converted: { label: 'Converted', color: 'success' },
  closed: { label: 'Closed', color: 'default' },
};

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
  hour: 'numeric',
  minute: '2-digit',
});

const relativeFormatter = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' });

const toRelativeTime = (dateString: string) => {
  const now = Date.now();
  const target = new Date(dateString).getTime();
  const diffMs = target - now;

  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['year', 1000 * 60 * 60 * 24 * 365],
    ['month', 1000 * 60 * 60 * 24 * 30],
    ['day', 1000 * 60 * 60 * 24],
    ['hour', 1000 * 60 * 60],
    ['minute', 1000 * 60],
    ['second', 1000],
  ];

  for (const [unit, msPerUnit] of units) {
    const delta = diffMs / msPerUnit;
    if (Math.abs(delta) >= 1 || unit === 'second') {
      return relativeFormatter.format(Math.round(delta), unit);
    }
  }

  return 'just now';
};

const LeadsPage = () => {
  const theme = useTheme();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const response = await authenticatedFetch(`${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/api/leads`, {
          method: 'GET',
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch leads (${response.status})`);
        }

        const data = await response.json();
        setLeads(data.leads ?? []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch leads:', err);
        setError('Unable to load leads. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  const groupedLeads = useMemo(() => {
    const byChatbot = new Map<string, Lead[]>();

    leads.forEach((lead) => {
      const key = lead.chatbotDisplayName || lead.organizationName || lead.chatbotName || 'Chatbot';
      if (!byChatbot.has(key)) {
        byChatbot.set(key, []);
      }
      byChatbot.get(key)?.push(lead);
    });

    return Array.from(byChatbot.entries()).map(([name, items]) => ({
      name,
      count: items.length,
      items,
    }));
  }, [leads]);

  const handleStatusChange = async (leadId: string, status: Lead['status']) => {
    try {
      setUpdatingLeadId(leadId);

      const response = await authenticatedFetch(
        `${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/api/leads/${leadId}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update lead (${response.status})`);
      }

      const data = await response.json();
      const updatedLead: Lead = data.lead;

      setLeads((prev) => prev.map((lead) => (lead._id === leadId ? { ...lead, status: updatedLead.status } : lead)));
    } catch (err) {
      console.error('Failed to update lead status:', err);
    } finally {
      setUpdatingLeadId(null);
    }
  };

  return (
    <PageContainer title="Leads" description="Captured leads from your AI assistant">
      <Box>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Leads
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Review and follow up with the prospects captured via your embedded chatbot.
            </Typography>
          </Box>

          {loading ? (
            <Box py={10} display="flex" flexDirection="column" alignItems="center" gap={2}>
              <CircularProgress />
              <Typography variant="body2" color="text.secondary">
                Fetching latest leads...
              </Typography>
            </Box>
          ) : error ? (
            <Card sx={{ borderRadius: 3, border: `1px solid ${theme.palette.error.light}` }}>
              <CardContent>
                <Typography variant="h6" color="error" gutterBottom>
                  Something went wrong
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {error}
                </Typography>
              </CardContent>
            </Card>
          ) : leads.length === 0 ? (
            <Card sx={{ borderRadius: 3, border: `1px dashed ${theme.palette.divider}`, py: 5 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  No leads captured yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Engage visitors with your chatbot to start collecting leads here.
                </Typography>
              </CardContent>
            </Card>
          ) : (
            groupedLeads.map((group) => (
              <Card key={group.name} sx={{ borderRadius: 3, overflow: 'hidden' }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        sx={{
                          bgcolor: theme.palette.primary.main,
                          color: theme.palette.primary.contrastText,
                        }}
                        variant="rounded"
                      >
                        {group.name.slice(0, 2).toUpperCase()}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight={700}>
                          {group.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {group.count} lead{group.count === 1 ? '' : 's'} captured
                        </Typography>
                      </Box>
                    </Stack>
                    <Chip label="Active" color="success" variant="outlined" />
                  </Stack>

                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Email</TableCell>
                          <TableCell>Phone</TableCell>
                          <TableCell>Company</TableCell>
                          <TableCell>Message</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Captured</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {group.items.map((lead) => {
                          const rawStatus = lead.status as Lead['status'] | undefined;
                          const currentStatus: Lead['status'] = rawStatus && STATUS_META[rawStatus] ? rawStatus : 'new';
                          const statusMeta = STATUS_META[currentStatus];

                          return (
                          <TableRow
                            key={lead._id}
                            hover
                            sx={{ cursor: 'pointer' }}
                            onClick={() => setSelectedLead(lead)}
                          >
                            <TableCell>
                              <Stack spacing={0.5}>
                                <Typography fontWeight={600}>{lead.name}</Typography>
                                {lead.sourceMessage && (
                                  <Typography variant="caption" color="text.secondary">
                                    Asked: {lead.sourceMessage}
                                  </Typography>
                                )}
                              </Stack>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">{lead.email}</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">{lead.phone}</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">{lead.company}</Typography>
                            </TableCell>
                            <TableCell sx={{ maxWidth: 260 }}>
                              <Typography variant="body2" color="text.secondary" noWrap title={lead.message}>
                                {lead.message || '—'}
                              </Typography>
                            </TableCell>
                            <TableCell>
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                onClick={(event) => event.stopPropagation()}
                              >
                                <Chip
                                  label={statusMeta.label}
                                  color={statusMeta.color}
                                  variant={currentStatus === 'new' ? 'filled' : 'outlined'}
                                  size="small"
                                  onClick={(event) => event.stopPropagation()}
                                />
                                <FormControl size="small" sx={{ minWidth: 140 }}>
                                  <Select
                                    value={currentStatus}
                                    onChange={(event: SelectChangeEvent<Lead['status']>) =>
                                      handleStatusChange(lead._id, event.target.value as Lead['status'])
                                    }
                                    disabled={updatingLeadId === lead._id}
                                    onClick={(event) => event.stopPropagation()}
                                  >
                                    {Object.entries(STATUS_META).map(([value, meta]) => (
                                      <MenuItem key={value} value={value}>
                                        {meta.label}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              </Stack>
                            </TableCell>
                            <TableCell>
                              <Stack spacing={0.5}>
                                <Typography variant="body2">
                                  {dateFormatter.format(new Date(lead.createdAt))}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {toRelativeTime(lead.createdAt)}
                                </Typography>
                              </Stack>
                            </TableCell>
                          </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            ))
          )}
        </Stack>
        <ConversationsDialog
          open={Boolean(selectedLead)}
          onClose={() => setSelectedLead(null)}
          chatboxId={selectedLead?.chatbotName ?? ''}
          leadName={selectedLead?.name ?? ''}
          chatbotDisplayName={selectedLead?.chatbotDisplayName}
          conversationId={selectedLead?.conversationId}
        />
      </Box>
    </PageContainer>
  );
};

export default LeadsPage;

