'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Paper,
  Stack,
  useTheme,
  Avatar,
  IconButton,
  Tooltip,
  Alert,
  Card,
  CardContent,
  Divider,
  Grid,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  PictureAsPdf as PictureAsPdfIcon,
  Receipt as ReceiptIcon,
  CreditCard as CreditCardIcon,
  TrendingUp as TrendingUpIcon,
  CalendarToday as CalendarIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  Payment as PaymentIcon,
  AccountBalance as AccountBalanceIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';

// Enhanced transaction data
const transactions = [
  {
    id: 'INV-1001',
    date: '2024-06-01',
    amount: 49.00,
    plan: 'Professional',
    paymentMethod: 'Visa ending in 4242',
    status: 'Paid',
    invoiceUrl: '#',
    description: 'Professional Plan - Monthly Subscription',
    nextBilling: '2024-07-01',
  },
  {
    id: 'INV-1000',
    date: '2024-05-01',
    amount: 49.00,
    plan: 'Professional',
    paymentMethod: 'Visa ending in 4242',
    status: 'Paid',
    invoiceUrl: '#',
    description: 'Professional Plan - Monthly Subscription',
    nextBilling: '2024-06-01',
  },
  {
    id: 'INV-0999',
    date: '2024-04-01',
    amount: 49.00,
    plan: 'Professional',
    paymentMethod: 'Visa ending in 4242',
    status: 'Paid',
    invoiceUrl: '#',
    description: 'Professional Plan - Monthly Subscription',
    nextBilling: '2024-05-01',
  },
  {
    id: 'INV-0998',
    date: '2024-03-01',
    amount: 49.00,
    plan: 'Professional',
    paymentMethod: 'Visa ending in 4242',
    status: 'Paid',
    invoiceUrl: '#',
    description: 'Professional Plan - Monthly Subscription',
    nextBilling: '2024-04-01',
  },
];

const BillingPage = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch = txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         txn.plan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || txn.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalSpent = transactions.reduce((sum, txn) => sum + txn.amount, 0);
  const averageAmount = totalSpent / transactions.length;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'failed': return 'error';
      default: return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <PageContainer title="Billing & Invoices" description="Manage your billing history and payment methods">
      <Box
        sx={{
          '@keyframes fadeInUp': {
            '0%': {
              opacity: 0,
              transform: 'translateY(20px)',
            },
            '100%': {
              opacity: 1,
              transform: 'translateY(0)',
            },
          },
        }}
      >
        <Stack spacing={4}>
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box textAlign="center" mb={4}>
            <Typography 
              variant="h3" 
              fontWeight="bold" 
              gutterBottom
              sx={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 2
              }}
            >
              Billing & Invoices
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 3, maxWidth: 600, mx: 'auto' }}>
              Track your subscription payments and download invoices
            </Typography>
          </Box>
        </motion.div>



        {/* Current Plan & Payment Method */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
              border: '1px solid rgba(0, 0, 0, 0.06)',
            }}
          >
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                  <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                    <ReceiptIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      Current Plan
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Professional Plan - ₹49/month
                    </Typography>
                  </Box>
                </Stack>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Next billing date: {formatDate('2024-07-01')}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Manage Subscription
                </Button>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                  <Avatar sx={{ bgcolor: theme.palette.success.main }}>
                    <CreditCardIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      Payment Method
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Visa ending in 4242
                    </Typography>
                  </Box>
                </Stack>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Expires: 12/25
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Update Payment Method
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
              border: '1px solid rgba(0, 0, 0, 0.06)',
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  fullWidth
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Status"
                    sx={{
                      borderRadius: 3,
                    }}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="paid">Paid</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="failed">Failed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <FormControl fullWidth>
                  <InputLabel>Date Range</InputLabel>
                  <Select
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    label="Date Range"
                    sx={{
                      borderRadius: 3,
                    }}
                  >
                    <MenuItem value="all">All Time</MenuItem>
                    <MenuItem value="30">Last 30 Days</MenuItem>
                    <MenuItem value="90">Last 90 Days</MenuItem>
                    <MenuItem value="365">Last Year</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 2 }}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<DownloadIcon />}
                  sx={{
                    borderRadius: 3,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Export
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>

        {/* Billing History Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              background: 'linear-gradient(135deg, #ffffff 0%, #fafafa 100%)',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ p: 3, borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}>
              <Typography variant="h6" fontWeight="bold">
                Billing History
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {filteredTransactions.length} invoices found
              </Typography>
            </Box>

            <Box sx={{ overflowX: 'auto', width: '100%' }}>
              <Table sx={{ minWidth: 800, width: '100%' }}>
            <TableHead>
                  <TableRow sx={{ background: 'rgba(0, 0, 0, 0.02)' }}>
                    <TableCell sx={{ fontWeight: 600, borderBottom: '2px solid rgba(0, 0, 0, 0.06)' }}>
                      Invoice
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, borderBottom: '2px solid rgba(0, 0, 0, 0.06)' }}>
                      Date
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, borderBottom: '2px solid rgba(0, 0, 0, 0.06)' }}>
                      Amount
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, borderBottom: '2px solid rgba(0, 0, 0, 0.06)' }}>
                      Plan
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, borderBottom: '2px solid rgba(0, 0, 0, 0.06)' }}>
                      Payment Method
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, borderBottom: '2px solid rgba(0, 0, 0, 0.06)' }}>
                      Status
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600, borderBottom: '2px solid rgba(0, 0, 0, 0.06)' }}>
                      Actions
                    </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
                  {filteredTransactions.map((txn, index) => (
                    <TableRow
                      key={txn.id}
                      sx={{
                        '&:hover': {
                          background: 'rgba(0, 0, 0, 0.02)',
                        },
                        animation: 'fadeInUp 0.3s ease-out',
                        animationDelay: `${index * 0.05}s`,
                        animationFillMode: 'both',
                      }}
                    >
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="600">
                            {txn.id}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {txn.description}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(txn.date)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="600">
                          {formatCurrency(txn.amount)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={txn.plan}
                          size="small"
                          sx={{
                            bgcolor: theme.palette.primary.light,
                            color: theme.palette.primary.main,
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {txn.paymentMethod}
                        </Typography>
                      </TableCell>
                  <TableCell>
                    <Chip
                      label={txn.status}
                          color={getStatusColor(txn.status) as any}
                      size="small"
                          sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title="View Invoice">
                            <IconButton
                              size="small"
                              sx={{
                                bgcolor: 'primary.light',
                                color: 'primary.main',
                                '&:hover': { bgcolor: 'primary.main', color: 'white' },
                              }}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Download PDF">
                            <IconButton
                      size="small"
                              sx={{
                                bgcolor: 'success.light',
                                color: 'success.main',
                                '&:hover': { bgcolor: 'success.main', color: 'white' },
                              }}
                            >
                              <PictureAsPdfIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
            </Box>
        </Paper>
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Alert
            severity="info"
            sx={{
              borderRadius: 4,
              '& .MuiAlert-icon': { fontSize: 28 },
            }}
          >
            <Box>
              <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                Need help with billing?
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                If you have any questions about your billing or need to update your payment method, 
                our support team is here to help.
              </Typography>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Contact Support
              </Button>
            </Box>
          </Alert>
        </motion.div>
      </Stack>
      </Box>
    </PageContainer>
  );
};

export default BillingPage;
