// src/pages/HomePage.js
import React from 'react';
import Navbar from '../public-components/Navbar';
import HeroSection from '../public-components/HeroSection';
import SkillsSection from '../public-components/SkillsSection';
import ResumeSection from '../public-components/ResumeSection';
import PortfolioSection from '../public-components/PortfolioSection';
import Footer from '../public-components/Footer';

const HomePage = () => {
  return (
    <>
      <Navbar />
      <main>
        {/* Pastikan setiap komponen hanya dipanggil satu kali */}
        <HeroSection />
        <SkillsSection />
        <ResumeSection />
        <PortfolioSection />
      </main>
      <Footer />
    </>
  );
};

export default HomePage;