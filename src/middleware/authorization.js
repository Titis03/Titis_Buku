// src/middleware/authorization.js

import jwt from 'jsonwebtoken'; // Ganti require menjadi import

// =========================================================
// 1. Middleware: verifyToken (Verifikasi Token & Lampirkan User Data)
// =========================================================
export const verifyToken = (req, res, next) => { // Gunakan 'export' langsung di depan fungsi
    // Mengambil token dari header Authorization (Format: 'Bearer TOKEN')
    const authHeader = req.headers['authorization'];
    
    // Cek format header: 'Bearer TOKEN'
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null; 

    // Cek jika token tidak ada
    if (token == null) {
        return res.status(401).json({ message: 'Akses ditolak. Access Token tidak ditemukan.' });
    }

    // Verifikasi Token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                console.error("Token verification failed: jwt expired");
                return res.status(401).json({ 
                    message: 'Access Token kedaluwarsa. Silakan perbarui token.',
                    expired: true 
                });
            }
            
            console.error("Token verification failed:", err.message);
            return res.status(403).json({ message: 'Token tidak valid.' });
        }
        
        req.user = user; 
        next(); 
    });
};

// =========================================================
// 2. Middleware: requireRoles (Cek Hak Akses Berdasarkan Role)
// =========================================================
export const requireRoles = (...allowedRoles) => (req, res, next) => {
    const userRole = req.user && req.user.role; 

    if (!userRole) {
        return res.status(403).json({ message: 'Role tidak ditemukan pada token.' });
    }
    
    if (allowedRoles.includes(userRole)) {
        next(); 
    } else {
        return res.status(403).json({ message: `Akses ditolak. Role '${userRole}' tidak diizinkan untuk operasi ini.` });
    }
};

// Hapus module.exports karena sudah menggunakan export di depan fungsi masing-masing