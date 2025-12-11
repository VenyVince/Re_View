// src/pages/reviewDetail/ReviewDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./ReviewDetailPage.css";

import ReviewDetailHeader from "./components/ReviewDetailHeader";
import ReviewDetailContent from "./components/ReviewDetailContent";
import ReviewCommentList from "./components/ReviewCommentList";
import ReviewCommentWriteBox from "./components/ReviewCommentWriteBox";

export default function ReviewDetailPage() {
    const { reviewId } = useParams();

    const [review, setReview] = useState(null);
    const [comments, setComments] = useState([]);

    // 리뷰 상세 정보와 댓글 조회 (세션 쿠키 포함)
    useEffect(() => {
        axios.get(`/api/reviews/${reviewId}`, { withCredentials: true })
            .then((res) => {
                const r = res.data.review;
                const p = res.data.product;

                const mergedReview = {
                    ...r,
                    prd_brand: p.prd_brand,
                    prd_name: p.prd_name,
                    product_image: p.product_image,
                    price: p.price,
                    category: p.category
                };

                setReview(mergedReview);
                setComments(res.data.comments);
            });
    }, [reviewId]);

    if (!review) return <div>불러오는 중...</div>;

    // 댓글 작성 후 최신 댓글 목록 조회
    const handleCommentSubmit = () => {
        axios
            .get(`/api/reviews/${reviewId}`, { withCredentials: true })
            .then((res) => setComments(res.data.comments))
            .catch((err) => {
                if (err.response?.status === 404) {
                    alert("로그인이 필요합니다.");
                } else {
                    console.error(err);
                }
            });
    };

    // 댓글 삭제 요청 (본인 여부 및 세션 체크 포함)
    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("댓글을 삭제하시겠습니까?")) return;

        try {
            await axios.delete(
                `/api/reviews/comments/${commentId}`,
                { withCredentials: true }
            );

            // 삭제 후 댓글 목록 재조회
            const res = await axios.get(`/api/reviews/${reviewId}`, {
                withCredentials: true,
            });
            setComments(res.data.comments);

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

    // 리뷰 좋아요 요청
    const handleLike = async () => {
        try {
            // 기존에 싫어요를 눌렀다면 취소 처리
            if (review.user_disliked) {
                await axios.post(
                    `/api/reviews/${reviewId}/reaction`,
                    { is_like: false },
                    { withCredentials: true }
                );
            }

            // 좋아요 처리
            await axios.post(
                `/api/reviews/${reviewId}/reaction`,
                { is_like: true },
                { withCredentials: true }
            );

            // 최신 리뷰 데이터 재조회
            const res = await axios.get(`/api/reviews/${reviewId}?t=${Date.now()}`, {
                withCredentials: true,
            });

            const r = res.data.review;
            const p = res.data.product;

            setReview({
                ...r,
                prd_brand: p.prd_brand,
                prd_name: p.prd_name,
                product_image: p.product_image,
                price: p.price,
                category: p.category
            });

        } catch (err) {
            if (err.response?.status === 404) alert("로그인이 필요합니다.");
            else console.error(err);
        }
    };

    // 리뷰 싫어요 요청
    const handleDislike = async () => {
        try {
            // 기존에 좋아요를 눌렀다면 취소 처리
            if (review.user_liked) {
                await axios.post(
                    `/api/reviews/${reviewId}/reaction`,
                    { is_like: true },
                    { withCredentials: true }
                );
            }

            // 싫어요 처리
            await axios.post(
                `/api/reviews/${reviewId}/reaction`,
                { is_like: false },
                { withCredentials: true }
            );

            // 최신 리뷰 데이터 재조회
            const res = await axios.get(`/api/reviews/${reviewId}?t=${Date.now()}`, {
                withCredentials: true,
            });

            const r = res.data.review;
            const p = res.data.product;

            setReview({
                ...r,
                prd_brand: p.prd_brand,
                prd_name: p.prd_name,
                product_image: p.product_image,
                price: p.price,
                category: p.category
            });

        } catch (err) {
            if (err.response?.status === 404) alert("로그인이 필요합니다.");
            else console.error(err);
        }
    };

    return (
        <div className="rd-wrap">

            <section className="rd-main">
                <ReviewDetailHeader
                    review={review}
                    onLike={handleLike}
                    onDislike={handleDislike}
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
                    currentUserNickname={review.nickname}
                    onDelete={handleDeleteComment}
                />

                <ReviewCommentWriteBox
                    reviewId={review.review_id}
                    onSubmit={handleCommentSubmit}
                />
            </section>
        </div>
    );
}
