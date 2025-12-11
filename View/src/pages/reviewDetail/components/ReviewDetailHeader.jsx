import React from "react";
import { Link } from "react-router-dom";
import "./ReviewDetailHeader.css";

export default function ReviewDetailHeader({ review, onLike, onDislike }) {
    return (
        <div className="rd-header">

            {/* 왼쪽: 상품 이미지 */}
            <div className="rd-header-left">
                <img
                    src={review.product_image || ""}
                    alt={review.prd_name}
                    className="rd-product-image"
                    onError={(e) => (e.target.style.display = "none")}
                />
            </div>

            <div className="rd-header-right">

                <div className="rd-brand-row">
                    <div className="rd-brand">{review.prd_brand}</div>

                    <div className="rd-like-dislike">
                        <button
                            className={review.user_liked ? "rd-like-btn active-like" : "rd-like-btn"}
                            onClick={onLike}
                        >
                            👍 {review.like_count}
                        </button>

                        <button
                            className={review.user_disliked ? "rd-dislike-btn active-dislike" : "rd-dislike-btn"}
                            onClick={onDislike}
                        >
                            👎 {review.dislike_count}
                        </button>
                    </div>
                </div>

                <div className="rd-name">
                    <Link to={`/product/${review.product_id}`}>
                        {review.prd_name}
                    </Link>
                </div>

                <div
                    className={
                        !review.rating || Number(review.rating) === 0
                            ? "rd-rating productRatingNone"
                            : "rd-rating"
                    }
                >
                    {!review.rating ? "-" : `${Number(review.rating).toFixed(1)} / 5.0`}
                </div>

                <div className="rd-price">
                    {review.price?.toLocaleString()}원
                </div>
            </div>
        </div>
    );
}
