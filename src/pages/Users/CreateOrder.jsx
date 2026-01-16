import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function CreateOrder() {
    const { productId } = useParams();

    const [product, setProduct] = useState(null);
    useEffect(() => {
            fetch(`https://dummyjson.com/products/${productId}`)
                .then(res => res.json())
                .then(data => {
                    setProduct(data);
                });
        }, [productId]);
    return (
        <div>
            <h1>Dat hang san pham: {product?.title}</h1>
        </div>
    );
}