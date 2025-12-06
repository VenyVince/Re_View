// src/pages/reviewDetail/components/ReviewCommentList.jsx
import React from "react";
import "./ReviewCommentList.css";

export default function ReviewCommentList({
                                              comments,
                                              currentUserNickname,
                                              onDelete
                                          }) {
    if (!Array.isArray(comments) || comments.length === 0) {
        return <div className="rd-no-comment">아직 댓글이 없습니다.</div>;
    }

    return (
        <ul className="rd-comment-list">
            {comments.map((c) => (
                <li key={c.comment_id} className="rd-comment-item">

                    <div className="rd-comment-row">
                        <div className="rd-comment-left">
                            <span className="rd-comment-user">{c.nickname}</span>

                            {c.baumann_type && (
                                <span className="rd-comment-baumann">{c.baumann_type}</span>
                            )}
                        </div>

                        <div className="rd-comment-right">
                            <span className="rd-comment-date">{c.created_at}</span>

                            {/* 🔥 본인 댓글만 삭제 가능 */}
                            {c.nickname === currentUserNickname && (
                                <button
                                    className="rd-comment-delete-btn"
                                    onClick={() => onDelete(c.comment_id)}
                                >
                                    삭제
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="rd-comment-text">{c.content}</div>
                </li>
            ))}
        </ul>
    );
}
