// src/public-components/HeroSection.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Box } from '@mui/material';
import ArrowIcon from './icons/ArrowIcon';
import { useTranslation } from 'react-i18next';

const BACKEND_URL = 'https://rifqy-api.gt.tc';

const HeroSection = () => {
  const [userInfo, setUserInfo] = useState(null);
  const { t, i18n } = useTranslation('common');

  useEffect(() => {
    // API dengan parameter bahasa
    axios.get(`${BACKEND_URL}/api/userinfo?lang=${i18n.language}`)
      .then(res => {
        // Ambil data pertama jika berupa array, atau langsung objeknya
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        setUserInfo(data);
      })
      .catch(err => console.error("Error fetching user info:", err));
  }, [i18n.language]);

  if (!userInfo) {
    return (
      <Box sx={{ 
        minHeight: 'calc(100vh - 80px)', 
        bgcolor: '#1125d6', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#ffed00',
        fontFamily: "'Anton', sans-serif",
        fontSize: '2rem'
      }}>
        LOADING...
      </Box>
    );
  }

  // --- TAMBAHKAN INI SEBELUM RETURN ---
  const langSuffix = i18n.language === 'id' ? 'id' : 'en';
  const heroBioText = userInfo[`hero_bio_${langSuffix}`] || userInfo.hero_bio;

  return (
    <Box 
      sx={{ 
        bgcolor: '#1125d6', // Biru elektrik Neo-Brutalism
        color: '#fff', 
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 8, md: 0 },
        borderBottom: '4px solid #000', // Batas tegas di bawah hero
        overflow: 'hidden' // Jaga-jaga kalau elemen panah keluar batas
      }}
    >
      <Container maxWidth="lg">
        <Box 
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: { xs: 6, md: 4 },
            flexDirection: { xs: 'column-reverse', md: 'row' } 
          }}
        >
          {/* ======================================= */}
          {/* KOLOM KIRI (TEKS SALAM & BIO)           */}
          {/* ======================================= */}
          <Box sx={{ flexBasis: { xs: '100%', md: '55%' }, position: 'relative', textAlign: { xs: 'center', md: 'left' } }}>
            
            {/* Arrow Icon (Tetap dipertahankan) */}
          {/* Arrow Icon (Turun ke tengah) */}
            <Box sx={{ 
              position: 'absolute', 
              top: '50%', // Posisikan di tengah secara vertikal
              right: { md: -60, lg: -50 }, // Geser ke kiri agar tidak tertimpa foto
              display: { xs: 'none', md: 'block' }, 
              // translateY(-50%) memastikan panahnya benar-benar di titik tengah
              // rotate(25deg) agak dimiringkan ke bawah agar seolah menunjuk ke foto profilmu
              transform: 'translateY(-50%) rotate(25deg) scale(1.5)', 
              zIndex: 0 
            }}>
              <ArrowIcon />
            </Box>

            {/* Teks Salam Raksasa ala Poster */}
            <Typography 
              variant="h1" 
              sx={{ 
                fontFamily: "'Anton', sans-serif",
                fontSize: { xs: '12vw', md: '4vw', lg: '6vw' }, // Ukuran dinamis super besar
                fontWeight: 'normal',
                color: '#ffed00', // Kuning terang
                textTransform: 'uppercase',
                textShadow: { xs: '4px 4px 0px #000', md: '6px 6px 0px #000' }, // Hard shadow
                lineHeight: 0.9,
                mb: 4,
                position: 'relative',
                zIndex: 2
              }}
            >
              {t('hero_greeting', { name: userInfo.full_name || 'RIFQY' })}
            </Typography>

            {/* Box Bio ala Stiker / Label Jalanan */}
            <Box sx={{
              display: 'inline-block',
              bgcolor: '#fff',
              color: '#000',
              border: '3px solid #000',
              boxShadow: '6px 6px 0px #000',
              p: { xs: 2, md: 3 },
              transform: 'rotate(-2deg)', // Dimiringkan sedikit ala stiker
              position: 'relative',
              zIndex: 2,
              maxWidth: '90%'
            }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  fontFamily: "'Inter', sans-serif", 
                  fontWeight: 800,
                  fontSize: { xs: '1rem', md: '1.2rem' },
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                {/* UBAH BARIS INI */}
                {heroBioText || t('hero_bio')}
              </Typography>
            </Box>
            
          </Box>
          
          {/* ======================================= */}
          {/* KOLOM KANAN (FOTO PROFIL)                 */}
          {/* ======================================= */}
          <Box sx={{ flexBasis: { xs: '100%', md: '40%' }, display: 'flex', justifyContent: 'center', position: 'relative' }}>
            {userInfo.profile_picture_url && (
              <Box 
                component="img"
                // --- KODE PEMBERSIH MULAI DI SINI ---
                src={
                  (() => {
                    let rawUrl = userInfo.profile_picture_url;
                    if (rawUrl && rawUrl.includes('/public')) {
                      rawUrl = rawUrl.replace('/public', '');
                    }
                    return rawUrl.startsWith('http') ? rawUrl : `${BACKEND_URL}${rawUrl}`;
                  })()
                }
                // --- KODE PEMBERSIH SELESAI ---
                alt={userInfo.full_name}
                sx={{ 
                  width: '100%', 
                  maxWidth: { xs: '280px', md: '400px' }, 
                  height: { xs: '350px', md: '500px' }, 
                  objectFit: 'cover',
                  borderRadius: '0px', 
                  border: '4px solid #000',
                  bgcolor: '#ffed00', 
                  boxShadow: '12px 12px 0px #f23a18, 12px 12px 0px 4px #000', 
                  transition: 'transform 0.2s ease',
                  '&:hover': {
                    transform: 'translate(-4px, -4px)',
                    boxShadow: '16px 16px 0px #f23a18, 16px 16px 0px 4px #000',
                  }
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