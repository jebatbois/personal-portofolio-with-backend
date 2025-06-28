// src/animations/PageTransition.js
import React from 'react';
import { motion } from 'framer-motion';

// Varian animasi baru yang lebih profesional
const pageVariants = {
  // Posisi awal: sedikit di bawah dan transparan
  initial: {
    opacity: 0,
    y: 20 
  },
  // Posisi aktif: di tengah dan tidak transparan
  in: {
    opacity: 1,
    y: 0
  },
  // Posisi keluar: sedikit ke atas dan transparan
  out: {
    opacity: 0,
    y: -20
  }
};

// Pengaturan durasi dan tipe transisi
const pageTransition = {
  type: 'tween',
  ease: 'easeInOut', // Efek percepatan dan perlambatan yang mulus
  duration: 0.5      
};

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;