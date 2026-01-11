import React from 'react';

export default function BestSellerProduct() {
    return (
        <div className="info-page fade-in">
            <div className="info-card">
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏆</div>
                <h1>Sản phẩm bán chạy</h1>
                <p style={{ marginBottom: '1.5rem' }}>
                    Những sản phẩm được yêu thích nhất của cửa hàng
                </p>
                <span className="badge badge-success" style={{ fontSize: '0.9rem' }}>
                    🔥 Hot Deals
                </span>
            </div>
        </div>
    );
}