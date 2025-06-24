// src/controllers/skillsController.js
const db = require('../config/db');

// GET all skills (sudah ada)
exports.getAllSkills = async (req, res) => { /* ... kode Anda ... */ };

// --- TAMBAHKAN FUNGSI-FUNGSI DI BAWAH INI ---

// @desc    Buat skill baru
// @route   POST /api/skills
// @access  Private
exports.createSkill = async (req, res) => {
  const { skill_name, percentage } = req.body;
  try {
    const sql = 'INSERT INTO skills (skill_name, percentage) VALUES (?, ?)';
    const [result] = await db.query(sql, [skill_name, percentage]);
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Update data skill
// @route   PUT /api/skills/:id
// @access  Private
exports.updateSkill = async (req, res) => {
  const { id } = req.params;
  const { skill_name, percentage } = req.body;
  try {
    const sql = 'UPDATE skills SET skill_name = ?, percentage = ? WHERE id = ?';
    await db.query(sql, [skill_name, percentage, id]);
    res.status(200).json({ message: 'Skill berhasil diupdate' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Hapus data skill
// @route   DELETE /api/skills/:id
// @access  Private
exports.deleteSkill = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM skills WHERE id = ?', [id]);
    res.status(200).json({ message: 'Skill berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};