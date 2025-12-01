// src/pages/reviewDetail/ReviewDetailPage.jsx
import React, { useState } from "react";
import "./ReviewDetailPage.css";

import ReviewDetailHeader from "./components/ReviewDetailHeader";
import ReviewDetailContent from "./components/ReviewDetailContent";
import ReviewCommentList from "./components/ReviewCommentList";
import ReviewCommentWriteBox from "./components/ReviewCommentWriteBox";

export default function ReviewDetailPage() {
    // 더미 데이터 (데이터 키/형식 변경 없음)
    const [review] = useState({
        review_id: 1,
        product_id: 10,
        nickname: "스킨케어러버",
        baumann_type: "DSPT",
        rating: 5,
        content:
            "정말 좋아요! 피부가 촉촉하고 편안해졌어요. 사용감이 너무 좋고 재구매 의사 있습니다.",
        images: ["https://picsum.photos/200/200?1", "https://picsum.photos/200/200?2"],
        created_at: "2025-02-05",
        like_count: 12,
        dislike_count: 1,
        prd_brand: "바이오더마",
        prd_name: "하이드라비오 토너",
        product_image: "https://picsum.photos/200/200?3",
        price: 38000,
        category: "스킨/토너",
    });

    const [comments] = useState([
        { comment_id: 1, nickname: "민감피부",baumann_type: "DSPT", content: "리뷰 덕분에 도움 됐어요!", created_at: "2025-02-06" },
        { comment_id: 2, nickname: "글로우러버",baumann_type: "OSPW", content: "좋은 리뷰 감사합니다 :)", created_at: "2025-02-07" },
    ]);

    return (
        <div className="rd-wrap">
            {/* 상단 제품 요약 + 리뷰 본문을 하나의 메인 박스로 */}
            <section className="rd-main">
                <ReviewDetailHeader review={review} />
                <ReviewDetailContent review={review} />
            </section>

            {/* 댓글 영역 */}
            <section className="rd-comments-box">
                <div className="rd-comments-header">
                    <h3>댓글</h3>
                    <span className="rd-comments-count">{comments.length}</span>
                </div>
                <ReviewCommentList comments={comments} />
                <ReviewCommentWriteBox reviewId={review.review_id} />
            </section>
        </div>
    );
}
