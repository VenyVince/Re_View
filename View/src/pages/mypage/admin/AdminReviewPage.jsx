// src/pages/mypage/admin/AdminReviewPage.jsx
import React, { useState } from "react";
import {
    Wrap, Inner, TitleRow, Title, Grid, Card,
    Badge, Thumb, CardBody, Reviewer, ContentText, Price,
    Actions, Pagination, PagerBtn, PageInfo, ModalOverlay, ModalBox, ModalButtons,} from "./adminReviewPage.style";
import {
    selectReview,
    deleteReview,
} from "../../../api/admin/adminReviewApi";

export default function AdminReviewPage() {
    // ---------------------
    // 더미 리뷰 데이터 (1차 버전: 목록은 더미, 버튼만 API 연결)
    // ---------------------
    const dummy = [
        {
            id: 1,
            reviewer: "김정명",
            content: "인생토너 ㅠ",
            price: 25000,
            isPick: false,
        },
        {
            id: 2,
            reviewer: "박명정",
            content: "최고의 브랜드!",
            price: 25000,
            isPick: true,
        },
        {
            id: 3,
            reviewer: "오명화",
            content: "ㄹㅇ 피부 미쳤다잉~",
            price: 25000,
            isPick: false,
        },
    ];

    // ---------------------
    // 상태
    // ---------------------
    const [reviews, setReviews] = useState(dummy);
    const [page, setPage] = useState(1);
    const pageSize = 9;
    const maxPage = Math.max(1, Math.ceil(reviews.length / pageSize));

    const [modalType, setModalType] = useState(null); // "pick" | "delete"
    const [selectedId, setSelectedId] = useState(null);

    // ---------------------
    // 모달 오픈
    // ---------------------
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

    // ---------------------
    // 실제 동작 (API 연결)
    // ---------------------
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

    // ---------------------
    // 페이지 나누기
    // ---------------------
    const start = (page - 1) * pageSize;
    const pageList = reviews.slice(start, start + pageSize);

    return (
        <Wrap>
            <Inner>
                <TitleRow>
                    <Title>리뷰 관리</Title>
                </TitleRow>

                <Grid>
                    {pageList.map((r) => (
                        <Card key={r.id}>
                            {r.isPick && <Badge>운영자픽</Badge>}

                            <Thumb>사진 영역</Thumb>

                            <CardBody>
                                <Reviewer>{r.reviewer}</Reviewer>
                                <ContentText>{r.content}</ContentText>
                                <Price>₩{(r.price ?? 0).toLocaleString()}</Price>

                                <Actions>
                                    <button
                                        title="운영자픽"
                                        onClick={() => openPickModal(r.id)}
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        title="삭제"
                                        onClick={() => openDeleteModal(r.id)}
                                    >
                                        🗑️
                                    </button>
                                </Actions>
                            </CardBody>
                        </Card>
                    ))}
                </Grid>

                {/* 페이지네이션 */}
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
            </Inner>
        </Wrap>
    );
}
