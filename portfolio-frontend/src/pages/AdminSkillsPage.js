// src/pages/AdminSkillsPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Typography, TextField, Button, Box, Table, TableBody, TableCell, TableHead, TableRow, Paper, IconButton, Slider,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, // <-- PERBAIKAN ADA DI SINI
  LinearProgress,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const AdminSkillsPage = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newSkill, setNewSkill] = useState({ skill_name_id: '', skill_name_en: '', percentage: 50 });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentSkill, setCurrentSkill] = useState(null);

  const fetchSkills = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:5000/api/skills');
      setSkills(response.data);
    } catch (err) {
      console.error("GAGAL MENGAMBIL DATA SKILLS:", err);
      setError('Gagal memuat data. Cek pesan error di console (F12).');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleNewSkillChange = (e) => setNewSkill({ ...newSkill, [e.target.name]: e.target.value });
  const handleNewSkillSliderChange = (e, newValue) => setNewSkill({ ...newSkill, percentage: newValue });

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.post('http://localhost:5000/api/skills', newSkill, { headers: { Authorization: token } });
      setSkills(prevSkills => [...prevSkills, response.data]);
      setNewSkill({ skill_name_id: '', skill_name_en: '', percentage: 50 });
      alert('Skill berhasil ditambahkan!');
    } catch (error) { alert('Gagal menambah skill.'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus skill ini?")) {
      const token = localStorage.getItem('authToken');
      try {
        await axios.delete(`http://localhost:5000/api/skills/${id}`, { headers: { Authorization: token } });
        setSkills(prevSkills => prevSkills.filter(skill => skill.id !== id));
        alert('Skill berhasil dihapus!');
      } catch (error) { alert('Gagal menghapus skill.'); }
    }
  };

  const handleOpenEditDialog = async (skill) => {
    setIsEditDialogOpen(true);
    setCurrentSkill(null); // Reset dulu
    const token = localStorage.getItem('authToken');
    try {
      // Ambil data lengkap dari backend (rute admin)
      const res = await axios.get(`http://localhost:5000/api/skills/admin/${skill.id}`, {
        headers: { Authorization: token }
      });
      setCurrentSkill({
        id: res.data.id,
        skill_name_id: res.data.skill_name_id || '',
        skill_name_en: res.data.skill_name_en || '',
        percentage: res.data.percentage || 0
      });
    } catch (error) {
      alert('Gagal mengambil data skill.');
      setCurrentSkill({ ...skill }); // fallback dari list
    }
  };
  const handleCloseEditDialog = () => setIsEditDialogOpen(false);
  const handleEditChange = (e) => setCurrentSkill({ ...currentSkill, [e.target.name]: e.target.value });
  const handleEditSliderChange = (e, newValue) => setCurrentSkill({ ...currentSkill, percentage: newValue });
  
  const handleUpdateSubmit = async () => {
    if (!currentSkill) return;
    const token = localStorage.getItem('authToken');
    try {
      await axios.put(`http://localhost:5000/api/skills/${currentSkill.id}`, currentSkill, { headers: { Authorization: token } });
      alert('Skill berhasil diupdate!');
      handleCloseEditDialog();
      fetchSkills();
    } catch (error) { alert('Gagal mengupdate skill.'); }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Manajemen Skills</Typography>
      <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
        <Box component="form" onSubmit={handleAddSubmit}>
          <Typography variant="h6">Tambah Skill Baru</Typography>
          
          <Typography variant="h6">Konten Bahasa Indonesia</Typography>
          <TextField
            label="Nama Skill (ID)"
            name="skill_name_id"
            value={newSkill.skill_name_id || ''}
            onChange={handleNewSkillChange}
            fullWidth
            margin="normal"
            required
          />

          <Typography variant="h6" sx={{ mt: 4 }}>Konten Bahasa Inggris</Typography>
          <TextField
            label="Skill Name (EN)"
            name="skill_name_en"
            value={newSkill.skill_name_en || ''}
            onChange={handleNewSkillChange}
            fullWidth
            margin="normal"
            required
          />

          <Typography gutterBottom sx={{ mt: 3 }}>Persentase Keahlian: {newSkill.percentage}%</Typography>
          <Slider name="percentage" value={newSkill.percentage} onChange={handleNewSkillSliderChange} valueLabelDisplay="auto" />

          <Button type="submit" variant="contained" color="primary">Tambah Skill</Button>
        </Box>
      </Paper>
      
      {loading && <LinearProgress sx={{ mt: 2 }} />} 
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      
      {!loading && !error && (
        <Paper>
          <Table>
            <TableHead><TableRow><TableCell>Nama Skill</TableCell><TableCell>Persentase</TableCell><TableCell>Aksi</TableCell></TableRow></TableHead>
            <TableBody>
              {skills.map((skill) => (
                <TableRow key={skill.id}>
                  <TableCell>{skill.skill_name}</TableCell>
                  <TableCell>{skill.percentage}%</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleOpenEditDialog(skill)}><EditIcon /></IconButton>
                    <IconButton color="error" onClick={() => handleDelete(skill.id)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      <Dialog open={isEditDialogOpen} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Skill</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{mb: 2}}>
            Silakan ubah detail skill di bawah ini.
          </DialogContentText>
          {currentSkill && (
            <Box>
              <TextField
                label="Nama Skill (ID)"
                name="skill_name_id"
                value={currentSkill.skill_name_id || ''}
                onChange={handleEditChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Skill Name (EN)"
                name="skill_name_en"
                value={currentSkill.skill_name_en || ''}
                onChange={handleEditChange}
                fullWidth
                margin="normal"
              />
              <Typography gutterBottom sx={{ mt: 3 }}>Persentase Keahlian: {currentSkill.percentage}%</Typography>
              <Slider name="percentage" value={currentSkill.percentage} onChange={handleEditSliderChange} valueLabelDisplay="auto" />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Batal</Button>
          <Button onClick={handleUpdateSubmit} variant="contained">Simpan Perubahan</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminSkillsPage;

