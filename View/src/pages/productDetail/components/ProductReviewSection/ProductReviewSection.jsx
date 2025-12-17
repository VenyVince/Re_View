import React, { useState, useEffect } from "react";
import "./ProductReviewSection.css";

import axiosClient from "api/axiosClient";
import ReviewReportModal from "../../../reviewDetail/components/ReviewReportModal";
import { useNavigate } from "react-router-dom";


export default function ProductReviewSection({ productId }) {
    const [reviewList, setReviewList] = useState([]);
    const [sortType, setSortType] = useState("like_count"); // 백엔드 기본값에 맞춤
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [reportTargetId, setReportTargetId] = useState(null);
    const navigate = useNavigate();

    const goToReviewDetail = (reviewId) => {
        navigate(`/review/${reviewId}`);
    };
    // 로그인 여부 확인
    useEffect(() => {
        const checkLogin = async () => {
            try {
                await axiosClient.get("/api/auth/me"); // 본인 인증 API 경로에 맞게 수정 필요
                setIsLoggedIn(true);
            } catch {
                setIsLoggedIn(false);
            }
        };
        checkLogin();
    }, []);

    // 리뷰 목록 조회
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

                // 백엔드 데이터를 그대로 사용하도록 변경
                const formatted = res.data.map((r) => ({
                    ...r,
                    rating: Math.round(r.rating),
                    // 백엔드 DTO 필드명(user_liked)을 그대로 매핑
                    userLiked: r.user_liked,
                    userDisliked: r.user_disliked,
                }));

                setReviewList(formatted);
            } catch (err) {
                console.error("리뷰 불러오기 오류:", err);
            }
        };

        if (productId) fetchReviews();
    }, [productId, sortType]);

    // 좋아요 API 연동
    const toggleLike = async (id) => {
        if (!isLoggedIn) {
            alert("로그인이 필요합니다.");
            return;
        }

        // 현재 리뷰 상태 찾기
        const targetReview = reviewList.find(r => r.review_id === id);
        if (!targetReview) return;

        if (targetReview.userDisliked) {
            alert("비추천을 먼저 취소해주세요.");
            return;
        }

        // 낙관적 업데이트 (Optimistic Update): 화면 먼저 갱신
        setReviewList((prev) =>
            prev.map((rev) => {
                if (rev.review_id !== id) return rev;

                // 이미 좋아요 상태라면 -> 취소 (카운트 -1)
                if (rev.userLiked) {
                    return { ...rev, like_count: rev.like_count - 1, userLiked: false };
                }
                // 좋아요가 아니라면 -> 추가 (카운트 +1)
                else {
                    return { ...rev, like_count: rev.like_count + 1, userLiked: true };
                }
            })
        );

        // 서버 요청 전송
        try {
            await axiosClient.post(`/api/reviews/${id}/reaction`, {
                is_like: true // 좋아요 요청
            });
        } catch (err) {
            console.error("좋아요 처리 실패:", err);
            alert(err.response?.data || "처리 중 오류가 발생했습니다.");
            window.location.reload();
        }
    };

    // 싫어요 API 연동
    const toggleDislike = async (id) => {
        if (!isLoggedIn) {
            alert("로그인이 필요합니다.");
            return;
        }

        const targetReview = reviewList.find(r => r.review_id === id);
        if (!targetReview) return;

        if (targetReview.userLiked) {
            alert("추천을 먼저 취소해주세요.");
            return;
        }

        setReviewList((prev) =>
            prev.map((rev) => {
                if (rev.review_id !== id) return rev;

                if (rev.userDisliked) {
                    return { ...rev, dislike_count: rev.dislike_count - 1, userDisliked: false };
                } else {
                    return { ...rev, dislike_count: rev.dislike_count + 1, userDisliked: true };
                }
            })
        );

        // 서버 요청 전송
        try {
            await axiosClient.post(`/api/reviews/${id}/reaction`, {
                is_like: false // 싫어요 요청
            });
        } catch (err) {
            console.error("싫어요 처리 실패:", err);
            alert(err.response?.data || "처리 중 오류가 발생했습니다.");
            window.location.reload();
        }
    };

    const handleReport = async ({ reason, description }) => {
        if (!reportTargetId) return;

        try {
            await axiosClient.post(
                `/api/reviews/${reportTargetId}/report`,
                { reason, description }
            );

            alert("신고가 접수되었습니다.");
            setIsReportOpen(false);
            setReportTargetId(null);
        } catch (err) {
            if (err.response?.status === 401) {
                alert("로그인이 필요합니다.");
            } else if (err.response?.status === 409) {
                alert("이미 신고한 리뷰입니다.");
            } else {
                console.error(err);
                alert("신고 처리 중 오류가 발생했습니다.");
            }
        }
    };


    return (
        <div className="review-wrapper">
            {/* 정렬 탭 */}
            <div className="review-sort">
                {/* 백엔드 정렬 키워드(latest, rating, like_count)와 맞춰야 함 */}
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
                    className={sortType === "like_count" ? "active" : ""}
                    onClick={() => setSortType("like_count")}
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
                {isReportOpen && (
                    <ReviewReportModal
                        onClose={() => {
                            setIsReportOpen(false);
                            setReportTargetId(null);
                        }}
                        onSubmit={handleReport}
                    />
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
                                    className="report-btn"
                                    onClick={() => {
                                        if (!isLoggedIn) {
                                            alert("로그인이 필요합니다.");
                                            return;
                                        }
                                        setReportTargetId(r.review_id);
                                        setIsReportOpen(true);
                                    }}
                                >
                                     🚨 신고
                                </span>
                                {/* 좋아요 버튼 */}
                                <span
                                    className={`like ${r.userLiked ? "active" : ""}`}
                                    onClick={() => toggleLike(r.review_id)}
                                    style={{ cursor: "pointer" }}
                                >
                                    👍 {r.like_count}
                                </span>

                                {/* 싫어요 버튼 */}
                                <span
                                    className={`dislike ${r.userDisliked ? "active" : ""}`}
                                    onClick={() => toggleDislike(r.review_id)}
                                    style={{ cursor: "pointer" }}
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
                            <div
                                className="review-content"
                                onClick={() => goToReviewDetail(r.review_id)}
                                style={{ cursor: "pointer" }}
                            >
                                {r.content}
                            </div>

                            <div className="review-extra">
                                {/* 이미지 처리: 배열인지 문자열인지 확인 필요 (백엔드는 List<String> images 반환) */}
                                {r.images && r.images.length > 0 && (
                                    <img
                                        className="review-img"
                                        src={r.images[0]}
                                        alt=""
                                        onClick={() => goToReviewDetail(r.review_id)}
                                        style={{ cursor: "pointer" }}
                                    />
                                )}
                                <div className="date">
                                    {/* 날짜 형식에 따라 slice 조절 필요 */}
                                    {r.created_at ? r.created_at.slice(0, 10) : ""}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}