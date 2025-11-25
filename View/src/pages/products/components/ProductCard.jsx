// src/pages/product/components/ProductCard.jsx
import React, { useState } from "react";
import "./ProductCard.css";

// 개별 상품 카드 컴포넌트
export default function ProductCard({ product }) {
    const [loaded, setLoaded] = useState(false); // 이미지 로딩 여부

    return (
        <div className="productCard">
            {/* 이미지 영역 */}
            <div className="imageWrapper">
                {/* 블러 처리된 프리뷰 (로딩 전 표시) */}
                {!loaded && (
                    <img
                        className="blurPreview"
                        src={product.image_url}
                        alt=""
                        onError={(e) => (e.target.src = "/placeholder.png")} // 오류 시 대체 이미지
                    />
                )}

                {/* 실제 상품 이미지 */}
                <img
                    className={`productImage ${loaded ? "visible" : ""}`}
                    src={product.image_url}
                    alt=""
                    onLoad={() => setLoaded(true)} // 로딩 완료
                    onError={(e) => {
                        e.target.src = "/placeholder.png"; // 오류 시 대체 이미지
                        setLoaded(true);
                    }}
                />
            </div>

            {/* 브랜드 / 평점 */}
            <div className="brandRatingRow">
                <p className="productBrand">{product.prd_brand}</p>

                <p
                    className={
                        product.rating
                            ? "productRating ratingGold"
                            : "productRating ratingNone"
                    }
                >
                    {product.rating
                        ? `${product.rating.toFixed(1)} / 5.0`
                        : "-"}
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
