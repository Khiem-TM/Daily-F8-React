import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

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

const Products = () => {
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

  return (
    <div className="fade-in">
      <div className="page-header">
        <h1> Danh sách sản phẩm</h1>
        <p>Khám phá {total} sản phẩm đa dạng và chất lượng</p>
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
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {products.map((item, index) => (
            <div 
              key={item.id} 
              className="product-card fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div style={{ overflow: 'hidden', background: '#f8fafc' }}>
                <img src={item.thumbnail} alt={item.title} />
              </div>
              <div className="product-card-content">
                <h3 className="product-card-title">{item.title}</h3>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{ color: '#fbbf24' }}>★</span>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {item.rating}
                  </span>
                  {item.discountPercentage > 10 && (
                    <span className="badge badge-primary" style={{ marginLeft: 'auto' }}>
                      -{Math.round(item.discountPercentage)}%
                    </span>
                  )}
                </div>
                <p className="product-card-price">${item.price}</p>
                <Link 
                  to={`/products/${item.id}/${toSlug(item.title)}`}
                  style={{
                    display: 'inline-block',
                    width: '100%',
                    textAlign: 'center',
                    padding: '0.75rem',
                    background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                    color: 'white',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: '600',
                    fontSize: '0.9rem',
                    transition: 'all var(--transition-normal)'
                  }}
                >
                  Xem chi tiết →
                </Link>
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
            style={{ background: page <= 1 ? '#e2e8f0' : '' }}
          >
            ← Trước
          </button>
          
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            let pageNum;
            if (totalPages <= 7) {
              pageNum = i + 1;
            } else if (page <= 4) {
              pageNum = i + 1;
            } else if (page >= totalPages - 3) {
              pageNum = totalPages - 6 + i;
            } else {
              pageNum = page - 3 + i;
            }
            return pageNum;
          }).map((p) => (
            <button
              key={p}
              onClick={() => handlePageChange(p)}
              className={p === page ? 'active' : ''}
            >
              {p}
            </button>
          ))}
          
          <button 
            onClick={() => handlePageChange(page + 1)} 
            disabled={page >= totalPages}
            style={{ background: page >= totalPages ? '#e2e8f0' : '' }}
          >
            Sau →
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;