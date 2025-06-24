import React from 'react';
import { Typography, Paper, Box } from '@mui/material';

const AdminDashboardPage = () => {
  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Selamat Datang di Dashboard
      </Typography>
      <Typography variant="body1">
        Pilih menu di sidebar sebelah kiri untuk mulai mengelola konten website.
      </Typography>
    </Paper>
  );
};
export default AdminDashboardPage;