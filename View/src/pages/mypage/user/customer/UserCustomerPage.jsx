// src/pages/mypage/user/UserCustomerPage.jsx
import React, { useEffect, useState } from "react";
import UserMyPageLayout from "../layout/UserMyPageLayout";
import "./UserCustomerPage.css";
import axiosClient from "../../../../api/axiosClient";
import { faqDummy } from "../dummy/customerDummy"; // FAQ 는 더미 그대로 사용

export default function UserCustomerPage() {
    // 1:1 문의 리스트 (/api/qna/my)
    const [inquiries, setInquiries] = useState([]);
    const [qnaLoading, setQnaLoading] = useState(false);
    const [qnaError, setQnaError] = useState(null);

    // 선택된 문의 id (열린 행)
    const [openQnaId, setOpenQnaId] = useState(null);

    // 문의 상세 캐시 (/api/qna/{qna_id})
    const [qnaDetails, setQnaDetails] = useState({});
    const [detailLoadingId, setDetailLoadingId] = useState(null);
    const [detailErrorId, setDetailErrorId] = useState(null);

    // 수정 모드 상태
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");

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
                const res = await axiosClient.get("/api/qna/my");
                // 스키마: [{ qna_id, prd_name, title, created_at, status, ... }]
                setInquiries(res.data || []);
            } catch (err) {
                console.error(err);
                setQnaError(
                    "문의 내역을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요."
                );
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
            const res = await axiosClient.get(`/api/qna/${qnaId}`);
            // 스키마: { qna_id, product_id, title, content, answer, ... }
            setQnaDetails((prev) => ({
                ...prev,
                [qnaId]: res.data,
            }));
        } catch (err) {
            console.error(err);
            setDetailErrorId(qnaId);
        } finally {
            setDetailLoadingId(null);
        }
    };

    // 리스트 행 클릭 (열기/닫기)
    const handleRowClick = (qnaId) => {
        // 이미 열려 있으면 닫기
        if (openQnaId === qnaId) {
            setOpenQnaId(null);
            setEditingId(null);
            return;
        }

        setOpenQnaId(qnaId);
        setEditingId(null);

        // 상세 정보 없으면 서버 호출
        if (!qnaDetails[qnaId]) {
            fetchQnaDetail(qnaId);
        }
    };


    // FAQ 토글
    const toggleFaq = (id) => {
        setOpenFaqId((prev) => (prev === id ? null : id));
    };

    // === 수정 모드 관련 핸들러 ===

    const handleStartEdit = (item) => {
        const detail = qnaDetails[item.qna_id];
        setEditingId(item.qna_id);
        setEditTitle(detail?.title ?? item.title ?? "");
        setEditContent(detail?.content ?? "");
        // 상세가 아직 없다면 가져와 두기
        if (!detail) {
            fetchQnaDetail(item.qna_id);
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditTitle("");
        setEditContent("");
    };

    const handleSaveEdit = async () => {
        if (!editingId) return;

        const title = editTitle.trim();
        const content = editContent.trim();

        if (!title) {
            alert("제목을 입력해주세요.");
            return;
        }
        if (!content) {
            alert("내용을 입력해주세요.");
            return;
        }

        // product_id 는 리스트나 상세에서 가져옴
        const target = inquiries.find((q) => q.qna_id === editingId);
        const detail = qnaDetails[editingId];
        const productId = detail?.product_id ?? target?.product_id;

        if (!productId) {
            alert("상품 정보가 없어 수정할 수 없습니다. 관리자에게 문의해주세요.");
            return;
        }

        try {
            // 백엔드 QnaController.updateQna 에 맞춘 호출
            await axiosClient.put(
                "/api/qna",
                {
                    qna_id: editingId,
                    product_id: productId,
                    title,
                    content,
                    // user_id 는 백엔드에서 Security_Util 로 덮어씌움
                },
            );

            // 리스트 갱신
            setInquiries((prev) =>
                prev.map((q) =>
                    q.qna_id === editingId
                        ? { ...q, title, content }
                        : q
                )
            );

            // 상세 캐시 갱신
            setQnaDetails((prev) => ({
                ...prev,
                [editingId]: {
                    ...(prev[editingId] || {}),
                    title,
                    content,
                },
            }));

            alert("문의가 수정되었습니다.");
            handleCancelEdit();
        } catch (e) {
            console.error("문의 수정 오류:", e);
            alert("문의 수정 중 오류가 발생했습니다.");
        }
    };

    const handleDelete = async (item) => {
        if (!item.qna_id) {
            alert("이 문의에는 qna_id 정보가 없어 삭제할 수 없습니다.");
            return;
        }

        if (!window.confirm("해당 문의를 삭제하시겠습니까?")) return;

        try {
            console.log("[QNA] 삭제 요청 시도:", item.qna_id);
            await axiosClient.delete(`/api/qna/${item.qna_id}`);

            console.log("[QNA] 삭제 요청 성공:", item.qna_id);

            setInquiries((prev) =>
                prev.filter((q) => q.qna_id !== item.qna_id)
            );
            setQnaDetails((prev) => {
                const next = { ...prev };
                delete next[item.qna_id];
                return next;
            });

            if (openQnaId === item.qna_id) {
                setOpenQnaId(null);
            }
            if (editingId === item.qna_id) {
                handleCancelEdit();
            }

            alert("문의가 삭제되었습니다.");
        } catch (e) {
            console.error("문의 삭제 오류:", e);
            alert("문의 삭제 중 오류가 발생했습니다.");
        }
    };

    // 상세 영역 UI
    const renderDetailRow = (item) => {
        const detail = qnaDetails[item.qna_id];
        const isLoading = detailLoadingId === item.qna_id;
        const isError = detailErrorId === item.qna_id;
        const isEditing = editingId === item.qna_id;

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
                            문의 상세 정보를 불러오지 못했습니다. 잠시 후 다시
                            시도해 주세요.
                        </div>
                    )}

                    {!isLoading && !isError && (
                        <>
                            {!isEditing ? (
                                <>
                                    <div className="cs-detail-block">
                                        <div className="cs-detail-label">
                                            문의 제목
                                        </div>
                                        <p className="cs-detail-text">
                                            {detail?.title || item.title}
                                        </p>
                                    </div>

                                    <div className="cs-detail-block">
                                        <div className="cs-detail-label">
                                            문의 내용
                                        </div>
                                        <p className="cs-detail-text">
                                            {detail?.content ||
                                                "등록된 문의 내용이 없습니다."}
                                        </p>
                                    </div>

                                    <div className="cs-detail-block">
                                        <div className="cs-detail-label">
                                            답변 내용
                                        </div>
                                        <p className="cs-detail-text">
                                            {detail?.answer
                                                ? detail.answer
                                                : "아직 담당자가 답변을 등록하지 않았습니다. 최대한 빠르게 확인 후 답변드리겠습니다."}
                                        </p>
                                    </div>

                                    <div className="cs-detail-actions">
                                        <button
                                            type="button"
                                            className="cs-detail-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleStartEdit(item);
                                            }}
                                        >
                                            수정
                                        </button>
                                        <button
                                            type="button"
                                            className="cs-detail-btn cs-detail-btn-danger"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(item);
                                            }}
                                        >
                                            삭제
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="cs-detail-edit">
                                    <div className="cs-detail-block">
                                        <div className="cs-detail-label">
                                            제목
                                        </div>
                                        <input
                                            type="text"
                                            className="cs-detail-input"
                                            value={editTitle}
                                            onChange={(e) =>
                                                setEditTitle(e.target.value)
                                            }
                                            placeholder="문의 제목을 입력하세요."
                                        />
                                    </div>

                                    <div className="cs-detail-block">
                                        <div className="cs-detail-label">
                                            문의 내용
                                        </div>
                                        <textarea
                                            className="cs-detail-textarea"
                                            rows={5}
                                            value={editContent}
                                            onChange={(e) =>
                                                setEditContent(e.target.value)
                                            }
                                            placeholder="상품에 대한 궁금한 점을 자세히 작성해주세요."
                                        />
                                    </div>

                                    <div className="cs-detail-actions">
                                        <button
                                            type="button"
                                            className="cs-detail-btn"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCancelEdit();
                                            }}
                                        >
                                            취소
                                        </button>
                                        <button
                                            type="button"
                                            className="cs-detail-btn cs-detail-btn-primary"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSaveEdit();
                                            }}
                                        >
                                            저장하기
                                        </button>
                                    </div>
                                </div>
                            )}
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
                        {/* 필요하면 문의 작성 버튼 연결 */}
                        {/* <button
                            type="button"
                            className="cs-new-qna-btn"
                            onClick={handleClickNewInquiry}
                        >
                            문의 작성하기
                        </button> */}
                    </div>

                    {qnaLoading ? (
                        <div className="cs-list-message">
                            문의 내역을 불러오는 중입니다…
                        </div>
                    ) : qnaError ? (
                        <div className="cs-list-message cs-list-error">
                            {qnaError}
                        </div>
                    ) : inquiries.length === 0 ? (
                        <div className="cs-list-message">
                            아직 남기신 문의가 없습니다. 첫 문의를 남겨보세요!
                        </div>
                    ) : (
                        <div className="cs-table">
                            <div className="cs-table-head">
                                <span className="cs-col cs-col-product">
                                    상품명
                                </span>
                                <span className="cs-col cs-col-title">
                                    문의 제목
                                </span>
                                <span className="cs-col cs-col-date">
                                    작성일
                                </span>
                                <span className="cs-col cs-col-status">
                                    상태
                                </span>
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

                {/* FAQ 카드 */}
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