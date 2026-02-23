import { useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import ProductCard from './ProductCard'; 

function Dashboard() {
    const navigate = useNavigate();
    const namaAdmin = localStorage.getItem("username") || "Pengguna";
    const [activeFilter, setActiveFilter] = useState("All Produk");
    const roleUser = localStorage.getItem("role");

    const logout = () => {
        localStorage.clear();
        navigate("/");
    };

    const daftarBuku = [
        { 
            src: "/CantikItuLuka.jpg", 
            nama: "Cantik Itu Luka", 
            kategori: "Fiksi Indonesia", 
            harga: "Rp 105.000", 
            stok: 40,
            deskripsi: "Karya epik yang menggabungkan sejarah, realisme magis, dan tragedi keluarga Indonesia."
        },
        { 
            src: "/FilosofiTeras.jpg", 
            nama: "Filosofi Teras", 
            kategori: "Pengembangan Diri", 
            harga: "Rp 108.000", 
            stok: 150,
            deskripsi: "Pengenalan ajaran Stoisisme untuk membantu meraih ketenangan mental di dunia modern."
        },
        { 
            src: "/LaskarPelangi.jpg", 
            nama: "Laskar Pelangi", 
            kategori: "Fiksi Indonesia", 
            harga: "Rp 85.000", 
            stok: 90,
            deskripsi: "Kisah inspiratif anak-anak Belitung mengejar mimpi melalui pendidikan."
        },
        { 
            src: "/LautBercerita.jpg", 
            nama: "Laut Bercerita", 
            kategori: "Fiksi Indonesia", 
            harga: "Rp 115.000", 
            stok: 75,
            deskripsi: "Novel tentang perjuangan aktivis mahasiswa menuntut keadilan di tahun 90-an."
        },
        { 
            src: "/PerahuKertas.jpg", 
            nama: "Perahu Kertas", 
            kategori: "Fiksi Indonesia", 
            harga: "Rp 95.000", 
            stok: 60,
            deskripsi: "Kisah romansa tentang pencarian jati diri antara Kugy dan Keenan."
        },
        { 
            src: "/SebuahSeniuntukBersikapBodoAmat.jpg", 
            nama: "Sebuah Seni untuk Bersikap Bodo Amat", 
            kategori: "Pengembangan Diri", 
            harga: "Rp 95.000", 
            stok: 110,
            deskripsi: "Pendekatan segar dalam memilih hal yang benar-benar layak untuk dipedulikan."
        },
        { 
            src: "/TheAlchemist.jpg", 
            nama: "The Alchemist", 
            kategori: "Fiksi Terjemahan", 
            harga: "Rp 65.000", 
            stok: 80,
            deskripsi: "Kisah Santiago dalam mengikuti takdirnya untuk menemukan harta karun di piramida."
        },
        { 
            src: "/TheMidnightLibrary.jpg", 
            nama: "The Midnight Library", 
            kategori: "Fiksi Terjemahan", 
            harga: "Rp 100.000", 
            stok: 55,
            deskripsi: "Menjelajahi ribuan kehidupan yang bisa dijalani Nora Seed di perpustakaan misterius."
        },
        { 
            src: "/AtomicHabits.jpg", 
            nama: "Atomic Habits", 
            kategori: "Pengembangan Diri", 
            harga: "Rp 108.000", 
            stok: 120,
            deskripsi: "Cara mudah membangun kebiasaan baik dan menghilangkan kebiasaan buruk."
        }
    ];

    const bukuDifilter = activeFilter === "All Produk"
        ? daftarBuku
        : daftarBuku.filter(buku => buku.kategori === activeFilter);

    return (
        <div>
            <div className="navbar">
                <div className="container">
                    <div className="navbar-box">
                        <div className="logo"><h1>TsaBook.id</h1></div>
                        <ul className="menu">
                            <li><a href="#" onClick={logout}>Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="dashboard" style={{ textAlign: "center", paddingTop: "10px", marginTop: "-100px" }}>
                <h1 style={{ color: "SaddleBrown", fontSize: "30px" }}>
                    Selamat Datang, <span id="namaAdmin">{namaAdmin}</span>!
                </h1>
                <h1 style={{ textAlign: "center", fontSize: "16px", paddingTop: "5px", marginTop: "-10px" }}>
                    Sekarang Anda login sebagai <strong>{roleUser}</strong>
                </h1>
            </div>

            <div className="layanan">
                <div className="container">
                    <div className="layanan-box">
                        <div className="box">
                            <i className="ri-book-fill ri-2x"></i>
                            <h2>Produk Original</h2>
                            <p>Koleksi buku kami dijamin 100% asli dari penerbit terpercaya.</p>
                        </div>
                        <div className="box">
                            <i className="ri-wallet-3-fill ri-2x"></i>
                            <h2>Harga Terjangkau</h2>
                            <p>Dapatkan akses literasi tanpa batas dengan harga yang bersahabat.</p>
                        </div>
                        <div className="box">
                            <i className="ri-customer-service-2-fill ri-2x"></i>
                            <h2>Terjual 10k+</h2>
                            <p>Lebih dari sepuluh ribu pembaca telah mempercayakan literaturnya.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="layanan">
                <div className="container">
                    <div className="layanan-box">
                    </div>
                </div>
            </div>

            <div className="produk">
                <div className="container">
                    <div className="produk-box">
                        <h1>Produk Kami</h1>
                        <ul>
                            {["All Produk", "Fiksi Indonesia", "Pengembangan Diri", "Fiksi Terjemahan"].map((item) => (
                                <li key={item} className={activeFilter === item ? "active" : ""} onClick={() => setActiveFilter(item)}>
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <div className="produk-list">
                            {bukuDifilter.map((buku, index) => (
                                <ProductCard 
                                    key={index}
                                    src={buku.src}
                                    nama={buku.nama}
                                    kategori={buku.kategori}
                                    harga={buku.harga}
                                    stok={buku.stok}
                                    deskripsi={buku.deskripsi}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;