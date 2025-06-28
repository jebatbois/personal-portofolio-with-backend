// src/pages/ResumeDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Box, Grid, Paper, CircularProgress } from '@mui/material';
import Navbar from '../public-components/Navbar';
import Footer from '../public-components/Footer';

const BACKEND_URL = 'http://localhost:5000';

const ResumeDetailPage = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const itemPromise = axios.get(`${BACKEND_URL}/api/resume/${id}`);
        const imagesPromise = axios.get(`${BACKEND_URL}/api/resume/${id}/images`);
        const [itemResponse, imagesResponse] = await Promise.all([itemPromise, imagesPromise]);
        setItem(itemResponse.data);
        setImages(imagesResponse.data);
      } catch (error) { console.error("Gagal memuat detail riwayat.", error); }
      finally { setLoading(false); }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <Box sx={{display: 'flex', justifyContent: 'center', my: 10}}><CircularProgress /></Box>;
  if (!item) return <Typography>Item tidak ditemukan.</Typography>;

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h3" component="h1" gutterBottom>{item.title}</Typography>
        <Typography variant="h5" color="text.secondary" gutterBottom>{item.subtitle}</Typography>
        <Typography variant="overline" display="block">
          {new Date(item.start_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })} - 
          {item.end_date ? new Date(item.end_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' }) : 'Sekarang'}
        </Typography>
        <Typography variant="body1" sx={{ my: 4, whiteSpace: 'pre-wrap' }}>
          {item.description}
        </Typography>

        {/* Galeri Foto */}
        {images.length > 0 && (
          <Box>
            <Typography variant="h4" gutterBottom>Galeri Foto</Typography>
            <Grid container spacing={2}>
              {images.map(image => (
                <Grid item xs={6} sm={4} key={image.id}>
                    <img src={`${BACKEND_URL}${image.image_url}`} alt="Detail riwayat" style={{ width: '100%', borderRadius: '8px' }} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default ResumeDetailPage;