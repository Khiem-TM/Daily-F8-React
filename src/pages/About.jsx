import React from 'react';

export default function About() {
    return (
        <div className="info-page fade-in">
            <div className="info-card">
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>ℹ️</div>
                <h1>Về chúng tôi</h1>
                <p>
                    Chào mừng bạn đến với Shop - nơi cung cấp các sản phẩm chất lượng cao
                    với giá cả cạnh tranh. Chúng tôi cam kết mang đến trải nghiệm mua sắm
                    tuyệt vời nhất cho khách hàng.
                </p>
                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <div className="badge badge-primary">100+ Sản phẩm</div>
                    <div className="badge badge-success">Giao hàng nhanh</div>
                    <div className="badge badge-primary">Hỗ trợ 24/7</div>
                </div>
            </div>
        </div>
    );
}