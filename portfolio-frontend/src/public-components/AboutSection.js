// src/public-components/AboutSection.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Container, Typography, Box, Grid, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CakeIcon from '@mui/icons-material/Cake';
import InterestsIcon from '@mui/icons-material/Interests';

const BACKEND_URL = 'http://localhost:5000';

const AboutSection = () => {
  const [userInfo, setUserInfo] = useState(null);
  const { t, i18n } = useTranslation('common');

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/userinfo?lang=${i18n.language}`)
      .then(res => setUserInfo(res.data))
      .catch(err => console.error("Error fetching user info:", err));
  }, [i18n.language]);

  if (!userInfo) return null;

  return (
    <Box sx={{ py: 10, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          {/* Kolom Kiri: Foto */}
          <Grid item xs={12} md={5}>
            {userInfo.about_image_url && (
              <Box 
                component="img" 
                src={`${BACKEND_URL}${userInfo.about_image_url}`} 
                alt={t('about_image_alt', 'Foto Tentang Saya')}
                sx={{
                  width: '100%',
                  maxWidth: '400px', 
                  height: 'auto',
                  borderRadius: '12px',
                  display: 'block',
                  mx: 'auto'
                }} 
              />
            )}
          </Grid>
          {/* Kolom Kanan: Deskripsi & Biodata */}
          <Grid item xs={12} md={7}>
            <Typography variant="h3" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
              {t('about_me_title', 'Tentang Saya')}
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.7, whiteSpace: 'pre-wrap', mb: 3 }}>
              {userInfo.about_description}
            </Typography>
            <List>
              <ListItem disablePadding>
                <ListItemIcon sx={{ minWidth: 40 }}><CakeIcon color="primary" /></ListItemIcon>
                <ListItemText 
                  primary={
                    userInfo.date_of_birth
                      ? new Date(userInfo.date_of_birth.length > 10
                          ? userInfo.date_of_birth.slice(0, 10)
                          : userInfo.date_of_birth
                        + 'T00:00:00').toLocaleDateString(
                          i18n.language === 'en' ? 'en-US' : 'id-ID',
                          { day: 'numeric', month: 'long', year: 'numeric' }
                        )
                      : '-'
                  } 
                  secondary={t('dob_label', 'Tanggal Lahir')} 
                />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon sx={{ minWidth: 40 }}><LocationOnIcon color="primary" /></ListItemIcon>
                <ListItemText 
                  primary={userInfo.location || '-'} 
                  secondary={t('location_label', 'Lokasi')} 
                />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon sx={{ minWidth: 40 }}><InterestsIcon color="primary" /></ListItemIcon>
                <ListItemText 
                  primary={userInfo.hobbies || '-'} 
                  secondary={t('hobbies_label', 'Hobi')} 
                />
              </ListItem>
            </List>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutSection;