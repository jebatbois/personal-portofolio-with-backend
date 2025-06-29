// src/pages/ContactPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Paper, Box, IconButton, TextField, Button, CircularProgress, Alert } from '@mui/material';
import Navbar from '../public-components/Navbar';
import Footer from '../public-components/Footer';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import { FaSpotify } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const BACKEND_URL = 'http://localhost:5000';

const ContactPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });
  const { t, i18n } = useTranslation('common');

  useEffect(() => {
    // Ambil data userinfo sesuai bahasa
    axios.get(`${BACKEND_URL}/api/userinfo?lang=${i18n.language}`)
      .then(res => {
        setUserInfo(res.data);
        console.log('userInfo:', res.data); // CEK APAKAH ADA spotify_url
      })
      .catch(err => console.error("Gagal mengambil info user:", err));
  }, [i18n.language]);

  const handleInputChange = (e) => setFormState({ ...formState, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormMessage({ type: '', text: '' });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formState.email)) {
      setFormMessage({ type: 'error', text: t('contact_form_email_invalid') });
      setIsSubmitting(false);
      return;
    }

    axios.post(`${BACKEND_URL}/api/contact`, formState)
      .then(() => {
        setFormMessage({ type: 'success', text: t('contact_success_message') });
        setFormState({ name: '', email: '', message: '' });
      })
      .catch(() => {
        setFormMessage({ type: 'error', text: t('contact_error_message') });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  if (!userInfo) return <div>Loading...</div>;

  // Pilih value/service sesuai bahasa
  const serviceDesc = userInfo[`service_description_${i18n.language}`] || userInfo.service_description || t('service_fallback');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, bgcolor: 'grey.100' }}>
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
            {t('contact_title')}
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
            {t('contact_subtitle')}
          </Typography>

          <Grid container spacing={5} justifyContent="center">
            {/* Kolom Kiri: Form Kontak */}
            <Grid item xs={12} md={7}>
              <Paper sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>{t('contact_form_title')}</Typography>
                <Box component="form" onSubmit={handleSubmit}>
                  <TextField label={t('contact_form_name')} name="name" value={formState.name} onChange={handleInputChange} fullWidth margin="normal" required />
                  <TextField label={t('contact_form_email')} name="email" type="email" value={formState.email} onChange={handleInputChange} fullWidth margin="normal" required />
                  <TextField label={t('contact_form_message')} name="message" value={formState.message} onChange={handleInputChange} fullWidth margin="normal" multiline rows={5} required />
                  <Button type="submit" variant="contained" size="large" sx={{ mt: 2 }} disabled={isSubmitting}>
                    {isSubmitting ? <CircularProgress size={24} /> : t('contact_form_button')}
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
              <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>{t('social_media_title')}</Typography>
                <Box>
                  <IconButton component="a" href={userInfo.github_url} target="_blank" aria-label="github" sx={{
                    color: '#222',
                    transition: 'color 0.2s, background 0.2s',
                    '&:hover': {
                      color: '#fff',
                      backgroundColor: '#333', // warna hover GitHub
                    }
                  }}>
                    <GitHubIcon fontSize="large" />
                  </IconButton>
                  <IconButton component="a" href={userInfo.linkedin_url} target="_blank" aria-label="linkedin" sx={{
                    color: '#0A66C2',
                    transition: 'color 0.2s, background 0.2s',
                    '&:hover': {
                      color: '#fff',
                      backgroundColor: '#0A66C2', // warna hover LinkedIn
                    }
                  }}>
                    <LinkedInIcon fontSize="large" />
                  </IconButton>
                  <IconButton component="a" href={userInfo.instagram_url} target="_blank" aria-label="instagram" sx={{
                    color: '#E1306C',
                    transition: 'color 0.2s, background 0.2s',
                    '&:hover': {
                      color: '#fff',
                      backgroundColor: '#E1306C', // warna hover Instagram
                    }
                  }}>
                    <InstagramIcon fontSize="large" />
                  </IconButton>
                  <IconButton
                    component="a"
                    href={userInfo.spotify_url || '#'}
                    target="_blank"
                    rel="noopener"
                    sx={{
                      color: '#1DB954', // Hijau Spotify
                      transition: 'color 0.2s, background 0.2s',
                      '&:hover': {
                        color: '#fff',
                        backgroundColor: '#1DB954', // Warna hover Spotify
                      }
                    }}
                    aria-label="Spotify"
                  >
                    <FaSpotify size={35} />
                  </IconButton>
                </Box>
                {/* Tambahkan email di bawah social media */}
                {userInfo.email && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                    <Typography variant="body1">
                      <a href={`mailto:${userInfo.email}`} style={{ color: '#1976d2', textDecoration: 'none' }}>
                        {userInfo.email}
                      </a>
                    </Typography>
                  </Box>
                )}
              </Paper>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>{t('service_title')}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {serviceDesc}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default ContactPage;