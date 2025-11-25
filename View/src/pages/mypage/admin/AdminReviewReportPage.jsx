// src/pages/mypage/admin/AdminReviewReportPage.jsx
import { useMemo, useState } from "react";
import {
    Wrap,
    Inner,
    Content,
    TitleRow,
    Title,
    FilterRow,
    FilterLabel,
    FilterSelect,
    SearchInput,
    TableWrapper,
    ReportTable,
    EmptyState,
    StatusBadge,
    SmallButton,
    Pagination,
    PagerBtn,
    PageInfo,
} from "./adminReviewReportPage.style";

// ⚠️ API 나오기 전까지는 더미 데이터로 UI만 확인
const DUMMY_REPORTS = [
    {
        reportId: 1,
        reviewId: 101,
        productName: "민감피부 저자극 토너",
        reviewerNickname: "건성토끼",
        reporterNickname: "지성여우",
        reason: "욕설 및 비방 표현이 포함되어 있어요.",
        status: "PENDING", // PENDING / RESOLVED
        createdAt: "2025-11-25 13:20",
        reviewContent: "진짜 별로임. 왜 이걸 돈 주고 삼? 다시는 안 쓴다.",
    },
    {
        reportId: 2,
        reviewId: 102,
        productName: "수분 폭탄 크림",
        reviewerNickname: "수부지공주",
        reporterNickname: "야옹이",
        reason: "스팸성 광고 같아요.",
        status: "RESOLVED",
        createdAt: "2025-11-24 09:10",
        reviewContent: "DRNT인데 이거 쓰고 인생템 됐어요!",
    },
];

const PAGE_SIZE = 10;

