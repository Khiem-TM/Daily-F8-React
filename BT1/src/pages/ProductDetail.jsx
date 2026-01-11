import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

const ProductDetail = () => {
    const { id, slug } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        fetch(`https://dummyjson.com/products/${id}`)
            .then(res => res.json())
            .then(data => setProduct(data));
    }, [id]);

    if (!product) {
        return <div style={{ padding: '20px' }}>Loading...</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <Link to="/products">← Back to Products</Link>
            <h1>{product.title}</h1>
            <img src={product.thumbnail} alt={product.title} style={{ width: '300px', marginTop: '10px' }} />
            <p style={{ marginTop: '10px' }}>{product.description}</p>
            <p><strong>Price:</strong> ${product.price}</p>
            <p><strong>Brand:</strong> {product.brand}</p>
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Rating:</strong> {product.rating} / 5</p>
            <button onClick={() => navigate(-1)} style={{ marginTop: '10px' }}>Go Back</button>
        </div>
    );
};

export default ProductDetail;