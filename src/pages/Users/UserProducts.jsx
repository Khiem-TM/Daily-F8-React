import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';

const toSlug = (str) =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

const UserProducts = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const limit = 12;

  const page = parseInt(searchParams.get('page') || '1', 10);
  const searchQuery = searchParams.get('q') || '';

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState(searchQuery);
  const debouncedSearch = useDebounce(inputValue, 500);
  
  useEffect(() => {
    const params = {};
    if (debouncedSearch) params.q = debouncedSearch;
    params.page = debouncedSearch !== searchQuery ? '1' : String(page);
    setSearchParams(params);
  }, [debouncedSearch]);
  
  useEffect(() => {
    setLoading(true);
    const skip = (page - 1) * limit;
    const url = searchQuery
      ? `https://dummyjson.com/products/search?q=${searchQuery}&limit=${limit}&skip=${skip}`
      : `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setTotal(data.total || 0);
        setLoading(false);
      });
  }, [searchQuery, page]);

  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = { page: String(newPage) };
    if (searchQuery) params.q = searchQuery;
    setSearchParams(params);
  };

  const handleQuickOrder = (product) => {
    if (confirm(`Đặt hàng nhanh: ${product.title}?`)) {
      navigate(`/users/order/${product.id}`);
    }
  };

  return (
    <div className="user-page fade-in">
      <div className="page-header" style={{ textAlign: 'left' }}>
        <h1>🛍️ Danh sách sản phẩm</h1>
        <p>Khám phá và đặt hàng {total} sản phẩm đa dạng</p>
      </div>

      <div className="search-container">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="search-input"
        />
      </div>

      <div style={{ 
        textAlign: 'center', 
        marginBottom: '1.5rem',
        color: 'var(--text-secondary)',
        fontSize: '0.9rem'
      }}>
        Trang {page} / {totalPages} • Tổng {total} sản phẩm
      </div>

      {loading ? (
        <div className="loading">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div className="user-products-grid">
          {products.map((item, index) => (
            <div 
              key={item.id} 
              className="user-product-card fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="user-product-image">
                <img src={item.thumbnail} alt={item.title} />
                {item.discountPercentage > 10 && (
                  <div className="product-discount-badge">
                    -{Math.round(item.discountPercentage)}%
                  </div>
                )}
              </div>
              <div className="user-product-content">
                <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>
                  {item.category}
                </span>
                <h3 className="user-product-title">{item.title}</h3>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  marginBottom: '0.75rem'
                }}>
                  <span style={{ color: '#fbbf24' }}>★</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {item.rating}
                  </span>
                  <span style={{ 
                    marginLeft: 'auto',
                    fontSize: '0.75rem',
                    color: item.stock > 10 ? 'var(--success-color)' : 'var(--warning-color)',
                    fontWeight: '600'
                  }}>
                    {item.stock > 10 ? '✓ Còn hàng' : '⚠ Sắp hết'}
                  </span>
                </div>
                <p className="user-product-price">${item.price}</p>
                <div className="user-product-actions">
                  <Link 
                    to={`/products/${item.id}/${toSlug(item.title)}`}
                    className="btn-secondary"
                    style={{ 
                      textDecoration: 'none',
                      textAlign: 'center',
                      padding: '0.5rem 1rem',
                      fontSize: '0.85rem'
                    }}
                  >
                    📄 Chi tiết
                  </Link>
                  <button
                    onClick={() => handleQuickOrder(item)}
                    className="btn-primary"
                    style={{ 
                      padding: '0.5rem 1rem',
                      fontSize: '0.85rem'
                    }}
                  >
                    🛒 Đặt ngay
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(page - 1)} 
            disabled={page <= 1}
          >
            ← Trước
          </button>
          
          {[...Array(totalPages)].map((_, i) => {
            const pageNum = i + 1;
            if (
              pageNum === 1 ||
              pageNum === totalPages ||
              (pageNum >= page - 1 && pageNum <= page + 1)
            ) {
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={page === pageNum ? 'active' : ''}
                >
                  {pageNum}
                </button>
              );
            } else if (pageNum === page - 2 || pageNum === page + 2) {
              return <span key={pageNum}>...</span>;
            }
            return null;
          })}

          <button 
            onClick={() => handlePageChange(page + 1)} 
            disabled={page >= totalPages}
          >
            Sau →
          </button>
        </div>
      )}
    </div>
  );
};

export default UserProducts;
