// src/controllers/resumeController.js
const db = require('../config/db');

// Fungsi bantuan untuk format tanggal
const formatDateForSQL = (dateString) => {
  if (!dateString) return null;
  return new Date(dateString).toISOString().split('T')[0];
};

// Mengambil data dengan bahasa dinamis
exports.getAllResumeItems = async (req, res) => {
  try {
    const lang = req.query.lang === 'en' ? 'en' : 'id';
    const titleCol = `title_${lang}`;
    const subtitleCol = `subtitle_${lang}`;
    const descCol = `description_${lang}`;

    const sql = `SELECT id, item_type, ${titleCol} as title, ${subtitleCol} as subtitle, start_date, end_date, ${descCol} as description FROM resume ORDER BY end_date DESC, start_date DESC`;
    
    const [rows] = await db.query(sql);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Mengambil satu item dengan semua kolom bahasanya untuk form edit
exports.getResumeItemById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.query('SELECT * FROM resume WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Item tidak ditemukan' });
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// Membuat item baru dengan kolom summary multi-bahasa
exports.createResumeItem = async (req, res) => {
  const { item_type, title_id, title_en, subtitle_id, subtitle_en, summary_id, summary_en, description_id, description_en } = req.body;
  const startDateFormatted = formatDateForSQL(req.body.start_date);
  const endDateFormatted = formatDateForSQL(req.body.end_date);
  try {
    const sql = `INSERT INTO resume 
      (item_type, title_id, title_en, subtitle_id, subtitle_en, summary_id, summary_en, start_date, end_date, description_id, description_en) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await db.query(sql, [
      item_type, title_id, title_en, subtitle_id, subtitle_en, summary_id, summary_en,
      startDateFormatted, endDateFormatted, description_id, description_en
    ]);
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Mengupdate item dengan kolom summary multi-bahasa
exports.updateResumeItem = async (req, res) => {
  const { id } = req.params;
  const { item_type, title_id, title_en, subtitle_id, subtitle_en, summary_id, summary_en, description_id, description_en } = req.body;
  const startDateFormatted = formatDateForSQL(req.body.start_date);
  const endDateFormatted = formatDateForSQL(req.body.end_date);
  try {
    const sql = `UPDATE resume SET 
      item_type = ?, title_id = ?, title_en = ?, subtitle_id = ?, subtitle_en = ?, 
      summary_id = ?, summary_en = ?, start_date = ?, end_date = ?, 
      description_id = ?, description_en = ? 
      WHERE id = ?`;
    const values = [
      item_type, title_id, title_en, subtitle_id, subtitle_en, summary_id, summary_en,
      startDateFormatted, endDateFormatted, description_id, description_en, id
    ];
    await db.query(sql, values);
    res.status(200).json({ message: 'Item riwayat berhasil diupdate' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

exports.deleteResumeItem = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM resume WHERE id = ?', [id]);
    res.status(200).json({ message: 'Item riwayat berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Ambil semua gambar untuk satu item resume
// @route   GET /api/resume/:id/images
// @access  Publik
exports.getResumeImages = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM resume_images WHERE resume_id = ?', [id]);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Tambah satu gambar ke galeri resume
// @route   POST /api/resume/:id/images
// @access  Private
exports.addResumeImage = async (req, res) => {
  const { id } = req.params; // ID dari item resume
  const { image_url } = req.body;
  try {
    const sql = 'INSERT INTO resume_images (resume_id, image_url) VALUES (?, ?)';
    const [result] = await db.query(sql, [id, image_url]);
    res.status(201).json({ id: result.insertId, resume_id: id, image_url });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Hapus satu gambar dari galeri resume
// @route   DELETE /api/resume/images/:imageId
// @access  Private
exports.deleteResumeImage = async (req, res) => {
  const { imageId } = req.params;
  try {
    await db.query('DELETE FROM resume_images WHERE id = ?', [imageId]);
    res.status(200).json({ message: 'Gambar berhasil dihapus.' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};