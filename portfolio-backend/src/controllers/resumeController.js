// src/controllers/resumeController.js
const db = require('../config/db');

exports.getAllResumeItems = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM resume ORDER BY start_date DESC');
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

exports.createResumeItem = async (req, res) => {
  const { item_type, title, subtitle, start_date, end_date, description } = req.body;
  try {
    const sql = 'INSERT INTO resume (item_type, title, subtitle, start_date, end_date, description) VALUES (?, ?, ?, ?, ?, ?)';
    const [result] = await db.query(sql, [item_type, title, subtitle, start_date, end_date, description]);
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Fungsi update dan delete bisa Anda tambahkan sendiri dengan pola yang sama seperti portfolioController