// src/controllers/portfolioController.js
const db = require('../config/db');

// @desc    Ambil semua data portfolio
// @route   GET /api/portfolio
// @access  Publik
exports.getAllPortfolios = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM portfolio ORDER BY id DESC');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Buat portfolio baru
// @route   POST /api/portfolio
// @access  Private (Admin)
exports.createPortfolio = async (req, res) => {
  const { project_name, description, image_url, project_link, tags } = req.body;
  try {
    const sql = 'INSERT INTO portfolio (project_name, description, image_url, project_link, tags) VALUES (?, ?, ?, ?, ?)';
    const [result] = await db.query(sql, [project_name, description, image_url, project_link, tags]);
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Update data portfolio
// @route   PUT /api/portfolio/:id
// @access  Private (Admin)
exports.updatePortfolio = async (req, res) => {
  const { id } = req.params;
  const { project_name, description, image_url, project_link, tags } = req.body;
  try {
    const sql = 'UPDATE portfolio SET project_name = ?, description = ?, image_url = ?, project_link = ?, tags = ? WHERE id = ?';
    await db.query(sql, [project_name, description, image_url, project_link, tags, id]);
    res.status(200).json({ message: 'Portfolio berhasil diupdate' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Hapus data portfolio
// @route   DELETE /api/portfolio/:id
// @access  Private (Admin)
exports.deletePortfolio = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM portfolio WHERE id = ?', [id]);
    res.status(200).json({ message: 'Portfolio berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};