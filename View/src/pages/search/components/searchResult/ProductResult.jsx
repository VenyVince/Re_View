// src/pages/search/components/SearchResult/ProductResult.jsx
import React from "react";
import ProductCard from "./ProductCard";

export default function ProductResult({ products = [], selectedBrand }) {
    let filtered = products;

    if (!Array.isArray(products)) {
        return <p className="no-result">상품 데이터가 올바르지 않습니다.</p>;
    }

    if (selectedBrand) {
        filtered = filtered.filter(p => p.prd_brand === selectedBrand);
    }

    return (
        <div className="product-result">
            {filtered.length === 0 ? (
                <p className="no-result">상품이 없습니다.</p>
            ) : (
                <ul className="result-list">
                    {filtered.map(product => (
                        <ProductCard key={product.product_id} product={product} />
                    ))}
                </ul>
            )}
        </div>
    );
}
