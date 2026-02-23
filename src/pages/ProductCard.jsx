import React from 'react';

function ProductCard({ src, nama, kategori, harga, stok, deskripsi }) {
    return (
        <div className="card-produk">
            <img src={src} alt={nama} />
            <div className="info-buku">
                <h3>{nama}</h3>
                <p className="kategori-tag">{kategori}</p>
                <p className="harga">{harga}</p>
                <p className={`stok ${stok === 0 ? "habis" : ""}`}>
                    Stok: {stok > 0 ? stok : "Habis"}
                </p>
                {/* Deskripsi yang kamu minta */}
                <p style={{ fontSize: '14px', color: '#666', marginTop: '10px', lineHeight: '1.5' }}>
                    {deskripsi}
                </p>
            </div>
        </div>
    );
}

export default ProductCard;