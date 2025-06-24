// seedAdmin.js

// PENTING: Muat variabel lingkungan dari .env SEBELUM kode lain dijalankan
require('dotenv').config();

const bcrypt = require('bcryptjs');
const db = require('./src/config/db');

const createAdmin = async () => {
  // Cek apakah variabel .env sudah termuat
  if (!process.env.DB_USER) {
    console.error('❌ Variabel .env tidak termuat! Pastikan file .env sudah benar.');
    return;
  }

  try {
    const username = 'admin';
    const plainPassword = 'Rifqy123'; // Pastikan ini password yang Anda inginkan

    console.log('Menyiapkan hashing password...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    console.log('Password berhasil di-hash.');

    await db.query('DELETE FROM admin_users WHERE username = ?', [username]);
    console.log('User admin lama (jika ada) berhasil dihapus.');

    const sql = 'INSERT INTO admin_users (username, password) VALUES (?, ?)';
    await db.query(sql, [username, hashedPassword]);
    console.log(`✅ Admin user '${username}' berhasil dibuat/diupdate dengan password '${plainPassword}'.`);
  
  } catch (error) {
    console.error('❌ Gagal menjalankan skrip seedAdmin:', error.message);
  } finally {
    await db.end(); 
    console.log('Koneksi database ditutup.');
  }
};

createAdmin();