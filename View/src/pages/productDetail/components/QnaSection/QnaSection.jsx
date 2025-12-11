// src/pages/productDetail/components/QnaSection.jsx
import React, { useState, useEffect } from "react";
import "./QnaSection.css";

export default function QnaSection({ productId }) {
    const [openId, setOpenId] = useState(null);

    // QnA 목록 상태
    const [qnaList, setQnaList] = useState([]);

    // 작성 상태
    const [writeTitle, setWriteTitle] = useState("");
    const [writeContent, setWriteContent] = useState("");

    // ===============================
    // QnA 목록 API 호출
    // ===============================
    useEffect(() => {
        const fetchQna = async () => {
            try {
                const response = await fetch(`/api/qna/list/${productId}`);
                const data = await response.json();

                // UI에서 필요한 값에 맞춰 기본 구조 유지
                const mapped = data.map((q) => ({
                    qna_id: q.qna_id,
                    title: q.title,
                    content: q.content || "(내용 없음)",
                    user_nickname: q.user_nickname || "익명",
                    created_at: q.created_at || "",
                    answer: q.answer || null
                }));

                setQnaList(mapped);
            } catch (err) {
                console.error("QnA 조회 오류:", err);
            }
        };

        fetchQna();
    }, [productId]);

    const toggleOpen = (id) => {
        setOpenId(openId === id ? null : id);
    };

    // ===============================
    // QnA 등록 (등록 API 없으므로 프론트 시뮬레이션 유지)
    // ===============================
    const handleSubmit = () => {
        if (!writeTitle.trim() || !writeContent.trim()) {
            alert("제목과 내용을 모두 입력해주세요.");
            return;
        }

        const today = new Date().toISOString();

        // 기존 UI 동작 유지 (임시 등록)
        const newQna = {
            qna_id: qnaList.length + 1,
            title: writeTitle,
            content: writeContent,
            user_nickname: "user99",
            created_at: today,
            answer: null
        };

        setQnaList([newQna, ...qnaList]);

        setWriteTitle("");
        setWriteContent("");
    };

    return (
        <div className="pd-qna-wrapper">

            {/* 제목 입력 + 등록 */}
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

            {/* 내용 입력 */}
            <div className="pd-qna-write-row">
                <textarea
                    className="pd-qna-content-input"
                    placeholder="내용을 입력하세요"
                    value={writeContent}
                    onChange={(e) => setWriteContent(e.target.value)}
                />
            </div>

            {/* QnA 목록 헤더 */}
            <div className="pd-qna-header-row">
                <span className="col-title">문의 내역</span>
                <span className="col-writer">닉네임</span>
                <span className="col-date">날짜</span>
            </div>

            {/* QnA 리스트 */}
            <ul className="pd-qna-list">
                {qnaList.length === 0 && (
                    <li className="pd-qna-empty">등록된 Q&A가 없습니다.</li>
                )}

                {qnaList.map((q) => (
                    <li key={q.qna_id} className="pd-qna-item">

                        {/* 제목 라인 */}
                        <div
                            className="pd-qna-title-area"
                            onClick={() => toggleOpen(q.qna_id)}
                        >
                            <span className="pd-qna-title">{q.title}</span>
                            <span className="pd-qna-writer-inline">{q.user_nickname}</span>
                            <span className="pd-qna-date">{q.created_at?.slice(0, 10)}</span>
                        </div>

                        {/* 펼침 영역 */}
                        {openId === q.qna_id && (
                            <div className="pd-qna-content-area">

                                {/* 제목 + 내용 */}
                                <div className="pd-qna-content-block">
                                    <div className="pd-qna-content-title">
                                        <strong>제목:</strong> {q.title}
                                    </div>
                                    <div className="pd-qna-content-text">
                                        <strong>내용:</strong> {q.content}
                                    </div>
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
