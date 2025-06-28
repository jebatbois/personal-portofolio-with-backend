// src/controllers/portfolioController.js
const db = require('../config/db');

// Mengambil semua data dengan bahasa dinamis
exports.getAllPortfolios = async (req, res) => {
  try {
    const lang = req.query.lang === 'en' ? 'en' : 'id'; // Default ke 'id'
    const nameCol = `project_name_${lang}`;
    const descCol = `description_${lang}`;
    const tagsCol = `tags_${lang}`;
    const sql = `SELECT id, ${nameCol} as project_name, ${descCol} as description, image_url, project_link, ${tagsCol} as tags FROM portfolio ORDER BY id DESC`;
    const [rows] = await db.query(sql);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Mengambil satu data, sekarang mengambil semua kolom bahasa
exports.getPortfolioById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM portfolio WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Proyek tidak ditemukan' });
    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Membuat data baru dengan input untuk kedua bahasa
exports.createPortfolio = async (req, res) => {
  const { project_name_id, project_name_en, description_id, description_en, image_url, project_link, tags_id, tags_en } = req.body;
  try {
    const sql = `INSERT INTO portfolio 
      (project_name_id, project_name_en, description_id, description_en, image_url, project_link, tags_id, tags_en) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const [result] = await db.query(sql, [project_name_id, project_name_en, description_id, description_en, image_url, project_link, tags_id, tags_en]);
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// Mengupdate data dengan input untuk kedua bahasa
exports.updatePortfolio = async (req, res) => {
  const { id } = req.params;
  const { project_name_id, project_name_en, description_id, description_en, image_url, project_link, tags_id, tags_en } = req.body;
  try {
    const sql = `UPDATE portfolio SET 
      project_name_id = ?, project_name_en = ?, description_id = ?, description_en = ?, 
      image_url = ?, project_link = ?, tags_id = ?, tags_en = ? 
      WHERE id = ?`;
    await db.query(sql, [project_name_id, project_name_en, description_id, description_en, image_url, project_link, tags_id, tags_en, id]);
    res.status(200).json({ message: 'Portfolio berhasil diupdate' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

exports.deletePortfolio = async (req, res) => {
    const { id } = req.params;
    try {
        // Karena ada ON DELETE CASCADE di database, menghapus proyek akan otomatis menghapus gambarnya di tabel project_images
        await db.query('DELETE FROM portfolio WHERE id = ?', [id]);
        res.status(200).json({ message: 'Portfolio berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// --- FUNGSI UNTUK GALERI ---
exports.getProjectImages = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM project_images WHERE portfolio_id = ?', [id]);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

exports.addProjectImage = async (req, res) => {
  const { id } = req.params; // Ini adalah ID dari portfolio
  const imageUrl = req.body.image_url; // URL gambar didapat setelah di-upload

  if (!imageUrl) {
    return res.status(400).json({ message: 'URL gambar diperlukan' });
  }

  try {
    const sql = 'INSERT INTO project_images (portfolio_id, image_url) VALUES (?, ?)';
    const [result] = await db.query(sql, [id, imageUrl]);
    res.status(201).json({ id: result.insertId, portfolio_id: id, image_url: imageUrl });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

exports.deleteProjectImage = async (req, res) => {
  const { imageId } = req.params;
  try {
    await db.query('DELETE FROM project_images WHERE id = ?', [imageId]);
    res.status(200).json({ message: 'Gambar berhasil dihapus dari galeri.' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};


