// seedAdmin.js
require('dotenv').config();
const bcrypt = require('bcryptjs');
const db = require('./src/config/db');

const seedDatabase = async () => {
  try {
    // --- Bagian 1: Membuat User Admin ---
    console.log("Memproses user admin...");
    const adminUsername = 'admin';
    const adminPassword = 'Rifqy123'; // Ganti dengan password admin yang Anda inginkan
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);
    
    // Hapus admin lama jika ada, lalu buat yang baru
    await db.query('DELETE FROM admin_users WHERE username = ?', [adminUsername]);
    await db.query('INSERT INTO admin_users (username, password) VALUES (?, ?)', [adminUsername, hashedPassword]);
    console.log(`✅ Admin user '${adminUsername}' berhasil dibuat/diupdate.`);

    // --- Bagian 2: Membuat Data Awal untuk userinfo (INI YANG BARU) ---
    console.log("Memproses data userinfo...");
    // Hapus semua data lama untuk memastikan hanya ada 1 baris
    await db.query('DELETE FROM userinfo'); 
    
    // Masukkan satu baris data awal. Kita set id=1 agar mudah di-query.
    const initialUserInfoSQL = `
      INSERT INTO userinfo 
      (id, full_name, job_title, email, phone_number, address, bio, profile_picture_url, linkedin_url, github_url, instagram_url, service_description) 
      VALUES (1, 'Nama Anda', 'Jabatan Anda', 'email@anda.com', '', '', '', '', '', '', '', '')
    `;
    await db.query(initialUserInfoSQL);
    console.log('✅ Data awal untuk `userinfo` berhasil dibuat dengan id=1.');

  } catch (error) {
    console.error('❌ Gagal menjalankan skrip seeder:', error);
  } finally {
    await db.end();
    console.log('Koneksi database ditutup.');
  }
};

seedDatabase();