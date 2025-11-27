// src/pages/mypage/user/review/UserReviewPage.jsx
import React from "react";
import UserMyPageLayout from "../layout/UserMyPageLayout";
import "./UserReviewPage.css";

// ✅ 더미 데이터 (API 스키마 기반)
// review_id, writer, created_at, image_url, brand_name,
// product_name, like_count, price, content, rating
const MOCK_REVIEWS = [
    {
        review_id: 1,
        writer: "더미유저",
        created_at: "2025-11-20T10:15:00",
        image_url:
            "https://images.unsplash.com/photo-1585386959984-a4155223f3f8?w=600&q=80",
        brand_name: "라곰(LAGOM)",
        product_name: "셀럽 마이크로 폼 클렌저",
        like_count: 12,
        price: 19000,
        content:
            "거품도 부드럽고 세안 후에 당김이 거의 없어요. 민감성인데도 자극이 적어서 잘 쓰고 있습니다.",
        rating: 4.5,
    },
    {
        review_id: 2,
        writer: "더미유저",
        created_at: "2025-11-18T21:03:00",
        image_url: "",
        brand_name: "라로슈포제",
        product_name: "시카플라스트 밤 B5+",
        like_count: 5,
        price: 22000,
        content:
            "트러블 올라올 때 국소 부위에만 발라주고 있어요. 유분감은 조금 있지만 진정 효과는 확실합니다.",
        rating: 4.0,
    },
    {
        review_id: 3,
        writer: "더미유저",
        created_at: "2025-11-10T09:40:00",
        image_url:
            "https://images.unsplash.com/photo-1612810432633-96f64dc8ccb6?w=600&q=80",
        brand_name: "닥터지",
        product_name: "레드 블레미쉬 수딩 크림",
        like_count: 27,
        price: 28000,
        content:
            "수분감 위주 크림이라 악건성인 분들에겐 겨울에 살짝 부족할 수 있는데, 지성·복합성에겐 딱 좋은 느낌이에요.",
        rating: 5.0,
    },
];

export default function UserMyReviewPage() {
    // 날짜 포맷 (YYYY-MM-DD)
    const formatDate = (isoString) => {
        if (!isoString) return "";
        return isoString.slice(0, 10);
    };

    const formatPrice = (price) => {
        if (price == null) return "";
        return price.toLocaleString("ko-KR");
    };

    const formatRating = (rating) => {
        if (rating == null) return "-";
        return Number(rating).toFixed(1);
    };

    const reviews = MOCK_REVIEWS; // 🔹 지금은 그냥 더미 배열 그대로 사용

    return (
        <UserMyPageLayout>
            <section className="mypage-section myreview-section">
                <h3 className="reivew-card-title">나의 작성 후기</h3>
                <p className="review-card-sub">작성한 리뷰는...</p>

                {reviews.length === 0 && (
                    <p className="myreview-empty">아직 작성한 후기가 없어요.</p>
                )}

                <div className="myreview-list">
                    {reviews.map((review) => (
                        <article key={review.review_id} className="myreview-card">
                            {/* 상단: 브랜드 / 상품명 + 날짜 / 버튼 */}
                            <header className="myreview-header">
                                <div className="myreview-title-block">
                                    <div className="myreview-brand">{review.brand_name}</div>
                                    <div className="myreview-product">
                                        {review.product_name}
                                    </div>
                                </div>

                                <div className="myreview-meta">
                  <span className="myreview-date">
                    {formatDate(review.created_at)}
                  </span>
                                    <button type="button" className="myreview-meta-btn">
                                        수정
                                    </button>
                                    <button type="button" className="myreview-meta-btn">
                                        삭제
                                    </button>
                                </div>
                            </header>

                            {/* 평점 / 도움돼요 / 가격 */}
                            <div className="myreview-rating-row">
                                <div className="myreview-stars">
                                    {Array.from({ length: 5 }).map((_, idx) => {
                                        const score = Number(review.rating) || 0;
                                        const filled = score >= idx + 1;
                                        return (
                                            <span
                                                key={idx}
                                                className={
                                                    "myreview-star" +
                                                    (filled ? " myreview-star--on" : "")
                                                }
                                            >
                        ★
                      </span>
                                        );
                                    })}
                                    <span className="myreview-score">
                    {formatRating(review.rating)}
                  </span>
                                </div>

                                <div className="myreview-extra">
                  <span className="myreview-like">
                    도움돼요 {review.like_count ?? 0}
                  </span>
                                    {review.price != null && (
                                        <span className="myreview-price">
                      {formatPrice(review.price)}원
                    </span>
                                    )}
                                </div>
                            </div>

                            {/* 리뷰 내용 */}
                            <p className="myreview-content">{review.content}</p>

                            {/* 리뷰 이미지 (있을 때만) */}
                            {review.image_url && (
                                <div className="myreview-images">
                                    <div className="myreview-thumb">
                                        <img
                                            src={review.image_url}
                                            alt="리뷰 이미지"
                                            className="myreview-thumb-img"
                                        />
                                    </div>
                                </div>
                            )}
                        </article>
                    ))}
                </div>
            </section>
        </UserMyPageLayout>
    );
}