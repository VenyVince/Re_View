import React, { useState, useEffect } from "react";
import "./ProductReviewSection.css";

import axiosClient from "api/axiosClient";

export default function ProductReviewSection({ productId }) {
    const [reviewList, setReviewList] = useState([]);
    const [sortType, setSortType] = useState("latest");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // 로그인 여부 확인
    useEffect(() => {
        const checkLogin = async () => {
            try {
                await axiosClient.get("/api/auth/me");
                setIsLoggedIn(true);
            } catch {
                setIsLoggedIn(false);
            }
        };
        checkLogin();
    }, []);

    // 리뷰 목록 조회 (정렬은 백엔드에서 처리)
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axiosClient.get(
                    `/api/reviews/${productId}/reviews`,
                    {
                        params: {
                            sort: sortType,
                        },
                    }
                );

                const formatted = res.data.map((r) => ({
                    ...r,
                    rating: Math.round(r.rating),
                    userLiked: false,
                    userDisliked: false,
                }));

                setReviewList(formatted);
            } catch (err) {
                console.error("리뷰 불러오기 오류:", err);
            }
        };

        if (productId) fetchReviews();
    }, [productId, sortType]);

    // 좋아요 토글 (프론트 상태만 변경)
    const toggleLike = (id) => {
        if (!isLoggedIn) {
            alert("로그인이 필요합니다.");
            return;
        }

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

    // 싫어요 토글 (프론트 상태만 변경)
    const toggleDislike = (id) => {
        if (!isLoggedIn) {
            alert("로그인이 필요합니다.");
            return;
        }

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
            {/* 정렬 탭 */}
            <div className="review-sort">
                <span
                    className={sortType === "latest" ? "active" : ""}
                    onClick={() => setSortType("latest")}
                >
                    최신순
                </span>

                <span
                    className={sortType === "rating" ? "active" : ""}
                    onClick={() => setSortType("rating")}
                >
                    평점순
                </span>

                <span
                    className={sortType === "like" ? "active" : ""}
                    onClick={() => setSortType("like")}
                >
                    좋아요순
                </span>
            </div>

            {/* 리뷰 리스트 */}
            <div className="review-list">
                {reviewList.length === 0 && (
                    <div className="review-empty">
                        아직 등록된 상품 후기가 없습니다.
                    </div>
                )}

                {reviewList.map((r) => (
                    <div className="review-card" key={r.review_id}>
                        <div className="review-top">
                            <div className="left">
                                <span className="nickname">{r.nickname}</span>
                                <span className="baumann">
                                    {r.baumann_type}
                                </span>
                            </div>

                            <div className="right">
                                <span
                                    className={`like ${
                                        r.userLiked ? "active" : ""
                                    }`}
                                    onClick={() =>
                                        toggleLike(r.review_id)
                                    }
                                >
                                    👍 {r.like_count}
                                </span>

                                <span
                                    className={`dislike ${
                                        r.userDisliked ? "active" : ""
                                    }`}
                                    onClick={() =>
                                        toggleDislike(r.review_id)
                                    }
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
                            <span className="rating-num">
                                {r.rating}/5
                            </span>
                        </div>

                        <div className="review-body">
                            <div className="review-content">
                                {r.content}
                            </div>

                            <div className="review-extra">
                                {r.images?.length > 0 && (
                                    <img
                                        className="review-img"
                                        src={r.images[0]}
                                        alt=""
                                    />
                                )}
                                <div className="date">
                                    {r.created_at.slice(0, 10)}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
