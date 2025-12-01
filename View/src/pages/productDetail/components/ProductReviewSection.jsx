// src/pages/productDetail/components/ProductReviewSection.jsx
// ------------------------------------------------------------
// 상품 상세 - 리뷰 섹션
// (리뷰 작성 기능 제거 / 정렬 + 좋아요/싫어요 + 리뷰 목록만 표시)
// ------------------------------------------------------------

import React, { useState } from "react";
import "./ProductReviewSection.css";

export default function ProductReviewSection({ reviews }) {

    // 리뷰 목록 상태
    const [reviewList, setReviewList] = useState(reviews);

    // 정렬 상태 (latest | like | dislike)
    const [sortType, setSortType] = useState("latest");

    // ------------------------------------------------------------
    // 정렬 로직
    // ------------------------------------------------------------
    const sortedList = [...reviewList].sort((a, b) => {

        // ⏱ 최신순
        if (sortType === "latest") {
            return new Date(b.created_at) - new Date(a.created_at);
        }

        // 👍 좋아요순
        if (sortType === "like") {
            if (b.like_count !== a.like_count) {
                return b.like_count - a.like_count;
            }
            return a.dislike_count - b.dislike_count; // 싫어요 적은 순
        }

        // 👎 싫어요순
        if (sortType === "dislike") {
            if (b.dislike_count !== a.dislike_count) {
                return b.dislike_count - a.dislike_count;
            }
            return b.like_count - a.like_count; // 좋아요 많은 순
        }

        return 0;
    });

    // ------------------------------------------------------------
    // 좋아요 기능
    // ------------------------------------------------------------
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
                        userDisliked: false,
                    };
                }

                return {
                    ...rev,
                    like_count: rev.like_count - 1,
                    userLiked: false,
                };
            })
        );
    };

    // ------------------------------------------------------------
    // 싫어요 기능
    // ------------------------------------------------------------
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
                        userLiked: false,
                    };
                }

                return {
                    ...rev,
                    dislike_count: rev.dislike_count - 1,
                    userDisliked: false,
                };
            })
        );
    };

    return (
        <div className="review-wrapper">

            {/* ------------------------------------------------------------
                정렬 UI
            ------------------------------------------------------------ */}
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

            {/* ------------------------------------------------------------
                리뷰 목록
            ------------------------------------------------------------ */}
            <div className="review-list">

                {/* 리뷰 없음 문구 */}
                {sortedList.length === 0 && (
                    <div className="review-empty">
                        아직 등록된 상품 후기가 없습니다.
                    </div>
                )}

                {sortedList.map((r) => (
                    <div className="review-card" key={r.review_id}>

                        {/* 1줄 - 닉네임 + 바우만 + 좋아요/싫어요 */}
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

                        {/* 2줄 - 별점 */}
                        <div className="rating-line">
                            <span className="stars">
                                {"★".repeat(r.rating)}
                                {"☆".repeat(5 - r.rating)}
                            </span>
                            <span className="rating-num">{r.rating}/5</span>
                        </div>

                        {/* 3줄 - 내용 + 이미지 + 날짜 */}
                        <div className="review-body">
                            <div className="review-content">{r.content}</div>

                            <div className="review-extra">
                                {r.images.length > 0 && (
                                    <img className="review-img" src={r.images[0]} alt="" />
                                )}
                                <div className="date">{r.created_at}</div>
                            </div>
                        </div>

                    </div>
                ))}
            </div>

        </div>
    );
}
