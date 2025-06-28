// src/public-components/Navbar.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

// Emoji bendera: 🇮🇩 dan 🇬🇧
const BACKEND_URL = 'http://localhost:5000';

const Navbar = () => {
  const [logoUrl, setLogoUrl] = useState('');
  const theme = useTheme();
  const { t, i18n } = useTranslation('common');

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/userinfo`)
      .then(res => {
        if (res.data && res.data.navbar_logo_url) {
          setLogoUrl(res.data.navbar_logo_url);
        }
      })
      .catch(err => console.error("Gagal mengambil info untuk navbar:", err));
  }, []);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'primary.main', boxShadow: 'none' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ flexGrow: 1 }}>
          <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
            {logoUrl && (
              <Box
                component="img"
                src={`${BACKEND_URL}${logoUrl}`}
                alt="Logo"
                sx={{ height: '40px', mr: 1.5 }}
              />
            )}
            <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
              RIFQY<span style={{ color: theme.palette.secondary.main }}>.</span>DEV
            </Typography>
          </RouterLink>
        </Box>

        {/* Bagian Link Navigasi */}
        <Box>
          <Button 
            sx={{ color: 'white', fontWeight: 600, '&:hover': { color: 'secondary.main' } }}
            component={RouterLink}
            to="/"
          >
            {t('nav_home')}
          </Button>
          <Button 
            sx={{ color: 'white', fontWeight: 600, '&:hover': { color: 'secondary.main' } }}
            component={RouterLink}
            to="/artikel"
          >
            {t('nav_articles')}
          </Button>
          <Button 
            sx={{ color: 'white', fontWeight: 600, '&:hover': { color: 'secondary.main' } }}
            component={RouterLink}
            to="/kontak"
          >
            {t('nav_contact')}
          </Button>
        </Box>

        {/* Tombol untuk ganti bahasa dengan bendera */}
        <Box>
          <IconButton
            size="small"
            sx={{
              color: 'white',
              fontWeight: i18n.language === 'id' ? 'bold' : 'normal',
              opacity: i18n.language === 'id' ? 1 : 0.6,
              fontSize: 20, // kecilkan ukuran icon button
              p: 0.5
            }}
            onClick={() => changeLanguage('id')}
            aria-label="Bahasa Indonesia"
          >
            <span
              role="img"
              aria-label="ID"
              style={{ fontSize: '1.2rem', lineHeight: 1 }} // kecilkan emoji bendera
            >
              🇮🇩
            </span>
          </IconButton>
          <Typography component="span" sx={{ color: 'white', mx: 0.5 }}>/</Typography>
          <IconButton
            size="small"
            sx={{
              color: 'white',
              fontWeight: i18n.language === 'en' ? 'bold' : 'normal',
              opacity: i18n.language === 'en' ? 1 : 0.6,
              fontSize: 20,
              p: 0.5
            }}
            onClick={() => changeLanguage('en')}
            aria-label="English"
          >
            <span
              role="img"
              aria-label="EN"
              style={{ fontSize: '1.2rem', lineHeight: 1 }}
            >
              🇬🇧
            </span>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;