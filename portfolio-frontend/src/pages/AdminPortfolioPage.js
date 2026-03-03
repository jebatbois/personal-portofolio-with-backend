import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Typography, TextField, Button, Box, Table, TableBody, TableCell, TableHead, TableRow, Paper, IconButton,
  Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, Grid
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';

const BACKEND_URL = 'https://rifqy-api.gt.tc';

const AdminPortfolioPage = () => {
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk Dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State untuk Form & File
  const [formData, setFormData] = useState({});
  const [mainImageFile, setMainImageFile] = useState(null);
  const [galleryImageFiles, setGalleryImageFiles] = useState([]);
  const [existingGallery, setExistingGallery] = useState([]);


  const fetchPortfolios = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/portfolio`);
      setPortfolios(res.data);
    } catch (error) { console.error("Gagal mengambil data portfolio:", error); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPortfolios(); }, []);

  const resetForm = () => {
    setFormData({
      project_name_id: '',
      project_name_en: '',
      description_id: '',
      description_en: '',
      tags_id: '',
      tags_en: '',
      status_id: 'Selesai',
      status_en: 'Completed',
      project_link: '',
      image_url: ''
    });
    setMainImageFile(null);
    setGalleryImageFiles([]);
    setExistingGallery([]);
    setIsEditMode(false);
  };

  const handleOpenAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };
  
  const handleOpenEditDialog = async (portfolio) => {
    resetForm();
    setIsEditMode(true);
    // Ambil data detail dari backend
    try {
      const res = await axios.get(`${BACKEND_URL}/api/portfolio/${portfolio.id}`);
      // Pastikan status_id dan status_en selalu ada di formData
      setFormData({
        ...res.data,
        status_id: res.data.status_id || 'Selesai',
        status_en: res.data.status_en || 'Completed'
      });
      const galleryRes = await axios.get(`${BACKEND_URL}/api/portfolio/${portfolio.id}/images`);
      setExistingGallery(galleryRes.data);
    } catch (error) {
      console.error("Gagal mengambil data detail atau gambar galeri:", error);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const resetAndClose = () => {
    handleCloseDialog();
    resetForm();
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleMainImageChange = (e) => setMainImageFile(e.target.files[0]);
  const handleGalleryFilesChange = (e) => setGalleryImageFiles([...e.target.files]);

  const uploadFile = async (file) => {
    const uploadFormData = new FormData();
    uploadFormData.append('image', file);
    const token = localStorage.getItem('authToken');
    const res = await axios.post(`${BACKEND_URL}/api/upload`, uploadFormData, {
      headers: { 'Content-Type': 'multipart/form-data', Authorization: token },
    });
    return res.data.filePath;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem('authToken');
    let dataToSubmit = { ...formData };

    try {
      // 1. Upload gambar utama jika ada
      if (mainImageFile) {
        dataToSubmit.image_url = await uploadFile(mainImageFile);
      }

      // 2. Simpan/Update data utama portfolio
      let portfolioResponse;
      if (isEditMode) {
        portfolioResponse = await axios.put(`${BACKEND_URL}/api/portfolio/${formData.id}`, dataToSubmit, { headers: { Authorization: token } });
      } else {
        portfolioResponse = await axios.post(`${BACKEND_URL}/api/portfolio`, dataToSubmit, { headers: { Authorization: token } });
      }
      const portfolioId = isEditMode ? formData.id : portfolioResponse.data.id;

      // 3. Upload gambar galeri baru jika ada
      if (galleryImageFiles.length > 0) {
        for (const file of galleryImageFiles) {
          const galleryImageUrl = await uploadFile(file);
          await axios.post(`${BACKEND_URL}/api/portfolio/${portfolioId}/images`, { image_url: galleryImageUrl }, { headers: { Authorization: token } });
        }
      }

      alert(`Proyek berhasil ${isEditMode ? 'diupdate' : 'disimpan'}!`);
      handleCloseDialog();
      fetchPortfolios();

    } catch (error) {
      alert(`Gagal menyimpan proyek.`);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteGalleryImage = async (imageId) => {
    const token = localStorage.getItem('authToken');
    if (!window.confirm('Yakin ingin menghapus gambar ini?')) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/portfolio/gallery/${imageId}`, {
        headers: { Authorization: token }
      });
      // Hapus dari state agar UI langsung update
      setExistingGallery(existingGallery.filter(img => img.id !== imageId));
    } catch (error) {
      alert('Gagal menghapus gambar galeri.');
      console.error(error);
    }
  };

  const handleDeletePortfolio = async (portfolioId) => {
    const token = localStorage.getItem('authToken');
    if (!window.confirm('Yakin ingin menghapus proyek ini?')) return;
    try {
      await axios.delete(`${BACKEND_URL}/api/portfolio/${portfolioId}`, {
        headers: { Authorization: token }
      });
      setPortfolios(portfolios.filter(p => p.id !== portfolioId));
    } catch (error) {
      alert('Gagal menghapus proyek.');
      console.error(error);
    }
  };

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" gutterBottom>Manajemen Portfolio</Typography>
        <Button variant="contained" onClick={handleOpenAddDialog}>Tambah Proyek Baru</Button>
      </Box>

      {loading ? <CircularProgress /> : (
        <Paper>
          <Table>
            <TableHead>
              <TableRow><TableCell>Gambar</TableCell><TableCell>Nama Proyek</TableCell><TableCell>Aksi</TableCell></TableRow>
            </TableHead>
            <TableBody>
              {portfolios.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <img src={p.image_url?.startsWith('http') ? p.image_url : `${BACKEND_URL}${p.image_url}`} alt={p.project_name} style={{ width: '100px', height: 'auto' }} />
                  </TableCell>
                  <TableCell>{p.project_name}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenEditDialog(p)}><EditIcon /></IconButton>
                    <IconButton color="error" onClick={() => handleDeletePortfolio(p.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* Dialog untuk Tambah/Edit */}
      <Dialog open={isDialogOpen} onClose={resetAndClose} fullWidth maxWidth="md">
        <DialogTitle>{isEditMode ? 'Edit Proyek' : 'Tambah Proyek Baru'}</DialogTitle>
        <DialogContent>
          <Box component="form" id="portfolio-form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {/* --- KONTEN BAHASA INDONESIA --- */}
            <Typography variant="h6">Bahasa Indonesia</Typography>
            <TextField 
              label="Nama Proyek (ID)" 
              name="project_name_id" 
              value={formData.project_name_id || ''} 
              onChange={handleChange} 
              fullWidth 
              margin="normal" 
              required 
            />
            <TextField 
              label="Status (ID)" 
              name="status_id" 
              value={formData.status_id || ''} 
              onChange={handleChange} 
              fullWidth 
              margin="normal" 
            />
            <TextField 
              label="Deskripsi (ID)" 
              name="description_id" 
              value={formData.description_id || ''} 
              onChange={handleChange} 
              fullWidth 
              margin="normal" 
              multiline 
              rows={4} 
            />
            <TextField 
              label="Tags (ID)" 
              name="tags_id" 
              value={formData.tags_id || ''} 
              onChange={handleChange} 
              fullWidth 
              margin="normal" 
            />
            
            <hr style={{margin: '2rem 0'}}/>

            {/* --- KONTEN BAHASA INGGRIS --- */}
            <Typography variant="h6">Bahasa Inggris</Typography>
            <TextField 
              label="Project Name (EN)" 
              name="project_name_en" 
              value={formData.project_name_en || ''} 
              onChange={handleChange} 
              fullWidth 
              margin="normal" 
            />
            <TextField 
              label="Status (EN)" 
              name="status_en" 
              value={formData.status_en || ''} 
              onChange={handleChange} 
              fullWidth 
              margin="normal" 
            />
            <TextField 
              label="Description (EN)" 
              name="description_en" 
              value={formData.description_en || ''} 
              onChange={handleChange} 
              fullWidth 
              margin="normal" 
              multiline 
              rows={4} 
            />
            <TextField 
              label="Tags (EN)" 
              name="tags_en" 
              value={formData.tags_en || ''} 
              onChange={handleChange} 
              fullWidth 
              margin="normal" 
            />
            
            <hr style={{margin: '2rem 0'}}/>
            
            {/* --- PENGATURAN LAINNYA --- */}
            <Typography variant="h6">Pengaturan Lainnya</Typography>
            <TextField 
              label="Link Proyek" 
              name="project_link" 
              value={formData.project_link || ''} 
              onChange={handleChange} 
              fullWidth 
              margin="normal" 
            />
            <Button variant="outlined" component="label" sx={{ mt: 1 }}>
              Upload Gambar Utama
              <input type="file" hidden onChange={handleMainImageChange} accept="image/*" />
            </Button>
            {mainImageFile && <Typography variant="caption" sx={{ ml: 2 }}>{mainImageFile.name}</Typography>}

            {isEditMode && (
              <Box mt={4}>
                <Typography variant="h6">Manajemen Galeri</Typography>
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
          <Button onClick={resetAndClose}>Batal</Button>
          <Button type="submit" form="portfolio-form" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? <CircularProgress size={24} /> : 'Simpan'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};
export default AdminPortfolioPage;