import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Typography, TextField, Button, Box, Table, TableBody, TableCell, TableHead, TableRow, Paper, IconButton,
  Select, MenuItem, FormControl, InputLabel,
  Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, Grid, LinearProgress, Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';

const BACKEND_URL = 'http://localhost:5000';

const defaultForm = {
  item_type: 'experience',
  title_id: '',
  title_en: '',
  subtitle_id: '',
  subtitle_en: '',
  summary_id: '',
  summary_en: '',
  description_id: '',
  description_en: '',
  start_date: '',
  end_date: ''
};

const AdminResumePage = () => {
  const [resumeItems, setResumeItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(defaultForm);
  const [galleryImageFiles, setGalleryImageFiles] = useState([]);
  const [existingGallery, setExistingGallery] = useState([]);

  // Fetch resume items
  const fetchResumeItems = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${BACKEND_URL}/api/resume`);
      setResumeItems(response.data);
    } catch (err) {
      setError("Gagal memuat data riwayat. Cek console (F12).");
      console.error("Gagal mengambil data riwayat:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResumeItems();
  }, []);

  // Open Add Dialog
  const handleOpenAddDialog = () => {
    setFormData(defaultForm);
    setIsEditMode(false);
    setGalleryImageFiles([]);
    setExistingGallery([]);
    setIsDialogOpen(true);
  };

  // Open Edit Dialog
  const handleOpenEditDialog = async (item) => {
    setIsEditMode(true);
    try {
      // Ambil data detail resume (multi-bahasa)
      const res = await axios.get(`${BACKEND_URL}/api/resume/${item.id}`);
      const detail = res.data;
      // Format tanggal
      detail.start_date = detail.start_date ? detail.start_date.split('T')[0] : '';
      detail.end_date = detail.end_date ? detail.end_date.split('T')[0] : '';
      setFormData(detail);
      // Ambil galeri
      const galleryRes = await axios.get(`${BACKEND_URL}/api/resume/${item.id}/images`);
      setExistingGallery(galleryRes.data);
    } catch (error) {
      setFormData(defaultForm);
      setExistingGallery([]);
      console.error("Gagal mengambil data detail atau galeri:", error);
    }
    setGalleryImageFiles([]);
    setIsDialogOpen(true);
  };

  // Close Dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setFormData(defaultForm);
    setGalleryImageFiles([]);
    setExistingGallery([]);
    setIsEditMode(false);
  };

  // Handle form change
  const handleFormChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handle gallery file change
  const handleGalleryFilesChange = (e) => setGalleryImageFiles([...e.target.files]);

  // Upload file helper
  const uploadFile = async (file) => {
    const uploadFormData = new FormData();
    uploadFormData.append('image', file);
    const token = localStorage.getItem('authToken');
    const res = await axios.post(`${BACKEND_URL}/api/upload`, uploadFormData, {
      headers: { 'Content-Type': 'multipart/form-data', Authorization: token },
    });
    return res.data.filePath;
  };

  // Submit Add/Edit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem('authToken');
    let dataToSubmit = { ...formData };

    try {
      let response;
      if (isEditMode) {
        response = await axios.put(`${BACKEND_URL}/api/resume/${formData.id}`, dataToSubmit, { headers: { Authorization: token } });
      } else {
        response = await axios.post(`${BACKEND_URL}/api/resume`, dataToSubmit, { headers: { Authorization: token } });
      }
      const resumeId = isEditMode ? formData.id : response.data.id;

      // Upload gallery images if any
      if (galleryImageFiles.length > 0) {
        for (const file of galleryImageFiles) {
          const filePath = await uploadFile(file);
          await axios.post(`${BACKEND_URL}/api/resume/${resumeId}/images`, { image_url: filePath }, { headers: { Authorization: token } });
        }
      }

      alert(isEditMode ? 'Item riwayat berhasil diupdate!' : 'Item riwayat berhasil ditambahkan!');
      handleCloseDialog();
      fetchResumeItems();
    } catch (error) {
      alert(isEditMode ? 'Gagal mengupdate item riwayat.' : 'Gagal menambah item riwayat.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete resume item
  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus item ini?")) {
      const token = localStorage.getItem('authToken');
      try {
        await axios.delete(`${BACKEND_URL}/api/resume/${id}`, { headers: { Authorization: token } });
        setResumeItems(prev => prev.filter(item => item.id !== id));
        alert('Item riwayat berhasil dihapus!');
      } catch (error) { alert('Gagal menghapus item riwayat.'); }
    }
  };

  // Delete gallery image
  const handleDeleteGalleryImage = async (imageId) => {
    const token = localStorage.getItem('authToken');
    try {
      await axios.delete(`${BACKEND_URL}/api/resume/images/${imageId}`, { headers: { Authorization: token } });
      setExistingGallery(prev => prev.filter(img => img.id !== imageId));
    } catch (error) {
      alert('Gagal menghapus gambar galeri.');
    }
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" gutterBottom>Manajemen Riwayat</Typography>
        <Button variant="contained" onClick={handleOpenAddDialog}>Tambah Item</Button>
      </Box>

      {loading && <LinearProgress sx={{ mt: 2 }} />}
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

      {!loading && !error && (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tipe</TableCell>
                <TableCell>Judul</TableCell>
                <TableCell>Sub-Judul</TableCell>
                <TableCell>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {resumeItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell sx={{textTransform: 'capitalize'}}>{item.item_type}</TableCell>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.subtitle}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleOpenEditDialog(item)}><EditIcon /></IconButton>
                    <IconButton color="error" onClick={() => handleDelete(item.id)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      <Dialog open={isDialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>
          {isEditMode ? 'Edit Item Riwayat' : 'Tambah Item Riwayat'}
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box component="form" id="resume-form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Tipe*</InputLabel>
              <Select
                name="item_type"
                value={formData.item_type || 'experience'}
                label="Tipe"
                onChange={handleFormChange}
                required
              >
                <MenuItem value="experience">Pengalaman Kerja</MenuItem>
                <MenuItem value="education">Pendidikan</MenuItem>
                <MenuItem value="organization">Organisasi</MenuItem>
                <MenuItem value="activity">Aktivitas/Seminar</MenuItem>
              </Select>
            </FormControl>

            <Typography variant="h6" sx={{ mt: 2 }}>Bahasa Indonesia</Typography>
            <TextField
              label="Jabatan / Gelar (ID)"
              name="title_id"
              value={formData.title_id || ''}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Institusi / Perusahaan (ID)"
              name="subtitle_id"
              value={formData.subtitle_id || ''}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Ringkasan (ID)"
              name="summary_id"
              value={formData.summary_id || ''}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              multiline
              rows={3}
            />
            <TextField
              label="Deskripsi Panjang (ID)"
              name="description_id"
              value={formData.description_id || ''}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              multiline
              rows={6}
            />

            <Typography variant="h6" sx={{ mt: 3 }}>Bahasa Inggris</Typography>
            <TextField
              label="Title / Degree (EN)"
              name="title_en"
              value={formData.title_en || ''}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Institution / Company (EN)"
              name="subtitle_en"
              value={formData.subtitle_en || ''}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Summary (EN)"
              name="summary_en"
              value={formData.summary_en || ''}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              multiline
              rows={3}
            />
            <TextField
              label="Long Description (EN)"
              name="description_en"
              value={formData.description_en || ''}
              onChange={handleFormChange}
              fullWidth
              margin="normal"
              multiline
              rows={6}
            />

            <Typography variant="h6" sx={{ mt: 3 }}>Periode</Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Tanggal Mulai"
                name="start_date"
                type="date"
                value={formData.start_date ? formData.start_date : ''}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Tanggal Selesai"
                name="end_date"
                type="date"
                value={formData.end_date ? formData.end_date : ''}
                onChange={handleFormChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            {isEditMode && (
              <Box mt={4}>
                <Typography variant="h6">Galeri Foto</Typography>
                <Grid container spacing={2} sx={{ my: 1 }}>
                  {existingGallery.map(img => (
                    <Grid item key={img.id}>
                      <Paper sx={{ p: 0.5, position: 'relative' }}>
                        <img src={img.image_url?.startsWith('http') ? img.image_url : `${BACKEND_URL}${img.image_url}`} alt="galeri" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                        <IconButton size="small" sx={{ position: 'absolute', top: 0, right: 0, background: 'rgba(255,255,255,0.7)' }} onClick={() => handleDeleteGalleryImage(img.id)}><CloseIcon fontSize="small"/></IconButton>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
                <Button variant="outlined" component="label">
                  Tambah Gambar Galeri
                  <input type="file" hidden multiple onChange={handleGalleryFilesChange} accept="image/*" />
                </Button>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button
            type="submit"
            form="resume-form"
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Simpan'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminResumePage;