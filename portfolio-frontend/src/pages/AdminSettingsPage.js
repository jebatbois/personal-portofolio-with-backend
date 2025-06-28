import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Box, Paper, Alert, CircularProgress } from '@mui/material';

const BACKEND_URL = 'http://localhost:5000';

const AdminSettingsPage = () => {
  // Semua state dideklarasikan di dalam komponen
  const [userInfo, setUserInfo] = useState({
    id: null, full_name: '', bio_id: '', bio_en: '', profile_picture_url: '', navbar_logo_url: '', 
    email: '', phone_number: '', address: '', linkedin_url: '', github_url: '', 
    instagram_url: '', service_description_id: '', service_description_en: ''
  });
  const [selectedProfileFile, setSelectedProfileFile] = useState(null);
  const [selectedLogoFile, setSelectedLogoFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch data awal
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem('authToken');
      try {
        // --- UBAH URL DI SINI ---
        const response = await axios.get(`${BACKEND_URL}/api/userinfo/admin`, {
          headers: { Authorization: token }
        });
        // --- AKHIR PERUBAHAN ---

        const data = response.data;
        setUserInfo(data);
      } catch (error) {
        console.error("Gagal mengambil info user untuk admin:", error);
      }
    };
    fetchUserInfo();
  }, []);

  // Handler untuk input teks biasa
  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  // Handler untuk masing-masing input file
  const handleProfileFileChange = (e) => {
    setSelectedProfileFile(e.target.files[0]);
  };
  const handleLogoFileChange = (e) => {
    setSelectedLogoFile(e.target.files[0]);
  };

  // --- SATU FUNGSI HANDLE SUBMIT UNTUK SEMUANYA ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setMessage('');

    const token = localStorage.getItem('authToken');
    let updatedUserInfo = { ...userInfo };

    // Langkah 1: Upload FOTO PROFIL jika ada file baru
    if (selectedProfileFile) {
      const formData = new FormData();
      formData.append('image', selectedProfileFile);
      try {
        const uploadRes = await axios.post(`${BACKEND_URL}/api/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data', Authorization: token },
        });
        updatedUserInfo.profile_picture_url = uploadRes.data.filePath;
      } catch (error) {
        setMessage('Gagal upload foto profil.');
        setIsUploading(false);
        return;
      }
    }
    
    // Langkah 2: Upload LOGO NAVBAR jika ada file baru
    if (selectedLogoFile) {
        const logoFormData = new FormData();
        logoFormData.append('image', selectedLogoFile);
        try {
          const uploadRes = await axios.post(`${BACKEND_URL}/api/upload`, logoFormData, {
            headers: { 'Content-Type': 'multipart/form-data', Authorization: token },
          });
          updatedUserInfo.navbar_logo_url = uploadRes.data.filePath;
        } catch (error) {
          setMessage('Gagal upload logo.');
          setIsUploading(false);
          return;
        }
    }

    // --- TAMBAHKAN LOG INI ---
    console.log("DATA YANG AKAN DIKIRIM KE BACKEND (PUT):", updatedUserInfo);
    // --- END LOG ---

    // Langkah 3: Simpan SEMUA data userInfo ke database
    try {
      await axios.put(`${BACKEND_URL}/api/userinfo/${updatedUserInfo.id}`, updatedUserInfo, {
        headers: { Authorization: token }
      });
      setMessage('Data berhasil disimpan!');
      setSelectedProfileFile(null);
      setSelectedLogoFile(null);
    } catch (error) {
      setMessage('Gagal menyimpan data.');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Pengaturan Umum & Kontak</Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          {/* ... Input teks lainnya ... */}
          <TextField label="Nama Lengkap" name="full_name" value={userInfo.full_name} onChange={handleChange} fullWidth margin="normal" />
          
          {/* Tambahkan form email di bawah ini */}
          <TextField
            label="Email"
            name="email"
            type="email"
            value={userInfo.email || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          
          <TextField 
            label="Bio Singkat (di bawah nama Anda)" 
            name="bio_id" 
            value={userInfo.bio_id || ''} 
            onChange={handleChange} 
            fullWidth 
            margin="normal" 
            multiline 
            rows={3} 
          />

          {/* Input Foto Profil */}
          <Typography variant="subtitle1" sx={{mt: 2}}>Foto Profil</Typography>
          {userInfo.profile_picture_url && <img src={`${BACKEND_URL}${userInfo.profile_picture_url}`} alt="preview" style={{width: '100px', height: '100px', objectFit: 'cover', display: 'block', marginBottom: '10px', borderRadius: '4px'}} />}
          <Button variant="contained" component="label">
            Upload Foto Profil Baru
            <input type="file" hidden onChange={handleProfileFileChange} accept="image/*" />
          </Button>
          {selectedProfileFile && <Typography variant="body2" sx={{mt:1, fontStyle: 'italic'}}>File dipilih: {selectedProfileFile.name}</Typography>}
          
          {/* Input Logo Navbar */}
          <Typography variant="subtitle1" sx={{mt: 3}}>Logo Navbar</Typography>
          {userInfo.navbar_logo_url && <img src={`${BACKEND_URL}${userInfo.navbar_logo_url}`} alt="logo preview" style={{height: '40px', background: '#ddd', padding: '5px', display: 'block', marginBottom: '10px'}} />}
          <Button variant="contained" component="label">
            Upload Logo Baru
            <input type="file" hidden onChange={handleLogoFileChange} accept="image/*" />
          </Button>
          {selectedLogoFile && <Typography variant="body2" sx={{mt:1, fontStyle: 'italic'}}>File dipilih: {selectedLogoFile.name}</Typography>}

          <Typography variant="h6" sx={{ mt: 3 }}>Sosial Media</Typography>
          <TextField label="URL LinkedIn" name="linkedin_url" value={userInfo.linkedin_url} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="URL GitHub" name="github_url" value={userInfo.github_url} onChange={handleChange} fullWidth margin="normal" />
          <TextField label="URL Instagram" name="instagram_url" value={userInfo.instagram_url} onChange={handleChange} fullWidth margin="normal" />
          <Typography variant="h6" sx={{ mt: 3 }}>Info Servis</Typography>
          <TextField
            label="Deskripsi Servis (ID)"
            name="service_description_id"
            value={userInfo.service_description_id || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
          <TextField
            label="Service Description (EN)"
            name="service_description_en"
            value={userInfo.service_description_en || ''}
            onChange={handleChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
          />
          <Button type="submit" variant="contained" sx={{ mt: 3 }} disabled={isUploading}>
            {isUploading ? <CircularProgress size={24} /> : 'Simpan Pengaturan'}
          </Button>
          {message && <Alert severity={message.includes('Gagal') ? 'error' : 'success'} sx={{ mt: 2 }}>{message}</Alert>}
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminSettingsPage;