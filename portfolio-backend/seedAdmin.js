// seedAdmin.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./src/config/db');

const seedDatabase = async () => {
  try {
    // Bagian 1: Membuat User Admin (tidak berubah)
    console.log("Memproses user admin...");
    const adminUsername = 'admin';
    const adminPassword = 'password123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);
    await db.query('DELETE FROM admin_users WHERE username = ?', [adminUsername]);
    await db.query('INSERT INTO admin_users (username, password) VALUES (?, ?)', [adminUsername, hashedPassword]);
    console.log(`✅ Admin user '${adminUsername}' berhasil dibuat/diupdate.`);

    // Bagian 2: Membuat Data Awal untuk userinfo (INI YANG DIPERBAIKI)
    console.log("Memproses data userinfo...");
    await db.query('DELETE FROM userinfo'); 

    // Query INSERT tanpa kolom job_title
    const initialUserInfoSQL = `
      INSERT INTO userinfo 
      (id, full_name, 
       bio_id, bio_en, 
       service_description_id, service_description_en,
       email, phone_number, address, profile_picture_url, navbar_logo_url, linkedin_url, github_url, instagram_url) 
      VALUES (
        1, 'Rifqy Athaya Prayuda', 
        'Bio singkat tentang saya...', 'Short bio about me...',
        'Deskripsi servis/jasa yang saya tawarkan...', 'Description of services I offer...',
        'email@anda.com', '', '', '', '', 
        'https://linkedin.com/in/namaanda', 'https://github.com/namaanda', 'https://instagram.com/namaanda'
      )
    `;
    await db.query(initialUserInfoSQL);
    console.log('✅ Data awal untuk `userinfo` berhasil dibuat.');

  } catch (error) {
    console.error('❌ Gagal menjalankan skrip seeder:', error.sqlMessage || error);
  } finally {
    await db.end();
    console.log('Koneksi database ditutup.');
  }
};

seedDatabase();