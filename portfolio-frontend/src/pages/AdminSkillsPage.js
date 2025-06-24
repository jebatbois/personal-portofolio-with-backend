// src/pages/AdminSkillsPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Typography, TextField, Button, Box, Table, TableBody, TableCell, TableHead, TableRow, Paper, IconButton, Slider,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle // Import komponen Dialog
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const AdminSkillsPage = () => {
  const [skills, setSkills] = useState([]);
  // State untuk form tambah
  const [newSkill, setNewSkill] = useState({ skill_name: '', percentage: 50 });
  // State untuk dialog edit
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentSkill, setCurrentSkill] = useState(null);

  const fetchSkills = async () => { /* ... sama seperti sebelumnya ... */ };
  useEffect(() => { fetchSkills(); }, []);

  const handleNewSkillChange = (e) => {
    setNewSkill({ ...newSkill, [e.target.name]: e.target.value });
  };
  const handleNewSkillSliderChange = (e, newValue) => {
    setNewSkill({ ...newSkill, percentage: newValue });
  };

 const handleAddSubmit = async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('authToken');
  try {
    // 1. Tangkap response dari backend saat membuat skill baru
    const response = await axios.post('http://localhost:5000/api/skills', newSkill, { 
      headers: { Authorization: token } 
    });

    // 2. Ambil data skill yang baru dibuat (lengkap dengan ID dari database) dari response
    const addedSkill = response.data;

    // 3. Update state 'skills' secara manual
    //    Ini memberitahu React: "Ambil semua skill yang lama (...prevSkills), lalu tambahkan skill baru ini di akhir"
    setSkills(prevSkills => [...prevSkills, addedSkill]);

    // 4. Beri notifikasi dan reset form
    alert('Skill berhasil ditambahkan!');
    setNewSkill({ skill_name: '', percentage: 50 });

  } catch (error) { 
    alert('Gagal menambah skill.'); 
    console.error(error);
  }
};

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus skill ini?")) {
      const token = localStorage.getItem('authToken');
      try {
        await axios.delete(`http://localhost:5000/api/skills/${id}`, { headers: { Authorization: token } });
        alert('Skill berhasil dihapus!');
        fetchSkills();
      } catch (error) { alert('Gagal menghapus skill.'); }
    }
  };

  // --- FUNGSI UNTUK EDIT ---
  const handleOpenEditDialog = (skill) => {
    setCurrentSkill(skill);
    setIsEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setIsEditDialogOpen(false);
    setCurrentSkill(null);
  };

  const handleEditChange = (e) => {
    setCurrentSkill({ ...currentSkill, [e.target.name]: e.target.value });
  };
  
  const handleEditSliderChange = (e, newValue) => {
    setCurrentSkill({ ...currentSkill, percentage: newValue });
  };

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
      
      {/* Form Tambah */}
      <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
        <Box component="form" onSubmit={handleAddSubmit}>
          <Typography variant="h6">Tambah Skill Baru</Typography>
          <TextField label="Nama Skill" name="skill_name" value={newSkill.skill_name} onChange={handleNewSkillChange} fullWidth margin="normal" required />
          <Typography gutterBottom>Persentase Keahlian: {newSkill.percentage}%</Typography>
          <Slider name="percentage" value={newSkill.percentage} onChange={handleNewSkillSliderChange} valueLabelDisplay="auto" />
          <Button type="submit" variant="contained" color="primary">Tambah Skill</Button>
        </Box>
      </Paper>
      
      {/* Tabel Data */}
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

      {/* Dialog untuk Edit */}
      <Dialog open={isEditDialogOpen} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Skill</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Silakan ubah detail skill di bawah ini.
          </DialogContentText>
          {currentSkill && (
            <Box sx={{mt: 2}}>
              <TextField label="Nama Skill" name="skill_name" value={currentSkill.skill_name} onChange={handleEditChange} fullWidth margin="normal" />
              <Typography gutterBottom>Persentase Keahlian: {currentSkill.percentage}%</Typography>
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