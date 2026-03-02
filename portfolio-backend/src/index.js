require('dotenv').config(); // Paling atas
const express = require('express');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*', // Mengizinkan semua domain untuk mengakses API ini (Aman untuk portofolio publik)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.use('/public', express.static('public'));

// Import Routes
const authRoutes = require('./routes/authRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const skillsRoutes = require('./routes/skillsRoutes');
const userinfoRoutes = require('./routes/userinfoRoutes');
const contactRoutes = require('./routes/contactRoutes');
const articlesRoutes = require('./routes/articlesRoutes'); 
const uploadRoutes = require('./routes/uploadRoutes'); 


// Gunakan Routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/userinfo', userinfoRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/upload', uploadRoutes);

if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`🚀 Server backend berjalan di http://localhost:${port}`);
  });
}

// TAMBAHKAN BARIS INI UNTUK VERCEL
module.exports = app;