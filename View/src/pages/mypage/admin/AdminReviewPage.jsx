import React, { useMemo, useState, useEffect } from "react";
import {
    Wrap, Inner, Content, TitleRow, Title, FilterRow, FilterLabel, FilterSelect, SearchInput,
    TableWrapper, ReviewTable, EmptyState, PickBadge, SmallButton, Pagination, PagerBtn, PageInfo,
    ModalOverlay, ModalBox, ModalButtons,} from "./adminReviewPage.style";
import {fetchAdminReviews, selectReview, deleteReview } from "../../../api/admin/adminReviewApi";

export default function AdminReviewPage() {
    // 상태
    const [reviews, setReviews] = useState([]); //빈 배열
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const [filterPick, setFilterPick] = useState("ALL"); // ALL | PICK | NORMAL
    const [keyword, setKeyword] = useState("");

    const [modalType, setModalType] = useState(null); // "pick" | "delete"
    const [selectedId, setSelectedId] = useState(null);

    // DB에서 리뷰 가져오기 (/api/reviews)
    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchAdminReviews(page, pageSize, "like_count");
                // 백엔드 응답(예: review_id, writer, content, price, is_selected ...)을
                // 프론트에서 쓰기 편한 형태로 변환
                const normalized = data.map((r) => ({
                    id: r.review_id,
                    reviewer: r.writer,
                    content: r.content,
                    price: r.price,
                    isPick:
                        r.is_selected === 1 ||
                        r.is_selected === true,
                }));
                setReviews(normalized);
            } catch (e) {
                console.error("[ADMIN] 리뷰 조회 실패:", e);
            }
        };
        load();
    }, [page]);

    // 필터 + 검색
    const filtered = useMemo(() => {
        let base = [...reviews];

        if (filterPick === "PICK") {
            base = base.filter((r) => r.isPick);
        } else if (filterPick === "NORMAL") {
            base = base.filter((r) => !r.isPick);
        }

        if (keyword.trim()) {
            const k = keyword.toLowerCase();
            base = base.filter(
                (r) =>
                    r.reviewer.toLowerCase().includes(k) ||
                    r.content.toLowerCase().includes(k)
            );
        }

        return base;
    }, [reviews, filterPick, keyword]);

    const maxPage = Math.max(1, Math.ceil(filtered.length / pageSize));
    const start = (page - 1) * pageSize;
    const pageList = filtered.slice(start, start + pageSize);
    const isEmpty = filtered.length === 0;

    // 모달 오픈/닫기
    const openPickModal = (id) => {
        setSelectedId(id);
        setModalType("pick");
    };

    const openDeleteModal = (id) => {
        setSelectedId(id);
        setModalType("delete");
    };

    const closeModal = () => {
        setModalType(null);
        setSelectedId(null);
    };

    // 실제 동작 (API 연결)
    const doPick = async () => {
        if (selectedId == null) return;

        const target = reviews.find((r) => r.id === selectedId);
        if (!target) {
            closeModal();
            return;
        }

        const nextIsPick = !target.isPick;

        try {
            // is_selected: 1 또는 0
            await selectReview(selectedId, nextIsPick ? 1 : 0);
            setReviews((prev) =>
                prev.map((r) =>
                    r.id === selectedId ? { ...r, isPick: nextIsPick } : r
                )
            );
            alert("운영자 픽 상태가 변경되었습니다.");
        } catch (error) {
            console.error("[ADMIN] 운영자 픽 변경 실패:", error);
            alert("운영자 픽 변경에 실패했습니다.");
        } finally {
            closeModal();
        }
    };

    const doDelete = async () => {
        if (selectedId == null) return;

        try {
            await deleteReview(selectedId);
            setReviews((prev) => prev.filter((r) => r.id !== selectedId));
            alert("리뷰가 삭제되었습니다.");
        } catch (error) {
            console.error("[ADMIN] 리뷰 삭제 실패:", error);
            alert("리뷰 삭제에 실패했습니다.");
        } finally {
            closeModal();
        }
    };

    return (
        <Wrap>
            <Inner>
                <Content>
                    <TitleRow>
                        <Title>리뷰 관리</Title>
                    </TitleRow>

                    {/* 필터 / 검색 */}
                    <FilterRow>
                        <FilterLabel>운영자 픽</FilterLabel>
                        <FilterSelect
                            value={filterPick}
                            onChange={(e) => {
                                setFilterPick(e.target.value);
                                setPage(1);
                            }}
                        >
                            <option value="ALL">전체</option>
                            <option value="PICK">운영자 픽만</option>
                            <option value="NORMAL">일반 리뷰만</option>
                        </FilterSelect>

                        <SearchInput
                            placeholder="작성자 / 내용 검색"
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
                            <EmptyState>조건에 맞는 리뷰가 없습니다.</EmptyState>
                        ) : (
                            <ReviewTable>
                                <thead>
                                <tr>
                                    <th>리뷰 ID</th>
                                    <th>작성자</th>
                                    <th>내용</th>
                                    <th>가격</th>
                                    <th>운영자 픽</th>
                                    <th>관리</th>
                                </tr>
                                </thead>
                                <tbody>
                                {pageList.map((r) => (
                                    <tr key={r.id}>
                                        <td>{r.id}</td>
                                        <td>{r.reviewer}</td>
                                        <td className="ellipsis">{r.content}</td>
                                        <td>₩{(r.price ?? 0).toLocaleString()}</td>
                                        <td>
                                            {r.isPick ? (
                                                <PickBadge>운영자 픽</PickBadge>
                                            ) : (
                                                "-"
                                            )}
                                        </td>
                                        <td>
                                            <SmallButton onClick={() => openPickModal(r.id)}>
                                                {r.isPick ? "픽 해제" : "픽 설정"}
                                            </SmallButton>{" "}
                                            <SmallButton onClick={() => openDeleteModal(r.id)}>
                                                삭제
                                            </SmallButton>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </ReviewTable>
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
                                onClick={() =>
                                    setPage((p) => Math.min(maxPage, maxPage === 0 ? 1 : p + 1))
                                }
                            >
                                {">"}
                            </PagerBtn>
                        </Pagination>
                    )}

                    {/* 모달 */}
                    {modalType && (
                        <ModalOverlay>
                            <ModalBox>
                                {modalType === "pick" && (
                                    <h2>운영자 픽으로 설정/해제 하겠습니까?</h2>
                                )}
                                {modalType === "delete" && (
                                    <h2>리뷰를 삭제하시겠습니까?</h2>
                                )}

                                <ModalButtons>
                                    <button onClick={closeModal}>취소</button>
                                    <button
                                        onClick={modalType === "pick" ? doPick : doDelete}
                                    >
                                        예
                                    </button>
                                </ModalButtons>
                            </ModalBox>
                        </ModalOverlay>
                    )}
                </Content>
            </Inner>
        </Wrap>
    );
}
