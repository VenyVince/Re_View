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

    // 리뷰 상세 + 댓글 불러오기
    useEffect(() => {
        axios.get(`/api/reviews/${reviewId}`).then((res) => {
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

    //댓글 작성 후 최신 댓글 다시 GET
    const handleCommentSubmit = () => {
        axios
            .get(`/api/reviews/${reviewId}`)
            .then((res) => setComments(res.data.comments))
            .catch((err) => {
                if (err.response?.status === 404) {
                    alert("로그인이 필요합니다.");
                } else {
                    console.error(err);
                }
            });
    };

    //좋아요
    const handleLike = async () => {
        try {
            if (review.user_disliked) {
                await axios.post(`/api/reviews/${reviewId}/reaction`, { is_like: false });
            }

            await axios.post(`/api/reviews/${reviewId}/reaction`, { is_like: true });

            const res = await axios.get(`/api/reviews/${reviewId}?t=${Date.now()}`);
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

    //싫어요
    const handleDislike = async () => {
        try {
            if (review.user_liked) {
                await axios.post(`/api/reviews/${reviewId}/reaction`, { is_like: true });
            }

            await axios.post(`/api/reviews/${reviewId}/reaction`, { is_like: false });

            const res = await axios.get(`/api/reviews/${reviewId}?t=${Date.now()}`);
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

                <ReviewCommentList comments={comments} />

                <ReviewCommentWriteBox
                    reviewId={review.review_id}
                    onSubmit={handleCommentSubmit}
                />
            </section>
        </div>
    );
}
