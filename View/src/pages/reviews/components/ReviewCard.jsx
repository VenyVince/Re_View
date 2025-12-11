// src/pages/reviews/components/ReviewCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./ReviewCard.css";

export default function ReviewCard({ review }) {
    const navigate = useNavigate();

    return (
        <div className="reviewCard"
             onClick={() => navigate(`/review/${review.review_id}`)}>
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
