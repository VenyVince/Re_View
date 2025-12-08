// src/pages/review/components/ReviewList.jsx
import React from "react";
import "./ReviewList.css";
import ReviewCard from "./ReviewCard";

export default function ReviewList({ reviews }) {
    if (!Array.isArray(reviews) || reviews.length === 0) {
        return (
            <div className="reviewListEmpty">
                표시할 리뷰가 없습니다.
            </div>
        );
    }

    return (
        <div className="reviewListWrapper">
            {reviews.map((review) => (
                <ReviewCard
                    key={review.review_id}
                    review={review}
                />
            ))}
        </div>
    );
}
