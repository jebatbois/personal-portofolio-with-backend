// src/public-components/Footer.js
import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, IconButton, Stack } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
import { FaSpotify } from 'react-icons/fa'; // 3. Import Spotify icon
import axios from 'axios';
import { useTranslation } from 'react-i18next'; // 1. Import hook

const BACKEND_URL = 'http://localhost:5000';

const Footer = () => {
  const [userInfo, setUserInfo] = useState({});
  const { t } = useTranslation('common'); // 2. Panggil hook

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/userinfo`)
      .then(res => setUserInfo(res.data))
      .catch(() => {});
  }, []);

  return (
    <Box component="footer" sx={{ bgcolor: '#1c1c1c', color: 'white', py: 4, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 2 }}>
          <IconButton
            component="a"
            href={userInfo.github_url || '#'}
            target="_blank"
            rel="noopener"
            sx={{
              color: 'white',
              '&:hover': { color: '#6e5494', bgcolor: 'rgba(255,255,255,0.08)' }
            }}
            aria-label="GitHub"
          >
            <GitHubIcon fontSize="large" />
          </IconButton>
          <IconButton
            component="a"
            href={userInfo.linkedin_url || '#'}
            target="_blank"
            rel="noopener"
            sx={{
              color: 'white',
              '&:hover': { color: '#0A66C2', bgcolor: 'rgba(255,255,255,0.08)' }
            }}
            aria-label="LinkedIn"
          >
            <LinkedInIcon fontSize="large" />
          </IconButton>
          <IconButton
            component="a"
            href={userInfo.instagram_url || '#'}
            target="_blank"
            rel="noopener"
            sx={{
              color: 'white',
              '&:hover': { color: '#E1306C', bgcolor: 'rgba(255,255,255,0.08)' }
            }}
            aria-label="Instagram"
          >
            <InstagramIcon fontSize="large" />
          </IconButton>
          <IconButton
            component="a"
            href={userInfo.spotify_url || '#'}
            target="_blank"
            rel="noopener"
            sx={{
              color: 'white',
              '&:hover': { color: '#1DB954', bgcolor: 'rgba(255,255,255,0.08)' }
            }}
            aria-label="Spotify"
          >
            <FaSpotify fontSize="Large" />
          </IconButton>
        </Stack>
        {/* --- PERBAIKAN ADA DI SINI --- */}
        <Typography variant="body2" color="inherit" align="center" sx={{ opacity: 0.8 }}>
          {'© '}
          {new Date().getFullYear()}
          {` Rifqy Athaya Prayuda. ${t('footer_rights')}`}
        </Typography>
        <Typography variant="caption" color="inherit" align="center" display="block" sx={{ mt: 1, opacity: 0.6 }}>
          {t('footer_built')}
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;