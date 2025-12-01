// src/pages/mypage/user/review/UserReviewPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import UserMyPageLayout from "../layout/UserMyPageLayout";
import "./UserReviewPage.css";

export default function UserReviewPage() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const formatDate = (isoString) => (isoString ? isoString.slice(0, 10) : "");
    const formatPrice = (price) =>
        price == null ? "" : price.toLocaleString("ko-KR");
    const formatRating = (rating) =>
        rating == null ? "-" : Number(rating).toFixed(1);

    const fetchMyReviews = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await axios.get("/api/users/reviews/search", {
                params: {
                    keyword: "",      // 전체 조회용
                    sort: "latest",   // 최신순
                    filter_rating: 0, // 필터 없음
                },
                withCredentials: true,
            });

            console.log(" /api/users/reviews/search 응답:", res.data);

            // 응답 형태 방어적으로 처리
            const root = res.data.data || res.data;

            // 예시: { reviews: [...] } 또는 { content: [...] } 등등 대비
            const list =
                root.reviews ||
                root.content ||
                root.items ||
                root.list ||
                [];

            setReviews(Array.isArray(list) ? list : []);
        } catch (e) {
            console.error(" 내 리뷰 조회 실패:", e);
            console.error(" 응답:", e.response?.status, e.response?.data);

            if (e.response?.status === 401) {
                setError("로그인이 필요합니다. 다시 로그인해 주세요.");
            } else {
                // 지금은 DB 에러 때문에 이 문장이 보이는 상태
                setError("작성한 후기를 불러오는 중 오류가 발생했어요.");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyReviews();
    }, []);

    return (
        <UserMyPageLayout>
            <section className="mypage-section myreview-section">
                <h3 className="reivew-card-title">나의 작성 후기</h3>
                <p className="review-card-sub">작성한 리뷰를 한눈에 확인할 수 있어요.</p>

                {loading && <p className="myreview-loading">불러오는 중...</p>}
                {error && <p className="myreview-error">{error}</p>}
                {!loading && !error && reviews.length === 0 && (
                    <p className="myreview-empty">아직 작성한 후기가 없어요.</p>
                )}

                <div className="myreview-list">
                    {reviews.map((review) => (
                        <article key={review.review_id} className="myreview-card">
                            {/* 상단: 브랜드 / 상품명 + 날짜 / 버튼 */}
                            <header className="myreview-header">
                                <div className="myreview-title-block">
                                    <div className="myreview-brand">{review.brand_name}</div>
                                    <div className="myreview-product">{review.product_name}</div>
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