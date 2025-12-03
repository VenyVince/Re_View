// src/pages/productDetail/components/ProductReviewSection.jsx
import React, { useState, useEffect } from "react";
import "./ProductReviewSection.css";

export default function ProductReviewSection({ productId }) {
    const [reviewList, setReviewList] = useState([]);
    const [sortType, setSortType] = useState("latest");

    // 리뷰 API 호출
    useEffect(() => {
        fetch(`/api/reviews/${productId}/reviews`)
            .then((res) => res.json())
            .then((data) => {
                const formatted = data.map((r) => ({
                    ...r,
                    rating: Math.round(r.rating),       // ★ 별 갯수용 변환
                    userLiked: false,                    // FE 전용 상태
                    userDisliked: false
                }));
                setReviewList(formatted);
            })
            .catch((e) => console.error("리뷰 불러오기 오류:", e));
    }, [productId]);

    // 정렬
    const sortedList = [...reviewList].sort((a, b) => {
        if (sortType === "latest") {
            return new Date(b.created_at) - new Date(a.created_at);
        }

        if (sortType === "like") {
            if (b.like_count !== a.like_count) {
                return b.like_count - a.like_count;
            }
            return a.dislike_count - b.dislike_count;
        }

        if (sortType === "dislike") {
            if (b.dislike_count !== a.dislike_count) {
                return b.dislike_count - a.dislike_count;
            }
            return b.like_count - a.like_count;
        }

        return 0;
    });

    // 좋아요
    const toggleLike = (id) => {
        setReviewList((prev) =>
            prev.map((rev) => {
                if (rev.review_id !== id) return rev;

                if (!rev.userLiked) {
                    return {
                        ...rev,
                        like_count: rev.like_count + 1,
                        dislike_count: rev.userDisliked
                            ? rev.dislike_count - 1
                            : rev.dislike_count,
                        userLiked: true,
                        userDisliked: false
                    };
                }

                return {
                    ...rev,
                    like_count: rev.like_count - 1,
                    userLiked: false
                };
            })
        );
    };

    // 싫어요
    const toggleDislike = (id) => {
        setReviewList((prev) =>
            prev.map((rev) => {
                if (rev.review_id !== id) return rev;

                if (!rev.userDisliked) {
                    return {
                        ...rev,
                        dislike_count: rev.dislike_count + 1,
                        like_count: rev.userLiked
                            ? rev.like_count - 1
                            : rev.like_count,
                        userDisliked: true,
                        userLiked: false
                    };
                }

                return {
                    ...rev,
                    dislike_count: rev.dislike_count - 1,
                    userDisliked: false
                };
            })
        );
    };

    return (
        <div className="review-wrapper">

            {/* 정렬 UI */}
            <div className="review-sort">
                <span
                    className={sortType === "latest" ? "active" : ""}
                    onClick={() => setSortType("latest")}
                >
                    최신순
                </span>

                <span
                    className={sortType === "like" ? "active" : ""}
                    onClick={() => setSortType("like")}
                >
                    좋아요순
                </span>

                <span
                    className={sortType === "dislike" ? "active" : ""}
                    onClick={() => setSortType("dislike")}
                >
                    싫어요순
                </span>
            </div>

            {/* 리뷰 리스트 */}
            <div className="review-list">
                {sortedList.length === 0 && (
                    <div className="review-empty">아직 등록된 상품 후기가 없습니다.</div>
                )}

                {sortedList.map((r) => (
                    <div className="review-card" key={r.review_id}>

                        <div className="review-top">
                            <div className="left">
                                <span className="nickname">{r.nickname}</span>
                                <span className="baumann">{r.baumann_type}</span>
                            </div>

                            <div className="right">
                                <span
                                    className={`like ${r.userLiked ? "active" : ""}`}
                                    onClick={() => toggleLike(r.review_id)}
                                >
                                    👍 {r.like_count}
                                </span>

                                <span
                                    className={`dislike ${r.userDisliked ? "active" : ""}`}
                                    onClick={() => toggleDislike(r.review_id)}
                                >
                                    👎 {r.dislike_count}
                                </span>
                            </div>
                        </div>

                        <div className="rating-line">
                            <span className="stars">
                                {"★".repeat(r.rating)}
                                {"☆".repeat(5 - r.rating)}
                            </span>
                            <span className="rating-num">{r.rating}/5</span>
                        </div>

                        <div className="review-body">
                            <div className="review-content">{r.content}</div>

                            <div className="review-extra">
                                {r.images?.length > 0 && (
                                    <img className="review-img" src={r.images[0]} alt="" />
                                )}
                                <div className="date">{r.created_at.slice(0, 10)}</div>
                            </div>
                        </div>

                    </div>
                ))}
            </div>

        </div>
    );
}
