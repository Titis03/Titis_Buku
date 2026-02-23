import express from 'express'; // Ganti require menjadi import
import pool from '../db/pool.js'; // Gunakan akhiran .js
import { verifyToken, requireRoles } from '../middleware/authorization.js';

const router = express.Router();

// =========================================================
// 1. GET /categories (Ambil Semua Kategori) - Semua Role
// =========================================================
router.get('/', verifyToken, requireRoles('admin', 'cashier', 'customer'),async (req, res) => {
    try {
        const q = `SELECT id_category, name, created_at, updated_at FROM categories ORDER BY name`;
        const { rows } = await pool.query(q);
        res.json({ count: rows.length, data: rows });
    } catch (e) {
        console.error("DB Error pada GET /categories:", e);
        res.status(500).json({ error: 'DB error', detail: e.message });
    }
});

// =========================================================
// 2. GET /categories/:id (Ambil Kategori Berdasarkan ID) - Hanya Admin dan Cashier
// =========================================================
router.get('/:id', verifyToken, requireRoles('admin', 'cashier'), async (req, res) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id) || id <= 0) {
        return res.status(400).json({ error: 'ID kategori tidak valid.' });
    }

    try {
        const q = `SELECT id_category, name, created_at, updated_at FROM categories WHERE id_category = $1`;
        const { rows } = await pool.query(q, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Kategori tidak ditemukan.' });
        }

        res.json(rows[0]);
    } catch (e) {
        console.error("DB Error pada GET /categories/:id:", e);
        res.status(500).json({ error: 'DB error', detail: e.message });
    }
});

// =========================================================
// 3. POST /categories (Buat Kategori Baru) - HANYA Admin
// =========================================================
router.post('/', verifyToken, requireRoles('admin'), async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Nama kategori wajib diisi.' });
    }

    try {
        // Cek duplikasi
        const check = await pool.query('SELECT 1 FROM categories WHERE name = $1', [name]);
        if (check.rows.length > 0) {
            return res.status(409).json({ error: 'Kategori sudah ada.' });
        }

        const q = `
            INSERT INTO categories (name)
            VALUES ($1)
            RETURNING id_category, name, created_at`;

        const { rows } = await pool.query(q, [name]);

        res.status(201).json({ message: 'Kategori berhasil ditambahkan', category: rows[0] });
    } catch (e) {
        console.error("DB Error pada POST /categories:", e);
        res.status(500).json({ error: 'DB error', detail: e.message });
    }
});

// =========================================================
// 4. PUT /categories/:id (Update Kategori) - HANYA Admin
// =========================================================
router.put('/:id', verifyToken, requireRoles('admin'), async (req, res) => {
    const id = Number(req.params.id);
    const { name } = req.body; 
    
    // 1. Validasi ID
    if (Number.isNaN(id) || id <= 0) {
        return res.status(400).json({ error: 'ID kategori tidak valid.' });
    }

    // 2. Validasi Data
    if (!name) {
        // Hanya nama yang bisa diupdate. Jika tidak ada, kirim error.
        return res.status(400).json({ error: 'Nama kategori wajib diisi untuk pembaruan.' });
    }
    
    try {
        // 3. Cek duplikasi nama baru (kecuali kategori itu sendiri)
        const check = await pool.query('SELECT 1 FROM categories WHERE name = $1 AND id_category != $2', [name, id]);
        if (check.rows.length > 0) {
            return res.status(409).json({ error: 'Nama kategori baru sudah ada.' });
        }

        // 4. Jalankan Query Update
        const q = `
            UPDATE categories 
            SET name = $1, updated_at = NOW()
            WHERE id_category = $2
            RETURNING id_category, name, updated_at`;

        const { rows } = await pool.query(q, [name, id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Kategori tidak ditemukan.' });
        }

        res.json({ message: 'Kategori berhasil diperbarui', category: rows[0] });

    } catch (e) {
        console.error("DB Error pada PUT /categories/:id:", e);
        res.status(500).json({ error: 'DB error', detail: e.message });
    }
});

// =========================================================
// 5. DELETE /categories/:id (Hapus Kategori) - HANYA Admin
// =========================================================
router.delete('/:id', verifyToken, requireRoles('admin'), async (req, res) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id) || id <= 0) return res.status(400).json({ error: 'ID kategori tidak valid.' });

    try {
        const q = `DELETE FROM categories WHERE id_category = $1`;
        const { rowCount } = await pool.query(q, [id]);

        if (rowCount === 0) {
            return res.status(404).json({ error: 'Kategori tidak ditemukan' });
        }

        // Status 204 No Content untuk operasi DELETE yang berhasil
        res.status(204).send();
    } catch (e) {
        console.error("DB Error pada DELETE /categories:", e);
        // Error 23503 (foreign_key_violation) jika ada buku yang masih menggunakan kategori ini
        if (e.code === '23503') { 
             return res.status(400).json({ error: 'Tidak bisa menghapus kategori. Masih ada buku yang terkait dengan kategori ini.' });
        }
        res.status(500).json({ error: 'DB error', detail: e.message });
    }
});

export default router;