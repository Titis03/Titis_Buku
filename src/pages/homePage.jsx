import { useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';
import FooterComponent from "../components/FooterComponent";
import { useState, useEffect } from "react";
import productData from "../data/products.json";

const HomePage = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    const namaAdmin = localStorage.getItem("username") || "Pengguna";
    const roleUser = localStorage.getItem("role") || "Guest";

    useEffect(() => {
        setProducts(productData);
    }, []);

    const featuredProducts = products.slice(0, 4);

    return (
        <div>
            <div className="dashboard" style={{ textAlign: "center", padding: "20px 0 10px 0" }}>
                <h1 style={{ color: "#1b4b35", fontSize: "40px", fontWeight: "normal" }}>
                    Selamat Datang, <span style={{ color: "#1b4b35", fontWeight: "bold" }}>{namaAdmin}</span>!
                </h1>
                <p style={{ color: "#666" }}>
                    Sekarang Anda login sebagai <strong>{roleUser}</strong>
                </p>
            </div>

            <div className="layanan">
                <div className="container fluid">
                    <div className="layanan-box">
                        <div className="box">
                            <i className="ri-book-fill"></i>
                            <h2>Produk Original</h2>
                            <p>Koleksi buku kami dijamin 100% asli dari penerbit terpercaya.</p>
                        </div>
                        <div className="box">
                            <i className="ri-wallet-3-fill"></i>
                            <h2>Harga Terjangkau</h2>
                            <p>Dapatkan akses literasi tanpa batas dengan harga yang bersahabat.</p>
                        </div>
                        <div className="box">
                            <i className="ri-customer-service-2-fill"></i>
                            <h2>Terjual 10k+</h2>
                            <p>Lebih dari sepuluh ribu pembaca telah mempercayakan literaturnya.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="produk" id="produk">
                <div className="container fluid">
                    <div className="produk-box">
                        <h1 className="text-center" style={{ fontWeight: "bold", paddingBottom: "-80px",marginBottom: "-80px" }}>Koleksi Buku Kami</h1>
                    </div>
                </div>
            </div>

            <div className="produk-list">
                {featuredProducts.map((buku) => (
                    <div className="card-produk" key={buku.id_product}>
                        <img src={buku.src} alt={buku.title} />
                        <div className="info-buku">
                            <h3>{buku.title}</h3>
                            <p>Penulis: {buku.author}</p>
                            <button className="btn-notify" onClick={() => navigate("/produk")}>
                                Lihat Detail
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <FooterComponent />
        </div>
    );

};

export default HomePage;