// src/components/AdminLayout.js
import React from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, AppBar, Typography } from '@mui/material';
import { Outlet, Link as RouterLink } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import SettingsIcon from '@mui/icons-material/Settings';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';

const drawerWidth = 240;

const AdminLayout = () => {
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    window.location.href = '/admin/login';
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Portfolio', icon: <ArticleIcon />, path: '/admin/portfolio' },
    { text: 'Skills', icon: <ArticleIcon />, path: '/admin/skills' },
    { text: 'Contact Messages', icon: <ArticleIcon />, path: '/admin/contact-messages' },
    { text: 'Articles', icon: <NewspaperIcon />, path: '/admin/articles' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' },
    { text: 'Resume', icon: <WorkHistoryIcon />, path: '/admin/resume' },
    // Tambahkan menu lain sesuai kebutuhan
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton component={RouterLink} to={item.path}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* Konten Utama */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
                    Admin Panel
                </Typography>
                <button onClick={handleLogout} style={{color: 'white', border: 'none', background: 'none', cursor: 'pointer'}}>Logout</button>
            </Toolbar>
        </AppBar>
        <Toolbar /> 
        {/* Di sinilah konten halaman (misal: PortfolioPage) akan ditampilkan */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;