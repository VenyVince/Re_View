// src/pages/productDetail/components/QnaSection.jsx
import React, { useState } from "react";
import "./QnaSection.css";

export default function QnaSection({ qnaList, onWrite }) {
    const [openId, setOpenId] = useState(null);
    const [writeTitle, setWriteTitle] = useState("");

    const toggleOpen = (id) => {
        setOpenId(openId === id ? null : id);
    };

    const handleSubmit = () => {
        if (!writeTitle.trim()) {
            alert("제목을 입력해주세요.");
            return;
        }

        const newQna = {
            title: writeTitle
        };

        onWrite(newQna);
        setWriteTitle("");
    };

    return (
        <div className="pd-qna-wrapper">

            {/* 작성 영역 */}
            <div className="pd-qna-write-row">
                <input
                    type="text"
                    className="pd-qna-title-input"
                    placeholder="제목을 입력하세요"
                    value={writeTitle}
                    onChange={(e) => setWriteTitle(e.target.value)}
                />
                <button className="pd-qna-write-submit" onClick={handleSubmit}>
                    등록
                </button>
            </div>

            {/* 헤더 */}
            <div className="pd-qna-header-row">
                <span className="col-title">문의 내역</span>
                <span className="col-writer">닉네임</span>
                <span className="col-date">날짜</span>
            </div>

            {/* 리스트 */}
            <ul className="pd-qna-list">
                {qnaList.length === 0 && (
                    <li className="pd-qna-empty">등록된 Q&A가 없습니다.</li>
                )}

                {qnaList.map((q) => (
                    <li key={q.qna_id} className="pd-qna-item">
                        <div
                            className="pd-qna-title-area"
                            onClick={() => toggleOpen(q.qna_id)}
                        >
                            <span className="pd-qna-title">{q.title}</span>
                            <span className="pd-qna-writer-inline">{q.user_nickname}</span>
                            <span className="pd-qna-date">{q.created_at.slice(0, 10)}</span>
                        </div>

                        {openId === q.qna_id && (
                            <div className="pd-qna-content-area">
                                <p>{q.title}</p>

                                {q.answer && (
                                    <div className="pd-qna-answer">
                                        <strong>답변:</strong> {q.answer}
                                    </div>
                                )}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
