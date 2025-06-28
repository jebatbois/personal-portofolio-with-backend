// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2A0DFF', // Biru khas Zohran
    },
    secondary: {
      main: '#FFC200', // Kuning/Oranye untuk aksen
    },
    background: {
      default: '#ffffff', // Latar belakang default
    },
  },
  typography: {
    fontFamily: [
      'Inter', // Font yang mirip, bisa diganti
      'sans-serif',
    ].join(','),
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
  },
});

export default theme;