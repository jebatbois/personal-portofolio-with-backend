// src/controllers/articlesController.js
const db = require('../config/db');

const generateSlug = (title) => {
  if (!title) return '';
  return title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') + '-' + Date.now();
};

// @desc    Ambil semua artikel yang sudah 'published' (untuk publik)
exports.getAllPublishedArticles = async (req, res) => {
  try {
    const lang = req.query.lang === 'en' ? 'en' : 'id';
    const titleCol = `title_${lang} as title`;
    const summaryCol = `summary_${lang} as summary`;

    // PERBAIKAN: Menggunakan nama kolom dinamis yang benar
    const sql = `SELECT id, ${titleCol}, slug, ${summaryCol}, thumbnail_url, status, created_at FROM articles WHERE status = 'published' ORDER BY created_at DESC`;
    
    const [articles] = await db.query(sql);
    res.status(200).json(articles);
  } catch (error) {
    console.error("[BACKEND] !!! ERROR di getAllPublishedArticles:", error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Ambil SEMUA artikel (untuk admin panel)
// @route   GET /api/articles/admin/all
// @access  Private
exports.getAllArticlesForAdmin = async (req, res) => {
  try {
    const sql = "SELECT id, title_id as title, slug, status, created_at FROM articles ORDER BY created_at DESC";
    const [articles] = await db.query(sql);
    res.status(200).json(articles);
  } catch (error) {
    console.error("[BACKEND] !!! ERROR di getAllArticlesForAdmin:", error);
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Ambil satu artikel berdasarkan slug (untuk publik)
exports.getArticleBySlug = async (req, res) => {
    try {
        const lang = req.query.lang === 'en' ? 'en' : 'id';
        const { slug } = req.params;

        const titleCol = `title_${lang} as title`;
        const summaryCol = `summary_${lang} as summary`;
        const contentCol = `content_${lang} as content`;

        const sql = `SELECT id, ${titleCol}, slug, ${summaryCol}, ${contentCol}, thumbnail_url, status, created_at FROM articles WHERE slug = ? AND status = 'published'`;
        
        const [rows] = await db.query(sql, [slug]);
        if (rows.length === 0) return res.status(404).json({ message: 'Artikel tidak ditemukan' });
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};

// @desc    Buat artikel baru (dengan summary)
exports.createArticle = async (req, res) => {
  const {
    title_id, title_en,
    summary_id, summary_en,
    content_id, content_en,
    thumbnail_url, status
  } = req.body;
  const slug = generateSlug(title_id);

  try {
    const sql = `
      INSERT INTO articles
      (title_id, title_en, summary_id, summary_en, content_id, content_en, slug, thumbnail_url, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(sql, [
      title_id, title_en,
      summary_id, summary_en,
      content_id, content_en,
      slug, thumbnail_url, status
    ]);
    res.status(201).json({ id: result.insertId, slug, ...req.body });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// @desc    Update data artikel (dengan summary)
exports.updateArticle = async (req, res) => {
  const { id } = req.params;
  const {
    title_id, title_en,
    summary_id, summary_en,
    content_id, content_en,
    thumbnail_url, status
  } = req.body;
  const slug = generateSlug(title_id);

  try {
    const sql = `
      UPDATE articles SET
        title_id = ?, title_en = ?,
        summary_id = ?, summary_en = ?,
        content_id = ?, content_en = ?,
        slug = ?, thumbnail_url = ?, status = ?
      WHERE id = ?
    `;
    await db.query(sql, [
      title_id, title_en,
      summary_id, summary_en,
      content_id, content_en,
      slug, thumbnail_url, status, id
    ]);
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

// @desc    Ambil semua artikel (untuk publik, dengan bahasa yang dipilih)
exports.getAllArticles = async (req, res) => {
  try {
    const lang = req.query.lang === 'en' ? 'en' : 'id';
    const titleCol = `title_${lang} as title`;
    const summaryCol = `summary_${lang} as summary`;
    const sql = `SELECT id, ${titleCol}, slug, ${summaryCol}, thumbnail_url FROM articles WHERE status='published' ORDER BY created_at DESC`;
    const [rows] = await db.query(sql);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};