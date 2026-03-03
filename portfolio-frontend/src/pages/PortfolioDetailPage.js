// src/pages/PortfolioDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Box, Grid, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import Navbar from '../public-components/Navbar';
import Footer from '../public-components/Footer';

const BACKEND_URL = 'https://rifqy-api.gt.tc';

const PortfolioDetailPage = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation('common'); 
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        // Ambil data (mendukung multibahasa jika backend mensupportnya)
        const projectPromise = axios.get(`${BACKEND_URL}/api/portfolio/${id}?lang=${i18n.language}`);
        const imagesPromise = axios.get(`${BACKEND_URL}/api/portfolio/${id}/images`);

        const [projectResponse, imagesResponse] = await Promise.all([projectPromise, imagesPromise]);

        setProject(projectResponse.data);
        setImages(imagesResponse.data);
      } catch (err) {
        setError('Gagal memuat detail proyek.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id, i18n.language]);

  // Loading Screen Brutalism
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

  // Error Screen
  if (error || !project) {
    return (
      <>
        <Navbar />
        <Box sx={{ minHeight: '80vh', bgcolor: '#f23a18', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Anton', sans-serif", fontSize: '3rem', borderBottom: '4px solid #000' }}>
          {error || 'PROJECT NOT FOUND'}
        </Box>
        <Footer />
      </>
    );
  }

  // Ambil tags dan deskripsi sesuai bahasa
  const lang = i18n.language === 'en' ? 'en' : 'id';
  const rawTags = project[`tags_${lang}`] || '';
  const tagsArray = rawTags ? rawTags.split(',').map(t => t.trim()) : ['NO TAGS'];

  const description = project[`description_${lang}`] || 'No description available.';
  // Cek apakah URL sudah mengandung 'http', jika tidak tambahkan BACKEND_URL
 // --- JURUS PEMBERSIH URL GAMBAR UTAMA ---
  let rawCoverImage = project.image_url;
  if (rawCoverImage && rawCoverImage.includes('/public')) {
    rawCoverImage = rawCoverImage.replace('/public', '');
  }
  const coverImage = rawCoverImage 
    ? (rawCoverImage.startsWith('http') ? rawCoverImage : `${BACKEND_URL}${rawCoverImage}`) 
    : 'https://via.placeholder.com/900x500/1125d6/ffed00?text=NO+IMAGE';
  return (
    <>
      <Navbar />
      <Box sx={{ bgcolor: '#fff', minHeight: '100vh', pt: { xs: 6, md: 10 }, pb: 15, borderBottom: '4px solid #000' }}>
        <Container maxWidth="lg">
          
          {/* ======================================= */}
          {/* HEADER: Judul & Tags Tech Stack           */}
          {/* ======================================= */}
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <Typography variant="h1" sx={{ 
              fontFamily: "'Anton', sans-serif", 
              textTransform: 'uppercase', 
              color: '#000', 
              // Dobel bayangan kuning dan biru!
              textShadow: '4px 4px 0px #ffed00, 8px 8px 0px #1125d6', 
              mb: 4, 
              fontSize: { xs: '3.5rem', md: '6rem' }, 
              lineHeight: 1 
            }}>
              {project.project_name || project.title}
            </Typography>

            {/* TAGS / BUILT WITH */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center', alignItems: 'center', mb: 4 }}>
              <Typography sx={{ fontFamily: "'Anton', sans-serif", fontSize: '1.5rem', mr: 1 }}>
                {t('portfolio_built_with', 'BUILT WITH:')}
              </Typography>
              {tagsArray.map((tag, idx) => (
                <Box key={idx} sx={{ 
                  bgcolor: '#000', 
                  color: '#fff', 
                  border: '3px solid #000', 
                  boxShadow: '4px 4px 0px #f23a18', // Shadow merah
                  px: 2, 
                  py: 0.5, 
                  transform: idx % 2 === 0 ? 'rotate(-2deg)' : 'rotate(2deg)' // Miring bergantian
                }}>
                  <Typography sx={{ fontWeight: 900, fontFamily: "'Inter', sans-serif", textTransform: 'uppercase', fontSize: '1rem' }}>
                    {tag}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* ======================================= */}
          {/* MAIN IMAGE                              */}
          {/* ======================================= */}
          <Box sx={{ position: 'relative', mb: 8, display: 'flex', justifyContent: 'center' }}>
            <Box 
              component="img"
              src={coverImage}
              alt={project.project_name || project.title}
              sx={{ 
                width: '100%', 
                maxWidth: '1000px',
                height: 'auto', 
                maxHeight: '600px',
                objectFit: 'cover', 
                border: '4px solid #000',
                boxShadow: '15px 15px 0px #1125d6', // Bayangan raksasa biru
                bgcolor: '#ffed00'
              }}
            />
          </Box>

          {/* ======================================= */}
          {/* KONTEN BAWAH: Deskripsi & Action        */}
          {/* ======================================= */}
          <Grid container spacing={6}>
            <Grid item xs={12} md={8}>
              {/* DESKRIPSI (Gaya Kertas/Artikel Majalah) */}
              <Box sx={{ 
                bgcolor: '#fff', 
                border: '4px solid #000', 
                boxShadow: '10px 10px 0px #000', 
                p: { xs: 3, md: 5 }, 
                position: 'relative'
              }}>
                {/* Aksen Label di Pojok Kiri Atas Kertas */}
                <Box sx={{ position: 'absolute', top: -20, left: 20, bgcolor: '#ffed00', border: '3px solid #000', px: 2, py: 0.5 }}>
                  <Typography sx={{ fontFamily: "'Anton', sans-serif", fontSize: '1.2rem', color: '#000' }}>{t('portfolio_about_project', 'ABOUT THE PROJECT')}</Typography>
                </Box>
                
                <Typography variant="body1" sx={{ 
                  fontFamily: "'Inter', sans-serif", 
                  fontSize: { xs: '1.1rem', md: '1.2rem' }, 
                  lineHeight: 1.8, 
                  fontWeight: 500, 
                  whiteSpace: 'pre-wrap',
                  color: '#000',
                  mt: 2
                }}>
                  {description}
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              {/* KOLOM KANAN: ACTIONS / LINKS */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {project.project_link && (
                  <Button 
                    href={project.project_link.startsWith('http') ? project.project_link : `https://${project.project_link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ 
                      bgcolor: '#f23a18', // Tombol Merah Terang
                      color: '#fff', 
                      border: '4px solid #000',
                      boxShadow: '6px 6px 0px #000',
                      fontFamily: "'Anton', sans-serif",
                      fontSize: '1.5rem',
                      py: 2,
                      borderRadius: 0,
                      transition: 'all 0.1s',
                      '&:hover': { bgcolor: '#fff', color: '#000', transform: 'translate(2px, 2px)', boxShadow: '4px 4px 0px #000' }
                    }}
                  >
                    {t('portfolio_visit_project', 'VISIT PROJECT')}
                  </Button>
                )}
                
                {/* Status Box sebagai Pemanis Desain */}
                <Box sx={{ 
                  bgcolor: '#1125d6', 
                  color: '#ffed00', 
                  border: '4px solid #000', 
                  p: 3,
                  boxShadow: '6px 6px 0px #000',
                  textAlign: 'center',
                  transform: 'rotate(1deg)'
                }}>
                  <Typography sx={{ fontFamily: "'Anton', sans-serif", fontSize: '2rem', lineHeight: 1 }}>STATUS</Typography>
                  <Typography sx={{ fontWeight: 800, mt: 1, textTransform: 'uppercase' }}>
                    {project[`status_${lang}`] ? project[`status_${lang}`] : t('portfolio_status_unknown', 'UNKNOWN')}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>

          {/* ======================================= */}
          {/* GALERI FOTO (EVIDENCE)                  */}
          {/* ======================================= */}
          {images && images.length > 0 && (
            <Box sx={{ mt: 15 }}>
              <Typography variant="h2" sx={{ 
                fontFamily: "'Anton', sans-serif", 
                textTransform: 'uppercase', 
                mb: 5, 
                display: 'inline-block',
                bgcolor: '#000',
                color: '#fff',
                px: 3,
                py: 1,
                border: '3px solid #000',
                boxShadow: '8px 8px 0px #f23a18',
                transform: 'rotate(-1deg)'
              }}>
                {i18n.language === 'en' ? 'GALLERY.' : 'GALERI PROYEK.'}
              </Typography>
              
              <Grid container spacing={5}>
                {images.map((image, index) => (
                  <Grid item xs={12} sm={6} md={4} key={image.id}>
                    <Box
                      sx={{
                        width: '100%',
                        aspectRatio: '4/3',
                        border: '4px solid #000',
                        boxShadow: '8px 8px 0px #000',
                        bgcolor: '#ffed00',
                        transition: 'all 0.2s ease',
                        cursor: 'crosshair',
                        p: 1.5, // padding agar gambar tidak nempel ke border
                        boxSizing: 'border-box',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        '&:hover': {
                          transform: index % 2 === 0 ? 'translate(-4px, -4px) rotate(2deg)' : 'translate(-4px, -4px) rotate(-2deg)',
                          boxShadow: '12px 12px 0px #1125d6'
                        }
                      }}
                    >
                     <img
                        // --- JURUS PEMBERSIH URL GALERI ---
                        src={(() => {
                          let imgUrl = image.image_url;
                          if (imgUrl && imgUrl.includes('/public')) imgUrl = imgUrl.replace('/public', '');
                          return imgUrl ? (imgUrl.startsWith('http') ? imgUrl : `${BACKEND_URL}${imgUrl}`) : '';
                        })()}
                        alt={`Gallery ${index}`}
                        style={{
                          width: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain',
                          display: 'block',
                          borderRadius: '6px'
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

export default PortfolioDetailPage;