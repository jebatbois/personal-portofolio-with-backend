// src/public-components/PortfolioSection.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const BACKEND_URL = 'https://rifqy-api.gt.tc';

const PortfolioSection = () => {
  const [portfolios, setPortfolios] = useState([]);
  const { t, i18n } = useTranslation('common');

  useEffect(() => {
    // Meminta semua data dari Laravel
    axios.get(`${BACKEND_URL}/api/portfolio`)
      .then(response => setPortfolios(response.data))
      .catch(error => console.error("Error fetching portfolios:", error));
  }, []);

  if (portfolios.length === 0) return null;

  return (
    <Box id="portfolio" sx={{ bgcolor: '#ffffff', py: 15, borderBottom: '4px solid #000' }}>
      <Container maxWidth="xl"> 
        
        {/* HEADER SECTION */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 8, flexWrap: 'wrap', gap: 4 }}>
          <Typography variant="h2" sx={{ 
            fontFamily: "'Anton', sans-serif", 
            color: '#1125d6', 
            fontSize: { xs: '4rem', md: '7rem' },
            textShadow: '6px 6px 0px #000',
            textTransform: 'uppercase',
            lineHeight: 0.9,
            m: 0,
            whiteSpace: 'pre-line' 
          }}>
            {t('portfolio_title', 'LATEST\nPROJECTS')}
          </Typography>
          
          <Typography sx={{ fontWeight: 800, fontSize: '1.2rem', maxWidth: '400px', borderLeft: '4px solid #f23a18', pl: 2 }}>
            {t('portfolio_subtitle')}
          </Typography>
        </Box>

        {/* HORIZONTAL SCROLL GALLERY */}
        <Box sx={{ 
          display: 'flex', 
          overflowX: 'auto', 
          gap: { xs: 3, md: 5 }, 
          pb: 6, 
          px: 1, 
          scrollSnapType: 'x mandatory', 
          '&::-webkit-scrollbar': { height: '18px' },
          '&::-webkit-scrollbar-track': { bgcolor: '#eee', border: '3px solid #000' },
          '&::-webkit-scrollbar-thumb': { bgcolor: '#f23a18', border: '3px solid #000', cursor: 'grab' }
        }}>
          {portfolios.map(project => {
            
            // --- 1. LOGIKA BAHASA & TEKS ---
            const langSuffix = i18n.language === 'id' ? 'id' : 'en';
            const projTitle = project[`title_${langSuffix}`] || project.title;
            const projCategory = project[`category_${langSuffix}`] || project.category || 'PROJECT';
            
            // Trik Sapu Jagat untuk mencari kolom deskripsi yang benar
            const projDesc = project[`description_${langSuffix}`] || 
                             project[`summary_${langSuffix}`] || 
                             project.description || 
                             project.summary || 
                             "";

            // --- 2. LOGIKA GAMBAR & PEMBERSIH URL ---
            let rawImageUrl = project.image_url || (project.images && project.images.length > 0 ? project.images[0].image_url : null);
            if (rawImageUrl && rawImageUrl.includes('/public')) {
              rawImageUrl = rawImageUrl.replace('/public', ''); 
            }
            const coverImage = rawImageUrl 
              ? (rawImageUrl.startsWith('http') ? rawImageUrl : `${BACKEND_URL}${rawImageUrl}`)
              : 'https://via.placeholder.com/600x400/1125d6/ffed00?text=NO+IMAGE';

            return (
              <Box key={project.id} sx={{
                minWidth: { xs: '85vw', sm: '400px', md: '450px' },
                scrollSnapAlign: 'start',
                bgcolor: '#ffed00',
                border: '4px solid #000',
                boxShadow: '8px 8px 0px #000',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s',
                '&:hover': {
                  transform: 'translate(-4px, -4px)',
                  boxShadow: '12px 12px 0px #1125d6, 12px 12px 0px 4px #000' 
                }
              }}>
                {/* Gambar Project */}
                <Box 
                  component="img"
                  src={coverImage}
                  alt={projTitle}
                  sx={{ width: '100%', height: '250px', objectFit: 'cover', borderBottom: '4px solid #000', bgcolor: '#fff' }}
                />
                
                {/* Detail Info */}
                <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Typography sx={{ bgcolor: '#000', color: '#fff', px: 1.5, py: 0.5, fontSize: '0.8rem', fontWeight: 900, textTransform: 'uppercase' }}>
                      {projCategory}
                    </Typography>
                  </Box>

                  <Typography variant="h4" sx={{ fontFamily: "'Anton', sans-serif", textTransform: 'uppercase', mb: 1, lineHeight: 1.1 }}>
                    {projTitle}
                  </Typography>
                  
                  {/* Teks Deskripsi */}
                  <Typography variant="body2" sx={{ 
                    fontWeight: 600, 
                    mb: 4, 
                    display: '-webkit-box', 
                    WebkitLineClamp: 3, 
                    WebkitBoxOrient: 'vertical', 
                    overflow: 'hidden' 
                  }}>
                    {projDesc}
                  </Typography>

                  {/* Tombol Aksi */}
                  <Box sx={{ mt: 'auto', display: 'flex', gap: 2 }}>
                    <Button 
                      component={RouterLink} 
                      to={`/portfolio/${project.id}`}
                      sx={{ 
                        flexGrow: 1, bgcolor: '#f23a18', color: '#fff', border: '3px solid #000', boxShadow: '4px 4px 0px #000', fontFamily: "'Anton', sans-serif", fontSize: '1.2rem', borderRadius: 0, transition: 'transform 0.1s',
                        '&:hover': { bgcolor: '#fff', color: '#000', transform: 'translate(2px, 2px)', boxShadow: '2px 2px 0px #000' }
                      }}
                    >
                      DETAILS
                    </Button>
                    
                    {project.link && (
                      <Button 
                        href={project.link.startsWith('http') ? project.link : `https://${project.link}`}
                        target="_blank"
                        sx={{ 
                          bgcolor: '#fff', color: '#000', border: '3px solid #000', boxShadow: '4px 4px 0px #000', fontFamily: "'Anton', sans-serif", fontSize: '1.2rem', borderRadius: 0, transition: 'transform 0.1s',
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