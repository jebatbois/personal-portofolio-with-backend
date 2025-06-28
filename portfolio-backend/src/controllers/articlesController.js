// src/controllers/articlesController.js
const db = require('../config/db');

// Fungsi untuk membuat 'slug' dari judul (untuk URL)
const generateSlug = (title) => {
  return title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now();
};

// @desc    Ambil semua artikel yang sudah 'published' (untuk publik)
exports.getAllPublishedArticles = async (req, res) => {
  try {
    const sql = "SELECT id, title, slug, thumbnail_url, status, created_at FROM articles WHERE status = 'published' ORDER BY created_at DESC";
    const [articles] = await db.query(sql);
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Ambil SEMUA artikel (untuk admin panel)
exports.getAllArticlesForAdmin = async (req, res) => {
  try {
    const sql = "SELECT id, title, slug, status, created_at FROM articles ORDER BY created_at DESC";
    const [articles] = await db.query(sql);
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Ambil satu artikel berdasarkan slug (untuk publik)
exports.getArticleBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const [rows] = await db.query("SELECT * FROM articles WHERE slug = ? AND status = 'published'", [slug]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Artikel tidak ditemukan' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// @desc    Buat artikel baru (dengan summary)
exports.createArticle = async (req, res) => {
  const { title, summary, content, thumbnail_url, status } = req.body;
  const slug = generateSlug(title);
  try {
    const sql = 'INSERT INTO articles (title, summary, slug, content, thumbnail_url, status) VALUES (?, ?, ?, ?, ?, ?)';
    const [result] = await db.query(sql, [title, summary, slug, content, thumbnail_url, status]);
    res.status(201).json({ id: result.insertId, slug, ...req.body });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Update data artikel (dengan summary)
exports.updateArticle = async (req, res) => {
  const { id } = req.params;
  const { title, summary, content, thumbnail_url, status } = req.body;
  const slug = generateSlug(title);
  try {
    const sql = 'UPDATE articles SET title = ?, summary = ?, slug = ?, content = ?, thumbnail_url = ?, status = ? WHERE id = ?';
    await db.query(sql, [title, summary, slug, content, thumbnail_url, status, id]);
    res.status(200).json({ message: 'Artikel berhasil diupdate' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Hapus data artikel
exports.deleteArticle = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM articles WHERE id = ?', [id]);
    res.status(200).json({ message: 'Artikel berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};