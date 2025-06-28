// src/pages/AdminArticlesPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Typography, TextField, Button, Box, Table, TableBody, TableCell, TableHead, TableRow, Paper, IconButton,
  Select, MenuItem, FormControl, InputLabel,
  LinearProgress, Alert,
  Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const BACKEND_URL = 'http://localhost:5000';

const defaultForm = {
  title_id: '',
  title_en: '',
  summary_id: '',
  summary_en: '',
  content_id: '',
  content_en: '',
  thumbnail_url: '',
  status: 'draft'
};

const AdminArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State untuk Dialog & Form
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [thumbnailFile, setThumbnailFile] = useState(null);

  const fetchArticles = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('authToken');
    if (!token) {
      setError("Autentikasi tidak ditemukan. Silakan login ulang.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${BACKEND_URL}/api/articles/admin/all`, {
        headers: { Authorization: token }
      });
      setArticles(response.data);
    } catch (err) {
      setError("Gagal memuat data artikel.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const resetAndClose = () => {
    setIsDialogOpen(false);
    setIsEditMode(false);
    setFormData(defaultForm);
    setThumbnailFile(null);
    setIsSubmitting(false);
  };

  const handleOpenAddDialog = () => {
    setFormData(defaultForm);
    setThumbnailFile(null);
    setIsEditMode(false);
    setIsDialogOpen(true);
  };

  const handleOpenEditDialog = (article) => {
    setFormData({
      id: article.id,
      title_id: article.title_id || '',
      title_en: article.title_en || '',
      summary_id: article.summary_id || '',
      summary_en: article.summary_en || '',
      content_id: article.content_id || '',
      content_en: article.content_en || '',
      thumbnail_url: article.thumbnail_url || '',
      status: article.status
    });
    setThumbnailFile(null);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => setThumbnailFile(e.target.files[0]);

  // Helper untuk upload file thumbnail
  const uploadThumbnail = async (file) => {
    const token = localStorage.getItem('authToken');
    const formData = new FormData();
    formData.append('image', file);
    const res = await axios.post(`${BACKEND_URL}/api/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data', Authorization: token },
    });
    return res.data.filePath;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem('authToken');
    let thumbnail_url = formData.thumbnail_url;

    try {
      // Upload thumbnail jika ada file baru
      if (thumbnailFile) {
        thumbnail_url = await uploadThumbnail(thumbnailFile);
      }

      // Tambah artikel baru
      await axios.post(`${BACKEND_URL}/api/articles`, {
        ...formData,
        thumbnail_url
      }, {
        headers: { Authorization: token }
      });

      fetchArticles();
      resetAndClose();
    } catch (error) {
      alert('Gagal menambah artikel.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem('authToken');
    let thumbnail_url = formData.thumbnail_url;

    try {
      // Upload thumbnail jika ada file baru
      if (thumbnailFile) {
        thumbnail_url = await uploadThumbnail(thumbnailFile);
      }

      await axios.put(`${BACKEND_URL}/api/articles/${formData.id}`, {
        ...formData,
        thumbnail_url
      }, {
        headers: { Authorization: token }
      });

      fetchArticles();
      resetAndClose();
    } catch (error) {
      alert('Gagal mengupdate artikel.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus artikel ini?')) return;
    const token = localStorage.getItem('authToken');
    try {
      await axios.delete(`${BACKEND_URL}/api/articles/${id}`, {
        headers: { Authorization: token }
      });
      setArticles(articles.filter(a => a.id !== id));
    } catch (error) {
      alert('Gagal menghapus artikel.');
      console.error(error);
    }
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" gutterBottom>Manajemen Artikel</Typography>
        <Button variant="contained" onClick={handleOpenAddDialog}>Tambah Artikel Baru</Button>
      </Box>

      {/* --- BAGIAN INI YANG MENAMPILKAN DATA --- */}
      {loading && <LinearProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      
      {!loading && !error && (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Judul</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Dibuat</TableCell>
                <TableCell align="right">Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {articles.map((article) => (
                <TableRow key={article.id} hover>
                  <TableCell>{article.title}</TableCell>
                  <TableCell>
                    <Box 
                      component="span"
                      sx={{
                        bgcolor: article.status === 'published' ? 'success.light' : 'warning.light',
                        color: article.status === 'published' ? 'success.dark' : 'warning.dark',
                        px: 1.5, py: 0.5, borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold'
                      }}
                    >
                      {article.status}
                    </Box>
                  </TableCell>
                  <TableCell>{new Date(article.created_at).toLocaleDateString('id-ID')}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small" color="primary" onClick={() => handleOpenEditDialog(article)}><EditIcon /></IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDelete(article.id)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
      {/* --- AKHIR BAGIAN TABEL --- */}

      {/* Dialog untuk Tambah/Edit */}
      <Dialog open={isDialogOpen} onClose={resetAndClose} fullWidth maxWidth="md">
        <DialogTitle>{isEditMode ? 'Edit Artikel' : 'Tambah Artikel Baru'}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={isEditMode ? handleUpdateSubmit : handleSubmit} sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mt: 2 }}>Judul (ID)</Typography>
            <TextField
              label="Judul (ID)"
              name="title_id"
              value={formData.title_id}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <Typography variant="subtitle2" sx={{ mt: 2 }}>Judul (EN)</Typography>
            <TextField
              label="Title (EN)"
              name="title_en"
              value={formData.title_en}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <Typography variant="subtitle2" sx={{ mt: 2 }}>Summary (ID)</Typography>
            <TextField
              label="Summary (ID)"
              name="summary_id"
              value={formData.summary_id}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <Typography variant="subtitle2" sx={{ mt: 2 }}>Summary (EN)</Typography>
            <TextField
              label="Summary (EN)"
              name="summary_en"
              value={formData.summary_en}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <Typography variant="subtitle2" sx={{ mt: 2 }}>Konten (ID)</Typography>
            <TextField
              label="Konten (ID)"
              name="content_id"
              value={formData.content_id}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={6}
              required
            />
            <Typography variant="subtitle2" sx={{ mt: 2 }}>Content (EN)</Typography>
            <TextField
              label="Content (EN)"
              name="content_en"
              value={formData.content_en}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={6}
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                label="Status"
                onChange={handleChange}
                required
              >
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="published">Published</MenuItem>
              </Select>
            </FormControl>
            <Button variant="outlined" component="label" sx={{ mt: 1 }}>
              Upload Thumbnail
              <input type="file" hidden onChange={handleFileChange} accept="image/*" />
            </Button>
            {(thumbnailFile || formData.thumbnail_url) && (
              <Typography sx={{ display: 'inline', ml: 2 }}>
                {thumbnailFile ? thumbnailFile.name : formData.thumbnail_url}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={resetAndClose}>Batal</Button>
          <Button
            onClick={isEditMode ? handleUpdateSubmit : handleSubmit}
            variant="contained"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Simpan'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminArticlesPage;