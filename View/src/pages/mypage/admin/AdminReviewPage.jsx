import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Wrap, Inner, Content, TitleRow, Title, FilterRow, FilterLabel, FilterSelect, SearchInput,
    TableWrapper, ReviewTable, EmptyState, PickBadge, SmallButton, Pagination, PagerBtn, PageInfo,
    ModalOverlay, ModalBox, ModalButtons,
} from "./adminReviewPage.style";

import { fetchAdminReviews, selectReview, deleteReview } from "../../../api/admin/adminReviewApi";

export default function AdminReviewPage() {

    const [reviews, setReviews] = useState([]); // 전체 데이터를 담을 곳
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const [filterPick, setFilterPick] = useState("ALL");
    const [keyword, setKeyword] = useState("");

    const [modalType, setModalType] = useState(null);
    const [selectedId, setSelectedId] = useState(null);

    const navigate = useNavigate();

    // 1. 데이터 가져오기 (처음 1회만 실행)
    useEffect(() => {
        const load = async () => {
            try {
                // 전체를 가져와야 하므로 size를 아주 크게 주거나, API가 알아서 전체를 준다면 파라미터 조절 필요
                // 여기서는 기존 파라미터 무시하고 데이터를 받아온다고 가정
                const data = await fetchAdminReviews(1, 10000, "like_count");

                console.log("[ADMIN] fetch all data:", data);

                // API 응답(배열)이 바로 data로 들어온다고 가정
                const list = Array.isArray(data) ? data : [];

                const normalized = list.map((r) => ({
                    id: r.review_id,
                    reviewer: r.writer,
                    content: r.content,
                    price: r.price,
                    isPick: r.is_selected === "1"
                }));

                setReviews(normalized); // 전체 데이터 저장

            } catch (e) {
                console.error("[ADMIN] 리뷰 조회 실패:", e);
            }
        };
        load();
    }, []); // 의존성 배열 비움 -> 마운트 시 1회 실행

    // 2. 필터링 (전체 데이터 대상)
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
                    String(r.id).includes(k) ||
                    r.reviewer.toLowerCase().includes(k) ||
                    r.content.toLowerCase().includes(k)
            );
        }
        return base;
    }, [reviews, filterPick, keyword]);

    // 3. 페이지네이션 (프론트엔드에서 자르기)
    // filtered된 목록에서 현재 페이지에 해당하는 부분만 slice
    const offset = (page - 1) * pageSize;
    const pageList = filtered.slice(offset, offset + pageSize);

    const totalPages = Math.ceil(filtered.length / pageSize);
    const isEmpty = filtered.length === 0;

    // 모달 열기/닫기
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

    // 운영자 픽
    const doPick = async () => {
        if (selectedId == null) return;
        const target = reviews.find((r) => r.id === selectedId);
        if (!target) { closeModal(); return; }

        const nextIsPick = !target.isPick;

        try {
            await selectReview(selectedId, nextIsPick ? 1 : 0);
            // 전체 목록(reviews) 상태 업데이트
            setReviews((prev) =>
                prev.map((r) =>
                    r.id === selectedId ? { ...r, isPick: nextIsPick } : r
                )
            );
            alert("상태가 변경되었습니다.");
        } catch (error) {
            console.error("실패:", error);
        } finally {
            closeModal();
        }
    };

    // 삭제
    const doDelete = async () => {
        if (selectedId == null) return;
        try {
            await deleteReview(selectedId);
            // 전체 목록에서 제거
            setReviews((prev) => prev.filter((r) => r.id !== selectedId));
            alert("삭제되었습니다.");
        } catch (error) {
            console.error("실패:", error);
        } finally {
            closeModal();
        }
    };

    return (
        <Wrap>
            <Inner>
                <Content>
                    <TitleRow>
                        <Title>리뷰 관리 (전체 {filtered.length}개)</Title>
                    </TitleRow>

                    <FilterRow>
                        <FilterLabel>구분</FilterLabel>
                        <FilterSelect
                            value={filterPick}
                            onChange={(e) => {
                                setFilterPick(e.target.value);
                                setPage(1); // 필터 바뀌면 1페이지로 리셋
                            }}
                        >
                            <option value="ALL">전체</option>
                            <option value="PICK">운영자 픽</option>
                            <option value="NORMAL">일반</option>
                        </FilterSelect>

                        <SearchInput
                            placeholder="검색어 입력..."
                            value={keyword}
                            onChange={(e) => {
                                setKeyword(e.target.value);
                                setPage(1); // 검색어 바뀌면 1페이지로 리셋
                            }}
                        />
                    </FilterRow>

                    <TableWrapper>
                        {isEmpty ? (
                            <EmptyState>데이터가 없습니다.</EmptyState>
                        ) : (
                            <ReviewTable>
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>작성자</th>
                                    <th>내용</th>
                                    <th>가격</th>
                                    <th>상태</th>
                                    <th>관리</th>
                                </tr>
                                </thead>
                                <tbody>
                                {pageList.map((r) => (
                                    <tr key={r.id}>
                                        <td>{r.id}</td>
                                        <td>{r.reviewer}</td>
                                        <td
                                            className="ellipsis"
                                            style={{cursor:"pointer", color:"#1971c2"}}
                                            onClick={()=> navigate(`/review/${r.id}`)}
                                        >
                                            {r.content.length > 30 ? r.content.substring(0,30)+"..." : r.content}
                                        </td>
                                        <td>{r.price?.toLocaleString()}</td>
                                        <td>{r.isPick ? <PickBadge>PICK</PickBadge> : "-"}</td>
                                        <td>
                                            <SmallButton onClick={() => openPickModal(r.id)}>
                                                {r.isPick ? "해제" : "설정"}
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

                    {!isEmpty && (
                        <Pagination>
                            <PagerBtn
                                disabled={page === 1}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                            >
                                {"<"}
                            </PagerBtn>

                            <PageInfo>
                                {page} / {totalPages}
                            </PageInfo>

                            <PagerBtn
                                disabled={page === totalPages}
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            >
                                {">"}
                            </PagerBtn>
                        </Pagination>
                    )}

                    {modalType && (
                        <ModalOverlay>
                            <ModalBox>
                                <h3>{modalType === "pick" ? "설정을 변경하시겠습니까?" : "삭제하시겠습니까?"}</h3>
                                <ModalButtons>
                                    <button onClick={closeModal}>취소</button>
                                    <button onClick={modalType === "pick" ? doPick : doDelete}>확인</button>
                                </ModalButtons>
                            </ModalBox>
                        </ModalOverlay>
                    )}
                </Content>
            </Inner>
        </Wrap>
    );
}