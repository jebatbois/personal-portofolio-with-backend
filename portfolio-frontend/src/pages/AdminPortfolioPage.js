import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Box, Table, TableBody, TableCell, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const AdminPortfolioPage = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [formState, setFormState] = useState({ project_name: '', description: '', image_url: '', project_link: '', tags: '' });
  
  const fetchPortfolios = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/portfolio');
      setPortfolios(response.data);
    } catch (error) { console.error("Gagal fetch portfolio:", error); }
  };

  useEffect(() => { fetchPortfolios(); }, []);

  const handleInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    try {
      await axios.post('http://localhost:5000/api/portfolio', formState, { headers: { Authorization: token } });
      alert('Proyek berhasil ditambahkan!');
      setFormState({ project_name: '', description: '', image_url: '', project_link: '', tags: '' });
      fetchPortfolios();
    } catch (error) {
      alert('Gagal menambah proyek.');
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus proyek ini?")) {
      const token = localStorage.getItem('authToken');
      try {
        await axios.delete(`http://localhost:5000/api/portfolio/${id}`, { headers: { Authorization: token } });
        alert('Proyek berhasil dihapus!');
        fetchPortfolios();
      } catch (error) {
        alert('Gagal menghapus proyek.');
        console.error(error);
      }
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Manajemen Portfolio</Typography>
      <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="h6">Tambah Proyek Baru</Typography>
          <TextField label="Nama Proyek" name="project_name" value={formState.project_name} onChange={handleInputChange} fullWidth margin="normal" required />
          <TextField label="Deskripsi" name="description" value={formState.description} onChange={handleInputChange} fullWidth margin="normal" multiline rows={4} />
          <TextField label="URL Gambar" name="image_url" value={formState.image_url} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField label="Link Proyek" name="project_link" value={formState.project_link} onChange={handleInputChange} fullWidth margin="normal" />
          <TextField label="Tags (pisahkan koma)" name="tags" value={formState.tags} onChange={handleInputChange} fullWidth margin="normal" />
          <Button type="submit" variant="contained" color="primary">Tambah Proyek</Button>
        </Box>
      </Paper>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nama Proyek</TableCell><TableCell>Tags</TableCell><TableCell>Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {portfolios.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.project_name}</TableCell>
                <TableCell>{p.tags}</TableCell>
                <TableCell>
                  <IconButton color="primary"><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(p.id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};
export default AdminPortfolioPage;