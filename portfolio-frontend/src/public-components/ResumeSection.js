// src/public-components/ResumeSection.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Box } from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineOppositeContent, TimelineDot } from '@mui/lab';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Pastikan ini di-import

// --- PERBAIKAN UTAMA ADA DI SINI: IMPORT SEMUA IKON YANG DIPERLUKAN ---
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
// --- AKHIR PERBAIKAN ---

const BACKEND_URL = 'http://localhost:5000';

const ResumeSection = () => {
  const [resumeItems, setResumeItems] = useState([]);
  const { i18n } = useTranslation(); // Dapatkan instance i18n

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/resume?lang=${i18n.language}`)
      .then(response => {
        setResumeItems(response.data);
      })
      .catch(error => console.error("Error fetching resume data:", error));
  }, [i18n.language]); // Jalankan ulang setiap kali bahasa berubah

  const experiences = resumeItems.filter(item => item.item_type === 'experience');
  const educations = resumeItems.filter(item => item.item_type === 'education');
  const organizations = resumeItems.filter(item => item.item_type === 'organization');
  const activities = resumeItems.filter(item => item.item_type === 'activity');

  const getIcon = (type) => {
    switch(type) {
      case 'education': return <SchoolIcon />;
      case 'organization': return <PeopleIcon />;
      case 'activity': return <EventIcon />;
      default: return <WorkIcon />;
    }
  };

  const renderTimeline = (title, items) => (
    items.length > 0 && (
      <Box sx={{ width: '100%'}}>
        <Typography variant="h4" sx={{ mt: 6, mb: 3, fontWeight: 'bold' }}>{title}</Typography>
        <Timeline position="alternate"> 
          {items.map((item) => (
            <TimelineItem key={item.id}>
              <TimelineOppositeContent color="text.secondary" sx={{ m: 'auto 0' }}>
                {new Date(item.start_date).getFullYear()} - {item.end_date ? new Date(item.end_date).getFullYear() : 'Sekarang'}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineConnector sx={{ bgcolor: 'primary.main' }} />
                <TimelineDot color="primary">
                  {/* Sekarang ikon akan muncul karena sudah di-import */}
                  {getIcon(item.item_type)}
                </TimelineDot>
                <TimelineConnector sx={{ bgcolor: 'primary.main' }} />
              </TimelineSeparator>
              <TimelineContent sx={{ py: '12px', px: 2 }}>
                <Box
                  component={RouterLink}
                  to={`/resume/${item.id}`}
                  sx={{
                    display: 'block',
                    textDecoration: 'none',
                    color: 'inherit',
                    cursor: 'pointer',
                    p: 2,
                    borderRadius: 2,
                    transition: 'box-shadow 0.2s, transform 0.2s, background 0.2s',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                      boxShadow: 4,
                      transform: 'translateY(-2px) scale(1.02)',
                    }
                  }}
                >
                  <Typography variant="h6" component="span">{item.title}</Typography>
                  <Typography>{item.subtitle}</Typography>
                </Box>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      </Box>
    )
  );

  return (
    <Container maxWidth="lg" sx={{ py: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
        Resume
      </Typography>
      {renderTimeline("Pengalaman Kerja", experiences)}
      {renderTimeline("Pendidikan", educations)}
      {renderTimeline("Organisasi", organizations)}
      {renderTimeline("Aktivitas & Pencapaian", activities)}
    </Container>
  );
};

export default ResumeSection;