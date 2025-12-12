// src/pages/product/components/ProductCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./ProductCard.css";

export default function ProductCard({ product }) {
    const navigate = useNavigate();

    // 이미지 유무에 따라 wrapper 클래스 분리
    const hasImage = Boolean(product.image_url);

    return (
        <div
            className="productCard"
            onClick={() => navigate(`/product/${product.product_id}`)}
        >

            {/* 이미지 영역 */}
            <div className={`productImageWrapper ${hasImage ? "hasImage" : "noImage"}`}>
                <img
                    src={product.image_url || ""}
                    alt={product.prd_name}
                    className="productImage"
                    onError={(e) => (e.currentTarget.style.display = "none")}
                />
            </div>

            {/* 브랜드 / 평점 */}
            <div className="productBrandRatingRow">
                <p className="productBrand">{product.prd_brand}</p>

                <p
                    className={
                        !product.rating || Number(product.rating) === 0
                            ? "productRating productRatingNone"
                            : "productRating"
                    }
                >
                    {!product.rating || Number(product.rating) === 0
                        ? "-"
                        : `${Number(product.rating).toFixed(1)} / 5.0`}
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
