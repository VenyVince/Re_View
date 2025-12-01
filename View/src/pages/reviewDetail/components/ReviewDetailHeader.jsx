// src/pages/reviewDetail/components/ReviewDetailHeader.jsx
import React from "react";
import "./ReviewDetailHeader.css";

export default function ReviewDetailHeader({ review }) {
    return (
        <div className="rd-header">
            {/* 왼쪽: 상품 이미지 */}
            <div className="rd-header-left">
                <img
                    src={review.product_image}
                    alt={review.prd_name}
                    className="rd-product-image"
                />
            </div>

            {/* 오른쪽: 브랜드/상품명/별점/가격 - 한 줄씩 */}
            <div className="rd-header-right">
                <div className="rd-brand">{review.prd_brand}</div>
                <div className="rd-name">{review.prd_name}</div>
                <div
                    className={
                        !review.rating || Number(review.rating) === 0
                            ? "rd-rating productRatingNone"
                            : "rd-rating"
                    }
                >
                    {!review.rating || Number(review.rating) === 0
                        ? "-"
                        : `${Number(review.rating).toFixed(1)} / 5.0`}
                </div>

                <div className="rd-price">{review.price?.toLocaleString()}원</div>
            </div>
        </div>
    );
}
