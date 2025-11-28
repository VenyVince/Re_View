import { useEffect, useMemo, useState } from "react";
import {
    Wrap, Inner, Content, TitleRow, Title, FilterRow, FilterLabel, FilterSelect, SearchInput,
    TableWrapper, ReportTable, EmptyState, StatusBadge, SmallButton, Pagination, PagerBtn,
    PageInfo,ModalOverlay, ModalBox, ModalTitle, ModalSectionTitle, ModalBoxContent, ModalText,
    ModalButtonRow, ModalPrimaryButton, ModalSecondaryButton,} from "./adminReviewReportPage.style";

import { fetchReports, updateReportStatus } from "../../../api/admin/adminReportApi";

const PAGE_SIZE = 10;

export default function AdminReviewReportPage() {
    const [reports, setReports] = useState([]);
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(1);
    const [selectedReport, setSelectedReport] = useState(null);

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        try {
            const data = await fetchReports();
            setReports(data);
        } catch (err) {
            console.error("신고 리스트 불러오기 실패:", err);
        }
    };

    /* 필터 + 검색 */
    const filtered = useMemo(() => {
        let base = [...reports];

        // 상태 필터
        if (statusFilter !== "ALL") {
            base = base.filter((r) => r.status === statusFilter);
        }

        // 검색 키워드
        if (keyword.trim()) {
            const k = keyword.toLowerCase();
            base = base.filter(
                (r) =>
                    r.description?.toLowerCase().includes(k) ||
                    r.reason?.toLowerCase().includes(k) ||
                    r.review_writer_nickname?.toLowerCase().includes(k) ||
                    r.reporter_nickname?.toLowerCase().includes(k)
            );
        }

        return base;
    }, [reports, statusFilter, keyword]);

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

                    {/* 필터 */}
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
                            <option value="PROCESSED">처리됨</option>
                            <option value="REJECTED">반려됨</option>
                        </FilterSelect>

                        <SearchInput
                            placeholder="내용/작성자/신고자 검색"
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
                                    <th>신고 설명</th>
                                    <th>리뷰 작성자</th>
                                    <th>신고자</th>
                                    <th>사유</th>
                                    <th>상태</th>
                                    <th>신고일</th>
                                    <th>관리</th>
                                </tr>
                                </thead>

                                <tbody>
                                {pageList.map((r) => (
                                    <tr key={r.report_id}>
                                        <td>{r.report_id}</td>
                                        <td>{r.review_id}</td>
                                        <td className="ellipsis">{r.description}</td>
                                        <td>{r.review_writer_nickname}</td>
                                        <td>{r.reporter_nickname}</td>
                                        <td className="ellipsis">{r.reason}</td>

                                        <td>
                                            <StatusBadge status={r.status}>
                                                {r.status === "PENDING"
                                                    ? "대기"
                                                    : r.status === "PROCESSED"
                                                        ? "처리됨"
                                                        : "반려됨"}
                                            </StatusBadge>
                                        </td>

                                        <td>{r.created_at?.slice(0, 10)}</td>

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

                    {selectedReport && (
                        <ModalOverlay onClick={() => setSelectedReport(null)}>
                            <ModalBox onClick={(e) => e.stopPropagation()}>
                                <ModalTitle>신고 상세</ModalTitle>

                                <ModalSectionTitle>리뷰 내용</ModalSectionTitle>
                                <ModalBoxContent>{selectedReport.review_content}</ModalBoxContent>

                                <ModalSectionTitle>신고 사유</ModalSectionTitle>
                                <ModalBoxContent>{selectedReport.reason}</ModalBoxContent>

                                <ModalText><strong>신고자:</strong> {selectedReport.reporter_nickname}</ModalText>
                                <ModalText><strong>리뷰 작성자:</strong> {selectedReport.review_writer_nickname}</ModalText>

                                <ModalButtonRow>
                                    <ModalPrimaryButton
                                        onClick={async () => {
                                            await updateReportStatus(selectedReport.report_id, "PROCESSED");
                                            loadReports();
                                            setSelectedReport(null);
                                        }}
                                    >
                                        신고 처리완료
                                    </ModalPrimaryButton>

                                    <ModalSecondaryButton
                                        onClick={async () => {
                                            await updateReportStatus(selectedReport.report_id, "REJECTED");
                                            loadReports();
                                            setSelectedReport(null);
                                        }}
                                    >
                                        신고 반려
                                    </ModalSecondaryButton>
                                </ModalButtonRow>
                            </ModalBox>
                        </ModalOverlay>
                    )}

                </Content>
            </Inner>
        </Wrap>
    );
}
