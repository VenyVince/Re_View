// src/pages/reviewDetail/components/ReviewCommentWriteBox.jsx
import React, { useState } from "react";
import axios from "axios";
import "./ReviewCommentWriteBox.css";

export default function ReviewCommentWriteBox({ reviewId, onSubmit }) {
    const [text, setText] = useState("");

    const handleSubmit = () => {
        if (!text.trim()) return;

        axios
            .post(`/api/reviews/${reviewId}/comments`, {
                content: text
            })
            .then(() => {
                setText("");      // 입력창 초기화
                if (onSubmit) onSubmit(); // 부모에게 콜백 보내기 (댓글 다시 불러오기)
            })
            .catch((err) => console.error(err));
    };

    return (
        <div className="rd-comment-write">
            <input
                type="text"
                className="rd-comment-input"
                placeholder="댓글을 입력하세요..."
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button className="rd-comment-btn" onClick={handleSubmit}>
                등록
            </button>
        </div>
    );
}
