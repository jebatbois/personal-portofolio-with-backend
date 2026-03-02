// src/public-components/Footer.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Container, Typography, Grid, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Ikon Sosial Media
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import { FaSpotify } from 'react-icons/fa'; // Import Spotify

const BACKEND_URL = 'http://localhost:5000';

const Footer = () => {
  const { t, i18n } = useTranslation('common');
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    // Mengambil data dinamis seperti di kode lamamu
    axios.get(`${BACKEND_URL}/api/userinfo?lang=${i18n.language}`)
      .then(res => {
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        if (data) setUserInfo(data);
      })
      .catch(err => console.error("Error fetching user info in footer:", err));
  }, [i18n.language]);

  // Siapkan array sosial media, dan saring hanya yang URL-nya tersedia di database
  const socialLinks = [
    { id: 'github', icon: <GitHubIcon fontSize="large" />, url: userInfo.github_url },
    { id: 'linkedin', icon: <LinkedInIcon fontSize="large" />, url: userInfo.linkedin_url },
    { id: 'instagram', icon: <InstagramIcon fontSize="large" />, url: userInfo.instagram_url },
    { id: 'spotify', icon: <FaSpotify size={35} />, url: userInfo.spotify_url },
    { id: 'email', icon: <EmailIcon fontSize="large" />, url: 'mailto:rifqyprayuda204@gmail.com' }
  ].filter(social => social.url); // Hanya tampilkan ikon jika URL-nya ada di database

  return (
    <Box sx={{ 
      bgcolor: '#000', // Hitam pekat brutalism
      color: '#fff', 
      pt: 12, 
      pb: 6,
      borderTop: '8px solid #f23a18', // Garis batas merah super tebal
      position: 'relative',
      overflow: 'hidden'
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          
          {/* Bagian Kiri: Call to Action Raksasa */}
          <Grid item xs={12} md={8}>
            <Typography variant="h2" sx={{ 
              fontFamily: "'Anton', sans-serif", 
              color: '#fff', 
              fontSize: { xs: '3rem', sm: '4rem', md: '5.5rem' },
              lineHeight: 1.1,
              mb: 2,
              textTransform: 'uppercase'
            }}>
              {t('footer_cta', "LET'S BUILD SOMETHING BIG.")}
            </Typography>
            <Typography variant="h6" sx={{ color: '#ffed00', fontFamily: "'Inter', sans-serif", fontWeight: 800 }}>
              {/* Menampilkan email dari database atau fallback statis */}
              {'rifqyprayuda204@gmail.com'}
            </Typography>
          </Grid>

          {/* Bagian Kanan: Sosial Media Link (Gaya Kotak Brutalism) */}
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, gap: 2, flexWrap: 'wrap' }}>
            {socialLinks.map((social) => (
              <IconButton 
                key={social.id}
                component="a"
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.id}
                sx={{ 
                  bgcolor: '#fff', 
                  color: '#000', 
                  borderRadius: 0, // Bentuk Kotak tajam
                  border: '3px solid #000',
                  boxShadow: '4px 4px 0px #ffed00', // Shadow kuning
                  p: 1.5,
                  transition: 'all 0.1s',
                  '&:hover': {
                    bgcolor: '#ffed00',
                    transform: 'translate(-2px, -2px)',
                    boxShadow: '6px 6px 0px #f23a18' // Shadow berubah jadi merah saat di-hover
                  }
                }}
              >
                {social.icon}
              </IconButton>
            ))}
          </Grid>
        </Grid>

        {/* Garis Pemisah & Copyright */}
        <Box sx={{ 
          mt: 10, 
          pt: 4, 
          borderTop: '2px solid #333', 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2
        }}>
          <Typography sx={{ fontFamily: "'Anton', sans-serif", fontSize: '2rem', color: '#333' }}>
            RIFQY.DEV
          </Typography>
          
          {/* Teks Copyright dengan Tahun Dinamis & Variabel Terjemahan */}
          <Box sx={{ textAlign: { xs: 'center', md: 'right' } }}>
            <Typography sx={{ fontWeight: 600, color: '#888', fontSize: '0.9rem' }}>
              © {new Date().getFullYear()} Rifqy Athaya Prayuda. {t('footer_rights', 'Hak Cipta Dilindungi.')}
            </Typography>
            <Typography sx={{ fontWeight: 600, color: '#555', fontSize: '0.8rem', mt: 0.5 }}>
              {t('footer_built', 'Dibuat dengan keringat dan kode.')}
            </Typography>
          </Box>
        </Box>

      </Container>
    </Box>
  );
};

export default Footer;