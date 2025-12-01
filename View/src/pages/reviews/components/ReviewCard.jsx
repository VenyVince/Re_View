// src/pages/reviews/components/ReviewCard.jsx
import React from "react";
import "./ReviewCard.css";

export default function ReviewCard({ review }) {
    return (
        <div className="reviewCard">
            {/* 이미지 */}
            <div className="reviewImageWrap">
                <img
                    src={review.image_url || "/images/no-img.png"}
                    alt={review.product_name}
                />
            </div>

            {/* 브랜드 + 평점 */}
            <div className="reviewBrandRating">
                <span className="reviewBrand">{review.brand_name}</span>
                <p className="reviewRating">
                    {review.rating ? `${review.rating.toFixed(1)} / 5.0` : "- / 5.0"}
                </p>

            </div>

            {/* 상품명 */}
            <div className="reviewProductName">{review.product_name}</div>

            {/* 리뷰 내용 */}
            <div className="reviewContent">{review.content}</div>
        </div>
    );
}
