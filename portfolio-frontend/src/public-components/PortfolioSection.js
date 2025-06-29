// src/public-components/PortfolioSection.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Card, CardMedia, CardContent, CardActions, Button, Box, CardActionArea } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const BACKEND_URL = 'http://localhost:5000';

const PortfolioSection = () => {
    const [projects, setProjects] = useState([]);
    const { t, i18n } = useTranslation('common');

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/portfolio?lang=${i18n.language}`)
            .then(res => setProjects(res.data))
            .catch(err => console.error("Error fetching portfolio:", err));
    }, [i18n.language]);

    return (
        <Box sx={{ bgcolor: 'grey.100', py: 10 }}>
            <Container maxWidth="lg">
                <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                    {t('portfolio_title')}
                </Typography>
                <Grid container spacing={4} sx={{ mt: 4 }}>
                    {projects.map((project) => (
                        <Grid item key={project.id} xs={12} sm={6} md={4}>
                          <CardActionArea
                            component={RouterLink}
                            to={`/portfolio/${project.id}`}
                            sx={{ height: '100%' }}
                          >
                            <Card
                              sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'transform 0.3s, box-shadow 0.3s',
                                '&:hover': {
                                  transform: 'translateY(-6px) scale(1.03)',
                                  boxShadow: 8,
                                },
                              }}
                            >
                              <CardMedia
                                component="img"
                                height="200"
                                image={project.image_url ? `${BACKEND_URL}${project.image_url}` : 'https://via.placeholder.com/300x200'}
                                alt={project.project_name}
                                sx={{
                                  objectFit: 'cover',
                                  transition: 'filter 0.3s',
                                  '&:hover': {
                                    filter: 'brightness(0.92)',
                                  },
                                }}
                              />
                              <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h5" component="h2">
                                  {project.project_name}
                                </Typography>
                                <Typography>
                                  {project.description}
                                </Typography>
                              </CardContent>
                              {project.project_link && (
                                <CardActions>
                                  <Button
                                    size="small"
                                    variant="contained"
                                    href={project.project_link}
                                    target="_blank"
                                    color="primary"
                                  >
                                    {t('view_project_button')}
                                  </Button>
                                </CardActions>
                              )}
                            </Card>
                          </CardActionArea>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default PortfolioSection;