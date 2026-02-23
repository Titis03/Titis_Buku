import express from 'express'; 
import pool from '../db/pool.js'; 
import { verifyToken, requireRoles } from '../middleware/authorization.js';

const router = express.Router();

// =========================================================
// 1. GET /transaction_items (Ambil Semua Item Transaksi) - HANYA Admin dan Cashier
// =========================================================
router.get('/', verifyToken, requireRoles('admin', 'cashier'), async (req, res) => {
    try {
        const q = `
            SELECT 
                ti.id_item, 
                ti.id_transaction, 
                ti.id_book, 
                b.title as book_title,
                ti.quantity, 
                ti.unit_price
            FROM transaction_items ti
            JOIN books b ON ti.id_book = b.id_book
            ORDER BY ti.id_transaction DESC`;
            
        const { rows } = await pool.query(q);
        res.json({ count: rows.length, data: rows });
    } catch (e) {
        console.error("DB Error pada GET /transaction_items:", e);
        res.status(500).json({ error: 'DB error', detail: e.message });
    }
});

export default router;