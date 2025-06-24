// src/controllers/contactController.js
const db = require('../config/db');

// Fungsi yang sudah ada
exports.createContactMessage = async (req, res) => { /* ... kode Anda di sini ... */ };

// -- TAMBAHKAN FUNGSI DI BAWAH INI --

// @desc    Ambil semua pesan kontak
// @route   GET /api/contact
// @access  Private (Admin)
exports.getAllMessages = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM contact ORDER BY created_at DESC');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Hapus satu pesan kontak
// @route   DELETE /api/contact/:id
// @access  Private (Admin)
exports.deleteMessage = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM contact WHERE id = ?', [id]);
    res.status(200).json({ message: 'Pesan berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};