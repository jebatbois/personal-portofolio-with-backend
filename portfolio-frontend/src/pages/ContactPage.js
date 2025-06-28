// src/pages/ContactPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Paper, Box, IconButton, TextField, Button, CircularProgress, Alert } from '@mui/material';
import Navbar from '../public-components/Navbar';
import Footer from '../public-components/Footer';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';

const BACKEND_URL = 'http://localhost:5000';

const ContactPage = () => {
  // State untuk info dari database (sosmed, dll)
  const [userInfo, setUserInfo] = useState(null);
  
  // State untuk form kontak
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });


  useEffect(() => {
    // Ambil data userinfo untuk link sosmed dan info servis
    axios.get(`${BACKEND_URL}/api/userinfo`)
      .then(res => setUserInfo(res.data))
      .catch(err => console.error("Gagal mengambil info user:", err));
  }, []);

  const handleInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // --- LOGIKA VALIDASI EMAIL ---
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formState.email)) {
      setFormMessage({ type: 'error', text: 'Format email yang Anda masukkan tidak valid.' });
      return;
    }
    // --- AKHIR VALIDASI ---

    setIsSubmitting(true);
    setFormMessage({ type: '', text: '' });

    // Kirim data form ke endpoint publik /api/contact
    axios.post(`${BACKEND_URL}/api/contact`, formState)
      .then(() => {
        setFormMessage({ type: 'success', text: 'Pesan Anda telah berhasil terkirim!' });
        setFormState({ name: '', email: '', message: '' }); // Reset form
      })
      .catch(() => {
        setFormMessage({ type: 'error', text: 'Gagal mengirim pesan. Coba lagi nanti.' });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'grey.100' }}>
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
            Get In Touch
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
            Punya pertanyaan atau proyek yang ingin didiskusikan? Jangan ragu untuk menghubungi saya.
          </Typography>

          <Grid container spacing={5} justifyContent="center">
            {/* Kolom Kiri: Form Kontak */}
            <Grid item xs={12} md={7}>
              <Paper sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>Kirim Pesan</Typography>
                <Box component="form" onSubmit={handleSubmit}>
                  <TextField label="Nama Anda" name="name" value={formState.name} onChange={handleInputChange} fullWidth margin="normal" required />
                  <TextField label="Email Anda" name="email" type="email" value={formState.email} onChange={handleInputChange} fullWidth margin="normal" required />
                  <TextField label="Pesan Anda" name="message" value={formState.message} onChange={handleInputChange} fullWidth margin="normal" multiline rows={5} required />
                  <Button type="submit" variant="contained" size="large" sx={{ mt: 2 }} disabled={isSubmitting}>
                    {isSubmitting ? <CircularProgress size={24} /> : 'Kirim Pesan'}
                  </Button>
                  {formMessage.text && (
                    <Alert severity={formMessage.type} sx={{ mt: 3 }}>
                      {formMessage.text}
                    </Alert>
                  )}
                </Box>
              </Paper>
            </Grid>

            {/* Kolom Kanan: Info Tambahan */}
            <Grid item xs={12} md={5}>
              {userInfo && (
                <>
                  <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" gutterBottom>Social Media</Typography>
                    <Box>
                      <IconButton
                        component="a"
                        href={userInfo.github_url}
                        target="_blank"
                        aria-label="github"
                        sx={{
                          color: '#222',
                          transition: 'color 0.2s, background 0.2s',
                          '&:hover': {
                            color: '#fff',
                            backgroundColor: '#333', // warna hover GitHub
                          }
                        }}
                      >
                        <GitHubIcon fontSize="large" />
                      </IconButton>
                      <IconButton
                        component="a"
                        href={userInfo.linkedin_url}
                        target="_blank"
                        aria-label="linkedin"
                        sx={{
                          color: '#0A66C2',
                          transition: 'color 0.2s, background 0.2s',
                          '&:hover': {
                            color: '#fff',
                            backgroundColor: '#0A66C2', // warna hover LinkedIn
                          }
                        }}
                      >
                        <LinkedInIcon fontSize="large" />
                      </IconButton>
                      <IconButton
                        component="a"
                        href={userInfo.instagram_url}
                        target="_blank"
                        aria-label="instagram"
                        sx={{
                          color: '#E1306C',
                          transition: 'color 0.2s, background 0.2s',
                          '&:hover': {
                            color: '#fff',
                            backgroundColor: '#E1306C', // warna hover Instagram
                          }
                        }}
                      >
                        <InstagramIcon fontSize="large" />
                      </IconButton>
                    </Box>
                  </Paper>
                  <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom>Value / Service</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {userInfo.service_description || 'Silakan hubungi untuk mendiskusikan detail servis dan biaya.'}
                    </Typography>
                  </Paper>
                </>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default ContactPage;