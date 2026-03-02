// src/public-components/ResumeSection.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Box, Grid } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Ikon
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';

const BACKEND_URL = 'http://localhost:5000';

const ResumeSection = () => {
  const [resumeItems, setResumeItems] = useState([]);
  const { t, i18n } = useTranslation('common');

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/resume?lang=${i18n.language}`)
      .then(response => setResumeItems(response.data))
      .catch(error => console.error("Error fetching resume data:", error));
  }, [i18n.language]);

  const getIcon = (type) => {
    const style = { fontSize: '2rem', color: '#000' };
    switch(type) {
      case 'education': return <SchoolIcon sx={style} />;
      case 'organization': return <PeopleIcon sx={style} />;
      case 'activity': return <EventIcon sx={style} />;
      default: return <WorkIcon sx={style} />;
    }
  };

  const renderCategory = (title, type) => {
    const items = resumeItems.filter(item => item.item_type === type);
    if (items.length === 0) return null;

    return (
      <Box sx={{ mb: 10, width: '100%' }}>
        {/* Sub-judul kategori ala Headline koran */}
        <Typography variant="h3" sx={{ 
          fontFamily: "'Anton', sans-serif", 
          bgcolor: '#f23a18', 
          color: '#fff', 
          display: 'inline-block',
          px: 3, py: 1,
          mb: 5,
          border: '3px solid #000',
          boxShadow: '6px 6px 0px #000',
          textTransform: 'uppercase',
          transform: 'rotate(-1deg)'
        }}>
          {title}
        </Typography>

        <Grid container spacing={4}>
          {items.map((item, index) => (
            <Grid item xs={12} md={6} key={item.id}>
              <Box
                component={RouterLink}
                to={`/resume/${item.id}`}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  textDecoration: 'none',
                  color: 'inherit',
                  bgcolor: '#fff',
                  border: '4px solid #000',
                  p: 3,
                  height: '100%',
                  position: 'relative',
                  boxShadow: '8px 8px 0px #000',
                  transition: 'all 0.15s',
                  '&:hover': {
                    transform: 'translate(-4px, -4px)',
                    boxShadow: '12px 12px 0px #ffed00, 12px 12px 0px 4px #000',
                    '& .icon-box': { bgcolor: '#ffed00' }
                  }
                }}
              >
                {/* Tahun di pojok kanan atas ala Label Harga */}
                <Box sx={{ 
                  position: 'absolute', top: -15, right: 20, 
                  bgcolor: '#000', color: '#fff', 
                  px: 2, py: 0.5, 
                  fontFamily: "'Anton', sans-serif",
                  border: '2px solid #fff',
                  zIndex: 2
                }}>
                  {new Date(item.start_date).getFullYear()} - {item.end_date ? new Date(item.end_date).getFullYear() : 'NOW'}
                </Box>

                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', mb: 2 }}>
                  <Box className="icon-box" sx={{ 
                    p: 1, border: '3px solid #000', bgcolor: '#eee', 
                    display: 'flex', transition: 'background 0.2s' 
                  }}>
                    {getIcon(item.item_type)}
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontFamily: "'Anton', sans-serif", textTransform: 'uppercase', lineHeight: 1.2 }}>
                      {item.title}
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#1125d6' }}>
                      {item.subtitle}
                    </Typography>
                  </Box>
                </Box>

                {item.summary && (
                  <Typography variant="body2" sx={{ 
                    mt: 'auto', fontWeight: 600, borderTop: '2px solid #000', pt: 2, fontStyle: 'italic' 
                  }}>
                    {item.summary}
                  </Typography>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };

  return (
    <Box id="resume" sx={{ bgcolor: '#1125d6', py: 15, borderBottom: '4px solid #000' }}>
      <Container maxWidth="lg">
     <Typography variant="h2" align="center" sx={{ 
          fontFamily: "'Anton', sans-serif", 
          color: '#ffed00', 
          fontSize: { xs: '3.5rem', md: '6rem' },
          textShadow: '8px 8px 0px #000',
          mb: 12,
          textTransform: 'uppercase'
        }}>
          {t('resume_title', 'TRACK RECORD')}
        </Typography>

        {renderCategory(t('experience_title', 'Experience'), 'experience')}
        {renderCategory(t('education_title', 'Education'), 'education')}
        {renderCategory(t('organization_title', 'Organizations'), 'organization')}
        {renderCategory(t('activity_title', 'Activities'), 'activity')}
      </Container>
    </Box>
  );
};

export default ResumeSection;