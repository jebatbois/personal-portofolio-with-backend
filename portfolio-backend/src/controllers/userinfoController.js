// src/controllers/userinfoController.js
const db = require('../config/db');

exports.getUserInfo = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM userinfo LIMIT 1');
    if (rows.length === 0) {
      // Ini penting jika tabelnya benar-benar kosong di awal
      return res.status(404).json({ message: 'User info tidak ditemukan.' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// --- FUNGSI INI YANG KITA PERBAIKI SECARA FINAL ---
exports.updateUserInfo = async (req, res) => {
  const { id } = req.params;
  
  // Ambil semua data dari body request, TERMASUK navbar_logo_url
  const { 
    full_name, 
    job_title, 
    job_title_en, // <-- Tambahkan ini
    bio, 
    bio_en, // <-- Tambahkan ini
    profile_picture_url, 
    navbar_logo_url, // <-- Pastikan ini ada
    email, 
    phone_number, 
    address,
    linkedin_url,
    github_url,
    instagram_url,
    service_description,
    service_description_en // <-- Tambahkan ini
  } = req.body;

  try {
    // Pastikan query SQL juga meng-update kolom navbar_logo_url
    const sql = `UPDATE userinfo SET 
      full_name = ?, job_title = ?, job_title_en = ?, bio = ?, bio_en = ?, 
      profile_picture_url = ?, navbar_logo_url = ?, -- <-- Pastikan ini ada
      email = ?, phone_number = ?, address = ?, 
      linkedin_url = ?, github_url = ?, instagram_url = ?, 
      service_description = ?, service_description_en = ? -- <-- Pastikan ini ada
      WHERE id = ?`;

    // Pastikan variabelnya juga dimasukkan ke dalam array values
    const values = [
      full_name, job_title, job_title_en, bio, bio_en, 
      profile_picture_url, navbar_logo_url, // <-- Pastikan ini ada
      email, phone_number, address,
      linkedin_url, github_url, instagram_url, 
      service_description, service_description_en, // <-- Pastikan ini ada
      id
    ];
    
    await db.query(sql, values);
    res.status(200).json({ message: 'User info berhasil diupdate' });
  } catch (error) {
    console.error("ERROR saat update user info:", error);
    res.status(500).json({ message: 'Server Error', error });
  }
};