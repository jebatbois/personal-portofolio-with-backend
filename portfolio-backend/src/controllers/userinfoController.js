// src/controllers/userinfoController.js
const db = require('../config/db');

exports.getUserInfo = async (req, res) => {
  try {
    const lang = req.query.lang === 'en' ? 'en' : 'id';
    const bioCol = `bio_${lang} as bio`;
    const serviceDescCol = `service_description_${lang} as service_description`;

    // Query SELECT tanpa job_title
    const sql = `SELECT id, full_name, ${bioCol}, profile_picture_url, navbar_logo_url, email, phone_number, address, linkedin_url, github_url, instagram_url, ${serviceDescCol} FROM userinfo LIMIT 1`;

    const [rows] = await db.query(sql);
    if (rows.length === 0) return res.status(404).json({ message: 'User info tidak ditemukan.' });
    res.status(200).json(rows[0]);
  } catch (error) { res.status(500).json({ message: 'Server Error', error }); }
};

exports.updateUserInfo = async (req, res) => {
  // --- TAMBAHKAN CONSOLE.LOG DI SINI ---
  console.log("=== BACKEND MENERIMA PERMINTAAN UPDATE ===");
  console.log("ID DARI URL:", req.params.id);
  console.log("DATA DARI BODY:", req.body);
  // --- AKHIR TAMBAHAN ---

  const { id } = req.params;
  const { 
    full_name, bio_id, bio_en, profile_picture_url, navbar_logo_url, email, 
    phone_number, address, linkedin_url, github_url, instagram_url, 
    service_description_id, service_description_en
  } = req.body;

  try {
    // Query UPDATE tanpa job_title
    const sql = `UPDATE userinfo SET 
      full_name = ?, bio_id = ?, bio_en = ?, profile_picture_url = ?, navbar_logo_url = ?, 
      email = ?, phone_number = ?, address = ?, linkedin_url = ?, github_url = ?, 
      instagram_url = ?, service_description_id = ?, service_description_en = ?
      WHERE id = ?`;
    const values = [
      full_name, bio_id, bio_en, profile_picture_url, navbar_logo_url, email, phone_number,
      address, linkedin_url, github_url, instagram_url, service_description_id, service_description_en, id
    ];

    await db.query(sql, values);
    res.status(200).json({ message: 'User info berhasil diupdate' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Ambil SEMUA data user info untuk admin panel
// @route   GET /api/userinfo/admin
// @access  Private
exports.getUserInfoForAdmin = async (req, res) => {
  try {
    // Cukup ambil semua kolom dari baris pertama
    const [rows] = await db.query('SELECT * FROM userinfo LIMIT 1');
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User info tidak ditemukan.' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};