import express from 'express';
import pool from '../db/pool.js';
// Tambahkan requireRoles di dalam kurung kurawal berikut:
import { verifyToken, requireRoles } from '../middleware/authorization.js'; 

const router = express.Router(); 

// =========================================================
// Rute Pengguna (Memerlukan Access Token)
// =========================================================

/**
 * @route GET /user/
 * @description Memberikan panduan ke rute user yang tersedia.
 * @access admin
 */
router.get('/', verifyToken, requireRoles('admin'), (req, res) => {
    res.status(200).json({
        message: 'Akses User Router. Tersedia endpoint: GET /profile, PUT /profile, PUT /deactivate-user.',
    });
});

/**
 * @route GET /user/profile
 * @description Mengambil profil pengguna yang sedang login.
 * @access Protected (Membutuhkan Access Token). admin
 */
router.get('/profile', verifyToken, requireRoles('admin'), async (req, res) => {
    // req.user berisi payload dari Access Token (id_user, username, role)
    const { id_user } = req.user; 

    try {
        const result = await pool.query(
            'SELECT id_user, fullname, username, email, role, is_active, created_at FROM users WHERE id_user = $1',
            [id_user]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Profil pengguna tidak ditemukan.' });
        }

        res.status(200).json({
            message: 'Akses profil berhasil',
            user: result.rows[0]
        });

    } catch (e) {
        console.error("Error retrieving profile:", e);
        res.status(500).json({ error: 'Gagal mengambil data profil karena kesalahan server.' });
    }
});

/**
 * @route PUT /user/profile
 * @description Mengupdate profil pengguna yang sedang login.
 * @access Protected (Membutuhkan Access Token). admin
 */
router.put('/profile', verifyToken, requireRoles('admin'),async (req, res) => {
    const { id_user } = req.user;
    const { fullname, email } = req.body; 

    if (!fullname && !email) {
        return res.status(400).json({ message: 'Minimal salah satu field (fullname atau email) harus disertakan untuk update.' });
    }

    let queryParts = [];
    let queryValues = [];
    let paramIndex = 1;

    if (fullname) {
        queryParts.push(`fullname = $${paramIndex++}`);
        queryValues.push(fullname);
    }
    if (email) {
        queryParts.push(`email = $${paramIndex++}`);
        queryValues.push(email);
    }

    if (queryParts.length === 0) {
        return res.status(400).json({ message: 'Tidak ada data valid yang dikirim untuk diupdate.' });
    }
    
    queryParts.push(`updated_at = NOW()`);
    queryValues.push(id_user); 

    const updateQuery = `
        UPDATE users SET ${queryParts.join(', ')}
        WHERE id_user = $${paramIndex}
        RETURNING id_user, fullname, username, email, role
    `;

    try {
        const result = await pool.query(updateQuery, queryValues);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
        }

        res.status(200).json({
            message: 'Profil berhasil diupdate.',
            user: result.rows[0]
        });

    } catch (e) {
        console.error("Error updating profile:", e);
        // Error kode '23505' adalah unique constraint violation (misal email sudah terpakai)
        if (e.code === '23505') {
            return res.status(409).json({ error: 'Update gagal. Email atau username yang Anda masukkan sudah digunakan.' });
        }
        res.status(500).json({ error: 'Gagal mengupdate profil karena kesalahan server.' });
    }
});


/**
 * @route PUT /user/deactivate-user
 * @description Menonaktifkan (deactivate) pengguna berdasarkan ID.
 * @access Protected (Membutuhkan Access Token). Memerlukan ID di body. admin
 */
