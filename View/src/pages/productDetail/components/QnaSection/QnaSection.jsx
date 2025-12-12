import React, { useState, useEffect } from "react";
import "./QnaSection.css";

import axiosClient from "../../../../api/axiosClient";

export default function QnaSection({ productId }) {
    const [openId, setOpenId] = useState(null);
    const [qnaList, setQnaList] = useState([]);

    const [writeTitle, setWriteTitle] = useState("");
    const [writeContent, setWriteContent] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // 로그인 여부 확인
    useEffect(() => {
        const checkLogin = async () => {
            try {
                await axiosClient.get("/api/auth/me");
                setIsLoggedIn(true);
            } catch {
                setIsLoggedIn(false);
            }
        };
        checkLogin();
    }, []);

    // QnA 목록 조회
    useEffect(() => {
        const fetchQna = async () => {
            try {
                const res = await axiosClient.get(`/api/qna/list/${productId}`);

                const mapped = res.data.map((q) => ({
                    qna_id: q.qna_id,
                    title: q.title,
                    content: q.content || "(내용 없음)",
                    user_nickname: q.user_nickname || "익명",
                    created_at: q.created_at || "",
                    answer: q.answer || null,
                }));

                setQnaList(mapped);
            } catch (err) {
                console.error("QnA 조회 오류:", err);
            }
        };

        if (productId) fetchQna();
    }, [productId]);

    // QnA 펼침 토글
    const toggleOpen = (id) => {
        setOpenId(openId === id ? null : id);
    };

    // QnA 등록 (프론트 시뮬레이션)
    const handleSubmit = () => {
        if (!isLoggedIn) {
            alert("로그인이 필요합니다.");
            return;
        }

        if (!writeTitle.trim() || !writeContent.trim()) {
            alert("제목과 내용을 모두 입력해주세요.");
            return;
        }

        const today = new Date().toISOString();

        const newQna = {
            qna_id: qnaList.length + 1,
            title: writeTitle,
            content: writeContent,
            user_nickname: "user99",
            created_at: today,
            answer: null,
        };

        setQnaList([newQna, ...qnaList]);
        setWriteTitle("");
        setWriteContent("");
    };

    return (
        <div className="pd-qna-wrapper">

            {/* QnA 작성 */}
            <div className="pd-qna-write-row">
                <input
                    type="text"
                    className="pd-qna-title-input"
                    placeholder="제목을 입력하세요"
                    value={writeTitle}
                    onChange={(e) => setWriteTitle(e.target.value)}
                />

                <button
                    className="pd-qna-write-submit"
                    onClick={handleSubmit}
                >
                    등록
                </button>
            </div>

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

            {/* QnA 리스트 */}
            <ul className="pd-qna-list">
                {qnaList.length === 0 && (
                    <li className="pd-qna-empty">
                        등록된 Q&A가 없습니다.
                    </li>
                )}

                {qnaList.map((q) => (
                    <li key={q.qna_id} className="pd-qna-item">

                        <div
                            className="pd-qna-title-area"
                            onClick={() => toggleOpen(q.qna_id)}
                        >
                            <span className="pd-qna-title">{q.title}</span>
                            <span className="pd-qna-writer-inline">
                                {q.user_nickname}
                            </span>
                            <span className="pd-qna-date">
                                {q.created_at?.slice(0, 10)}
                            </span>
                        </div>

                        {openId === q.qna_id && (
                            <div className="pd-qna-content-area">
                                <div className="pd-qna-content-block">
                                    <div className="pd-qna-content-title">
                                        <strong>제목:</strong> {q.title}
                                    </div>
                                    <div className="pd-qna-content-text">
                                        <strong>내용:</strong> {q.content}
                                    </div>
                                </div>

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
