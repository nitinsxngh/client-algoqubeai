'use client';

import React from 'react';
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
} from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

// Simulated transaction data
const transactions = [
  {
    id: 'INV-1001',
    date: '2024-06-01',
    amount: '$49.00',
    plan: 'Pro',
    paymentMethod: 'Credit Card',
    status: 'Paid',
    invoiceUrl: '#',
  },
  {
    id: 'INV-1000',
    date: '2024-05-01',
    amount: '$49.00',
    plan: 'Pro',
    paymentMethod: 'Credit Card',
    status: 'Paid',
    invoiceUrl: '#',
  },
  {
    id: 'INV-0999',
    date: '2024-04-01',
    amount: '$49.00',
    plan: 'Pro',
    paymentMethod: 'Credit Card',
    status: 'Paid',
    invoiceUrl: '#',
  },
];

const BillingPage = () => {
  return (
    <PageContainer title="Billing" description="View your billing history and invoices.">
      <DashboardCard title="Billing History">
        <Paper sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 800 }}>
            <TableHead>
              <TableRow>
                <TableCell><strong>Invoice ID</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Amount</strong></TableCell>
                <TableCell><strong>Plan</strong></TableCell>
                <TableCell><strong>Payment Method</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell align="right"><strong>Invoice</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell>{txn.id}</TableCell>
                  <TableCell>{txn.date}</TableCell>
                  <TableCell>{txn.amount}</TableCell>
                  <TableCell>{txn.plan}</TableCell>
                  <TableCell>{txn.paymentMethod}</TableCell>
                  <TableCell>
                    <Chip
                      label={txn.status}
                      color={txn.status === 'Paid' ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Button
                      variant="outlined"
                      size="small"
                      href={txn.invoiceUrl}
                      target="_blank"
                    >
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </DashboardCard>
    </PageContainer>
  );
};

export default BillingPage;
