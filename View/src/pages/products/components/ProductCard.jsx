// src/pages/product/components/ProductCard.jsx
import React from "react";
import "./ProductCard.css";

export default function ProductCard({ product }) {
    return (
        <div className="productCard">

            {/* 이미지 영역 — 리뷰 방식 그대로 */}
            <div className="productImageWrapper">
                <img
                    src={product.image_url || "/images/no-img.png"}
                    alt={product.prd_name}
                    className="productImage"
                />
            </div>

            {/* 브랜드 / 평점 */}
            <div className="productBrandRatingRow">
                <p className="productBrand">{product.prd_brand}</p>

                <p
                    className={
                        product.rating
                            ? "productRating productRatingGold"
                            : "productRating productRatingNone"
                    }
                >
                    {product.rating
                        ? `${product.rating.toFixed(1)} / 5.0`
                        : "- / 5.0"}
                </p>
            </div>

            {/* 상품명 */}
            <p className="productName">{product.prd_name}</p>

            {/* 가격 */}
            <p className="productPrice">
                {product.price.toLocaleString()}원
            </p>
        </div>
    );
}
