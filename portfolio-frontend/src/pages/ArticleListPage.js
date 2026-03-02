// src/pages/ArticleListPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import Navbar from '../public-components/Navbar';
import Footer from '../public-components/Footer';
import { useTranslation } from 'react-i18next'; 

const BACKEND_URL = 'http://localhost:5000';

const ArticleListPage = () => {
  const [articles, setArticles] = useState([]);
  const { t, i18n } = useTranslation('common'); 

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/articles?lang=${i18n.language}`)
      .then(res => {
        setArticles(res.data);
      })
      .catch(err => console.error("Gagal mengambil artikel:", err));
  }, [i18n.language]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#fff' }}>
      <Navbar />
      
      <Box component="main" sx={{ flexGrow: 1, borderBottom: '4px solid #000' }}>
        
        {/* ======================================= */}
        {/* HERO SECTION (Koran Headline)           */}
        {/* ======================================= */}
        <Box sx={{ 
          bgcolor: '#1125d6', // Biru Brutalism
          color: '#fff', 
          py: { xs: 8, md: 12 },
          borderBottom: '4px solid #000',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Aksen Abstrak di background */}
          <Typography sx={{ position: 'absolute', top: -20, left: -20, fontSize: '20rem', fontFamily: "'Anton', sans-serif", color: 'rgba(255,255,255,0.05)', lineHeight: 0.8, pointerEvents: 'none' }}>
            READ
          </Typography>

          <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h1" sx={{ 
              fontFamily: "'Anton', sans-serif", 
              textTransform: 'uppercase',
              color: '#ffed00', // Teks Kuning Terang
              fontSize: { xs: '4rem', md: '7rem' },
              textShadow: '6px 6px 0px #000',
              lineHeight: 1,
              mb: 2
            }}>
              {t('nav_articles', 'WRITINGS.')}
            </Typography>
            <Box sx={{ display: 'inline-block', bgcolor: '#000', color: '#fff', px: 2, py: 1, transform: 'rotate(-1deg)' }}>
              <Typography sx={{ fontWeight: 800, fontFamily: "'Inter', sans-serif", textTransform: 'uppercase' }}>
                Thoughts, tutorials, and rants.
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* ======================================= */}
        {/* ARTICLES GRID (Gaya Zine/Poster)          */}
        {/* ======================================= */}
        <Container maxWidth="lg" sx={{ py: 10 }}>
          {articles.length === 0 ? (
             <Box sx={{ py: 10, textAlign: 'center' }}>
               <Typography variant="h3" sx={{ fontFamily: "'Anton', sans-serif" }}>NOTHING HERE YET.</Typography>
             </Box>
          ) : (
            <Grid container spacing={6}>
              {articles.map((article, index) => (
                <Grid item key={article.id} xs={12} md={6}>
                  <Box
                    component={RouterLink}
                    to={`/artikel/${article.slug}`}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      textDecoration: 'none',
                      color: 'inherit',
                      bgcolor: '#fff',
                      border: '4px solid #000',
                      height: '100%',
                      boxShadow: '8px 8px 0px #000',
                      transition: 'all 0.15s ease-in-out',
                      '&:hover': {
                        transform: 'translate(-4px, -4px)',
                        // Miringkan sedikit saat dihover dengan pola zig-zag
                        boxShadow: '12px 12px 0px #f23a18, 12px 12px 0px 4px #000', 
                        '& .article-title': { color: '#1125d6' },
                        '& .article-img': { filter: 'grayscale(0%)' } // Gambar berubah berwarna saat dihover
                      }
                    }}
                  >
                    {/* Header Image */}
                    <Box sx={{ 
                      width: '100%', 
                      height: '250px', 
                      borderBottom: '4px solid #000', 
                      overflow: 'hidden',
                      bgcolor: '#eee'
                    }}>
                      <img 
                        className="article-img"
                        src={article.thumbnail_url ? `${BACKEND_URL}${article.thumbnail_url}` : 'https://via.placeholder.com/600x400/000/fff?text=NO+IMAGE'} 
                        alt={article.title}
                        style={{ 
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover',
                          filter: 'grayscale(100%)', // Default abu-abu ala koran
                          transition: 'filter 0.3s'
                        }}
                      />
                    </Box>

                    {/* Content Box */}
                    <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      
                      {/* Label Tanggal / Kategori (Bisa diisi jika databasemu ada kolom tanggal) */}
                      <Box sx={{ display: 'flex', mb: 2 }}>
                        <Typography sx={{ 
                          bgcolor: '#000', 
                          color: '#fff', 
                          px: 1.5, 
                          py: 0.5, 
                          fontSize: '0.8rem', 
                          fontWeight: 900, 
                          textTransform: 'uppercase' 
                        }}>
                          ARTICLE
                        </Typography>
                      </Box>

                      {/* Judul Artikel */}
                      <Typography 
                        className="article-title"
                        variant="h3" 
                        sx={{ 
                          fontFamily: "'Anton', sans-serif", 
                          textTransform: 'uppercase', 
                          lineHeight: 1.1,
                          mb: 2,
                          transition: 'color 0.2s'
                        }}
                      >
                        {article.title}
                      </Typography>

                      {/* Summary */}
                      <Typography variant="body1" sx={{ 
                        fontFamily: "'Inter', sans-serif",
                        fontWeight: 500,
                        fontSize: '1.1rem',
                        lineHeight: 1.6,
                        mb: 4
                      }}>
                        {article.summary}
                      </Typography>

                      {/* Read More Text */}
                      <Typography sx={{ 
                        mt: 'auto', 
                        fontFamily: "'Anton', sans-serif", 
                        fontSize: '1.2rem',
                        color: '#f23a18', // Merah
                        borderTop: '2px solid #000',
                        pt: 2,
                        alignSelf: 'flex-start'
                      }}>
                        READ MORE {'>'}
                      </Typography>

                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
      
      <Footer />
    </Box>
  );
};

export default ArticleListPage;