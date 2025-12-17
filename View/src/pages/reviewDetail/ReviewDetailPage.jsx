import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ReviewDetailPage.css";

import axiosClient from "api/axiosClient";

import ReviewDetailHeader from "./components/ReviewDetailHeader";
import ReviewDetailContent from "./components/ReviewDetailContent";
import ReviewCommentList from "./components/ReviewCommentList";
import ReviewCommentWriteBox from "./components/ReviewCommentWriteBox";
import ReviewReportModal from "./components/ReviewReportModal";

export default function ReviewDetailPage() {
    const { reviewId } = useParams();
    const [review, setReview] = useState(null);
    const [comments, setComments] = useState([]);
    const [currentUserNickname, setCurrentUserNickname] = useState(null);
    const [isReportOpen, setIsReportOpen] = useState(false);

    // 로그인 유저 정보 조회
    useEffect(() => {
        axiosClient.get("/api/auth/me")
            .then((res) => {
                setCurrentUserNickname(res.data.nickname);
            })
            .catch(() => {
                setCurrentUserNickname(null); // 비로그인
            });
    }, []);

    // 리뷰 상세 + 댓글 조회
    useEffect(() => {
        axiosClient.get(`/api/reviews/${reviewId}`)
            .then((res) => {
                const r = res.data.review;
                const p = res.data.product;

                setReview({
                    ...r,
                    prd_brand: p.prd_brand,
                    prd_name: p.prd_name,
                    product_image: p.product_image,
                    price: p.price,
                    category: p.category,
                });

                setComments((res.data.comments || []).map(c => ({
                    ...c,
                    comment_id:c.comment_id
                }))
                );
            })
            .catch((err) => {
                console.error("리뷰 상세 조회 오류:", err);
            });
    }, [reviewId]);

    if (!review) return <div>불러오는 중...</div>;


    // 댓글 작성 후 재조회
    const handleCommentSubmit = async () => {
        try {
            const res = await axiosClient.get(`/api/reviews/${reviewId}`);
            setComments(res.data.comments || []);
        } catch (err) {
            if (err.response?.status === 401) {
                alert("로그인이 필요합니다.");
            } else {
                console.error(err);
            }
        }
    };

    // 댓글 삭제 (부모에서만 처리)
    const handleDeleteComment = async (comment_id) => {
        if (!window.confirm("댓글을 삭제하시겠습니까?")) return;

        try {
            await axiosClient.delete(`/api/reviews/comments/${comment_id}`);

            const res = await axiosClient.get(`/api/reviews/${reviewId}`);
            setComments((res.data.comments || []).map(c => ({
                    ...c,
                    comment_id:c.comment_id
                }))
            );
        } catch (err) {
            if (err.response?.status === 401) {
                alert("로그인이 필요합니다.");
            } else if (err.response?.status === 403) {
                alert("본인 댓글만 삭제할 수 있습니다.");
            } else {
                console.error(err);
            }
        }
    };

    // 리뷰 좋아요
    const handleLike = async () => {
        try {
            if (review.is_like) {
                await axiosClient.post(
                    `/api/reviews/${reviewId}/reaction`,
                    { is_like: false }
                );
            }

            await axiosClient.post(
                `/api/reviews/${reviewId}/reaction`,
                { is_like: true }
            );

            const res = await axiosClient.get(
                `/api/reviews/${reviewId}?t=${Date.now()}`
            );

            const r = res.data.review;
            const p = res.data.product;

            setReview({
                ...r,
                prd_brand: p.prd_brand,
                prd_name: p.prd_name,
                product_image: p.product_image,
                price: p.price,
                category: p.category,
            });
        } catch (err) {
            if (err.response?.status === 401) {
                alert("로그인이 필요합니다.");
            } else {
                console.error(err);
            }
        }
    };

    // 리뷰 싫어요
    const handleDislike = async () => {
        try {
            if (review.is_like) {
                await axiosClient.post(
                    `/api/reviews/${reviewId}/reaction`,
                    { is_like: true }
                );
            }

            await axiosClient.post(
                `/api/reviews/${reviewId}/reaction`,
                { is_like: false }
            );

            const res = await axiosClient.get(
                `/api/reviews/${reviewId}?t=${Date.now()}`
            );

            const r = res.data.review;
            const p = res.data.product;

            setReview({
                ...r,
                prd_brand: p.prd_brand,
                prd_name: p.prd_name,
                product_image: p.product_image,
                price: p.price,
                category: p.category,
            });
        } catch (err) {
            if (err.response?.status === 401) {
                alert("로그인이 필요합니다.");
            } else {
                console.error(err);
            }
        }
    };

    // 신고 요청
    const handleReport = async ({ reason, description }) => {
        try {
            await axiosClient.post(
                `/api/reviews/${reviewId}/report`,
                {
                    reason,
                    description,
                }
            );

            alert("신고가 접수되었습니다.");
            setIsReportOpen(false);
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
        <div className="rd-wrap">
            <section className="rd-main">
                <ReviewDetailHeader
                    review={review}
                    onLike={handleLike}
                    onDislike={handleDislike}
                    onReport={() => setIsReportOpen(true)}
                />

                <ReviewDetailContent review={review} />
            </section>

            <section className="rd-comments-box">
                <div className="rd-comments-header">
                    <h3>댓글</h3>
                    <span className="rd-comments-count">{comments.length}</span>
                </div>

                <ReviewCommentList
                    comments={comments}
                    currentUserNickname={currentUserNickname}
                    onDelete={handleDeleteComment}
                />

                <ReviewCommentWriteBox
                    reviewId={review.review_id}
                    onSubmit={handleCommentSubmit}
                />
            </section>
            {isReportOpen && (
                <ReviewReportModal
                    onClose={() => setIsReportOpen(false)}
                    onSubmit={handleReport}
                />
            )}
        </div>
    );
}
