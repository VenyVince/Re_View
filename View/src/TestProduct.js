import React, { useEffect, useState } from "react";

const TestProduct = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/test/products")
            .then((res) => res.json())
            .then((data) => setProducts(data.products))
            .catch((err) => console.error(err));
    }, []);

    return (
        <div>
            <h2>테스트 상품 목록</h2>
            <ul>
                {products.map((p) => (
                    <li key={p.id}>
                        {p.name} / {p.brand} / {p.price}원
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TestProduct;
