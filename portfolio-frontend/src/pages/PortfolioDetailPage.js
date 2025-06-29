// src/pages/PortfolioDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Box, CircularProgress, Alert, Grid, Paper } from '@mui/material';
import Navbar from '../public-components/Navbar';
import Footer from '../public-components/Footer';

const BACKEND_URL = 'http://localhost:5000';

const PortfolioDetailPage = () => {
  // Ambil 'id' dari URL
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        // Ambil data utama proyek dan data gambar galeri secara bersamaan
        const projectPromise = axios.get(`${BACKEND_URL}/api/portfolio/${id}`);
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
  }, [id]);

  let content;
  if (loading) {
    content = <CircularProgress />;
  } else if (error) {
    content = <Alert severity="error">{error}</Alert>;
  } else if (project) {
    content = (
      <>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          {project.project_name}
        </Typography>
        <Box
          component="img"
          src={`${BACKEND_URL}${project.image_url}`}
          alt={project.project_name}
          sx={{ width: '100%', maxHeight: '500px', objectFit: 'cover', borderRadius: '8px', mb: 4 }}
        />
        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 3 }}>
          {project.description}
        </Typography>
        {project.project_link && (
          <Box sx={{ mb: 4 }}>
            <a
              href={project.project_link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '10px 24px',
                background: '#1976d2',
                color: '#fff',
                borderRadius: '6px',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'background 0.2s',
              }}
              onMouseOver={e => (e.currentTarget.style.background = '#1565c0')}
              onMouseOut={e => (e.currentTarget.style.background = '#1976d2')}
            >
              Kunjungi Proyek
            </a>
          </Box>
        )}
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ py: 8 }}>
        {content}
      </Container>


       {images.length > 0 && (
        <Box sx={{ mt: 5 }}>
          <Typography variant="h4" gutterBottom>Galeri Proyek</Typography>
          <Grid container spacing={3}>
            {images.map(image => (
              <Grid item xs={12} sm={6} md={4} key={image.id}>
                <Paper
                  elevation={4}
                  sx={{
                    borderRadius: 3,
                    overflow: 'hidden',
                    p: 0,
                    height: 370,
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
                  }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: 240,
                      overflow: 'hidden',
                      bgcolor: '#f5f5f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img
                      src={`${BACKEND_URL}${image.image_url}`}
                      alt="Detail proyek"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  </Box>
                  {/* Jika ingin menambah caption atau info gambar */}
                  {/* <Box sx={{ p: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {image.caption || ''}
                    </Typography>
                  </Box> */}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
            <Footer />
    </>
  );
};


export default PortfolioDetailPage;