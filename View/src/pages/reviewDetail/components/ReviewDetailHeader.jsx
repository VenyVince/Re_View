// src/pages/reviewDetail/components/ReviewDetailHeader.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./ReviewDetailHeader.css";

export default function ReviewDetailHeader({ review, onLike, onDislike, onReport }) {
    return (
        <div className="rdh-header">

            {/* 왼쪽: 상품 이미지 */}
            <div className="rdh-image-box">
                <img
                    src={review.product_image || ""}
                    alt={review.prd_name}
                    className="rdh-image"
                    onError={(e) => {
                        // 이미지 깨지면 숨김 (ReviewCard 방식 그대로)
                        e.currentTarget.style.display = "none";
                    }}
                />
            </div>

            {/* 오른쪽 정보 */}
            <div className="rdh-info">

                <div className="rdh-brand-row">
                    <div className="rdh-brand">{review.prd_brand}</div>

                    <div className="rdh-like-box">
                        {!review.is_mine && (
                            <button
                                className="rdh-report-btn"
                                onClick={onReport}
                            >🚨신고
                            </button>
                        )}
                        <button
                            className={
                                review.user_liked
                                    ? "rdh-like-btn active"
                                    : "rdh-like-btn"
                            }
                            onClick={onLike}
                        >
                            👍 {review.like_count}
                        </button>

                        <button
                            className={
                                review.user_disliked
                                    ? "rdh-dislike-btn active"
                                    : "rdh-dislike-btn"
                            }
                            onClick={onDislike}
                        >
                            👎 {review.dislike_count}
                        </button>
                    </div>
                </div>

                <div className="rdh-name">
                    <Link to={`/product/${review.product_id}`}>
                        {review.prd_name}
                    </Link>
                </div>

                <div className="rdh-rating">
                    {review.rating
                        ? `${Number(review.rating).toFixed(1)} / 5.0`
                        : "-"}
                </div>

                <div className="rdh-price">
                    {review.price?.toLocaleString()}원
                </div>

            </div>
        </div>
    );
}
