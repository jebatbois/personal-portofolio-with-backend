// src/controllers/contactController.js
const db = require('../config/db');

// Fungsi yang sudah ada
exports.createContactMessage = async (req, res) => {
  console.log(`[${new Date().toLocaleTimeString()}] Menerima permintaan POST ke /api/contact...`);
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Semua field wajib diisi.' });
  }

  try {
    console.log("[BACKEND] Mencoba menjalankan query INSERT ke tabel contact...");
    const sql = 'INSERT INTO contact (name, email, message) VALUES (?, ?, ?)';

    await db.query(sql, [name, email, message]);

    // Jika log di bawah ini tidak muncul di terminal, berarti proses macet di db.query()
    console.log("[BACKEND] Query INSERT berhasil. Mengirim response..."); 

    res.status(201).json({ success: true, message: 'Pesan berhasil terkirim!' });

  } catch (error) {
    console.error('!!! ERROR saat menyimpan pesan kontak:', error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
  }
};

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