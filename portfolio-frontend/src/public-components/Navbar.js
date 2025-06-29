// src/public-components/Navbar.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';

const BACKEND_URL = 'http://localhost:5000';

const Navbar = () => {
  const [logoUrl, setLogoUrl] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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

  const navLinks = [
    { label: t('nav_home'), to: '/' },
    { label: t('nav_articles'), to: '/artikel' },
    { label: t('nav_contact'), to: '/kontak' },
  ];

  const drawer = (
    <Box
      sx={{ width: 250, maxWidth: '100vw' }}
      role="presentation"
      onClick={() => setDrawerOpen(false)}
      onKeyDown={() => setDrawerOpen(false)}
    >
      <List>
        {navLinks.map((link) => (
          <ListItem key={link.to} disablePadding>
            <ListItemButton component={RouterLink} to={link.to}>
              <ListItemText primary={link.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <IconButton
          size="small"
          sx={{
            fontWeight: i18n.language === 'id' ? 'bold' : 'normal',
            opacity: i18n.language === 'id' ? 1 : 0.6,
            fontSize: 20,
            p: 0.5
          }}
          onClick={e => {
            e.stopPropagation();
            changeLanguage('id');
          }}
          aria-label="Bahasa Indonesia"
        >
          <span role="img" aria-label="ID" style={{ fontSize: '1.2rem', lineHeight: 1 }}>🇮🇩</span>
        </IconButton>
        <Typography component="span" sx={{ color: 'black', mx: 0.5 }}>/</Typography>
        <IconButton
          size="small"
          sx={{
            fontWeight: i18n.language === 'en' ? 'bold' : 'normal',
            opacity: i18n.language === 'en' ? 1 : 0.6,
            fontSize: 20,
            p: 0.5
          }}
          onClick={e => {
            e.stopPropagation();
            changeLanguage('en');
          }}
          aria-label="English"
        >
          <span role="img" aria-label="EN" style={{ fontSize: '1.2rem', lineHeight: 1 }}>🇬🇧</span>
        </IconButton>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" sx={{ bgcolor: 'primary.main', boxShadow: 'none', width: '100%' }}>
        <Toolbar sx={{ justifyContent: 'space-between', width: '100%', px: { xs: 1, sm: 2 }, minWidth: 0, maxWidth: '100vw', overflowX: 'hidden' }}>
          {/* Logo dan Nama */}
          <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit', minWidth: 0, overflow: 'hidden' }}>
            {logoUrl && (
              <Box component="img" src={`${BACKEND_URL}${logoUrl}`} alt="Logo" sx={{ height: 40, mr: 1.5, maxWidth: 48, objectFit: 'contain', minWidth: 0 }}/>
            )}
            <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: { xs: '1.1rem', sm: '1.5rem' }, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0 }}>
              RIFQY<span style={{ color: theme.palette.secondary.main }}>.</span>DEV
            </Typography>
          </Box>

          {/* Tampilkan menu desktop atau ikon hamburger */}
          {isMobile ? (
            <IconButton color="inherit" aria-label="menu" edge="end" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {navLinks.map((link) => (
                <Button key={link.to} sx={{ color: 'white', fontWeight: 600, '&:hover': { color: 'secondary.main' } }} component={RouterLink} to={link.to}>
                  {link.label}
                </Button>
              ))}
              {/* Language Switcher for Desktop */}
              <IconButton
                size="small"
                sx={{
                  color: 'white',
                  fontWeight: i18n.language === 'id' ? 'bold' : 'normal',
                  opacity: i18n.language === 'id' ? 1 : 0.6,
                  fontSize: 20,
                  p: 0.5
                }}
                onClick={() => changeLanguage('id')}
                aria-label="Bahasa Indonesia"
              >
                <span role="img" aria-label="ID" style={{ fontSize: '1.2rem', lineHeight: 1 }}>🇮🇩</span>
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
                <span role="img" aria-label="EN" style={{ fontSize: '1.2rem', lineHeight: 1 }}>🇬🇧</span>
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer untuk tampilan mobile */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;