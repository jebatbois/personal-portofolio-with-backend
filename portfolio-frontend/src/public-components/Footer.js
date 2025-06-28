// src/public-components/Footer.js
import React from 'react';
import { Box, Container, Typography, IconButton, Stack } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: '#1c1c1c', color: 'white', py: 4, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 1 }}>
          <IconButton
            component="a"
            href="https://github.com/rifqyprayuda"
            target="_blank"
            rel="noopener"
            sx={{
              color: 'white',
              '&:hover': { color: '#6e5494', bgcolor: 'rgba(255,255,255,0.08)' }
            }}
            aria-label="GitHub"
          >
            <GitHubIcon fontSize="large" />
          </IconButton>
          <IconButton
            component="a"
            href="https://linkedin.com/in/rifqyprayuda"
            target="_blank"
            rel="noopener"
            sx={{
              color: 'white',
              '&:hover': { color: '#0A66C2', bgcolor: 'rgba(255,255,255,0.08)' }
            }}
            aria-label="LinkedIn"
          >
            <LinkedInIcon fontSize="large" />
          </IconButton>
          <IconButton
            component="a"
            href="https://instagram.com/rifqyprayuda"
            target="_blank"
            rel="noopener"
            sx={{
              color: 'white',
              '&:hover': { color: '#E1306C', bgcolor: 'rgba(255,255,255,0.08)' }
            }}
            aria-label="Instagram"
          >
            <InstagramIcon fontSize="large" />
          </IconButton>
        </Stack>
        <Typography variant="body2" color="inherit" align="center" sx={{ opacity: 0.8 }}>
          {'© '}
          {new Date().getFullYear()}
          {' Rifqy. All rights reserved.'}
        </Typography>
        <Typography variant="caption" color="inherit" align="center" display="block" sx={{ mt: 1, opacity: 0.6 }}>
          Built with React, Express, and ❤️ by Rifqy A. Prayuda
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;