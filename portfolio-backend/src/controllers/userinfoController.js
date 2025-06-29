// src/controllers/userinfoController.js
const db = require('../config/db');

// --- FUNGSI INI KITA UBAH MENJADI LEBIH AMAN DAN SEDERHANA ---
const formatDateForSQL = (dateString) => {
  // Jika string kosong, null, atau undefined, kembalikan null untuk database.
  if (!dateString) return null;

  // Cukup ambil 10 karakter pertama (YYYY-MM-DD).
  // Ini adalah cara paling aman untuk menghindari masalah timezone.
  // Ia akan bekerja baik untuk format "2004-09-02" maupun "2004-09-02T17:00:00.000Z".
  return String(dateString).substring(0, 10);
};

// Mengambil data user info (tambahkan spotify_url)
exports.getUserInfo = async (req, res) => {
  try {
    const lang = req.query.lang === 'en' ? 'en' : 'id';
    const heroBioCol = `hero_bio_${lang} as hero_bio`;
    const aboutDescCol = `about_description_${lang} as about_description`;
    const hobbiesCol = `hobbies_${lang} as hobbies`;
    const serviceDescCol = `service_description_${lang} as service_description`;

    const sql = `SELECT id, full_name, ${heroBioCol}, ${aboutDescCol}, profile_picture_url, about_image_url, navbar_logo_url, email, phone_number, address, place_of_birth, date_of_birth, location, ${hobbiesCol}, ${serviceDescCol}, linkedin_url, github_url, instagram_url, spotify_url FROM userinfo LIMIT 1`;
    
    const [rows] = await db.query(sql);
    if (rows.length === 0) return res.status(404).json({ message: 'User info tidak ditemukan.' });
    res.status(200).json(rows[0]);
  } catch (error) { res.status(500).json({ message: 'Server Error', error }); }
};

// Mengupdate semua data user info dengan format tanggal yang sudah aman (tambahkan spotify_url)
exports.updateUserInfo = async (req, res) => {
  const { id } = req.params;
  const { 
    full_name, hero_bio_id, hero_bio_en, about_description_id, about_description_en,
    profile_picture_url, navbar_logo_url, about_image_url,
    email, phone_number, address, place_of_birth, location,
    linkedin_url, github_url, instagram_url, spotify_url,
    service_description_id, service_description_en,
    hobbies_id, hobbies_en
  } = req.body;

  // Memanggil fungsi baru yang lebih aman
  const dateOfBirthFormatted = formatDateForSQL(req.body.date_of_birth);

  try {
    const sql = `UPDATE userinfo SET 
      full_name = ?, hero_bio_id = ?, hero_bio_en = ?, 
      about_description_id = ?, about_description_en = ?,
      profile_picture_url = ?, navbar_logo_url = ?, about_image_url = ?,
      email = ?, phone_number = ?, address = ?, place_of_birth = ?, date_of_birth = ?, location = ?,
      linkedin_url = ?, github_url = ?, instagram_url = ?, spotify_url = ?,
      service_description_id = ?, service_description_en = ?,
      hobbies_id = ?, hobbies_en = ?
      WHERE id = ?`;
    
    const values = [
      full_name, hero_bio_id, hero_bio_en, 
      about_description_id, about_description_en,
      profile_picture_url, navbar_logo_url, about_image_url,
      email, phone_number, address, place_of_birth, dateOfBirthFormatted, location,
      linkedin_url, github_url, instagram_url, spotify_url,
      service_description_id, service_description_en,
      hobbies_id, hobbies_en,
      id
    ];
    
    await db.query(sql, values);
    res.status(200).json({ message: 'User info berhasil diupdate' });
  } catch (error) {
    console.error("ERROR saat update user info:", error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Fungsi untuk admin panel
exports.getUserInfoForAdmin = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM userinfo LIMIT 1');
    if (rows.length === 0) {
      return res.status(404).json({ message: 'User info tidak ditemukan.' });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};