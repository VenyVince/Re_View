import React from "react";
import { useNavigate } from "react-router-dom";

export default function ReviewCard({ review }) {
    const navigate = useNavigate();   // 🔥 최상단

    if (!review) return null;
    const truncateText = (text, maxLength = 120) => {
        if (!text) return "";
        return text.length > maxLength
            ? text.slice(0, maxLength) + "…"
            : text;
    };

    const hasImage =
        review.image_url && review.image_url.trim() !== "";

    return (
        <li
            className="result-card"
            onClick={() => navigate(`/review/${review.review_id}`)}   // 🔥 수정 부분
            style={{ cursor: "pointer" }}
        >
            <div className="img-wrapper">
                {hasImage ? (
                    <img
                        src={review.image_url}
                        alt={review.prd_name}
                        onError={(e) => {
                            e.target.style.display = "none";
                            e.target.parentNode.querySelector(".alt-text").style.display = "flex";
                        }}
                    />
                ) : null}

                {!hasImage && (
                    <div className="alt-text">
                        {review.prd_name}
                    </div>
                )}
            </div>

            <div className="card-meta">
                <span className="card-brand">{review.prd_brand}</span>
                <span className="card-rating">
                    {review.rating ? `${review.rating.toFixed(1)} / 5.0` : "-"}
                </span>
            </div>

            <p className="card-name">{review.prd_name}</p>

            <p className="card-review-content">
                {truncateText(review.content, 70)}
            </p>
        </li>
    );
}
