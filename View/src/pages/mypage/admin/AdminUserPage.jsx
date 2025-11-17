import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Wrap,
    Inner,
    Title,
    UserList,
    UserRow,
    Avatar,
    UserInfo,
    UserName,
    UserRole,
    UserRight,
    IconButton,
    WarningText,
    Pagination,
    PagerBtn,
    PageInfo,
    ModalOverlay,
    ModalBox,
    ModalTitle,
    ModalTextarea,
    ModalButtons,
    WarnWrap,
    WarnCard,
    MainButtonWrap,
    MainButton,
} from "./adminUserPage.style";

// 더미 유저 데이터
const initialUsers = [
    { id: 1, name: "홍길동", role: "회원", warnings: 0, coupons: 2, points: 12000 },
    { id: 2, name: "유저2", role: "회원", warnings: 0, coupons: 0, points: 3000 },
    { id: 3, name: "유저3", role: "회원", warnings: 0, coupons: 0, points: 0 },
    { id: 4, name: "유저4", role: "회원", warnings: 0, coupons: 1, points: 5000 },
    { id: 5, name: "유저5", role: "회원", warnings: 0, coupons: 3, points: 8000 },
    { id: 6, name: "유저6", role: "관리자", warnings: 0, coupons: 0, points: 0 },
];

export default function AdminUserPage() {
    const [users, setUsers] = useState(initialUsers);
    const [page, setPage] = useState(1);
    const pageSize = 5;

    const [warnModalOpen, setWarnModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [warnReason, setWarnReason] = useState("");
    const [warnResultUser, setWarnResultUser] = useState(null); // 경고 결과 화면용

    const navigate = useNavigate();

    const total = users.length;
    const maxPage = Math.max(1, Math.ceil(total / pageSize));

    const pageList = useMemo(() => {
        const s = (page - 1) * pageSize;
        return users.slice(s, s + pageSize);
    }, [users, page]);

    const openWarnModal = (user) => {
        setSelectedUser(user);
        setWarnReason("");
        setWarnModalOpen(true);
    };

    const closeWarnModal = () => {
        setWarnModalOpen(false);
        setSelectedUser(null);
    };

    const handleConfirmWarn = () => {
        if (!selectedUser) return;

        const updated = users.map((u) =>
            u.id === selectedUser.id ? { ...u, warnings: u.warnings + 1 } : u
        );
        setUsers(updated);

        const resultUser = updated.find((u) => u.id === selectedUser.id);
        setWarnResultUser(resultUser);

        setWarnModalOpen(false);
    };

    const goDetail = (user) => {
        navigate(`/admin/users/${user.id}`, { state: user });
    };

    const backToMain = () => {
        setWarnResultUser(null);
    };

    return (
        <Wrap>
            <Inner>
                <Title>유저 관리</Title>

                {/* 경고 결과 화면 (경고 1회, 메인화면 버튼) */}
                {warnResultUser ? (
                    <>
                        <WarnWrap>
                            <WarnCard>
                                <Avatar>👤</Avatar>
                                <UserInfo>
                                    <UserName>{warnResultUser.name}</UserName>
                                    <UserRole>{warnResultUser.role}</UserRole>
                                </UserInfo>
                                <WarningText>경고 {warnResultUser.warnings}회</WarningText>
                            </WarnCard>
                        </WarnWrap>
                        <MainButtonWrap>
                            <MainButton type="button" onClick={backToMain}>
                                메인화면
                            </MainButton>
                        </MainButtonWrap>
                    </>
                ) : (
                    <>
                        {/* 유저 목록 */}
                        <UserList>
                            {pageList.map((u) => (
                                <UserRow key={u.id}>
                                    <Avatar>👤</Avatar>
                                    <UserInfo>
                                        <UserName>{u.name}</UserName>
                                        <UserRole>{u.role}</UserRole>
                                    </UserInfo>

                                    <UserRight>
                                        {u.warnings > 0 && (
                                            <WarningText>경고 {u.warnings}회</WarningText>
                                        )}

                                        {/* 연필 아이콘: 상세 페이지로 이동 */}
                                        <IconButton
                                            type="button"
                                            title="유저 상세"
                                            onClick={() => goDetail(u)}
                                        >
                                            ✏️
                                        </IconButton>

                                        {/* 경고 아이콘: 경고 모달 */}
                                        <IconButton
                                            type="button"
                                            title="경고 주기"
                                            onClick={() => openWarnModal(u)}
                                        >
                                            🚫
                                        </IconButton>
                                    </UserRight>
                                </UserRow>
                            ))}
                        </UserList>

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
                    </>
                )}

                {/* 경고 모달 */}
                {warnModalOpen && (
                    <ModalOverlay>
                        <ModalBox>
                            <ModalTitle>경고를 주시겠습니까?</ModalTitle>
                            <ModalTextarea
                                placeholder="경고 사유를 입력하세요."
                                value={warnReason}
                                onChange={(e) => setWarnReason(e.target.value)}
                            />
                            <ModalButtons>
                                <button type="button" onClick={closeWarnModal}>
                                    취소
                                </button>
                                <button type="button" onClick={handleConfirmWarn}>
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
