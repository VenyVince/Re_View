// src/pages/reviewDetail/components/ReviewCommentList.jsx
import React from "react";
import axiosClient from "api/axiosClient";
import "./ReviewCommentList.css";

export default function ReviewCommentList({
                                              comments,
                                              currentUserNickname,
                                              onDelete   // 👉 삭제 후 재조회용 콜백만 사용
                                          }) {
    if (!Array.isArray(comments) || comments.length === 0) {
        return <div className="rd-no-comment">아직 댓글이 없습니다.</div>;
    }

    // ⭐ 댓글 삭제 처리
    const handleDeleteClick = async (commentId) => {
        if (!window.confirm("댓글을 삭제하시겠습니까?")) return;

        try {
            await axiosClient.delete(
                `/api/reviews/comments/${commentId}`
            );

            // 삭제 성공 후 부모에게 알림 (재조회)
            onDelete?.();

        } catch (err) {
            if (err.response?.status === 401) {
                alert("로그인이 필요합니다.");
            } else if (err.response?.status === 403) {
                alert("본인 댓글만 삭제할 수 있습니다.");
            } else {
                console.error("댓글 삭제 오류:", err);
                alert("댓글 삭제 중 오류가 발생했습니다.");
            }
        }
    };

    return (
        <ul className="rd-comment-list">
            {comments.map((c) => {
                const isAuthor =
                    c.nickname === currentUserNickname;

                return (
                    <li key={c.comment_id} className="rd-comment-item">
                        <div className="rd-comment-row">
                            <div className="rd-comment-left">
                                <span className="rd-comment-user">
                                    {c.nickname}
                                </span>

                                {c.baumann_type && (
                                    <span className="rd-comment-baumann">
                                        {c.baumann_type}
                                    </span>
                                )}
                            </div>

                            <div className="rd-comment-right">
                                <span className="rd-comment-date">
                                    {c.created_at}
                                </span>

                                {/* 🔥 본인 댓글만 삭제 가능 */}
                                {isAuthor && (
                                    <button
                                        className="rd-comment-delete-btn"
                                        onClick={() =>
                                            handleDeleteClick(c.comment_id)
                                        }
                                    >
                                        삭제
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="rd-comment-text">
                            {c.content}
                        </div>
                    </li>
                );
            })}
        </ul>
    );
}
