import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
    const navigate = useNavigate();   // 🔥 최상단에서 호출

    if (!product) return null;

    const hasImage =
        product.image_url && product.image_url.trim() !== "";

    return (
        <li
            className="result-card"
            onClick={() => navigate(`/product/${product.product_id}`)}  // 🔥 수정 부분
            style={{ cursor: "pointer" }}
        >
            <div className="img-wrapper">
                {hasImage ? (
                    <img
                        src={product.image_url}
                        alt={product.prd_name}
                        onError={(e) => {
                            e.target.style.display = "none";
                            e.target.parentNode.querySelector(".alt-text").style.display = "flex";
                        }}
                    />
                ) : null}

                {!hasImage && (
                    <div className="alt-text">
                        {product.prd_name}
                    </div>
                )}
            </div>

            <div className="card-meta">
                <span className="card-brand">{product.prd_brand}</span>
                <span className="card-rating">
                    {product.rating ? `${product.rating.toFixed(1)} / 5.0` : "-"}
                </span>
            </div>

            <p className="card-name">{product.prd_name}</p>
            <p className="card-price">
                {product.price ? `${product.price.toLocaleString()}원` : ""}
            </p>
        </li>
    );
}
