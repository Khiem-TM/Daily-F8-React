import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const ProductDetail = () => {
    const { id, slug } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        fetch(`https://dummyjson.com/products/${id}`)
            .then(res => res.json())
            .then(data => {
                setProduct(data);
                setSelectedImage(0); // Reset về ảnh đầu tiên khi load sản phẩm mới
            });
    }, [id]);

    if (!product) {
        return <div style={{ padding: '20px' }}>Loading...</div>;
    }

    const images = product.images || [product.thumbnail];

    return (
        <div style={{ padding: '20px' }}>
            <Link to="/products">← Back to Products</Link>
            <h1>{product.title}</h1>
            
            {/* Main Image */}
            <div style={{ marginTop: '10px' }}>
                <img 
                    src={images[selectedImage]} 
                    alt={product.title} 
                    style={{ 
                        width: '400px', 
                        height: '400px', 
                        objectFit: 'contain',
                        border: '1px solid #ddd',
                        borderRadius: '8px'
                    }} 
                />
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
                <div style={{ 
                    display: 'flex', 
                    gap: '10px', 
                    marginTop: '15px',
                    flexWrap: 'wrap'
                }}>
                    {images.map((img, index) => (
                        <img
                            key={index}
                            src={img}
                            alt={`${product.title} - ${index + 1}`}
                            onClick={() => setSelectedImage(index)}
                            style={{
                                width: '80px',
                                height: '80px',
                                objectFit: 'cover',
                                cursor: 'pointer',
                                border: selectedImage === index ? '3px solid #007bff' : '1px solid #ddd',
                                borderRadius: '4px',
                                opacity: selectedImage === index ? 1 : 0.7,
                                transition: 'all 0.2s'
                            }}
                        />
                    ))}
                </div>
            )}

            <p style={{ marginTop: '15px' }}>{product.description}</p>
            <p><strong>Price:</strong> ${product.price}</p>
            <p><strong>Brand:</strong> {product.brand}</p>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Rating:</strong> {product.rating} / 5</p>
            <p><strong>Stock:</strong> {product.stock} items</p>
            <button 
                onClick={() => navigate(-1)} 
                style={{ 
                    marginTop: '10px', 
                    padding: '10px 20px',
                    cursor: 'pointer'
                }}
            >
                Go Back
            </button>
        </div>
    );
};

export default ProductDetail;