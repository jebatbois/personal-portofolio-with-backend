const mysql = require('mysql2/promise');
require('dotenv').config(); // Pastikan dotenv dipanggil di sini jika belum

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 20694, // Sesuaikan dengan port Aiven kamu
  // BLOK SSL WAJIB UNTUK AIVEN
  ssl: {
    rejectUnauthorized: false
  }
});

// ALAT PENDETEKSI KONEKSI
pool.getConnection()
  .then((connection) => {
    console.log("✅ BERHASIL: Backend sudah terhubung ke Database Aiven!");
    connection.release();
  })
  .catch((err) => {
    console.error("❌ GAGAL KONEK KE DATABASE AIVEN. Penyebabnya:");
    console.error(err.message);
  });

module.exports = pool;