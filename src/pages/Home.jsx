import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../stores/authStore';

export default function Home() {
  const { user, isAuthenticated, logOut } = useAuth();

  return (
    <div className="info-page fade-in">
      <div className="info-card">
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛍️</div>
        <h1>Chào mừng đến với Shop</h1>
        <p>
          Khám phá bộ sưu tập sản phẩm đa dạng và chất lượng cao.
          Trải nghiệm mua sắm dễ dàng và tiện lợi cùng chúng tôi!
        </p>

        <div style={{ marginTop: '1rem', color: '#475569' }}>
          {isAuthenticated ? (
            <>
              <p style={{ margin: 0 }}>Đang đăng nhập: {user?.email || user?.name}</p>
              <button style={{ marginTop: '0.75rem' }} onClick={logOut}>Đăng xuất</button>
            </>
          ) : (
            <p style={{ margin: 0 }}>Bạn chưa đăng nhập.</p>
          )}
        </div>
        
        <Link to="/products">
          <button style={{ marginTop: '1.5rem' }}>
            Xem sản phẩm ngay →
          </button>
        </Link>
      </div>
    </div>
  );
}