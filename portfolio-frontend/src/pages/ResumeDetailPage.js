// src/pages/ResumeDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Box, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Navbar from '../public-components/Navbar';
import Footer from '../public-components/Footer';

const BACKEND_URL = 'https://personal-portofolio-with-backend.vercel.app';

const ResumeDetailPage = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation('common');
  const [item, setItem] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const itemPromise = axios.get(`${BACKEND_URL}/api/resume/${id}?lang=${i18n.language}`);
        const imagesPromise = axios.get(`${BACKEND_URL}/api/resume/${id}/images`);
        const [itemResponse, imagesResponse] = await Promise.all([itemPromise, imagesPromise]);
        setItem(itemResponse.data);
        setImages(imagesResponse.data);
      } catch (error) { 
        console.error("Gagal memuat detail riwayat.", error); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchDetails();
  }, [id, i18n.language]);

  if (loading) {
    return (
      <>
        <Navbar />
        <Box sx={{ minHeight: '80vh', bgcolor: '#1125d6', color: '#ffed00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Anton', sans-serif", fontSize: '3rem', borderBottom: '4px solid #000' }}>
          LOADING DATA...
        </Box>
        <Footer />
      </>
    );
  }

  if (!item) {
    return (
      <>
        <Navbar />
        <Box sx={{ minHeight: '80vh', bgcolor: '#f23a18', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Anton', sans-serif", fontSize: '3rem', borderBottom: '4px solid #000' }}>
          DATA NOT FOUND
        </Box>
        <Footer />
      </>
    );
  }

  // Format tanggal sesuai bahasa
  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'id-ID', { year: 'numeric', month: 'short' });
  };

  return (
    <>
      <Navbar />
      
      {/* Kontainer Utama */}
      <Box sx={{ bgcolor: '#fff', minHeight: '100vh', pt: { xs: 6, md: 10 }, pb: 15, borderBottom: '4px solid #000' }}>
        <Container maxWidth="md">
          
          {/* HEADER DOKUMEN */}
          <Box sx={{ mb: 6 }}>
            {/* Judul Raksasa */}
            <Typography variant="h1" sx={{ 
              fontFamily: "'Anton', sans-serif", 
              textTransform: 'uppercase', 
              color: '#1125d6', 
              textShadow: { xs: '3px 3px 0px #000', md: '5px 5px 0px #000' }, 
              mb: 3, 
              fontSize: { xs: '3.5rem', md: '5.5rem' }, 
              lineHeight: 1 
            }}>
              {item.title}
            </Typography>

            {/* Label Subtitle & Tahun */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
              <Box sx={{ bgcolor: '#ffed00', border: '3px solid #000', boxShadow: '4px 4px 0px #000', px: 2, py: 1, transform: 'rotate(-1deg)' }}>
                <Typography sx={{ fontWeight: 900, fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', color: '#000', fontSize: '1.1rem' }}>
                  {item.subtitle}
                </Typography>
              </Box>

              <Box sx={{ bgcolor: '#000', border: '3px solid #000', boxShadow: '4px 4px 0px #f23a18', px: 2, py: 1 }}>
                <Typography sx={{ fontWeight: 800, fontFamily: "'Anton', sans-serif", letterSpacing: '1px', color: '#fff', fontSize: '1.2rem' }}>
                  {formatDate(item.start_date)} - {item.end_date ? formatDate(item.end_date) : 'NOW'}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* DESKRIPSI (Gaya Kertas Berita) */}
          <Box sx={{ 
            bgcolor: '#fff', 
            border: '4px solid #000', 
            boxShadow: '10px 10px 0px #000', 
            p: { xs: 3, md: 5 }, 
            mb: 10,
            position: 'relative'
          }}>
            {/* Aksen Solasi di ujung kertas */}
            <Box sx={{ position: 'absolute', top: -15, left: '50%', transform: 'translateX(-50%) rotate(-3deg)', width: '100px', height: '30px', bgcolor: 'rgba(255,237,0,0.8)', border: '2px solid #000' }} />
            
            <Typography variant="body1" sx={{ 
              fontFamily: "'Inter', sans-serif", 
              fontSize: { xs: '1.1rem', md: '1.3rem' }, 
              lineHeight: 1.8, 
              fontWeight: 500, 
              whiteSpace: 'pre-wrap',
              color: '#000'
            }}>
              {item.description}
            </Typography>
          </Box>

          {/* GALERI FOTO */}
          {images.length > 0 && (
            <Box>
              <Typography variant="h2" sx={{ 
                fontFamily: "'Anton', sans-serif", 
                textTransform: 'uppercase', 
                mb: 4, 
                display: 'inline-block',
                bgcolor: '#000',
                color: '#fff',
                px: 2,
                py: 1,
                border: '3px solid #000',
                boxShadow: '6px 6px 0px #f23a18'
              }}>
                {i18n.language === 'en' ? 'EVIDENCE.' : 'BUKTI DOKUMENTASI.'}
              </Typography>
              
              <Grid container spacing={4}>
                {images.map(image => (
                  <Grid item xs={12} sm={6} md={4} key={image.id}>
                    <Box
                      sx={{
                        width: '100%',
                        aspectRatio: '4/3', // Rasio galeri modern tapi border kasar
                        border: '4px solid #000',
                        boxShadow: '8px 8px 0px #000',
                        bgcolor: '#ffed00', // Kuning jika transparan
                        transition: 'all 0.2s ease',
                        cursor: 'crosshair',
                        '&:hover': {
                          transform: 'translate(-4px, -4px) rotate(2deg)', // Efek foto miring pas dihover
                          boxShadow: '12px 12px 0px #1125d6' // Bayangan biru saat dihover
                        }
                      }}
                    >
                      <img
                        src={image.image_url.startsWith('http') ? image.image_url : `${BACKEND_URL}${image.image_url}`}
                        alt="Evidence"
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default ResumeDetailPage;