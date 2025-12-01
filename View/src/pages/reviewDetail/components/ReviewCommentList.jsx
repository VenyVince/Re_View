// src/pages/reviewDetail/components/ReviewCommentList.jsx
import React from "react";
import "./ReviewCommentList.css";

export default function ReviewCommentList({ comments }) {
    if (!Array.isArray(comments) || comments.length === 0) {
        return <div className="rd-no-comment">아직 댓글이 없습니다.</div>;
    }

    return (
        <ul className="rd-comment-list">
            {comments.map((c) => (
                <li key={c.comment_id} className="rd-comment-item">

                    {/* 상단: 닉네임 + 바우만타입 + 날짜 */}
                    <div className="rd-comment-top">
                        <div className="rd-comment-left">
                            <span className="rd-comment-user">{c.nickname}</span>

                            {/* 🔥 바우만 타입 추가 */}
                            {c.baumann_type && (
                                <span className="rd-comment-baumann">
                                    {c.baumann_type}
                                </span>
                            )}
                        </div>

                        <span className="rd-comment-date">{c.created_at}</span>
                    </div>

                    {/* 본문 */}
                    <div className="rd-comment-text">{c.content}</div>

                </li>
            ))}
        </ul>
    );
}
