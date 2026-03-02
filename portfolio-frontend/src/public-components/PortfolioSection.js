// src/public-components/PortfolioSection.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const BACKEND_URL = 'https://personal-portofolio-with-backend.vercel.app';

const PortfolioSection = () => {
  const [portfolios, setPortfolios] = useState([]);
  const { t, i18n } = useTranslation('common');

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/portfolio?lang=${i18n.language}`)
      .then(response => setPortfolios(response.data))
      .catch(error => console.error("Error fetching portfolios:", error));
  }, [i18n.language]);

  if (portfolios.length === 0) return null;

  return (
    <Box id="portfolio" sx={{ bgcolor: '#ffffff', py: 15, borderBottom: '4px solid #000' }}>
      {/* Menggunakan maxWidth="xl" agar gallery punya ruang horizontal luas */}
      <Container maxWidth="xl"> 
        
        {/* ======================================= */}
        {/* HEADER SECTION                          */}
        {/* ======================================= */}
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 8, flexWrap: 'wrap', gap: 4 }}>
          <Typography variant="h2" sx={{ 
            fontFamily: "'Anton', sans-serif", 
            color: '#1125d6', 
            fontSize: { xs: '4rem', md: '7rem' },
            textShadow: '6px 6px 0px #000',
            textTransform: 'uppercase',
            lineHeight: 0.9,
            m: 0,
            whiteSpace: 'pre-line' // Penting agar \n dari JSON bisa jadi baris baru
          }}>
            {t('portfolio_title', 'LATEST\nPROJECTS')}
          </Typography>
          
          <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', maxWidth: '400px', borderLeft: '4px solid #f23a18', pl: 2 }}>
            {t('portfolio_subtitle')}
          </Typography>
        </Box>

        {/* ======================================= */}
        {/* HORIZONTAL SCROLL GALLERY               */}
        {/* ======================================= */}
        <Box sx={{ 
          display: 'flex', 
          overflowX: 'auto', 
          gap: { xs: 3, md: 5 }, 
          pb: 6, // Padding bawah untuk tempat scrollbar dan shadow
          px: 1, // Padding X agar shadow card pertama & terakhir tidak terpotong
          scrollSnapType: 'x mandatory', // Mengunci scroll pada tiap card (snap)
          
          /* Custom Brutal Scrollbar */
          '&::-webkit-scrollbar': { 
            height: '18px' 
          },
          '&::-webkit-scrollbar-track': { 
            bgcolor: '#eee', 
            border: '3px solid #000' 
          },
          '&::-webkit-scrollbar-thumb': { 
            bgcolor: '#f23a18', // Scrollbar merah terang!
            border: '3px solid #000',
            cursor: 'grab'
          }
        }}>
          {portfolios.map(project => {
            // Logika Gambar (Sudah mendukung URL Cloudinary maupun lokal)
            const coverImage = project.image_url 
              ? (project.image_url.startsWith('http') ? project.image_url : `${BACKEND_URL}${project.image_url}`)
              : (project.images && project.images.length > 0
                ? (project.images[0].image_url.startsWith('http') ? project.images[0].image_url : `${BACKEND_URL}${project.images[0].image_url}`)
                : 'https://via.placeholder.com/600x400/1125d6/ffed00?text=NO+IMAGE');

            return (
              <Box key={project.id} sx={{
                minWidth: { xs: '85vw', sm: '400px', md: '450px' }, // Lebar tetap tiap card
                scrollSnapAlign: 'start', // Titik henti saat digeser
                bgcolor: '#ffed00', // Card warna kuning
                border: '4px solid #000',
                boxShadow: '8px 8px 0px #000',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translate(-4px, -4px)',
                  boxShadow: '12px 12px 0px #1125d6, 12px 12px 0px 4px #000' // Shadow biru saat disorot
                }
              }}>
                {/* Gambar Project */}
                <Box 
                  component="img"
                  src={coverImage}
                  alt={project.title}
                  sx={{
                    width: '100%',
                    height: '250px',
                    objectFit: 'cover',
                    borderBottom: '4px solid #000',
                    bgcolor: '#fff'
                  }}
                />
                
                {/* Detail Info */}
                <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  
                  {/* Kategori ala Label Hitam */}
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Typography sx={{ bgcolor: '#000', color: '#fff', px: 1.5, py: 0.5, fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase' }}>
                      {project.category || 'PROJECT'}
                    </Typography>
                  </Box>

                  <Typography variant="h4" sx={{ fontFamily: "'Anton', sans-serif", textTransform: 'uppercase', mb: 1, lineHeight: 1.1 }}>
                    {project.title}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ 
                    fontWeight: 600, 
                    mb: 4, 
                    display: '-webkit-box', 
                    WebkitLineClamp: 3, // Maksimal 3 baris deskripsi
                    WebkitBoxOrient: 'vertical', 
                    overflow: 'hidden' 
                  }}>
                    {project.description || project.summary}
                  </Typography>

                  {/* Tombol Aksi Keras (Hard Buttons) */}
                  <Box sx={{ mt: 'auto', display: 'flex', gap: 2 }}>
                    <Button 
                      component={RouterLink} 
                      to={`/portfolio/${project.id}`}
                      sx={{ 
                        flexGrow: 1,
                        bgcolor: '#f23a18', // Tombol Merah
                        color: '#fff', 
                        border: '3px solid #000',
                        boxShadow: '4px 4px 0px #000',
                        fontFamily: "'Anton', sans-serif",
                        fontSize: '1.2rem',
                        borderRadius: 0,
                        transition: 'transform 0.1s',
                        '&:hover': { bgcolor: '#fff', color: '#000', transform: 'translate(2px, 2px)', boxShadow: '2px 2px 0px #000' }
                      }}
                    >
                      DETAILS
                    </Button>
                    
                    {/* Jika ada URL Demo/Web, tampilkan tombol Visit */}
                    {project.link && (
                      <Button 
                        href={project.link.startsWith('http') ? project.link : `https://${project.link}`}
                        target="_blank"
                        sx={{ 
                          bgcolor: '#fff', 
                          color: '#000', 
                          border: '3px solid #000',
                          boxShadow: '4px 4px 0px #000',
                          fontFamily: "'Anton', sans-serif",
                          fontSize: '1.2rem',
                          borderRadius: 0,
                          transition: 'transform 0.1s',
                          '&:hover': { bgcolor: '#000', color: '#fff', transform: 'translate(2px, 2px)', boxShadow: '2px 2px 0px #000' }
                        }}
                      >
                        VISIT
                      </Button>
                    )}
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Container>
    </Box>
  );
};

export default PortfolioSection;