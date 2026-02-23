import express from 'express'; // Ganti require menjadi import
import pool from '../db/pool.js'; // Gunakan akhiran .js
import { verifyToken, requireRoles } from '../middleware/authorization.js';

const router = express.Router();

// Helper untuk validasi angka/price
const isPriceValid = (value) => value !== undefined && value !== null && !Number.isNaN(Number(value)) && Number(value) >= 0;

// =========================================================
// 1. POST /transactions - Buat transaksi baru (checkout)
// =========================================================
router.post('/', verifyToken, requireRoles('cashier'), async (req, res) => {
    // Diasumsikan id_user berasal dari token
    const { total_price, payment_method, items } = req.body;
    const id_user = req.user.id_user; 

    // --- Validasi Data Awal ---
    if (!isPriceValid(total_price) || !payment_method || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Data transaksi tidak lengkap atau tidak valid.' });
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Mulai transaksi DB

        // 1️⃣ Masukkan Transaksi Utama ke tabel 'transactions'
        // Kolom: id_user, transaction_date, total_price, payment_method
        const transactionQuery = `
            INSERT INTO transactions (id_user, transaction_date, total_price, payment_method)
            VALUES ($1, NOW(), $2, $3)
            -- Koreksi: Hanya 3 placeholder ($1, $2, $3) yang diperlukan selain NOW()
            RETURNING id_transaction, transaction_date, total_price, payment_method
        `;
        const transactionResult = await client.query(transactionQuery, [id_user, total_price, payment_method]);
        const transaction = transactionResult.rows[0];
        const id_transaction = transaction.id_transaction; // ID Transaksi Utama

        // 2️⃣ Persiapan dan Masukkan Item Transaksi ke tabel 'transaction_items'
        const itemValues = [];
        const itemParams = [];
        let paramIndex = 1;

        for (const item of items) {
            // Validasi item di dalam loop
            if (!item.id_product || !item.quantity || !isPriceValid(item.book_price)) {
                await client.query('ROLLBACK'); 
                return res.status(400).json({ error: 'Detail item tidak lengkap atau tidak valid: id_product, quantity, book_price wajib diisi.' });
            }
            
            // --- KRITIS: HITUNG SUBTOTAL ---
            const subtotal = parseFloat(item.quantity) * parseFloat(item.book_price);
            
            // Format untuk query batch: ($1, $2, $3, $4, $5)
            // 5 Placeholder dibutuhkan untuk 5 kolom
            itemValues.push(`($${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++}, $${paramIndex++})`);
            
            // Urutan parameter (5 nilai): [id_transaksi, id_produk, kuantitas, harga satuan, subtotal]
            itemParams.push(
                id_transaction, 
                item.id_product, 
                item.quantity, 
                item.book_price, 
                subtotal // <--- Nilai subtotal yang wajib ada
            );
        }

        const itemsQuery = `
            INSERT INTO transaction_items (transaction_id, product_id, quantity, book_price, subtotal)
            -- 5 Kolom Target
            VALUES ${itemValues.join(', ')}
            RETURNING transaction_id, product_id, quantity, book_price, subtotal
        `;
        const itemsResult = await client.query(itemsQuery, itemParams);

        // 3️⃣ Finalisasi dan Respons
        await client.query('COMMIT'); 

        res.status(201).json({
            message: 'Transaksi berhasil dibuat',
            transaction: {
                ...transaction,
                items: itemsResult.rows
            }
        });

    } catch (e) {
        // --- Penanganan Error ---
        await client.query('ROLLBACK'); 
        console.error("DB Error POST /transactions:", e);
        
        // Penanganan Foreign Key Violation
        if (e.code === '23503') {
             return res.status(400).json({ error: 'Data terkait tidak ditemukan. Pastikan ID produk valid dan ada di database.' });
        }

        res.status(500).json({ error: 'Gagal membuat transaksi.', detail: e.message });
    } finally {
        client.release();
    }
});

// =========================================================
// 2. GET /transactions - Ambil semua transaksi
// =========================================================
router.get('/', verifyToken, requireRoles('cashier'), async (req, res) => {
    try {
        const query = `
            SELECT t.id_transaction, t.transaction_date, t.total_price, t.payment_method,
                   u.username, u.fullname
            FROM transactions t
            JOIN users u ON t.id_user = u.id_user
            ORDER BY t.transaction_date DESC
        `;
        const { rows } = await pool.query(query);
        res.json({ count: rows.length, data: rows });
    } catch (e) {
        console.error("DB Error GET /transactions:", e);
        res.status(500).json({ error: 'DB error', detail: e.message });
    }
});

