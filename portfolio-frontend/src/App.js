import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminPortfolioPage from './pages/AdminPortfolioPage';
import HomePage from './pages/HomePage';
import AdminSkillsPage from './pages/AdminSkillsPage';
import AdminContactMessagesPage from './pages/dminContactMessagesPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="portfolio" element={<AdminPortfolioPage />} />
          <Route path="skills" element={<AdminSkillsPage />} />
          <Route path="contact-messages" element={<AdminContactMessagesPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
export default App;