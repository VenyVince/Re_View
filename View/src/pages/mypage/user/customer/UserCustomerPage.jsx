// src/pages/mypage/user/UserCustomerPage.jsx
import React, { useEffect, useState } from "react";
import UserMyPageLayout from "../layout/UserMyPageLayout";
import "./UserCustomerPage.css";
import axios from "axios";
import { faqDummy } from "../dummy/customerDummy"; // FAQ 는 더미 그대로 사용

export default function UserCustomerPage() {
    // 1:1 문의 리스트 (/api/qna/my)
    const [inquiries, setInquiries] = useState([]);
    const [qnaLoading, setQnaLoading] = useState(false);
    const [qnaError, setQnaError] = useState(null);

    // 선택된 문의 id
    const [openQnaId, setOpenQnaId] = useState(null);

    // 문의 상세 캐시 (/api/qna/{qna_id})
    const [qnaDetails, setQnaDetails] = useState({});
    const [detailLoadingId, setDetailLoadingId] = useState(null);
    const [detailErrorId, setDetailErrorId] = useState(null);

    // FAQ
    const [faqs] = useState(faqDummy);
    const [openFaqId, setOpenFaqId] = useState(null);

    // 날짜 포맷 (2025. 11. 22.)
    const formatDate = (iso) => {
        if (!iso) return "-";
        try {
            const d = new Date(iso);
            const y = d.getFullYear();
            const m = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            return `${y}. ${m}. ${day}.`;
        } catch (e) {
            return iso;
        }
    };

    // 상태 뱃지
    const renderStatusBadge = (status) => {
        if (status === "답변완료") {
            return <span className="cs-status cs-status-done">답변완료</span>;
        }
        if (status === "답변대기" || status === "처리중") {
            return <span className="cs-status cs-status-ing">답변대기</span>;
        }
        return <span className="cs-status">{status}</span>;
    };

    // 1:1 문의 리스트 불러오기
    useEffect(() => {
        const fetchQnaList = async () => {
            setQnaLoading(true);
            setQnaError(null);
            try {
                const res = await axios.get("/api/qna/my", {
                    withCredentials: true,
                });
                // 스키마: [{ qna_id, prd_name, title, created_at, status }]
                setInquiries(res.data || []);
            } catch (err) {
                console.error("❌ /api/qna/my 조회 실패:", err);
                setQnaError("문의 내역을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.");
            } finally {
                setQnaLoading(false);
            }
        };

        fetchQnaList();
    }, []);

    // 특정 qna_id 상세 조회
    const fetchQnaDetail = async (qnaId) => {
        setDetailLoadingId(qnaId);
        setDetailErrorId(null);
        try {
            const res = await axios.get(`/api/qna/${qnaId}`, {
                withCredentials: true,
            });
            // 스키마: { qna_id, title, content, answer, ... }
            setQnaDetails((prev) => ({
                ...prev,
                [qnaId]: res.data,
            }));
        } catch (err) {
            console.error(`❌ /api/qna/${qnaId} 조회 실패:`, err);
            setDetailErrorId(qnaId);
        } finally {
            setDetailLoadingId(null);
        }
    };

    // 리스트 행 클릭
    const handleRowClick = (qnaId) => {
        // 이미 열려 있으면 닫기
        if (openQnaId === qnaId) {
            setOpenQnaId(null);
            return;
        }

        setOpenQnaId(qnaId);

        // 상세 정보 없으면 서버 호출
        if (!qnaDetails[qnaId]) {
            fetchQnaDetail(qnaId);
        }
    };

    // 문의 작성 버튼 (아직 더미)
    const handleClickNewInquiry = () => {
        alert("문의 작성 페이지는 추후 백엔드 연동 시 구현 예정입니다.");
    };

    // FAQ 토글
    const toggleFaq = (id) => {
        setOpenFaqId((prev) => (prev === id ? null : id));
    };

    // 상세 영역 UI
    const renderDetailRow = (item) => {
        const detail = qnaDetails[item.qna_id];
        const isLoading = detailLoadingId === item.qna_id;
        const isError = detailErrorId === item.qna_id;

        return (
            <div className="cs-detail-row">
                <div className="cs-detail-inner">
                    {isLoading && (
                        <div className="cs-detail-loading">
                            문의 내용을 불러오는 중입니다…
                        </div>
                    )}

                    {isError && (
                        <div className="cs-detail-error">
                            문의 상세 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
                        </div>
                    )}

                    {!isLoading && !isError && (
                        <>
                            <div className="cs-detail-block">
                                <div className="cs-detail-label">문의 내용</div>
                                <p className="cs-detail-text">
                                    {detail?.content ||
                                        "등록된 문의 내용이 없습니다."}
                                </p>
                            </div>

                            <div className="cs-detail-block">
                                <div className="cs-detail-label">답변 내용</div>
                                <p className="cs-detail-text">
                                    {detail?.answer
                                        ? detail.answer
                                        : "아직 담당자가 답변을 등록하지 않았습니다. 최대한 빠르게 확인 후 답변드리겠습니다."}
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    };

    return (
        <UserMyPageLayout>
            <section className="mypage-section cs-section">

                {/* 1:1 문의 내역 리스트 */}
                <div className="cs-qna-card">
                    <div className="cs-qna-header">
                        <div>
                            <h4 className="cs-card-title">1:1 문의 내역</h4>
                            <p className="cs-card-sub">
                                최근 3개월 이내에 남기신 문의 내역입니다. 상품 관련
                                궁금하신 점이 있다면 언제든지 문의해 주세요.
                            </p>
                        </div>
                    </div>

                    {qnaLoading ? (
                        <div className="cs-list-message">문의 내역을 불러오는 중입니다…</div>
                    ) : qnaError ? (
                        <div className="cs-list-message cs-list-error">{qnaError}</div>
                    ) : inquiries.length === 0 ? (
                        <div className="cs-list-message">
                            아직 남기신 문의가 없습니다. 첫 문의를 남겨보세요!
                        </div>
                    ) : (
                        <div className="cs-table">
                            <div className="cs-table-head">
                                <span className="cs-col cs-col-product">상품명</span>
                                <span className="cs-col cs-col-title">문의 제목</span>
                                <span className="cs-col cs-col-date">작성일</span>
                                <span className="cs-col cs-col-status">상태</span>
                            </div>
                            <div className="cs-table-body">
                                {inquiries.map((item) => (
                                    <React.Fragment key={item.qna_id}>
                                        {/* 리스트 행 */}
                                        <div
                                            className={`cs-table-row ${
                                                openQnaId === item.qna_id
                                                    ? "cs-table-row-open"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleRowClick(item.qna_id)
                                            }
                                        >
                                            <span className="cs-col cs-col-product">
                                                {item.prd_name}
                                            </span>
                                            <span className="cs-col cs-col-title">
                                                {item.title}
                                            </span>
                                            <span className="cs-col cs-col-date">
                                                {formatDate(item.created_at)}
                                            </span>
                                            <span className="cs-col cs-col-status">
                                                {renderStatusBadge(item.status)}
                                            </span>
                                        </div>

                                        {/* 상세 영역 – 선택된 행 바로 아래 */}
                                        {openQnaId === item.qna_id &&
                                            renderDetailRow(item)}
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* FAQ 카드 (기존 구조 유지, 약간의 스타일만 공통 CSS에서 조정) */}
                <div className="cs-faq-card">
                    <div className="cs-faq-header">
                        <div>
                            <h4 className="cs-card-title">자주 묻는 질문</h4>
                            <p className="cs-card-sub">
                                자주 문의되는 내용을 모아두었어요. 궁금한 점을 빠르게
                                확인해 보세요.
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
                                    <span className="cs-faq-category">
                                        {faq.category}
                                    </span>
                                    <span className="cs-faq-text">
                                        {faq.question}
                                    </span>
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