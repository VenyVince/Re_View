// src/pages/reviewDetail/components/ReviewCommentWriteBox.jsx
import React, { useState } from "react";
import "./ReviewCommentWriteBox.css";

export default function ReviewCommentWriteBox({ reviewId }) {
    const [text, setText] = useState("");

    const handleSubmit = () => {
        if (!text.trim()) return;
        alert("댓글 등록 API 연결 예정");
        setText("");
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
