// src/controllers/skillsController.js
const db = require('../config/db');

// Mengambil data skill dengan bahasa dinamis
exports.getAllSkills = async (req, res) => {
  try {
    const lang = req.query.lang === 'en' ? 'en' : 'id'; // Default ke 'id'
    const nameCol = `skill_name_${lang}`;

    // Gunakan 'AS' untuk menjaga nama key di JSON tetap 'skill_name' untuk frontend
    const sql = `SELECT id, ${nameCol} as skill_name, percentage FROM skills ORDER BY percentage DESC`;
    
    const [rows] = await db.query(sql);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Membuat skill baru dengan kolom _id dan _en
exports.createSkill = async (req, res) => {
  // Ambil data dari body dengan nama kolom yang sudah benar
  const { skill_name_id, skill_name_en, percentage } = req.body;
  try {
    // Gunakan nama kolom yang benar di query SQL
    const sql = 'INSERT INTO skills (skill_name_id, skill_name_en, percentage) VALUES (?, ?, ?)';
    const [result] = await db.query(sql, [skill_name_id, skill_name_en, percentage]);
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Mengupdate skill dengan kolom _id dan _en
exports.updateSkill = async (req, res) => {
  const { id } = req.params;
  const { skill_name_id, skill_name_en, percentage } = req.body;
  try {
    const sql = 'UPDATE skills SET skill_name_id = ?, skill_name_en = ?, percentage = ? WHERE id = ?';
    await db.query(sql, [skill_name_id, skill_name_en, percentage, id]);
    res.status(200).json({ message: 'Skill berhasil diupdate' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Hapus skill (tidak ada perubahan signifikan di sini)
exports.deleteSkill = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM skills WHERE id = ?', [id]);
    res.status(200).json({ message: 'Skill berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Ambil satu skill lengkap dengan semua kolomnya untuk Admin
// @route   GET /api/skills/admin/:id
// @access  Private
exports.getSkillByIdForAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT id, skill_name_id, skill_name_en, percentage FROM skills WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Skill tidak ditemukan' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};