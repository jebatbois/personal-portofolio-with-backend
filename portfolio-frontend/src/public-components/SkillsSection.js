// src/public-components/SkillsSection.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Import ikon-ikon
import { DiReact, DiNodejsSmall, DiHtml5, DiCss3, DiMysql, DiPython } from 'react-icons/di';
import { SiFigma, SiCplusplus, SiLaravel, SiKotlin, SiSmartthings } from "react-icons/si";

const BACKEND_URL = 'https://personal-portofolio-with-backend.vercel.app';

const getSkillIcon = (skillName) => {
  const lowerCaseName = skillName.toLowerCase();
  const iconProps = { size: "2rem", color: "inherit" };
  
  if (lowerCaseName.includes('react')) return <DiReact {...iconProps} />;
  if (lowerCaseName.includes('node')) return <DiNodejsSmall {...iconProps} />;
  if (lowerCaseName.includes('html')) return <DiHtml5 {...iconProps} />;
  if (lowerCaseName.includes('css')) return <DiCss3 {...iconProps} />;
  if (lowerCaseName.includes('mysql')) return <DiMysql {...iconProps} />;
  if (lowerCaseName.includes('python')) return <DiPython {...iconProps} />;
  if (lowerCaseName.includes('figma')) return <SiFigma {...iconProps} />;
  if (lowerCaseName.includes('c++')) return <SiCplusplus {...iconProps} />;
  if (lowerCaseName.includes('laravel')) return <SiLaravel {...iconProps} />;
  if (lowerCaseName.includes('kotlin')) return <SiKotlin {...iconProps} />;
  if (lowerCaseName.includes('iot')) return <SiSmartthings {...iconProps} />;
  return null; 
};

const SkillsSection = () => {
  const { t } = useTranslation('common');
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${BACKEND_URL}/api/skills`)
      .then(res => {
        setSkills(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching skills:", err);
        setLoading(false);
      });
  }, []);

  return (
    <Box id="skills" sx={{ bgcolor: '#1125d6', py: 15, borderBottom: '4px solid #000' }}>
      <Container maxWidth="lg">
        
        {/* JUDUL SEKSI ALA POSTER */}
 <Typography variant="h2" align="center" sx={{ 
          fontFamily: "'Anton', sans-serif", 
          color: '#ffed00', 
          fontSize: { xs: '3.5rem', md: '6rem' },
          textShadow: '6px 6px 0px #000',
          mb: 10,
          textTransform: 'uppercase'
        }}>
          {t('skills_title', 'MY ARSENAL')}
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress sx={{ color: '#ffed00' }} /></Box>
        ) : (
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
            gap: 4 
          }}>
            {skills.map(skill => (
              <Box key={skill.id} sx={{ 
                bgcolor: '#fff', 
                border: '3px solid #000', 
                p: 3, 
                boxShadow: '8px 8px 0px #000',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                transition: 'transform 0.1s',
                '&:hover': { transform: 'scale(1.02)' }
              }}>
                
                {/* Header Skill: Ikon & Nama */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: '#1125d6' }}>
                    {getSkillIcon(skill.skill_name)}
                    <Typography sx={{ fontFamily: "'Anton', sans-serif", fontSize: '1.5rem', color: '#000' }}>
                      {skill.skill_name.toUpperCase()}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontFamily: "'Anton', sans-serif", fontSize: '1.2rem', color: '#f23a18' }}>
                    {skill.percentage}%
                  </Typography>
                </Box>

                {/* Progress Bar Brutalism (Kotak-kotak) */}
                <Box sx={{ 
                  height: '24px', 
                  width: '100%', 
                  border: '2px solid #000', 
                  bgcolor: '#eee',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <Box sx={{ 
                    height: '100%', 
                    width: `${skill.percentage}%`, 
                    bgcolor: '#ffed00', 
                    borderRight: '2px solid #000'
                  }} />
                </Box>

              </Box>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default SkillsSection;