export default function AdminReviewReportPage() {
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(1);
    const [selectedReport, setSelectedReport] = useState(null); // 상세 모달

    // 상태 + 키워드 필터
    const filtered = useMemo(() => {
        let base = [...DUMMY_REPORTS];

        if (statusFilter === "PENDING") {
            base = base.filter((r) => r.status === "PENDING");
        } else if (statusFilter === "RESOLVED") {
            base = base.filter((r) => r.status === "RESOLVED");
        }

        if (keyword.trim()) {
            const k = keyword.toLowerCase();
            base = base.filter(
                (r) =>
                    r.productName.toLowerCase().includes(k) ||
                    r.reviewerNickname.toLowerCase().includes(k) ||
                    r.reporterNickname.toLowerCase().includes(k) ||
                    r.reason.toLowerCase().includes(k)
            );
        }
        return base;
    }, [statusFilter, keyword]);

    const total = filtered.length;
    const maxPage = Math.max(1, Math.ceil(total / PAGE_SIZE));

    const pageList = useMemo(() => {
        const start = (page - 1) * PAGE_SIZE;
        return filtered.slice(start, start + PAGE_SIZE);
    }, [filtered, page]);

    const isEmpty = total === 0;

    return (
        <Wrap>
            <Inner>
                <Content>
                    <TitleRow>
                        <Title>신고 관리</Title>
                    </TitleRow>

                    {/* 필터 / 검색 */}
                    <FilterRow>
                        <FilterLabel>상태</FilterLabel>
                        <FilterSelect
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setPage(1);
                            }}
                        >
                            <option value="ALL">전체</option>
                            <option value="PENDING">대기</option>
                            <option value="RESOLVED">처리완료</option>
                        </FilterSelect>

                        <SearchInput
                            placeholder="상품명 / 작성자 / 신고자 / 사유 검색"
                            value={keyword}
                            onChange={(e) => {
                                setKeyword(e.target.value);
                                setPage(1);
                            }}
                        />
                    </FilterRow>

                    {/* 테이블 */}
                    <TableWrapper>
                        {isEmpty ? (
                            <EmptyState>해당 조건의 신고가 없습니다.</EmptyState>
                        ) : (
                            <ReportTable>
                                <thead>
                                <tr>
                                    <th>신고 ID</th>
                                    <th>리뷰 ID</th>
                                    <th>상품명</th>
                                    <th>작성자</th>
                                    <th>신고자</th>
                                    <th>신고 사유</th>
                                    <th>상태</th>
                                    <th>신고일</th>
                                    <th>관리</th>
                                </tr>
                                </thead>
                                <tbody>
                                {pageList.map((r) => (
                                    <tr key={r.reportId}>
                                        <td>{r.reportId}</td>
                                        <td>{r.reviewId}</td>
                                        <td className="ellipsis">{r.productName}</td>
                                        <td>{r.reviewerNickname}</td>
                                        <td>{r.reporterNickname}</td>
                                        <td className="ellipsis">{r.reason}</td>
                                        <td>
                                            <StatusBadge status={r.status}>
                                                {r.status === "PENDING" ? "대기" : "처리완료"}
                                            </StatusBadge>
                                        </td>
                                        <td>{r.createdAt}</td>
                                        <td>
                                            <SmallButton onClick={() => setSelectedReport(r)}>
                                                상세보기
                                            </SmallButton>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </ReportTable>
                        )}
                    </TableWrapper>

                    {/* 페이지네이션 */}
                    {!isEmpty && (
                        <Pagination>
                            <PagerBtn
                                disabled={page === 1}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                            >
                                {"<"}
                            </PagerBtn>
                            <PageInfo>
                                {page} / {maxPage}
                            </PageInfo>
                            <PagerBtn
                                disabled={page === maxPage}
                                onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
                            >
                                {">"}
                            </PagerBtn>
                        </Pagination>
                    )}

                    {/* 신고 상세 모달 */}
                    {selectedReport && (
                        <div
                            style={{
                                position: "fixed",
                                inset: 0,
                                background: "rgba(0,0,0,0.4)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                zIndex: 9999,
                            }}
                            onClick={() => setSelectedReport(null)}
                        >
                            <div
                                style={{
                                    background: "#fff",
                                    padding: "24px 28px",
                                    borderRadius: "16px",
                                    minWidth: "420px",
                                    maxWidth: "520px",
                                    maxHeight: "80vh",
                                    overflowY: "auto",
                                }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        marginBottom: "12px",
                                    }}
                                >
                                    <h3 style={{ fontSize: 18, fontWeight: 700 }}>신고 상세</h3>
                                    <button
                                        onClick={() => setSelectedReport(null)}
                                        style={{
                                            fontSize: 20,
                                            border: "none",
                                            background: "none",
                                            cursor: "pointer",
                                        }}
                                    >
                                        ×
                                    </button>
                                </div>

                                <section style={{ marginBottom: 12 }}>
                                    <div style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>
                                        신고 정보
                                    </div>
                                    <div style={{ fontSize: 14, lineHeight: 1.5 }}>
                                        <p>
                                            <strong>신고 ID:</strong> {selectedReport.reportId}
                                        </p>
                                        <p>
                                            <strong>리뷰 ID:</strong> {selectedReport.reviewId}
                                        </p>
                                        <p>
                                            <strong>상품명:</strong> {selectedReport.productName}
                                        </p>
                                        <p>
                                            <strong>작성자:</strong> {selectedReport.reviewerNickname}
                                        </p>
                                        <p>
                                            <strong>신고자:</strong> {selectedReport.reporterNickname}
                                        </p>
                                        <p>
                                            <strong>신고일:</strong> {selectedReport.createdAt}
                                        </p>
                                    </div>
                                </section>

                                <section style={{ marginBottom: 12 }}>
                                    <div style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>
                                        리뷰 내용
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 14,
                                            lineHeight: 1.5,
                                            padding: "10px 12px",
                                            borderRadius: 8,
                                            background: "#f8f9fb",
                                            border: "1px solid #e5e7eb",
                                        }}
                                    >
                                        {selectedReport.reviewContent}
                                    </div>
                                </section>

                                <section style={{ marginBottom: 12 }}>
                                    <div style={{ fontSize: 13, color: "#666", marginBottom: 4 }}>
                                        신고 사유
                                    </div>
                                    <div
                                        style={{
                                            fontSize: 14,
                                            lineHeight: 1.5,
                                            padding: "10px 12px",
                                            borderRadius: 8,
                                            background: "#f8f9fb",
                                            border: "1px solid #e5e7eb",
                                        }}
                                    >
                                        {selectedReport.reason}
                                    </div>
                                </section>

                                <div
                                    style={{
                                        marginTop: 18,
                                        display: "flex",
                                        justifyContent: "flex-end",
                                        gap: 8,
                                    }}
                                >
                                    <button
                                        style={{
                                            padding: "8px 12px",
                                            borderRadius: 999,
                                            border: "none",
                                            background: "#fa5252",
                                            color: "#fff",
                                            fontSize: 13,
                                            cursor: "pointer",
                                        }}
                                        onClick={() => {
                                            alert("🚨 신고 유지 / 리뷰 숨김 처리 API 나중에 연결");
                                            // TODO: POST /api/admin/reports/{id}/approve
                                        }}
                                    >
                                        신고 유지 / 리뷰 숨김
                                    </button>
                                    <button
                                        style={{
                                            padding: "8px 12px",
                                            borderRadius: 999,
                                            border: "1px solid #ddd",
                                            background: "#fff",
                                            fontSize: 13,
                                            cursor: "pointer",
                                        }}
                                        onClick={() => {
                                            alert("✅ 신고 반려 API 나중에 연결");
                                            // TODO: POST /api/admin/reports/{id}/reject
                                        }}
                                    >
                                        신고 반려
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </Content>
            </Inner>
        </Wrap>
    );
}
