// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './animations/PageTransition';

// Import semua halaman dan komponen
import HomePage from './pages/HomePage';
import PortfolioDetailPage from './pages/PortfolioDetailPage';
import ResumeDetailPage from './pages/ResumeDetailPage';
import ArticleListPage from './pages/ArticleListPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import ContactPage from './pages/ContactPage';

import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminPortfolioPage from './pages/AdminPortfolioPage';
import AdminSkillsPage from './pages/AdminSkillsPage';
import AdminContactMessagesPage from './pages/AdminContactMessagesPage'; 
import AdminArticlesPage from './pages/AdminArticlesPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import AdminResumePage from './pages/AdminResumePage'; 

function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* === RUTE PUBLIK DENGAN TRANSISI === */}
        <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
        <Route path="/artikel" element={<PageTransition><ArticleListPage /></PageTransition>} />
        <Route path="/artikel/:slug" element={<PageTransition><ArticleDetailPage /></PageTransition>} />
        <Route path="/kontak" element={<PageTransition><ContactPage /></PageTransition>} />
        <Route path="/resume/:id" element={<PageTransition><ResumeDetailPage /></PageTransition>} />
        <Route path="/portfolio/:id" element={<PageTransition><PortfolioDetailPage /></PageTransition>} />

        {/* === RUTE ADMIN (tanpa transisi agar lebih cepat) === */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="portfolio" element={<AdminPortfolioPage />} />
          <Route path="skills" element={<AdminSkillsPage />} />
          <Route path="contact-messages" element={<AdminContactMessagesPage />} />
          <Route path="articles" element={<AdminArticlesPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route path="resume" element={<AdminResumePage />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

export default App;