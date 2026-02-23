import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRouter from './src/routes/auth.js';
import userRouter from './src/routes/user.js';
import productsRouter from './src/routes/products.js';
import categoriesRouter from './src/routes/categories.js';
import transactionsRouter from './src/routes/transactions.js';
import transactionItemsRouter from './src/routes/transaction_items.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/transaction_items', transactionItemsRouter);

app.get('/', (req, res) => {
    res.send('Selamat datang di Toko Online API!');
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Terjadi kesalahan server!',
        detail: err.message
    });
});

app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await pool.query("SELECT * FROM users WHERE username = $1", [username]);

        if (user.rows.length > 0) {
            const userData = user.rows[0];

            if (userData.password === password) {
                res.json({
                    msg: "Login Berhasil",
                    username: user.rows[0].username,
                });
            } else {
                res.status(401).json({ msg: "Password salah" });
            }
        } else {
            res.status(404).json({ msg: "User tidak ditemukan" });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

app.listen(port, () => {
    console.log(`➡️ Server berjalan di http://localhost:${port} ⬅️`);
});