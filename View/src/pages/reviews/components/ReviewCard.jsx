// src/pages/reviews/components/ReviewCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./ReviewCard.css";

export default function ReviewCard({ review }) {
    const navigate = useNavigate();

    const imageSrc = review.image_url || review.product_image || "";

    const hasImage = Boolean(imageSrc);

    return (
        <div
            className="reviewCard"
            onClick={() => navigate(`/review/${review.review_id}`)}
        >
            {/* 이미지 */}
            <div className={`reviewImageWrap ${hasImage ? "hasImage" : "noImage"}`}>
                {hasImage && (
                    <img
                        src={imageSrc}
                        alt={review.product_name}
                        className="hasImage"
                        onError={(e) => {
                            // 이미지 깨질 경우 fallback → noImage 처리
                            e.currentTarget.style.display = "none";
                            e.currentTarget.parentElement.classList.remove("hasImage");
                            e.currentTarget.parentElement.classList.add("noImage");
                        }}
                    />
                )}
            </div>

            {/* 브랜드 + 평점 */}
            <div className="reviewBrandRating">
                <span className="reviewBrand">{review.brand_name}</span>

                <p
                    className={
                        !review.rating || Number(review.rating) === 0
                            ? "reviewRating productRatingNone"
                            : "reviewRating"
                    }
                >
                    {!review.rating || Number(review.rating) === 0
                        ? "-"
                        : `${Number(review.rating).toFixed(1)} / 5.0`}
                </p>
            </div>

            {/* 상품명 */}
            <div className="reviewProductName">{review.product_name}</div>

            {/* 리뷰 내용 */}
            <div className="reviewContent">{review.content}</div>
        </div>
    );
}
