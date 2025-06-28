// src/pages/ArticleDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Box, CircularProgress, Alert } from '@mui/material';
import Navbar from '../public-components/Navbar';
import Footer from '../public-components/Footer';

const BACKEND_URL = 'http://localhost:5000';

const ArticleDetailPage = () => {
  const { slug } = useParams(); // Ambil 'slug' dari URL
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/articles/${slug}`)
      .then(res => {
        setArticle(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Artikel tidak ditemukan.');
        setLoading(false);
        console.error(err);
      });
  }, [slug]); // Jalankan ulang jika slug berubah

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
              Dipublikasikan pada: {new Date(article.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
            </Typography>
            {article.thumbnail_url && (
              <Box 
                component="img"
                src={`${BACKEND_URL}${article.thumbnail_url}`}
                alt={article.title}
                sx={{ width: '100%', height: 'auto', maxHeight: '450px', objectFit: 'cover', borderRadius: '8px', mb: 4 }}
              />
            )}
            {/* Untuk menampilkan konten HTML dari editor teks */}
            <Box dangerouslySetInnerHTML={{ __html: article.content }} />
          </article>
        )}
      </Container>
      <Footer />
    </Box>
  );
};

export default ArticleDetailPage;