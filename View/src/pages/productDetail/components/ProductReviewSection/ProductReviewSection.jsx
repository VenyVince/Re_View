// src/pages/productDetail/components/ProductReviewSection.jsx
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

    // 리뷰 조회 (새로고침 시 상태 유지)
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axiosClient.get(
                    `/api/reviews/${productId}/reviews`,
                    { params: { sort: sortType } }
                );

                const formatted = res.data.map((r) => ({
                    ...r,
                    rating: Math.round(r.rating),
                    userLiked: r.user_liked,
                    userDisliked: r.user_disliked,
                }));

                setReviewList(formatted);
            } catch (err) {
                console.error(err);
            }
        };

        if (productId) fetchReviews();
    }, [productId, sortType]);

    // 👍 좋아요
    const toggleLike = async (id) => {
        if (!isLoggedIn) {
            alert("로그인이 필요합니다.");
            return;
        }

        const target = reviewList.find(r => r.review_id === id);
        if (!target) return;

        // 👎 상태에서 👍 클릭 → 경고만
        if (target.userDisliked) {
            alert("현재 선택을 취소한 뒤 다시 눌러주세요.");
            return;
        }

        try {
            await axiosClient.post(`/api/reviews/${id}/reaction`, {
                is_like: true,
            });

            setReviewList(prev =>
                prev.map(r => {
                    if (r.review_id !== id) return r;

                    // 👍 취소
                    if (r.userLiked) {
                        return {
                            ...r,
                            like_count: r.like_count - 1,
                            userLiked: false,
                        };
                    }

                    // 👍 선택
                    return {
                        ...r,
                        like_count: r.like_count + 1,
                        userLiked: true,
                    };
                })
            );
        } catch (err) {
            console.error("좋아요 처리 실패", err);
        }
    };

    // 👎 싫어요
    const toggleDislike = async (id) => {
        if (!isLoggedIn) {
            alert("로그인이 필요합니다.");
            return;
        }

        const target = reviewList.find(r => r.review_id === id);
        if (!target) return;

        // 👍 상태에서 👎 클릭 → 경고만
        if (target.userLiked) {
            alert("현재 선택을 취소한 뒤 다시 눌러주세요.");
            return;
        }

        try {
            await axiosClient.post(`/api/reviews/${id}/reaction`, {
                is_like: false,
            });

            setReviewList(prev =>
                prev.map(r => {
                    if (r.review_id !== id) return r;

                    // 👎 취소
                    if (r.userDisliked) {
                        return {
                            ...r,
                            dislike_count: r.dislike_count - 1,
                            userDisliked: false,
                        };
                    }

                    // 👎 선택
                    return {
                        ...r,
                        dislike_count: r.dislike_count + 1,
                        userDisliked: true,
                    };
                })
            );
        } catch (err) {
            console.error("싫어요 처리 실패", err);
        }
    };

    return (
        <div className="review-wrapper">
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
                                <span className="baumann">{r.baumann_type}</span>
                            </div>

                            <div className="right">
                                <span
                                    className={`like ${r.userLiked ? "active" : ""}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleLike(r.review_id);
                                    }}
                                >
                                    👍 {r.like_count}
                                </span>

                                <span
                                    className={`dislike ${r.userDisliked ? "active" : ""}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleDislike(r.review_id);
                                    }}
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
