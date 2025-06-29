// src/public-components/SkillsSection.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Box, Paper, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

// Import ikon-ikon yang kita butuhkan
import { 
  DiReact, 
  DiNodejsSmall, 
  DiHtml5, 
  DiCss3,
  DiMysql,
  DiPython,
} from 'react-icons/di';
import { SiFigma, SiCplusplus, SiLaravel, SiKotlin, SiSmartthings } from "react-icons/si";

// Fungsi "peta" untuk memilih ikon berdasarkan nama skill
const getSkillIcon = (skillName) => {
  const lowerCaseName = skillName.toLowerCase();
  
  if (lowerCaseName.includes('react')) return <DiReact size="2.5em" color="#61DAFB" />;
  if (lowerCaseName.includes('node.js')) return <DiNodejsSmall size="2.5em" color="#8CC84B" />;
  if (lowerCaseName.includes('html')) return <DiHtml5 size="2.5em" color="#E34F26" />;
  if (lowerCaseName.includes('css')) return <DiCss3 size="2.5em" color="#1572B6" />;
  if (lowerCaseName.includes('mysql')) return <DiMysql size="2.5em" color="#4479A1" />;
  if (lowerCaseName.includes('python')) return <DiPython size="2.5em" color="#3776AB" />;
  if (lowerCaseName.includes('figma')) return <SiFigma size="2.5em" color="#F24E1E" />;
  if (lowerCaseName.includes('c++')) return <SiCplusplus size="2.5em" color="#00599C" />;
  if (lowerCaseName.includes('laravel')) return <SiLaravel size="2.5em" color="#FF2D20" />;
  if (lowerCaseName.includes('kotlin')) return <SiKotlin size="2.5em" color="#0095D5" />;
  if (lowerCaseName.includes('IoT')) return <SiSmartthings size="2.5em" color="#00A0DC" />;

  return null; 
};

// Komponen progress bar kustom
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.primary.main,
  },
}));

const SkillsSection = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/skills')
      .then(response => {
        setSkills(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching skills:", error);
        setLoading(false);
      });
  }, []);

  return (
    <Box sx={{ bgcolor: 'grey.100', py: 10 }}>
      <Container maxWidth="md">
        <Typography variant="h3" component="h2" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
          Skills
        </Typography>
        <Paper elevation={0} sx={{ p: {xs: 2, sm: 4}, mt: 4, bgcolor: 'background.default' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
          ) : (
            <Box>
              {skills.map(skill => (
                <Box key={skill.id} sx={{ mb: 3 }}>
                  
                  {/* Baris untuk Ikon dan Nama Skill */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                    {getSkillIcon(skill.skill_name)}
                    <Typography variant="h6" sx={{ fontWeight: 500 }}>
                      {skill.skill_name}
                    </Typography>
                  </Box>

                  {/* Baris untuk Progress Bar dan Persentase */}
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <BorderLinearProgress variant="determinate" value={skill.percentage} />
                    </Box>
                    <Typography variant="body1" sx={{ minWidth: '50px', textAlign: 'right', color: 'primary.main', fontWeight: 500 }}>
                      {skill.percentage}%
                    </Typography>
                  </Box>

                </Box>
              ))}
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default SkillsSection;