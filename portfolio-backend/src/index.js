require('dotenv').config(); // Paling atas
const express = require('express');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
const authRoutes = require('./routes/authRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const skillsRoutes = require('./routes/skillsRoutes');
const userinfoRoutes = require('./routes/userinfoRoutes');
const contactRoutes = require('./routes/contactRoutes');


// Gunakan Routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/userinfo', userinfoRoutes);
app.use('/api/contact', contactRoutes);

app.listen(port, () => {
  console.log(`🚀 Server backend berjalan di http://localhost:${port}`);
});