// =========================================================
// 3. GET /transactions/:id - Ambil detail transaksi
// =========================================================
router.get('/:id', verifyToken, requireRoles('cashier'), async (req, res) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id) || id <= 0) {
        return res.status(400).json({ error: 'ID transaksi tidak valid.' });
    }

    try {
        // Ambil transaksi utama
        const transactionQuery = `
            SELECT t.id_transaction, t.transaction_date, t.total_price, t.payment_method,
                   u.username, u.fullname
            FROM transactions t
            JOIN users u ON t.id_user = u.id_user
            WHERE t.id_transaction = $1
        `;
        const transactionResult = await pool.query(transactionQuery, [id]);
        if (transactionResult.rows.length === 0) {
            return res.status(404).json({ error: 'Transaksi tidak ditemukan.' });
        }
        const transaction = transactionResult.rows[0];

        // Ambil item transaksi
        const itemsQuery = `
            SELECT ti.id_item, ti.product_id, p.title as product_title,
                   ti.quantity, ti.book_price
            FROM transaction_items ti
            JOIN products p ON ti.product_id = p.id_product
            WHERE ti.transaction_id = $1
        `;
        const itemsResult = await pool.query(itemsQuery, [id]);

        res.json({
            ...transaction,
            items: itemsResult.rows
        });
    } catch (e) {
        console.error("DB Error GET /transactions/:id:", e);
        res.status(500).json({ error: 'DB error', detail: e.message });
    }
});

// =========================================================
// 4. PUT /transactions/:id - Edit transaksi (Pembaharuan parsial/sebagian)
// =========================================================
router.put('/:id', verifyToken, requireRoles('cashier'), async (req, res) => {
    const id = Number(req.params.id);
    // Hanya mengizinkan update pada payment_method dan total_price
    const { total_price, payment_method } = req.body;

    // --- Validasi Data Awal ---
    if (Number.isNaN(id) || id <= 0) {
        return res.status(400).json({ error: 'ID transaksi tidak valid.' });
    }

    // Validasi data yang dikirim jika ada
    const isTotalPriceUpdate = total_price !== undefined;
    const isPaymentMethodUpdate = payment_method !== undefined;

    if ((isTotalPriceUpdate && !isPriceValid(total_price)) || (isPaymentMethodUpdate && payment_method.trim() === '')) {
        return res.status(400).json({ error: 'Data yang diupdate tidak valid. Harga harus angka non-negatif dan metode pembayaran tidak boleh kosong.' });
    }
    
    // Pastikan ada sesuatu untuk diupdate
    if (!isTotalPriceUpdate && !isPaymentMethodUpdate) {
         return res.status(400).json({ error: 'Tidak ada data yang dikirim untuk diupdate (hanya total_price atau payment_method yang diizinkan).' });
    }

    const updates = [];
    const params = [];
    let paramIndex = 1;

    // Persiapan Query Dinamis
    if (isTotalPriceUpdate) {
        updates.push(`total_price = $${paramIndex++}`);
        params.push(total_price);
    }

    if (isPaymentMethodUpdate) {
        updates.push(`payment_method = $${paramIndex++}`);
        params.push(payment_method);
    }
    
    // Jangan lupa ID Transaksi untuk klausa WHERE
    params.push(id);
    const idParam = `$${paramIndex}`; // Placeholder untuk ID Transaksi

    
    // Catatan: Asumsikan tabel 'transactions' memiliki kolom updated_at
    const updateQuery = `
        UPDATE transactions
        SET ${updates.join(', ')},
            updated_at = NOW() 
        WHERE id_transaction = ${idParam}
        RETURNING id_transaction, transaction_date, total_price, payment_method, id_user
    `;

    try {
        const { rows } = await pool.query(updateQuery, params);
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Transaksi tidak ditemukan atau tidak ada perubahan yang dilakukan.' });
        }

        res.json({
            message: 'Transaksi berhasil diupdate',
            transaction: rows[0]
        });

    } catch (e) {
        console.error("DB Error PUT /transactions/:id:", e);
        res.status(500).json({ error: 'Gagal mengupdate transaksi.', detail: e.message });
    }
});

export default router;