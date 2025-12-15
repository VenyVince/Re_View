import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./ReviewDetailPage.css";
import axiosClient from "api/axiosClient";

import ReviewDetailHeader from "./components/ReviewDetailHeader";
import ReviewDetailContent from "./components/ReviewDetailContent";
import ReviewCommentList from "./components/ReviewCommentList";
import ReviewCommentWriteBox from "./components/ReviewCommentWriteBox";

export default function ReviewDetailPage() {
    const { reviewId } = useParams();

    const [review, setReview] = useState(null);
    const [comments, setComments] = useState([]);
    const [pending, setPending] = useState(false);

    const fetchReview = async () => {
        const res = await axiosClient.get(`/api/reviews/${reviewId}?t=${Date.now()}`);
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
        setComments(res.data.comments || []);
    };

    useEffect(() => {
        fetchReview().catch((err) => console.error("리뷰 상세 조회 오류:", err));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reviewId]);

    if (!review) return <div>불러오는 중...</div>;

    const handleCommentSubmit = async () => {
        try {
            const res = await axiosClient.get(`/api/reviews/${reviewId}?t=${Date.now()}`);
            setComments(res.data.comments || []);
        } catch (err) {
            if (err.response?.status === 401) alert("로그인이 필요합니다.");
            else console.error(err);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
        try {
            await axiosClient.delete(`/api/reviews/comments/${commentId}`);
            const res = await axiosClient.get(`/api/reviews/${reviewId}?t=${Date.now()}`);
            setComments(res.data.comments || []);
        } catch (err) {
            if (err.response?.status === 401) alert("로그인이 필요합니다.");
            else if (err.response?.status === 403) alert("본인 댓글만 삭제할 수 있습니다.");
            else console.error(err);
        }
    };

    const handleLike = async () => {
        if (pending) return;
        setPending(true);
        try {
            if (review.user_disliked) {
                await axiosClient.post(`/api/reviews/${reviewId}/reaction`, { is_like: false });
            }
            await axiosClient.post(`/api/reviews/${reviewId}/reaction`, { is_like: true });
            await fetchReview();
        } catch (err) {
            if (err.response?.status === 401) alert("로그인이 필요합니다.");
            else console.error(err);
        } finally {
            setPending(false);
        }
    };

    const handleDislike = async () => {
        if (pending) return;
        setPending(true);
        try {
            if (review.user_liked) {
                await axiosClient.post(`/api/reviews/${reviewId}/reaction`, { is_like: true });
            }
            await axiosClient.post(`/api/reviews/${reviewId}/reaction`, { is_like: false });
            await fetchReview();
        } catch (err) {
            if (err.response?.status === 401) alert("로그인이 필요합니다.");
            else console.error(err);
        } finally {
            setPending(false);
        }
    };

    return (
        <div className="rd-wrap">
            <section className="rd-main">
                <ReviewDetailHeader
                    review={review}
                    onLike={handleLike}
                    onDislike={handleDislike}
                    pending={pending}
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
