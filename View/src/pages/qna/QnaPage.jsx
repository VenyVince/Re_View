import React, { useState } from "react";
import "./QnaPage.css";

export default function QnaPage() {
    const today = new Date().toISOString().slice(0, 10);

    const [qnaList, setQnaList] = useState([
        {
            id: 1,
            category: "배송",
            title: "배송은 얼마나 걸리나요?",
            content: "제품 배송은 평균 어느 정도 걸리나요?",
            answer: "보통 5~7일 정도 소요됩니다.",
            writer: "관리자",
            date: today,
            open: false,
        },
        {
            id: 2,
            category: "상품",
            title: "제품에 하자가 있으면 교환 가능한가요?",
            content: "사용 전에 문제가 발견되면 교환이 가능한가요?",
            answer: "네, 상품 수령 후 7일 이내에는 무상 교환 가능합니다.",
            writer: "관리자",
            date: today,
            open: false,
        },
        {
            id: 3,
            category: "입고",
            title: "품절된 제품은 언제 다시 입고되나요?",
            content: "인기 상품 재입고 일정이 궁금합니다.",
            answer: "정확한 일정은 없으나 보통 1~2주 내 재입고됩니다.",
            writer: "관리자",
            date: today,
            open: false,
        },
        {
            id: 4,
            category: "기타",
            title: "회원 탈퇴 후 정보는 어떻게 되나요?",
            content: "탈퇴하면 개인정보는 모두 삭제되나요?",
            answer: "관련 법령에 따라 일정 기간 보관 후 안전하게 삭제됩니다.",
            writer: "관리자",
            date: today,
            open: false,
        },
    ]);

    const [writeCategory, setWriteCategory] = useState("배송");
    const [writeTitle, setWriteTitle] = useState("");
    const [writeContent, setWriteContent] = useState("");

    const toggleOpen = (id) => {
        setQnaList((prev) =>
            prev.map((q) => (q.id === id ? { ...q, open: !q.open } : q))
        );
    };

    const handleSubmit = () => {
        if (!writeCategory || !writeTitle.trim() || !writeContent.trim()) {
            alert("카테고리, 제목, 내용을 모두 입력해주세요.");
            return;
        }

        const newQna = {
            id: qnaList.length + 1,
            category: writeCategory,
            title: writeTitle,
            content: writeContent,
            writer: "user99",
            date: today,
            answer: "",
            open: false,
        };

        setQnaList([newQna, ...qnaList]);
        setWriteCategory("배송");
        setWriteTitle("");
        setWriteContent("");
    };

    return (
        <div className="qna-page">
            <div className="qna-top">
                <h1>Q&A</h1>
            </div>

            <div className="qna-container">

                <div className="qna-header-row">
                    <span className="col-category">카테고리</span>
                    <span className="col-title">문의 내역</span>
                    <span className="col-writer">닉네임</span>
                    <span className="col-date">날짜</span>
                </div>

                <ul className="qna-list">
                    {qnaList.map((q) => (
                        <li key={q.id} className="qna-item">
                            <div
                                className="qna-title-area"
                                onClick={() => toggleOpen(q.id)}
                            >
                                <span className="qna-category-pill">{q.category}</span>
                                <span className="qna-title">{q.title}</span>
                                <span className="qna-writer-inline">{q.writer}</span>
                                <span className="qna-date">{q.date}</span>
                            </div>

                            {q.open && (
                                <div className="qna-content-area">
                                    <p>{q.content}</p>

                                    {q.answer && (
                                        <div className="qna-answer">
                                            <strong>답변:</strong> {q.answer}
                                        </div>
                                    )}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>

                <div className="qna-write-row">
                    <select
                        className="qna-write-category"
                        value={writeCategory}
                        onChange={(e) => setWriteCategory(e.target.value)}
                    >
                        <option value="배송">배송</option>
                        <option value="입고">입고</option>
                        <option value="상품">상품</option>
                        <option value="기타">기타</option>
                    </select>

                    <input
                        className="qna-write-title-input"
                        type="text"
                        placeholder="제목을 입력하세요"
                        value={writeTitle}
                        onChange={(e) => setWriteTitle(e.target.value)}
                    />

                    <button className="qna-write-submit" onClick={handleSubmit}>
                        등록
                    </button>
                </div>

                <textarea
                    className="qna-write-content-full"
                    placeholder="내용을 입력하세요"
                    value={writeContent}
                    onChange={(e) => setWriteContent(e.target.value)}
                />
            </div>
        </div>
    );
}
