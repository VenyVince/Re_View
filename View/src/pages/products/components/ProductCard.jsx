// src/pages/product/components/ProductCard.jsx
import React, { useState } from "react";
import "./ProductCard.css";

export default function ProductCard({ product }) {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className="productCard">

            {/* 이미지 영역 */}
            <div className="productImageWrapper">

                {!loaded && (
                    <img
                        className="productBlurPreview"
                        src={product.image_url}
                        alt=""
                        onError={(e) => (e.target.src = "/placeholder.png")}
                    />
                )}

                <img
                    className={`productImage ${loaded ? "visible" : ""}`}
                    src={product.image_url}
                    alt=""
                    onLoad={() => setLoaded(true)}
                    onError={(e) => {
                        e.target.src = "/placeholder.png";
                        setLoaded(true);
                    }}
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
