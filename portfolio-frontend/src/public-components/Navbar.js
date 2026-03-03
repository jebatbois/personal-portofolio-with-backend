// src/public-components/Navbar.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Divider } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTranslation } from 'react-i18next';

const BACKEND_URL = 'https://rifqy-api.gt.tc';

const Navbar = () => {
  const [logoUrl, setLogoUrl] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { t, i18n } = useTranslation('common');

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/userinfo`)
      .then(res => {
        // Asumsi data berupa array atau object tunggal
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        if (data && data.navbar_logo_url) {
          setLogoUrl(data.navbar_logo_url);
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
      sx={{ width: 250, maxWidth: '100vw', backgroundColor: '#ffed00', height: '100%', borderLeft: '4px solid #000' }}
      role="presentation"
      onClick={() => setDrawerOpen(false)}
      onKeyDown={() => setDrawerOpen(false)}
    >
      <List sx={{ mt: 2 }}>
        {navLinks.map((link) => (
          <ListItem key={link.to} disablePadding>
            <ListItemButton component={RouterLink} to={link.to} sx={{ borderBottom: '2px solid #000' }}>
              <ListItemText 
                primary={link.label} 
                primaryTypographyProps={{ fontFamily: "'Anton', sans-serif", fontSize: '1.5rem', color: '#000', textTransform: 'uppercase' }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ borderColor: '#000', borderWidth: '1px' }} />
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <IconButton
          size="small"
          sx={{ opacity: i18n.language === 'id' ? 1 : 0.4, p: 0.5, border: i18n.language === 'id' ? '2px solid #000' : 'none' }}
          onClick={e => { e.stopPropagation(); changeLanguage('id'); }}
        >
          <span role="img" aria-label="ID" style={{ fontSize: '1.5rem' }}>🇮🇩</span>
        </IconButton>
        <Typography component="span" sx={{ color: 'black', mx: 1, fontFamily: "'Anton', sans-serif", fontSize: '1.5rem' }}>/</Typography>
        <IconButton
          size="small"
          sx={{ opacity: i18n.language === 'en' ? 1 : 0.4, p: 0.5, border: i18n.language === 'en' ? '2px solid #000' : 'none' }}
          onClick={e => { e.stopPropagation(); changeLanguage('en'); }}
        >
          <span role="img" aria-label="EN" style={{ fontSize: '1.5rem' }}>🇬🇧</span>
        </IconButton>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: '#1125d6', borderBottom: '4px solid #000', boxShadow: 'none', width: '100%' }}>
        <Toolbar sx={{ justifyContent: 'space-between', width: '100%', px: { xs: 2, sm: 4 }, minHeight: '80px !important' }}>
          
          {/* Logo dan Nama */}
          <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: '#fff' }}>
            {logoUrl && (
              <Box 
                component="img" 
                // --- KODE PEMBERSIH LOGO ---
                src={(() => {
                  let rawUrl = logoUrl;
                  if (rawUrl.includes('/public')) rawUrl = rawUrl.replace('/public', '');
                  return rawUrl.startsWith('http') ? rawUrl : `${BACKEND_URL}${rawUrl}`;
                })()} 
                alt="Logo" 
                sx={{ height: 45, mr: 2, border: '2px solid #000', backgroundColor: '#fff', boxShadow: '2px 2px 0px #000' }}
              />
            )}
            <Typography variant="h6" sx={{ fontFamily: "'Anton', sans-serif", fontSize: { xs: '1.5rem', sm: '2rem' }, color: '#ffed00', textShadow: '2px 2px 0px #000', letterSpacing: '1px' }}>
              RIFQY<span style={{ color: '#f23a18' }}>.</span>AP
            </Typography>
          </Box>

          {/* Menu Desktop / Ikon Hamburger Mobile */}
          {isMobile ? (
            <IconButton sx={{ color: '#ffed00' }} aria-label="menu" edge="end" onClick={() => setDrawerOpen(true)}>
              <MenuIcon sx={{ fontSize: '2rem' }} />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {navLinks.map((link) => (
                <Button 
                  key={link.to} 
                  component={RouterLink} 
                  to={link.to}
                  sx={{ 
                    color: '#fff', 
                    fontFamily: "'Anton', sans-serif", 
                    fontSize: '1.2rem',
                    letterSpacing: '1px',
                    transition: 'all 0.1s',
                    border: '2px solid transparent',
                    '&:hover': { 
                      color: '#000', 
                      backgroundColor: '#ffed00',
                      border: '2px solid #000',
                      transform: 'translate(-2px, -2px)',
                      boxShadow: '4px 4px 0px #000'
                    } 
                  }} 
                >
                  {link.label}
                </Button>
              ))}
              
              {/* Language Switcher Desktop */}
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, backgroundColor: '#fff', border: '2px solid #000', borderRadius: 0 }}>
                <Button
                  onClick={() => changeLanguage('id')}
                  sx={{ 
                    minWidth: 0, p: '4px 8px', borderRadius: 0, 
                    backgroundColor: i18n.language === 'id' ? '#ffed00' : 'transparent',
                    borderRight: '2px solid #000'
                  }}
                >
                  <span role="img" aria-label="ID" style={{ fontSize: '1.2rem', opacity: i18n.language === 'id' ? 1 : 0.5 }}>🇮🇩</span>
                </Button>
                <Button
                  onClick={() => changeLanguage('en')}
                  sx={{ 
                    minWidth: 0, p: '4px 8px', borderRadius: 0,
                    backgroundColor: i18n.language === 'en' ? '#ffed00' : 'transparent',
                  }}
                >
                  <span role="img" aria-label="EN" style={{ fontSize: '1.2rem', opacity: i18n.language === 'en' ? 1 : 0.5 }}>🇬🇧</span>
                </Button>
              </Box>

            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer 
        anchor="right" 
        open={drawerOpen} 
        onClose={() => setDrawerOpen(false)}
        sx={{ '& .MuiDrawer-paper': { width: '250px', backgroundColor: 'transparent', boxShadow: '-5px 0px 0px rgba(0,0,0,1)' } }} // Tambahan shadow brutalism untuk drawer
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;