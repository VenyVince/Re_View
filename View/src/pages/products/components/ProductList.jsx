// src/pages/product/components/ProductList.jsx
import React from "react";
import "./ProductList.css";
import ProductCard from "./ProductCard";

export default function ProductList({ products }) {
    if (!Array.isArray(products) || products.length === 0) {
        return (
            <div className="productListEmpty">
                표시할 상품이 없습니다.
            </div>
        );
    }

    return (
        <div className="productListWrapper">
            {products.map((product) => (
                <ProductCard
                    key={product.product_id}
                    product={product}
                />
            ))}
        </div>
    );
}
