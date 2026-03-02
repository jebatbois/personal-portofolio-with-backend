// src/pages/ArticleDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Container, Typography, Box } from '@mui/material';
import Navbar from '../public-components/Navbar';
import Footer from '../public-components/Footer';
import { useTranslation } from 'react-i18next';

const BACKEND_URL = 'https://personal-portofolio-with-backend.vercel.app';

const ArticleDetailPage = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t, i18n } = useTranslation('common');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    axios.get(`${BACKEND_URL}/api/articles/${slug}?lang=${i18n.language}`)
      .then(res => {
        setArticle(res.data);
      })
      .catch(err => {
        console.error(err);
        setError('ARTICLE NOT FOUND.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug, i18n.language]);

  // Loading Screen Brutalism
  if (loading) {
    return (
      <>
        <Navbar />
        <Box sx={{ minHeight: '80vh', bgcolor: '#1125d6', color: '#ffed00', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Anton', sans-serif", fontSize: '3rem', borderBottom: '4px solid #000' }}>
          LOADING ARTICLE...
        </Box>
        <Footer />
      </>
    );
  }

  // Error Screen
  if (error || !article) {
    return (
      <>
        <Navbar />
        <Box sx={{ minHeight: '80vh', bgcolor: '#f23a18', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Anton', sans-serif", fontSize: '3rem', borderBottom: '4px solid #000' }}>
          {error || 'ARTICLE NOT FOUND.'}
        </Box>
        <Footer />
      </>
    );
  }

  // Format Tanggal
  const formattedDate = new Date(article.created_at).toLocaleDateString(
    i18n.language === 'en' ? 'en-US' : 'id-ID', 
    { day: 'numeric', month: 'long', year: 'numeric' }
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#fff' }}>
      <Navbar />
      
      {/* Kontainer Utama */}
      <Box sx={{ flexGrow: 1, borderBottom: '4px solid #000', pb: 15 }}>
        
{/* HEADER ARTIKEL: Full Width Image dengan Overlay Judul */}
        <Box sx={{ 
          position: 'relative', 
          borderBottom: '4px solid #000', 
          bgcolor: '#1125d6', // Fallback warna jika gambar kosong
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end', // Memaksa konten selalu nempel di bawah
          minHeight: { xs: '60vh', md: '70vh' }, // Pakai minHeight agar melar jika teks panjang!
          overflow: 'hidden'
        }}>
          
          {/* Background Image (Absolute letaknya di layer belakang) */}
          {article.thumbnail_url && (
             <Box 
               component="img"
               src={`${BACKEND_URL}${article.thumbnail_url}`}
               alt={article.title}
               sx={{ 
                 position: 'absolute',
                 top: 0, left: 0,
                 width: '100%', 
                 height: '100%', 
                 objectFit: 'cover', 
                 display: 'block',
                 opacity: 0.85, 
                 filter: 'grayscale(20%) contrast(120%)',
                 zIndex: 0
               }}
             />
          )}

          {/* Overlay Konten Teks (Relative letaknya di layer depan) */}
          <Box sx={{ 
            position: 'relative', 
            zIndex: 1,
            background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.6) 60%, rgba(0,0,0,0) 100%)',
            pt: { xs: 8, md: 12 }, // Padding atas lebih kecil agar konten naik
            pb: { xs: 5, md: 8 }, 
            px: { xs: 2, md: 4 }
          }}>
            <Container maxWidth="md">
              
              {/* Stiker Kategori & Tanggal */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                <Box sx={{ bgcolor: '#ffed00', color: '#000', px: 2, py: 0.5, border: '3px solid #000', transform: 'rotate(-2deg)' }}>
                  <Typography sx={{ fontWeight: 900, fontFamily: "'Inter', sans-serif", fontSize: '0.9rem' }}>
                    ARTICLE
                  </Typography>
                </Box>
                <Box sx={{ bgcolor: '#f23a18', color: '#fff', px: 2, py: 0.5, border: '3px solid #000', transform: 'rotate(1deg)' }}>
                  <Typography sx={{ fontWeight: 900, fontFamily: "'Inter', sans-serif", fontSize: '0.9rem' }}>
                    {formattedDate}
                  </Typography>
                </Box>
              </Box>

              {/* Judul Utama */}
              <Typography variant="h1" sx={{ 
                fontFamily: "'Anton', sans-serif", 
                color: '#fff', 
                fontSize: { xs: '3rem', md: '5.5rem' }, 
                lineHeight: 1.1,
                textTransform: 'uppercase',
                textShadow: '4px 4px 0px #000',
                wordWrap: 'break-word' // Jaga-jaga kalau ada satu kata yang super panjang
              }}>
                {article.title}
              </Typography>

            </Container>
          </Box>
        </Box>

        {/* KONTEN ARTIKEL */}
        <Container maxWidth="md" sx={{ mt: 8 }}>
          
          {/* Summary / Lead Paragraph */}
          {article.summary && (
            <Box sx={{ 
              mb: 6, 
              p: 3, 
              bgcolor: '#eee', 
              borderLeft: '8px solid #f23a18',
              fontFamily: "'Inter', sans-serif",
              fontSize: '1.3rem',
              fontWeight: 600,
              color: '#333'
            }}>
              {article.summary}
            </Box>
          )}

          {/* Isi HTML Artikel */}
          <Box 
            className="article-content"
            dangerouslySetInnerHTML={{ __html: article.content }} 
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '1.15rem',
              lineHeight: 1.8,
              color: '#000',
              
              /* Custom CSS untuk merombak elemen HTML yang datang dari database/Rich Text Editor */
              '& p': { mb: 3 },
              '& h1, & h2, & h3, & h4': {
                fontFamily: "'Anton', sans-serif",
                textTransform: 'uppercase',
                mt: 5,
                mb: 2,
                color: '#1125d6'
              },
              '& img': {
                maxWidth: '100%',
                height: 'auto',
                border: '3px solid #000',
                boxShadow: '6px 6px 0px #000',
                my: 4,
                display: 'block'
              },
              '& blockquote': {
                bgcolor: '#000',
                color: '#ffed00',
                p: 3,
                border: '3px solid #000',
                boxShadow: '6px 6px 0px #f23a18',
                mx: 0,
                my: 4,
                fontStyle: 'italic',
                fontWeight: 'bold',
                transform: 'rotate(-0.5deg)'
              },
              '& a': {
                color: '#f23a18',
                textDecoration: 'underline',
                textDecorationThickness: '3px',
                fontWeight: 'bold',
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: '#ffed00',
                  color: '#000'
                }
              }
            }}
          />
        </Container>

      </Box>
      <Footer />
    </Box>
  );
};

export default ArticleDetailPage;