router.put('/deactivate-user', verifyToken, requireRoles('admin'), async (req, res) => {
    // ID yang ingin dinonaktifkan (datang dari body request)
    const { id_to_deactivate } = req.body; 
    
    // User yang melakukan request (dari token)
    const { id_user: caller_id, role: caller_role } = req.user; 

    if (!id_to_deactivate) {
        return res.status(400).json({ message: 'Harap sertakan ID pengguna yang akan dinonaktifkan (id_to_deactivate).' });
    }

    // --- KOREKSI KRITIS BERIKUT ---
    
    // Konversi string ID ke number jika diperlukan untuk perbandingan yang ketat
    const deactivate_id = parseInt(id_to_deactivate);
    const caller_num_id = parseInt(caller_id);

    // KONDISI PENGECEKAN: Mencegah Admin menonaktifkan dirinya sendiri
    if (caller_role === 'admin' && deactivate_id === caller_num_id) {
        return res.status(403).json({ message: 'Akses Ditolak. Seorang Admin tidak dapat menonaktifkan akunnya sendiri.' });
    }
    
    // Logika Otorisasi: Admin (telah diverifikasi oleh middleware) sekarang hanya dapat menonaktifkan pengguna lain
    // Pengecekan di atas sudah mencakup kasus ini.

    try {
        // Logika aslinya (hanya Admin yang bisa sampai di sini)
        
        // Jalankan Query untuk menonaktifkan pengguna (is_active = FALSE)
        const result = await pool.query(
            'UPDATE users SET is_active = FALSE, updated_at = NOW() WHERE id_user = $1 AND is_active = TRUE RETURNING id_user, username',
            [deactivate_id] // Gunakan ID yang sudah di-parse
        );

        if (result.rowCount === 0) {
            // Ini mencakup kasus ID tidak ditemukan atau sudah nonaktif
            return res.status(404).json({ message: `Pengguna dengan ID ${id_to_deactivate} tidak ditemukan atau sudah nonaktif.` });
        }

        res.status(200).json({
            message: `Pengguna ${result.rows[0].username} (ID: ${id_to_deactivate}) berhasil dinonaktifkan.`,
            user_deactivated: result.rows[0]
        });

    } catch (e) {
        console.error("Error deactivating user:", e);
        res.status(500).json({ error: 'Gagal menonaktifkan pengguna karena kesalahan server.', detail: e.message });
    }
});

/**
 * @route PUT /user/activate-user
 * @description Mengaktifkan (activate) pengguna berdasarkan ID.
 * @access Protected (Membutuhkan Access Token). Memerlukan ID di body. Admin only.
 */
router.put('/activate-user', verifyToken, requireRoles('admin'), async (req, res) => {
    // ID pengguna yang ingin diaktifkan kembali (datang dari body request)
    const { id_to_activate } = req.body; 
    
    // ID dan role Admin yang melakukan request (dari token)
    const { id_user: caller_id } = req.user;

    if (!id_to_activate) {
        return res.status(400).json({ message: 'Harap sertakan ID pengguna yang akan diaktifkan (id_to_activate).' });
    }
    
    // Pastikan Admin tidak mencoba menonaktifkan/mengaktifkan dirinya sendiri
    // (Jika Admin menonaktifkan dirinya sendiri, ia tidak bisa mengaktifkan lagi.
    // Pengecekan ini lebih untuk konsistensi. Asumsi: Admin tidak perlu mengaktifkan dirinya sendiri di sini).
    const activate_id = parseInt(id_to_activate);
    const caller_num_id = parseInt(caller_id);

    if (activate_id === caller_num_id) {
         return res.status(403).json({ message: 'Akses Ditolak. Tidak perlu mengaktifkan akun Anda sendiri melalui endpoint ini.' });
    }

    try {
        // Jalankan Query untuk mengaktifkan pengguna (is_active = TRUE)
        // Kita mencari pengguna yang saat ini NONAKTIF (is_active = FALSE)
        const result = await pool.query(
            'UPDATE users SET is_active = TRUE, updated_at = NOW() WHERE id_user = $1 AND is_active = FALSE RETURNING id_user, username',
            [activate_id]
        );

        if (result.rowCount === 0) {
            // Ini mencakup kasus ID tidak ditemukan atau sudah aktif
            return res.status(404).json({ message: `Pengguna dengan ID ${activate_id} tidak ditemukan atau sudah aktif.` });
        }

        res.status(200).json({
            message: `Pengguna ${result.rows[0].username} (ID: ${activate_id}) berhasil diaktifkan kembali.`,
            user_activated: result.rows[0]
        });

    } catch (e) {
        console.error("Error activating user:", e);
        res.status(500).json({ error: 'Gagal mengaktifkan pengguna karena kesalahan server.', detail: e.message });
    }
});

export default router;