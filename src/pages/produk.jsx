import React, { useState, useEffect } from "react";
import axios from "axios";
import FooterComponent from "../components/FooterComponent";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BsCart3, BsLightning } from 'react-icons/bs';
import CartDropDown from '../components/CartDropDown';  

const Produk = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All Produk");
  const [cartOpen, setCartOpen] = useState(false);

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const roleUser = localStorage.getItem('role');

  const fetchBuku = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/products");
      setProducts(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Gagal koneksi ke database:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuku();
  }, []);

  const tambahKeKeranjang = async (buku) => {
    if (!token || !userId) {
      toast.warning('Silakan login terlebih dahulu!');
      navigate('/login');
      return;
    }

    if (roleUser !== 'cashier') {
      toast.warning('Hanya cashier yang dapat menambah ke keranjang');
      return;
    }

    if (buku.stock < 1) {
      toast.error('Stok buku habis!');
      return;
    }

    try {
      setCartLoading(true);
      
      const response = await axios.post(
        'http://localhost:3000/api/cart/add',
        {
          userId: parseInt(userId),
          productId: buku.id_product,
          quantity: 1
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data) {
        toast.success(`${buku.title} ditambahkan ke keranjang!`);
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        setCartOpen(true);
      }
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      
      if (error.response?.status === 400) {
        toast.error(error.response.data.error || 'Stok tidak mencukupi');
      } else if (error.response?.status === 403) {
        toast.error('Anda tidak memiliki akses');
      } else {
        toast.error('Gagal menambah ke keranjang');
      }
    } finally {
      setCartLoading(false);
    }
  };

  const beliSekarang = async (buku) => {
    if (!token || !userId) {
      toast.warning('Silakan login terlebih dahulu!');
      navigate('/login');
      return;
    }

    if (roleUser !== 'cashier') {
      toast.warning('Hanya cashier yang dapat melakukan transaksi');
      return;
    }

    if (buku.stock < 1) {
      toast.error('Stok buku habis!');
      return;
    }

    try {
      setCartLoading(true);
      
      const transactionData = {
        total_price: parseFloat(buku.price),
        payment_method: 'transfer',
        items: [
          {
            id_product: buku.id_product,
            quantity: 1,
            book_price: parseFloat(buku.price)
          }
        ]
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
        fetchBuku();
        navigate(`/transaksi/${response.data.transaction.id_transaction}`);
      }
      
    } catch (error) {
      console.error('Error creating transaction:', error);
      
      if (error.response?.status === 400) {
        toast.error(error.response.data.error || 'Gagal membuat transaksi');
      } else if (error.response?.status === 403) {
        toast.error('Anda tidak memiliki akses sebagai cashier');
      } else {
        toast.error('Gagal membuat transaksi');
      }
    } finally {
      setCartLoading(false);
    }
  };

  const bukuDifilter = activeFilter === "All Produk"
    ? products
    : products.filter(buku =>
      buku.category_name?.toLowerCase().trim() === activeFilter.toLowerCase().trim()
    );

  return (
    <div className="produk-page">
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <CartDropDown isOpen={cartOpen} onClose={() => setCartOpen(false)} />

      <div className="container">
        <div className="produk" id="produk">
          <div className="produk-box">
            <h1 className="text-center" style={{ fontWeight: "bold", marginTop: "40px" }}>
              Koleksi Buku Kami
            </h1>

            <ul className="filter-tab">
              {["All Produk", "Fiksi Indonesia", "Peningkatan Diri", "Fiksi Terjemahan / Klasik"].map((item) => (
                <li
                  key={item}
                  className={activeFilter === item ? "active" : ""}
                  onClick={() => setActiveFilter(item)}
                >
                  {item}
                </li>
              ))}
            </ul>

            {loading ? (
              <div className="text-center mt-5">
                <h3>Menghubungkan ke Database...</h3>
              </div>
            ) : (
              <div className="produk-list">
                {bukuDifilter.length > 0 ? (
                  bukuDifilter.map((buku) => (
                    <div className="card-produk" key={buku.id_product}>
                      <img
                        src={buku.image_url || "https://via.placeholder.com/150x200?text=No+Image"}
                        alt={buku.title}
                        style={{ width: "100%", height: "250px", objectFit: "cover" }}
                      />

                      <div className="info-buku">
                        <h3>{buku.title}</h3>
                        <p><strong>Penulis:</strong> {buku.author}</p>
                        <p><strong>Kategori:</strong> {buku.category_name}</p>
                        <p className="harga">
                          Rp {Number(buku.price).toLocaleString('id-ID')}
                        </p>
                        <p className="stok" style={{ 
                          color: buku.stock > 0 ? '#1b4b35' : '#ff6b6b',
                          fontWeight: '600'
                        }}>
                          Stok: {buku.stock}
                        </p>
                      </div>

                      <div className="action-buttons" style={{
                        display: 'flex',
                        gap: '10px',
                        marginTop: '15px',
                        width: '100%'
                      }}>
                        <button 
                          className="btn-cart"
                          onClick={() => tambahKeKeranjang(buku)}
                          disabled={cartLoading || buku.stock < 1}
                          style={{
                            flex: 1,
                            padding: '10px 0',
                            backgroundColor: 'transparent',
                            border: '2px solid #007806',
                            color: '#007806',
                            fontSize: '13px',
                            fontWeight: '600',
                            borderRadius: '5px',
                            cursor: buku.stock > 0 ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '5px',
                            opacity: buku.stock < 1 ? 0.5 : 1
                          }}
                        >
                          <BsCart3 /> Keranjang
                        </button>
                        
                        <button 
                          className="btn-buy"
                          onClick={() => beliSekarang(buku)}
                          disabled={cartLoading || buku.stock < 1}
                          style={{
                            flex: 1,
                            padding: '10px 0',
                            backgroundColor: '#007806',
                            border: 'none',
                            color: 'white',
                            fontSize: '13px',
                            fontWeight: '600',
                            borderRadius: '5px',
                            cursor: buku.stock > 0 ? 'pointer' : 'not-allowed',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '5px',
                            opacity: buku.stock < 1 ? 0.5 : 1
                          }}
                        >
                          <BsLightning /> Beli
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center w-100 mt-4">
                    <p>Buku untuk kategori ini belum tersedia.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <FooterComponent />
    </div>
  );
};

export default Produk;