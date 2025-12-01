// src/pages/productDetail/components/QnaSection.jsx
import React, { useState } from "react";
import "./QnaSection.css";

export default function QnaSection({ qnaList, onWrite }) {
    const [openId, setOpenId] = useState(null);

    // 입력 상태
    const [writeTitle, setWriteTitle] = useState("");
    const [writeContent, setWriteContent] = useState("");

    const toggleOpen = (id) => {
        setOpenId(openId === id ? null : id);
    };

    const handleSubmit = () => {
        if (!writeTitle.trim() || !writeContent.trim()) {
            alert("제목과 내용을 모두 입력해주세요.");
            return;
        }

        onWrite({
            title: writeTitle,
            content: writeContent
        });

        setWriteTitle("");
        setWriteContent("");
    };

    return (
        <div className="pd-qna-wrapper">

            {/* 작성 영역: 제목 + 등록 */}
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

            {/* 작성 영역: 내용 */}
            <div className="pd-qna-write-row">
                <textarea
                    className="pd-qna-content-input"
                    placeholder="내용을 입력하세요"
                    value={writeContent}
                    onChange={(e) => setWriteContent(e.target.value)}
                />
            </div>

            {/* QnA 헤더 */}
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

                                {/* 제목 + 내용 */}
                                <div className="pd-qna-content-block">
                                    <div className="pd-qna-content-title"><strong>제목:</strong> {q.title}</div>
                                    <div className="pd-qna-content-text"><strong>내용:</strong> {q.content}</div>
                                </div>

                                {/* 답변 */}
                                {q.answer ? (
                                    <div className="pd-qna-answer has-answer">
                                        <strong>답변:</strong> {q.answer}
                                    </div>
                                ) : (
                                    <div className="pd-qna-answer no-answer">
                                        답변 준비 중입니다
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
