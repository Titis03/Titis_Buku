import express from 'express'; // Ganti require menjadi import
import pool from '../db/pool.js'; // Pastikan pakai .js
import { verifyToken, requireRoles } from '../middleware/authorization.js';

const router = express.Router(); 

// =========================================================
// 1. GET /products (Ambil Semua) - Semua Role
// =========================================================
router.get('/', verifyToken, requireRoles('admin', 'cashier', 'customer'), async (req, res) => {
    try {
        const q = `
            SELECT 
                p.id_product, 
                p.title, 
                p.price, 
                p.author, 
                p.stock,
                c.name AS category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id_category
            ORDER BY p.id_product`;
        
        const { rows } = await pool.query(q);
        res.json({ count: rows.length, data: rows });
    } catch (e) {
        console.error("DB Error pada GET /products:", e);
        res.status(500).json({ error: 'DB error', detail: e.message }); 
    }
});

// =========================================================
// 2. GET /products/:id (Ambil Berdasarkan ID) - Hanya Admin dan Cashier
// =========================================================
router.get('/:id', verifyToken, requireRoles('admin', 'cashier'), async (req, res) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id) || id <= 0) {
        return res.status(400).json({ error: 'ID produk tidak valid.' });
    }

    try {
        const q = `
            SELECT 
                p.id_product, 
                p.title, 
                p.price, 
                p.author, 
                p.stock,
                c.name AS category_name
            FROM products p
            LEFT JOIN categories c ON p.category_id = c.id_category
            WHERE p.id_product = $1`;
        
        const { rows } = await pool.query(q, [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Buku tidak ditemukan' });
        }
        res.json(rows[0]);
    } catch (e) {
        console.error("DB Error pada GET /products/:id:", e);
        res.status(500).json({ error: 'DB error', detail: e.message }); 
    }
});

// =========================================================
// 3. POST /products (Buat Baru) - HANYA Admin
// =========================================================
// Wajib memanggil verifyToken dulu
router.post('/', verifyToken, requireRoles('admin'), async (req, res) => {
    // KOREKSI: Menggunakan nama kolom yang benar: category_id
    const { title, price, author, category_id, stock } = req.body;
    
    // Validasi data wajib: title, price, dan category_id (Foreign Key)
    if (!title || price == null || typeof category_id !== 'number' || category_id <= 0) { 
        return res.status(400).json({ error: 'Data buku tidak lengkap. title, category_id, dan price wajib diisi.' });
    }
    
    try {
        const q = `
            INSERT INTO products (title, price, author, category_id, stock) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING id_product, title, price, author, category_id, stock`;
            
        const { rows } = await pool.query(q, [
            title, 
            price, 
            author || null,             // $3: Gunakan null jika author kosong
            category_id,                // $4: ID kategori
            stock || 0                  // $5: Stock default 0
        ]);
        
        res.status(201).json({ message: 'Buku berhasil ditambahkan', product: rows[0] }); 
    } catch (e) {
        // Tangani Foreign Key Violation jika category_id tidak valid (Code '23503')
        if (e.code === '23503') {
            return res.status(400).json({ error: 'Category ID tidak valid atau tidak ditemukan.' });
        }
        console.error("DB Error pada POST /products:", e);
        res.status(500).json({ error: 'DB error', detail: e.message });
    }
});

// =========================================================
// 4. PUT /products/:id (Update) - Hanya Admin
// =========================================================
// Wajib memanggil verifyToken dulu
router.put('/:id', verifyToken, requireRoles('admin'), async (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id) || id <= 0) return res.status(400).json({ error: 'ID produk tidak valid.' });
    
    const { title, price, author, category_id, stock } = req.body;
    
    const updates = [];
    const args = [];
    let argIndex = 1;
    
    if (title !== undefined) {
        updates.push(`title = $${argIndex++}`); 
        args.push(title);
    }
    if (price !== undefined) {
        updates.push(`price = $${argIndex++}`);
        args.push(price);
    }
    if (author !== undefined) {
        updates.push(`author = $${argIndex++}`);
        args.push(author);
    }
    // KOREKSI: Menggunakan nama kolom category_id
    if (category_id !== undefined) {
        // Validasi cepat: harus integer
        if (typeof category_id !== 'number' || category_id <= 0) {
            return res.status(400).json({ error: 'Category ID harus berupa angka positif.' });
        }
        updates.push(`category_id = $${argIndex++}`);
        args.push(category_id);
    }
    if (stock !== undefined) {
        updates.push(`stock = $${argIndex++}`);
        args.push(stock);
    }
    
    if (updates.length === 0) {
        return res.status(400).json({ error: 'Tidak ada data yang dikirim untuk diperbarui.' });
    }
    
    args.push(id); // ID adalah argumen terakhir
    
    try {
        const q = `
            UPDATE products SET ${updates.join(', ')} 
            WHERE id_product = $${argIndex} 
            RETURNING id_product, title, price, author, category_id, stock`; 
        
        const { rows } = await pool.query(q, args);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Buku tidak ditemukan' });
        }
        res.json({ message: 'Buku berhasil diperbarui', product: rows[0] }); 

    } catch (e) {
        // Tangani Foreign Key Violation jika category_id tidak valid (Code '23503')
        if (e.code === '23503') {
            return res.status(400).json({ error: 'Category ID tidak valid atau tidak ditemukan.' });
        }
        console.error("DB Error pada PUT /products:", e);
        res.status(500).json({ error: 'DB error', detail: e.message });
    }
});

// =========================================================
// 5. DELETE /products/:id (Hapus) - HANYA Admin
// =========================================================
// Wajib memanggil verifyToken dulu
router.delete('/:id', verifyToken, requireRoles('admin'), async (req, res) => {
    const id = Number(req.params.id);
    
    if (Number.isNaN(id) || id <= 0) return res.status(400).json({ error: 'ID produk tidak valid.' });

    try {
        const q = `DELETE FROM products WHERE id_product = $1`;
        const { rowCount } = await pool.query(q, [id]);
        
        if (rowCount === 0) {
            return res.status(404).json({ error: 'Buku tidak ditemukan' });
        }
        
        // Status 204 No Content
        res.status(204).send(); 
        
    } catch (e) {
        // Tangani error jika produk masih direferensikan (misal di transaction_items)
        if (e.code === '23503') {
            return res.status(409).json({ error: 'Produk tidak dapat dihapus karena masih ada dalam riwayat transaksi.' });
        }
        console.error("DB Error pada DELETE /products:", e);
        res.status(500).json({ error: 'DB error', detail: e.message });
    }
});

export default router;