// src/pages/mypage/user/UserCustomerPage.jsx
import React, { useState } from "react";
import UserMyPageLayout from "./UserMyPageLayout";
import "./UserCustomerPage.css";
import { inquiryDummy, faqDummy } from "./dummy/customerDummy";

export default function UserCustomerPage() {
    const [inquiries] = useState(inquiryDummy);
    const [faqs] = useState(faqDummy);
    const [openFaqId, setOpenFaqId] = useState(null);
    const [openInquiryId, setOpenInquiryId] = useState(null);

    const handleClickNewInquiry = () => {
        // TODO: 실제 문의 작성 페이지로 이동 or 모달
        alert("문의 작성 페이지는 추후 백엔드 연동 시 구현 예정입니다.");
    };

    const toggleFaq = (id) => {
        setOpenFaqId((prev) => (prev === id ? null : id));
    };

    const toggleInquiry = (id) => {
        setOpenInquiryId((prev) => (prev === id ? null : id));
    };

    const renderStatusBadge = (status) => {
        if (status === "답변완료") {
            return <span className="cs-status cs-status-done">답변완료</span>;
        }
        if (status === "처리중") {
            return <span className="cs-status cs-status-ing">처리중</span>;
        }
        return <span className="cs-status">{status}</span>;
    };

    return (
        <UserMyPageLayout>
            <section className="mypage-section cs-section">
                <h3 className="mypage-section-title">고객센터</h3>

                {/* 1:1 문의 내역 카드 */}
                <div className="cs-card">
                    <div className="cs-card-header">
                        <div>
                            <h4 className="cs-card-title">1:1 문의 내역</h4>
                            <p className="cs-card-sub">
                                최근 3개월 이내에 남기신 문의 내역입니다.
                            </p>
                        </div>
                        <button
                            type="button"
                            className="cs-primary-btn"
                            onClick={handleClickNewInquiry}
                        >
                            1:1 문의하기
                        </button>
                    </div>

                    {inquiries.length === 0 ? (
                        <div className="cs-empty">
                            아직 남기신 문의가 없습니다. 궁금한 점이 있다면 언제든지 문의해 주세요.
                        </div>
                    ) : (
                        <div className="cs-table">
                            <div className="cs-table-head">
                                <span className="cs-col cs-col-category">구분</span>
                                <span className="cs-col cs-col-title">제목</span>
                                <span className="cs-col cs-col-date">작성일</span>
                                <span className="cs-col cs-col-status">상태</span>
                            </div>
                            <div className="cs-table-body">
                                {inquiries.map((item) => (
                                    <React.Fragment key={item.id}>
                                        {/* 한 줄 요약 영역 (클릭 가능) */}
                                        <button
                                            type="button"
                                            className="cs-table-row cs-table-row-button"
                                            onClick={() => toggleInquiry(item.id)}
                                        >
                                            <span className="cs-col cs-col-category">
                                                {item.category}
                                            </span>
                                            <span className="cs-col cs-col-title">
                                                {item.title}
                                            </span>
                                            <span className="cs-col cs-col-date">
                                                {item.created_at}
                                            </span>
                                            <span className="cs-col cs-col-status">
                                                {renderStatusBadge(item.status)}
                                            </span>
                                        </button>

                                        {/* 상세 내용 + 답변 영역 */}
                                        {openInquiryId === item.id && (
                                            <div className="cs-inquiry-detail">
                                                {/* 상품 정보 (product_id, product_name 등) */}
                                                {item.product_id && (
                                                    <div className="cs-inquiry-product">
                                                        <span className="cs-inquiry-label">상품</span>
                                                        <span className="cs-inquiry-product-text">
                                                            {item.product_name || `상품 ID: ${item.product_id}`}
                                                        </span>
                                                    </div>
                                                )}

                                                {/* 문의 내용 */}
                                                {item.content && (
                                                    <div className="cs-inquiry-block">
                                                        <div className="cs-inquiry-label">문의 내용</div>
                                                        <div className="cs-inquiry-text">
                                                            {item.content}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* 답변 내용 */}
                                                <div className="cs-inquiry-block">
                                                    <div className="cs-inquiry-label">답변</div>
                                                    <div className="cs-inquiry-text cs-inquiry-answer">
                                                        {item.status === "답변완료" && item.answer
                                                            ? item.answer
                                                            : "담당자가 확인 중입니다. 답변 등록 후 다시 확인해 주세요."}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* FAQ 카드 */}
                <div className="cs-card">
                    <div className="cs-card-header">
                        <div>
                            <h4 className="cs-card-title">자주 묻는 질문</h4>
                            <p className="cs-card-sub">
                                자주 문의되는 내용을 모아두었어요. 빠르게 확인해 보세요.
                            </p>
                        </div>
                    </div>

                    <div className="cs-faq-list">
                        {faqs.map((faq) => (
                            <div key={faq.id} className="cs-faq-item">
                                <button
                                    type="button"
                                    className="cs-faq-question"
                                    onClick={() => toggleFaq(faq.id)}
                                >
                                    <span className="cs-faq-category">{faq.category}</span>
                                    <span className="cs-faq-text">{faq.question}</span>
                                    <span
                                        className={`cs-faq-toggle ${
                                            openFaqId === faq.id ? "open" : ""
                                        }`}
                                    >
                    {openFaqId === faq.id ? "−" : "+"}
                  </span>
                                </button>
                                {openFaqId === faq.id && (
                                    <div className="cs-faq-answer">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </UserMyPageLayout>
    );
}