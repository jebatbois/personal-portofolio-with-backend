// src/public-components/AboutSection.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Container, Typography, Box, Grid } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CakeIcon from '@mui/icons-material/Cake';
import InterestsIcon from '@mui/icons-material/Interests';

const BACKEND_URL = 'https://rifqy-api.gt.tc';

const AboutSection = () => {
  const [userInfo, setUserInfo] = useState(null);
  const { t, i18n } = useTranslation('common');

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/userinfo?lang=${i18n.language}`)
      .then(res => {
        const data = Array.isArray(res.data) ? res.data[0] : res.data;
        setUserInfo(data);
      })
      .catch(err => console.error("Error fetching user info:", err));
  }, [i18n.language]);

  if (!userInfo) return null;

  // Helper untuk format tanggal
  const formattedDate = userInfo.date_of_birth
    ? new Date(userInfo.date_of_birth.slice(0, 10) + 'T00:00:00').toLocaleDateString(
        i18n.language === 'en' ? 'en-US' : 'id-ID',
        { day: 'numeric', month: 'long', year: 'numeric' }
      )
      
    : '-';

    // --- TAMBAHKAN INI SEBELUM RETURN ---
  const langSuffix = i18n.language === 'id' ? 'id' : 'en';
  const aboutDesc = userInfo[`about_description_${langSuffix}`] || userInfo.about_description;
  const locationText = userInfo[`location_${langSuffix}`] || userInfo.location;
  const hobbiesText = userInfo[`hobbies_${langSuffix}`] || userInfo.hobbies;    

  return (
    <Box id="about" sx={{ py: 15, bgcolor: '#ffed00', color: '#000', borderBottom: '4px solid #000' }}>
      <Container maxWidth="lg">
        <Grid container spacing={8} alignItems="center">
          
          {/* KOLOM KIRI: FOTO DENGAN HARD SHADOW */}
          <Grid item xs={12} md={5}>
            {userInfo.about_image_url && (
              <Box sx={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                {/* Aksen Kotak Merah di Belakang Foto */}
                <Box sx={{
                  position: 'absolute',
                  top: 20,
                  left: 20,
                  width: '100%',
                  height: '100%',
                  bgcolor: '#f23a18',
                  border: '3px solid #000',
                  zIndex: 0
                }} />
                <Box 
                  component="img" 
                  // --- KODE PEMBERSIH MULAI DI SINI ---
                  src={
                    (() => {
                      let rawUrl = userInfo.about_image_url;
                      if (!rawUrl) return 'https://via.placeholder.com/450?text=NO+IMAGE';
                      if (rawUrl.includes('/public')) {
                        rawUrl = rawUrl.replace('/public', '');
                      }
                      return rawUrl.startsWith('http') ? rawUrl : `${BACKEND_URL}${rawUrl}`;
                    })()
                  }
                  // --- KODE PEMBERSIH SELESAI ---
                  alt="About Me"
                  sx={{
                    width: '100%',
                    maxWidth: '450px', 
                    height: 'auto',
                    border: '4px solid #000',
                    display: 'block',
                    position: 'relative',
                    zIndex: 1,
                    bgcolor: '#fff'
                  }} 
                />
              </Box>
            )}
          </Grid>

          {/* KOLOM KANAN: DESKRIPSI & INFO BLOCKS */}
          <Grid item xs={12} md={7}>
            <Typography variant="h2" sx={{ 
              fontFamily: "'Anton', sans-serif", 
              textTransform: 'uppercase',
              fontSize: { xs: '3rem', md: '4.5rem' },
              mb: 4,
              lineHeight: 1
            }}>
              {t('about_me_title', 'WHO AM I?')}
            </Typography>

            <Box sx={{ 
              bgcolor: '#000', 
              color: '#fff', 
              p: 4, 
              border: '3px solid #000',
              boxShadow: '10px 10px 0px #1125d6', // Shadow biru
              mb: 5
            }}>
              <Typography variant="body1" sx={{ 
                fontSize: '1.2rem', 
                lineHeight: 1.6, 
                fontWeight: 600,
                fontFamily: "'Inter', sans-serif"
              }}>
                {aboutDesc || t('about_description')}
              </Typography>
            </Box>

            {/* INFO BLOCKS (Biodata ala Stiker) */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              
              {/* Box Tanggal Lahir */}
              <Box sx={{ 
                bgcolor: '#fff', 
                border: '3px solid #000', 
                p: 2, 
                boxShadow: '5px 5px 0px #000',
                transform: 'rotate(-1deg)'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <CakeIcon sx={{ color: '#f23a18' }} />
                  <Typography variant="caption" sx={{ fontWeight: 900, textTransform: 'uppercase' }}>{t('dob_label', 'BORN')}</Typography>
                </Box>
                <Typography sx={{ fontWeight: 800 }}>{formattedDate}</Typography>
              </Box>

              {/* Box Lokasi */}
              <Box sx={{ 
                bgcolor: '#fff', 
                border: '3px solid #000', 
                p: 2, 
                boxShadow: '5px 5px 0px #000',
                transform: 'rotate(2deg)'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <LocationOnIcon sx={{ color: '#1125d6' }} />
                  <Typography variant="caption" sx={{ fontWeight: 900, textTransform: 'uppercase' }}>{t('location_label', 'BASE')}</Typography>
                </Box>
                <Typography sx={{ fontWeight: 800 }}>{locationText || '-'}</Typography>
              </Box>

              {/* Box Hobi */}
              <Box sx={{ 
                bgcolor: '#fff', 
                border: '3px solid #000', 
                p: 2, 
                boxShadow: '5px 5px 0px #000',
                transform: 'rotate(-2deg)'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <InterestsIcon sx={{ color: '#f23a18' }} />
                  <Typography variant="caption" sx={{ fontWeight: 900, textTransform: 'uppercase' }}>{t('hobbies_label', 'LIKES')}</Typography>
                </Box>
                <Typography sx={{ fontWeight: 800 }}>{hobbiesText || '-'}</Typography>
              </Box>

            </Box>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
};

export default AboutSection;