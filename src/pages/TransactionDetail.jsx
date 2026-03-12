import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const TransactionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [transaction, setTransaction] = useState(null);
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchTransactionDetail();
    }, [id]);

    const fetchTransactionDetail = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:5000/api/transactions/${id}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setTransaction(response.data);
        } catch (error) {
            console.error('Error fetching transaction:', error);
            toast.error('Gagal memuat detail transaksi');
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!transaction) {
        return <div>Transaksi tidak ditemukan</div>;
    }

    return (
        <div className="transaction-detail-container">
            <div className="transaction-header">
                <h2>Detail Transaksi #{transaction.id_transaction}</h2>
                <button onClick={() => navigate('/')}>Kembali</button>
            </div>

            <div className="transaction-info">
                <div className="info-group">
                    <label>Tanggal</label>
                    <p>{formatDate(transaction.transaction_date)}</p>
                </div>
                <div className="info-group">
                    <label>Kasir</label>
                    <p>{transaction.fullname || transaction.username}</p>
                </div>
                <div className="info-group">
                    <label>Metode Pembayaran</label>
                    <p>{transaction.payment_method}</p>
                </div>
                <div className="info-group">
                    <label>Total</label>
                    <p className="total-price">{formatCurrency(transaction.total_price)}</p>
                </div>
            </div>

            <div className="transaction-items">
                <h3>Item yang Dibeli</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Produk</th>
                            <th>Harga</th>
                            <th>Jumlah</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transaction.items?.map((item, index) => (
                            <tr key={index}>
                                <td>{item.product_title}</td>
                                <td>{formatCurrency(item.book_price)}</td>
                                <td>{item.quantity}</td>
                                <td>{formatCurrency(item.book_price * item.quantity)}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan="3" className="text-right">Total</td>
                            <td>{formatCurrency(transaction.total_price)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>

            <div className="transaction-actions">
                <button className="btn-print" onClick={() => window.print()}>
                    Cetak Invoice
                </button>
            </div>
        </div>
    );
};

export default TransactionDetail;