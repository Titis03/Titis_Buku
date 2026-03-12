import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsCart3, BsTrash, BsPlus, BsDash } from 'react-icons/bs';
import axios from 'axios';
import { toast } from 'react-toastify';

const CartDropDown = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        if (isOpen && userId && token) {
            fetchCart();
        }
    }, [isOpen]);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:3000/api/cart/${userId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            
            setCartItems(response.data.items || []);
            setTotal(response.data.total || 0);
        } catch (error) {
            console.error('Error fetching cart:', error);
            toast.error('Gagal memuat keranjang');
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (cartId, newQuantity) => {
        if (newQuantity < 1) {
            removeItem(cartId);
            return;
        }

        try {
            await axios.put(
                `http://localhost:3000/api/cart/update/${cartId}`,
                { quantity: newQuantity },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            
            fetchCart();
            window.dispatchEvent(new CustomEvent('cartUpdated'));
            
        } catch (error) {
            console.error('Error updating cart:', error);
            toast.error(error.response?.data?.error || 'Gagal update keranjang');
        }
    };

    const removeItem = async (cartId) => {
        try {
            await axios.delete(
                `http://localhost:3000/api/cart/remove/${cartId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            
            fetchCart();
            window.dispatchEvent(new CustomEvent('cartUpdated'));
            toast.success('Item dihapus dari keranjang');
            
        } catch (error) {
            console.error('Error removing item:', error);
            toast.error('Gagal menghapus item');
        }
    };

    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            toast.warning('Keranjang belanja kosong');
            return;
        }

        try {
            setLoading(true);

            const items = cartItems.map(item => ({
                id_product: item.id_product,
                quantity: item.quantity,
                book_price: parseFloat(item.price) 
            }));

            const transactionData = {
                total_price: total,
                payment_method: 'transfer', 
                items: items
            };

            const response = await axios.post(
                'http://localhost:3000/api/transactions',
                transactionData,
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.status === 201) {
                toast.success('Transaksi berhasil dibuat!');
                
                await clearCart();
                
                onClose();
                
                navigate(`/transaksi/${response.data.transaction.id_transaction}`);
            }
            
        } catch (error) {
            console.error('Error creating transaction:', error);
            
            if (error.response) {
                switch (error.response.status) {
                    case 400:
                        toast.error(error.response.data.error || 'Data transaksi tidak lengkap');
                        break;
                    case 403:
                        toast.error('Anda tidak memiliki akses sebagai cashier');
                        break;
                    case 500:
                        toast.error('Gagal membuat transaksi: ' + (error.response.data.detail || 'Server error'));
                        break;
                    default:
                        toast.error('Gagal membuat transaksi');
                }
            } else {
                toast.error('Network error, silakan coba lagi');
            }
        } finally {
            setLoading(false);
        }
    };

    const clearCart = async () => {
        try {
            await Promise.all(
                cartItems.map(item => 
                    axios.delete(
                        `http://localhost:3000/api/cart/remove/${item.cart_id}`,
                        {
                            headers: { Authorization: `Bearer ${token}` }
                        }
                    )
                )
            );
            
            setCartItems([]);
            setTotal(0);
            window.dispatchEvent(new CustomEvent('cartUpdated'));
            
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    if (!isOpen) return null;

    return (
        <div className="cart-dropdown-overlay" onClick={onClose}>
            <div className="cart-dropdown" onClick={(e) => e.stopPropagation()}>
                <div className="cart-header">
                    <h3>
                        <BsCart3 /> Basket
                    </h3>
                    <span className="cart-total-label">
                        {formatCurrency(total)}
                    </span>
                    <button className="cart-close" onClick={onClose}>×</button>
                </div>

                <div className="cart-rrp-info">
                    <small>
                        The RRP is the suggested or Recommended Retail Price of a product, 
                        set by the publisher or manufacturer.
                    </small>
                </div>

                {loading && (
                    <div className="cart-loading">
                        <p>Loading...</p>
                    </div>
                )}

                {!loading && (
                    <div className="cart-items">
                        {cartItems.length === 0 ? (
                            <div className="cart-empty">
                                <p>Mini basket</p>
                                <p>Your basket is empty</p>
                            </div>
                        ) : (
                            <>
                                {cartItems.map(item => (
                                    <div className="cart-item" key={item.cart_id}>
                                        <img 
                                            src={item.image_url || '/images/default-book.jpg'} 
                                            alt={item.title} 
                                        />
                                        <div className="cart-item-details">
                                            <h4>{item.title}</h4>
                                            <p className="cart-item-author">{item.author}</p>
                                            <div className="cart-item-price">
                                                {formatCurrency(item.price * item.quantity)}
                                            </div>
                                            <div className="cart-item-actions">
                                                <div className="cart-quantity">
                                                    <button 
                                                        className="quantity-btn"
                                                        onClick={() => updateQuantity(
                                                            item.cart_id, 
                                                            item.quantity - 1
                                                        )}
                                                        disabled={loading}
                                                    >
                                                        <BsDash />
                                                    </button>
                                                    <span>{item.quantity}</span>
                                                    <button 
                                                        className="quantity-btn"
                                                        onClick={() => updateQuantity(
                                                            item.cart_id, 
                                                            item.quantity + 1
                                                        )}
                                                        disabled={loading}
                                                    >
                                                        <BsPlus />
                                                    </button>
                                                </div>
                                                <button 
                                                    className="remove-btn"
                                                    onClick={() => removeItem(item.cart_id)}
                                                    disabled={loading}
                                                >
                                                    <BsTrash />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="cart-footer">
                                    <div className="cart-subtotal">
                                        <span>Subtotal</span>
                                        <span>{formatCurrency(total)}</span>
                                    </div>
                                    <button 
                                        className="checkout-btn"
                                        onClick={handleCheckout}
                                        disabled={loading || cartItems.length === 0}
                                    >
                                        {loading ? 'Processing...' : 'Checkout'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartDropDown;