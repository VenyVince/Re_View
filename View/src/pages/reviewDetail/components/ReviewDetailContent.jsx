// src/pages/reviewDetail/components/ReviewDetailContent.jsx
import React from "react";
import "./ReviewDetailContent.css";

export default function ReviewDetailContent({ review,product }) {
    return (
        <div className="rd-content">

            {/* 리뷰 이미지들 (있을 때만) */}
            {review.images?.length > 0 && (
                <div className="rd-img-box">
                    {review.images.map((src, idx) => (
                        <img key={idx} src={src} alt="" />
                    ))}
                </div>
            )}

            {/* 리뷰 본문: 상품이미지 아래 전체 영역 */}
            <div className="rd-text">{review.content}</div>

            {/* 마지막 줄 오른쪽: 바우만 타입 · 닉네임 */}
            <div className="rd-user-info">
                <span className="rd-baumann">{review.baumann_type}</span>
                <span className="rd-nickname">{review.nickname}</span>
            </div>
        </div>
    );
}
