import express from 'express'; 
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pool from '../db/pool.js'; 
import { verifyToken } from '../middleware/authorization.js';

const router = express.Router();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'your_access_secret_default';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your_refresh_secret_default';

const generateAccessToken = (user) =>
    jwt.sign({ id_user: user.id_user, username: user.username, role: user.role }, ACCESS_TOKEN_SECRET, { expiresIn: '1d' });

const generateRefreshToken = (user) =>
    jwt.sign({ id_user: user.id_user, username: user.username, role: user.role }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

// =========================================================
// 1. POST /auth/register - Registrasi Pengguna Baru (BCRYPT)
// =========================================================
router.post('/register', async (req, res) => {
    const {fullname, username, email, password} = req.body;
    
    if (!fullname || !username || !email || !password) {
        return res.status(400).json({
            error: 'Data tidak lengkap. Pastikan fullname, username, email, dan password terisi.'
        });
    }

    try {
        const existingUser = await pool.query(
            'SELECT 1 FROM users WHERE username = $1 OR email = $2',
            [username, email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({ message: 'Registrasi gagal. Username atau email sudah terdaftar.' });
        }
        
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        const {rows} = await pool.query(
            `INSERT INTO users (fullname, username, email, password, role)
            VALUES ($1, $2, $3, $4, 'customer')
            RETURNING id_user, fullname, username, email, role`,
            [fullname, username, email, hashedPassword] // <-- Menggunakan hashedPassword
        );

        res.status(201).json({
            message: 'Registrasi berhasil',
            user: rows[0],
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error : 'Registrasi gagal karena kesalahan server.'}); 
    }
});
 

// =========================================================
// 2. POST /auth/login - Login Pengguna (BCRYPT)
// =========================================================
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: 'Username dan password harus diisi.' });
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        const user = result.rows[0];

        if (!user) {
             return res.status(401).json({ error: "Username atau password salah"});
        }
        
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ error: "Username atau password salah"});
        }
        
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        
        await pool.query(
            `INSERT INTO tokens (id_user, token, expires_at)
            VALUES ($1, $2, NOW() + INTERVAL '7 days')
            ON CONFLICT (id_user) DO UPDATE SET token = $2, expires_at = NOW() + INTERVAL '7 days'`,
            [user.id_user, refreshToken]
        );
        
        res.status(200).json({
            message: `📚Selamat datang di Toko Buku, ${user.username}📚!`,
            user: {
                id_user: user.id_user,
                fullname: user.fullname,
                username: user.username,
                email: user.email,
                role: user.role 
            },
            accessToken,
            refreshToken
        });

    } catch (err) {
        if (err.message.includes("Cannot read properties of undefined")) { 
             return res.status(401).json({ error: "Username atau password salah"});
        }
        console.error("Login Error:", err); 
        res.status(500).json({ message: 'Gagal melakukan login. Terjadi kesalahan server.' });
    }
});


// =========================================================
// 3. POST /auth/refresh-token - Memperoleh Access Token Baru
// =========================================================
router.post('/refresh-token', async (req, res) => {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
        return res.status(401).json({ error: 'Refresh token tidak ditemukan.' });
    }
    
    try {
        const tokenCheck = await pool.query(
            'SELECT t.id_user, u.username, u.role FROM tokens t JOIN users u ON t.id_user = u.id_user WHERE t.token = $1 AND t.expires_at > NOW()',
            [refreshToken]
        );
        
        if (tokenCheck.rows.length === 0) {
            return res.status(403).json({ message: 'Refresh token tidak valid atau sudah kedaluwarsa.' });
        }
        
        const user = tokenCheck.rows[0];
        
        jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                await pool.query('DELETE FROM tokens WHERE token = $1', [refreshToken]);
                return res.status(403).json({ message: 'Refresh token tidak valid.' });
            }
            
            const newAccessToken = generateAccessToken(user); 
            
            res.status(200).json({ 
                message: 'Token berhasil diperbarui',
                accessToken: newAccessToken,
            });
        });
    } catch (err) {
        console.error("Refresh Token Error:", err);
        res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
    }
});


// =========================================================
// 4. POST /auth/logout - Logout Pengguna (Hapus Refresh Token)
// =========================================================
router.post('/logout', async (req, res) => {
    const { refreshToken } = req.body;
    
    if (!refreshToken) return res.status(400).json({ message: 'Refresh token harus disertakan.' });
    
    try {
        const result = await pool.query('DELETE FROM tokens WHERE token = $1', [refreshToken]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Refresh token tidak ditemukan atau sudah dihapus.' });
        }
        
        res.status(200).json({ message: 'Logout berhasil, refresh token dihapus.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Gagal logout.' });
    }
});


export default router;