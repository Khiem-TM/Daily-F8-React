import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

// Helper: tạo slug từ title
const toSlug = (str) =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

// Custom hook debounce
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
  const limit = 10;

  // Lấy giá trị từ URL (giữ state khi refresh)
  const page = parseInt(searchParams.get('page') || '1', 10);
  const searchQuery = searchParams.get('q') || '';

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [inputValue, setInputValue] = useState(searchQuery);

  // Debounce search 500ms
  const debouncedSearch = useDebounce(inputValue, 500);

  // Cập nhật URL khi debounced search thay đổi
  useEffect(() => {
    const params = {};
    if (debouncedSearch) params.q = debouncedSearch;
    params.page = debouncedSearch !== searchQuery ? '1' : String(page);
    setSearchParams(params);
  }, [debouncedSearch]);

  // Fetch products khi page hoặc searchQuery thay đổi
  useEffect(() => {
    const skip = (page - 1) * limit;
    const url = searchQuery
      ? `https://dummyjson.com/products/search?q=${searchQuery}&limit=${limit}&skip=${skip}`
      : `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
        setTotal(data.total || 0);
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
    <div style={{ padding: '20px' }}>
      <h1>Product List</h1>
      {/* search */}
      <input
        type="text"
        placeholder="Search products..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        style={{ marginBottom: '20px', padding: '8px', width: '300px' }}
      />

      <p style={{ marginBottom: '10px' }}>
        Showing page {page} of {totalPages} ({total} products)
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {products.map((item) => (
          <div key={item.id} style={{ border: '1px solid #ddd', padding: '10px' }}>
            <img src={item.thumbnail} alt={item.title} style={{ width: '100%' }} />
            <h3>{item.title}</h3>
            <p>${item.price}</p>
            <Link to={`/products/${item.id}/${toSlug(item.title)}`}>View Detail</Link>
          </div>
        ))}
      </div>

      {/* pagination */}
      <div style={{ marginTop: '20px', display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
        <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => handlePageChange(p)}
            style={{
              fontWeight: p === page ? 'bold' : 'normal',
              backgroundColor: p === page ? '#007bff' : '#fff',
              color: p === page ? '#fff' : '#000',
              border: '1px solid #ddd',
              padding: '5px 10px',
              cursor: 'pointer',
            }}
          >
            {p}
          </button>
        ))}
        <button onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Products;