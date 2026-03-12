import React, { useState, useEffect } from "react";
import axios from "axios";
import FooterComponent from "../components/FooterComponent";

const Produk = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All Produk");

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

  const bukuDifilter = activeFilter === "All Produk"
    ? products
    : products.filter(buku =>
      buku.category_name?.toLowerCase().trim() === activeFilter.toLowerCase().trim()
    );

  return (
    <div className="produk-page">
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
                        <p className="stok">Stok: {buku.stock}</p>
                        <button className="btn-beli">Beli Sekarang</button>
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