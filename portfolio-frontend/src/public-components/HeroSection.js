// src/public-components/HeroSection.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Box } from '@mui/material';
import ArrowIcon from './icons/ArrowIcon';
import { useTranslation } from 'react-i18next'; // 1. Import hook useTranslation

const BACKEND_URL = 'http://localhost:5000';

const HeroSection = () => {
  const [userInfo, setUserInfo] = useState(null);
  const { t } = useTranslation('common'); // 2. Panggil hook

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/userinfo`)
      .then(res => setUserInfo(res.data))
      .catch(err => console.error("Error fetching user info:", err));
  }, []);

  if (!userInfo) {
    return <Box sx={{ minHeight: 'calc(100vh - 64px)', bgcolor: 'primary.main' }} />;
  }

  return (
    <Box 
      sx={{ 
        bgcolor: 'primary.main', 
        color: 'white', 
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 8, md: 0 }
      }}
    >
      <Container maxWidth="lg">
        <Box 
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 4,
            flexDirection: { xs: 'column-reverse', md: 'row' } 
          }}
        >
          {/* KOLOM KIRI (TEKS) */}
          <Box sx={{ flexBasis: { xs: '100%', md: '55%' }, position: 'relative', textAlign: { xs: 'center', md: 'left' } }}>
            
            <Box sx={{ position: 'absolute', top: 5, right: -60, display: { xs: 'none', md: 'block' }, transform: 'rotate(10deg)' }}>
              <ArrowIcon />
            </Box>

            {/* --- PERBAIKAN UTAMA ADA DI SINI --- */}
            <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
              {/* 3. Gunakan t() dengan variabel */}
              {t('hero_greeting', { name: userInfo.full_name })}
            </Typography>
            <Typography variant="h5" sx={{ opacity: 0.9 }}>
              {/* 4. Gunakan t() untuk bio */}
              {userInfo.bio || t('hero_bio')}
            </Typography>
            {/* --- AKHIR PERBAIKAN --- */}

          </Box>
          
          {/* KOLOM KANAN (FOTO) */}
          <Box sx={{ flexBasis: { xs: '100%', md: '40%' }, display: 'flex', justifyContent: 'center' }}>
            {userInfo.profile_picture_url && (
              <Box 
                component="img"
                src={`${BACKEND_URL}${userInfo.profile_picture_url}`}
                alt={userInfo.full_name}
                sx={{
                  width: '100%',
                  maxWidth: { xs: '280px', md: '450px' },
                  maxHeight: '500px',
                  height: 'auto',
                  borderRadius: '12px',
                  objectFit: 'cover',
                }}
              />
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HeroSection;