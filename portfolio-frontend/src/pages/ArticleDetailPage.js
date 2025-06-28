// src/pages/ArticleDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Box, CircularProgress, Alert } from '@mui/material';
import Navbar from '../public-components/Navbar';
import Footer from '../public-components/Footer';
import { useTranslation } from 'react-i18next';

const BACKEND_URL = 'http://localhost:5000';

const ArticleDetailPage = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t, i18n } = useTranslation('common'); // gunakan namespace jika ada

  useEffect(() => {
    if (!slug) return;
    axios.get(`${BACKEND_URL}/api/articles/${slug}?lang=${i18n.language}`)
      .then(res => {
        setArticle(res.data);
      })
      .catch(err => {
        setError('Artikel tidak ditemukan.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug, i18n.language]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container maxWidth="md" sx={{ py: 8, flexGrow: 1 }}>
        {loading && <Box sx={{display: 'flex', justifyContent: 'center'}}><CircularProgress /></Box>}
        {error && <Alert severity="error">{error}</Alert>}
        {article && (
          <article>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              {article.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              {t('published_at', 'Dipublikasikan pada')}: {new Date(article.created_at).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </Typography>
            {article.thumbnail_url && (
              <Box 
                component="img"
                src={`${BACKEND_URL}${article.thumbnail_url}`}
                alt={article.title}
                sx={{ width: '100%', height: 'auto', maxHeight: '450px', objectFit: 'cover', borderRadius: '8px', mb: 4 }}
              />
            )}
            <Box dangerouslySetInnerHTML={{ __html: article.content }} />
          </article>
        )}
      </Container>
      <Footer />
    </Box>
  );
};

export default ArticleDetailPage;