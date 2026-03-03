// src/pages/AdminContactMessagesPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Table, TableBody, TableCell, TableHead, TableRow, Paper, IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const AdminContactMessagesPage = () => {
  const [messages, setMessages] = useState([]);

  const fetchMessages = async () => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.get('https://rifqy-api.gt.tc/api/contact', {
        headers: { Authorization: token }
      });
      setMessages(response.data);
    } catch (error) { 
      console.error("Gagal mengambil data pesan:", error);
      alert('Gagal mengambil data pesan. Mungkin sesi Anda berakhir, coba login ulang.');
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pesan ini?")) {
      const token = localStorage.getItem('authToken');
      try {
        await axios.delete(`https://rifqy-api.gt.tc/api/contact/${id}`, { headers: { Authorization: token } });
        alert('Pesan berhasil dihapus!');
        fetchMessages(); // Ambil ulang data setelah menghapus
      } catch (error) {
        alert('Gagal menghapus pesan.');
        console.error(error);
      }
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Pesan Masuk</Typography>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tanggal</TableCell>
              <TableCell>Nama</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Pesan</TableCell>
              <TableCell>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {messages.map((msg) => (
              <TableRow key={msg.id}>
                <TableCell>{new Date(msg.created_at).toLocaleString('id-ID')}</TableCell>
                <TableCell>{msg.name}</TableCell>
                <TableCell>{msg.email}</TableCell>
                <TableCell sx={{ maxWidth: 300, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{msg.message}</TableCell>
                <TableCell>
                  <Tooltip title="Hapus Pesan">
                    <IconButton color="error" onClick={() => handleDelete(msg.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default AdminContactMessagesPage;