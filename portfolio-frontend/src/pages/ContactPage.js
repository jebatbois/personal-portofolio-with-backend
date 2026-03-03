// src/pages/ContactPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Box, IconButton, TextField, Button, CircularProgress } from '@mui/material';
import Navbar from '../public-components/Navbar';
import Footer from '../public-components/Footer';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import { FaSpotify } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const BACKEND_URL = 'https://rifqy-api.gt.tc';

const ContactPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formMessage, setFormMessage] = useState({ type: '', text: '' });
  const { t, i18n } = useTranslation('common');

  useEffect(() => {
    // Ambil semua data (backend Laravel mengembalikan array/object penuh)
    axios.get(`${BACKEND_URL}/api/userinfo`)
      .then(res => {
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        setUserInfo(data);
      })
      .catch(err => console.error("Gagal mengambil info user:", err));
  }, []);

  const handleInputChange = (e) => setFormState({ ...formState, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormMessage({ type: '', text: '' });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formState.email)) {
      setFormMessage({ type: 'error', text: t('contact_form_email_invalid', 'Email tidak valid.') });
      setIsSubmitting(false);
      return;
    }

    axios.post(`${BACKEND_URL}/api/contact`, formState)
      .then(() => {
        setFormMessage({ type: 'success', text: t('contact_success_message', 'Pesan berhasil terkirim!') });
        setFormState({ name: '', email: '', message: '' });
      })
      .catch(() => {
        setFormMessage({ type: 'error', text: t('contact_error_message', 'Gagal mengirim pesan.') });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  if (!userInfo) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Box sx={{ flexGrow: 1, bgcolor: '#1125d6', color: '#ffed00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Anton', sans-serif", fontSize: '3rem' }}>
          LOADING...
        </Box>
        <Footer />
      </Box>
    );
  }

  // --- LOGIKA BAHASA UNTUK SERVICES ---
  const langSuffix = i18n.language === 'id' ? 'id' : 'en';
  const serviceDesc = userInfo[`service_description_${langSuffix}`] || userInfo.service_description || t('service_fallback', 'Saya terbuka untuk kolaborasi proyek, pekerjaan freelance, dan diskusi teknologi.');

  const socialLinks = [
    { id: 'github', icon: <GitHubIcon fontSize="large" />, url: userInfo.github_url },
    { id: 'linkedin', icon: <LinkedInIcon fontSize="large" />, url: userInfo.linkedin_url },
    { id: 'instagram', icon: <InstagramIcon fontSize="large" />, url: userInfo.instagram_url },
    { id: 'spotify', icon: <FaSpotify size={35} />, url: userInfo.spotify_url }
  ].filter(s => s.url);

  const brutalInputSx = {
    '& .MuiInputBase-root': {
      borderRadius: 0,
      border: '3px solid #000',
      bgcolor: '#fff',
      boxShadow: '4px 4px 0px #000',
      transition: 'all 0.1s',
      fontFamily: "'Inter', sans-serif",
      fontWeight: 600,
      '&.Mui-focused': { boxShadow: '6px 6px 0px #1125d6', transform: 'translate(-2px, -2px)' }
    },
    '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
    '& .MuiInputLabel-root': { fontFamily: "'Anton', sans-serif", fontSize: '1.2rem', color: '#000', textTransform: 'uppercase' },
    '& .MuiInputLabel-root.Mui-focused': { color: '#1125d6' },
    mb: 4
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#fff' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1, borderBottom: '4px solid #000', pb: 15 }}>
        
        <Box sx={{ bgcolor: '#ffed00', borderBottom: '4px solid #000', py: 10, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <Typography sx={{ position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)', fontSize: '15rem', fontFamily: "'Anton', sans-serif", color: 'rgba(0,0,0,0.03)', pointerEvents: 'none', lineHeight: 1 }}>
            PING ME
          </Typography>
          
          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h1" sx={{ fontFamily: "'Anton', sans-serif", textTransform: 'uppercase', color: '#000', fontSize: { xs: '4rem', md: '7rem' }, textShadow: '6px 6px 0px #fff', lineHeight: 1, mb: 2 }}>
              {t('contact_title', 'GET IN TOUCH.')}
            </Typography>
            <Box sx={{ display: 'inline-block', bgcolor: '#000', color: '#fff', px: 2, py: 1, transform: 'rotate(1deg)' }}>
              <Typography sx={{ fontWeight: 800, fontFamily: "'Inter', sans-serif", textTransform: 'uppercase' }}>
                {t('contact_subtitle', 'Tinggalkan pesan. Saya akan membalas secepatnya.')}
              </Typography>
            </Box>
          </Container>
        </Box>

        <Container maxWidth="lg" sx={{ mt: 8 }}>
          <Grid container spacing={8}>
            <Grid item xs={12} md={7}>
              <Box sx={{ bgcolor: '#fff', border: '4px solid #000', boxShadow: '12px 12px 0px #000', p: { xs: 3, md: 5 }, position: 'relative' }}>
                <Box sx={{ position: 'absolute', top: -20, left: 20, bgcolor: '#1125d6', color: '#fff', border: '3px solid #000', px: 2, py: 0.5 }}>
                  <Typography sx={{ fontFamily: "'Anton', sans-serif", fontSize: '1.2rem', letterSpacing: '1px' }}>
                    {t('contact_form_title', 'TRANSMISSION FORM')}
                  </Typography>
                </Box>

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                  <TextField sx={brutalInputSx} label={t('contact_form_name', 'NAME')} name="name" value={formState.name} onChange={handleInputChange} fullWidth required />
                  <TextField sx={brutalInputSx} label={t('contact_form_email', 'EMAIL')} name="email" type="email" value={formState.email} onChange={handleInputChange} fullWidth required />
                  <TextField sx={brutalInputSx} label={t('contact_form_message', 'MESSAGE')} name="message" value={formState.message} onChange={handleInputChange} fullWidth multiline rows={6} required />
                  
                  {formMessage.text && (
                    <Box sx={{ bgcolor: formMessage.type === 'success' ? '#00e676' : '#f23a18', color: '#000', border: '3px solid #000', p: 2, mb: 4, boxShadow: '4px 4px 0px #000', fontWeight: 900 }}>
                      {formMessage.text}
                    </Box>
                  )}

                  <Button type="submit" disabled={isSubmitting} fullWidth sx={{ bgcolor: '#f23a18', color: '#fff', border: '4px solid #000', boxShadow: '6px 6px 0px #000', fontFamily: "'Anton', sans-serif", fontSize: '1.5rem', py: 2, borderRadius: 0, transition: 'all 0.1s', '&:hover': { bgcolor: '#fff', color: '#000', transform: 'translate(-2px, -2px)', boxShadow: '8px 8px 0px #000' }, '&:disabled': { bgcolor: '#ccc', color: '#666' } }}>
                    {isSubmitting ? <CircularProgress size={28} sx={{ color: '#000' }} /> : t('contact_form_button', 'SEND MESSAGE >')}
                  </Button>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={5}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <Box sx={{ bgcolor: '#1125d6', color: '#fff', p: 4, border: '4px solid #000', boxShadow: '8px 8px 0px #000', transform: 'rotate(1deg)' }}>
                  <Typography variant="h4" sx={{ fontFamily: "'Anton', sans-serif", textTransform: 'uppercase', mb: 3, color: '#ffed00' }}>
                    {t('social_media_title', 'DIGITAL PRESENCE')}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4 }}>
                    {socialLinks.map((social) => (
                      <IconButton key={social.id} component="a" href={social.url} target="_blank" aria-label={social.id} sx={{ bgcolor: '#fff', color: '#000', borderRadius: 0, border: '3px solid #000', boxShadow: '4px 4px 0px #000', p: 1.5, transition: 'all 0.1s', '&:hover': { bgcolor: '#ffed00', transform: 'translate(-2px, -2px)', boxShadow: '6px 6px 0px #000' } }}>
                        {social.icon}
                      </IconButton>
                    ))}
                  </Box>

                  <Box sx={{ borderTop: '2px solid #000', pt: 3 }}>
                    <Typography sx={{ fontFamily: "'Anton', sans-serif", fontSize: '1.2rem', color: '#ffed00', mb: 1 }}>DIRECT EMAIL:</Typography>
                    <Typography variant="h6" sx={{ fontFamily: "'Inter', sans-serif", fontWeight: 800, wordWrap: 'break-word' }}>
                      <a href={`mailto:${userInfo.email || 'rifqyprayuda204@gmail.com'}`} style={{ color: '#fff', textDecoration: 'underline', textDecorationThickness: '3px' }}>
                        {userInfo.email || 'rifqyprayuda204@gmail.com'}
                      </a>
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ bgcolor: '#ffed00', color: '#000', p: 4, border: '4px solid #000', boxShadow: '8px 8px 0px #f23a18', transform: 'rotate(-1deg)' }}>
                  <Typography variant="h4" sx={{ fontFamily: "'Anton', sans-serif", textTransform: 'uppercase', mb: 2 }}>
                    {t('service_title', 'SERVICES')}
                  </Typography>
                  <Typography variant="body1" sx={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: '1.1rem', lineHeight: 1.6 }}>
                    {serviceDesc}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default ContactPage;