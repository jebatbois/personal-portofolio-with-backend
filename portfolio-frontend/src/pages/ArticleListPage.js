// src/pages/ArticleListPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Navbar from '../public-components/Navbar';
import Footer from '../public-components/Footer';
import { useTranslation } from 'react-i18next'; // Import hook

const BACKEND_URL = 'http://localhost:5000';

const ArticleListPage = () => {
  const [articles, setArticles] = useState([]);
  const { t, i18n } = useTranslation('common'); // Panggil hook

  useEffect(() => {
    // Tambahkan parameter ?lang= ke URL API
    axios.get(`${BACKEND_URL}/api/articles?lang=${i18n.language}`)
      .then(res => {
        setArticles(res.data);
      })
      .catch(err => console.error("Gagal mengambil artikel:", err));
  }, [i18n.language]); // Jalankan ulang setiap kali bahasa berubah

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* Hero Section */}
        <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
          <Container maxWidth="md">
            <Typography variant="h2" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
              {t('nav_articles')}
            </Typography>
          </Container>
        </Box>
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Grid container spacing={4}>
            {articles.map(article => (
              <Grid item key={article.id} xs={12} sm={6} md={4} sx={{ display: 'flex' }}>
                <Card
                  component={RouterLink}
                  to={`/artikel/${article.slug}`}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    textDecoration: 'none',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 8,
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="180"
                    image={article.thumbnail_url ? `${BACKEND_URL}${article.thumbnail_url}` : 'https://via.placeholder.com/300x180'}
                    alt={article.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                      {article.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {article.summary}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default ArticleListPage;