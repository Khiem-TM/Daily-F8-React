import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const ProductDetail = () => {
    const { productId, slug } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        fetch(`https://dummyjson.com/products/${productId}`)
            .then(res => res.json())
            .then(data => {
                setProduct(data);
                setSelectedImage(0);
                setLoading(false);
            });
    }, [productId]);

    if (loading || !product) {
        return (
            <div className="loading" style={{ minHeight: '50vh' }}>
                <div className="loading-spinner"></div>
            </div>
        );
    }

    const images = product.images || [product.thumbnail];

    return (
        <div className="fade-in">
            <Link to="/products" className="back-link">
                Quay lại
            </Link>
            
            <div className="detail-container">
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '2rem'
                }}>
                
                    <div>
                        <div className="detail-image-container">
                            <img 
                                src={images[selectedImage]} 
                                alt={product.title} 
                                className="detail-main-image"
                            />
                        </div>

                        {images.length > 1 && (
                            <div className="detail-thumbnails">
                                {images.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`${product.title} - ${index + 1}`}
                                        onClick={() => setSelectedImage(index)}
                                        className={`detail-thumbnail ${selectedImage === index ? 'active' : ''}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="detail-info">
                        <div style={{ marginBottom: '0.5rem' }}>
                            <span className="badge badge-primary">{product.category}</span>
                        </div>
                        
                        <h1 style={{ marginBottom: '0.5rem' }}>{product.title}</h1>
                        
                        <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '0.5rem',
                            marginBottom: '1rem'
                        }}>
                            <span style={{ color: '#fbbf24', fontSize: '1.25rem' }}>★</span>
                            <span style={{ fontWeight: '600' }}>{product.rating}</span>
                            <span style={{ color: 'var(--text-muted)' }}>/ 5</span>
                            <span style={{ 
                                marginLeft: '1rem', 
                                color: 'var(--text-secondary)',
                                fontSize: '0.9rem'
                            }}>
                                ({product.stock} sản phẩm còn lại)
                            </span>
                        </div>

                        <div className="detail-price">
                            ${product.price}
                            {product.discountPercentage > 0 && (
                                <span style={{
                                    marginLeft: '0.75rem',
                                    fontSize: '1rem',
                                    color: 'var(--success-color)',
                                    fontWeight: '500'
                                }}>
                                    Giảm {Math.round(product.discountPercentage)}%
                                </span>
                            )}
                        </div>

                        <p className="detail-description">{product.description}</p>

                        <div className="detail-meta">
                            <div className="detail-meta-item">
                                <span className="detail-meta-label">Thương hiệu</span>
                                <span className="detail-meta-value">{product.brand || 'N/A'}</span>
                            </div>
                            <div className="detail-meta-item">
                                <span className="detail-meta-label">Danh mục</span>
                                <span className="detail-meta-value">{product.category}</span>
                            </div>
                            <div className="detail-meta-item">
                                <span className="detail-meta-label">Đánh giá</span>
                                <span className="detail-meta-value">⭐ {product.rating} / 5</span>
                            </div>
                            <div className="detail-meta-item">
                                <span className="detail-meta-label">Tình trạng</span>
                                <span className="detail-meta-value" style={{ 
                                    color: product.stock > 10 ? 'var(--success-color)' : 'var(--warning-color)'
                                }}>
                                    {product.stock > 10 ? 'Còn hàng' : 'Sắp hết'}
                                </span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <button onClick={() => navigate(`/users/order/${product.id}`)} style={{ flex: 1, minWidth: '150px' }}>
                                Dat hang
                            </button>
                            <button 
                                onClick={() => navigate(-1)}
                                style={{ 
                                    flex: 1,
                                    minWidth: '150px',
                                    background: 'var(--bg-tertiary)',
                                    color: 'var(--text-primary)'
                                }}
                            >
                                ← Quay lại
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;