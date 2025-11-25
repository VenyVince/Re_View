import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Wrap, Inner, Title, UserList, UserRow, Avatar, UserInfo, UserName, UserRole, UserRight,
    IconButton, WarningText, Pagination, PagerBtn, PageInfo, ModalOverlay, ModalBox, ModalTitle,
    ModalTextarea, ModalButtons, WarnWrap, WarnCard, HeaderRow, SearchInput,
} from "./adminUserPage.style";
import { fetchMembers, banMember } from "../../../api/admin/adminUserApi";

export default function AdminUserPage() {
    const navigate = useNavigate();

    // 기본 상태
    const [users, setUsers] = useState([]); // 항상 배열
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [page, setPage] = useState(1);
    const pageSize = 20;

    const [search, setSearch] = useState("");

    // 밴 모달 관련 상태
    const [banModalOpen, setBanModalOpen] = useState(false);
    const [banReason, setBanReason] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);

    // 밴 처리된 유저 표시용
    const [bannedUserIds, setBannedUserIds] = useState([]);
    const [banResultUser, setBanResultUser] = useState(null);

    // 회원 목록 API 호출
    useEffect(() => {
        const loadUsers = async () => {
            try {
                setLoading(true);
                const res = await fetchMembers();
                const data = Array.isArray(res.data) ? res.data : [];

                //  UserSummaryDTO -> 화면에서 쓸 형태로 매핑
                const mapped = data.map((u) => {
                    // id가 숫자든 문자열이든 무조건 문자열로 통일
                    const loginId = u.id != null ? String(u.id) : "";
                    const isAdmin = loginId.toLowerCase().includes("admin");

                    return {
                        id: u.user_id,              // PK
                        loginId,                    // 로그인 아이디 (문자열로 통일)
                        realName: u.name,           // 실명
                        nickname: u.nickname,       // 닉네임
                        name: u.nickname || u.name || loginId, // 목록에서 표시할 이름
                        role: isAdmin ? "관리자" : "회원",
                    };
                });

                setUsers(mapped);
                setError("");
            } catch (e) {
                console.error(e);
                setError("회원 목록을 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, []);

    // 검색어 적용된 목록
    const filteredUsers = useMemo(() => {
        if (!search.trim()) return users;
        const q = search.toLowerCase();
        return users.filter((u) =>
            (u.name && u.name.toLowerCase().includes(q)) ||
            (u.loginId && u.loginId.toLowerCase().includes(q)) ||
            (u.nickname && u.nickname.toLowerCase().includes(q))
        );
    }, [users, search]);

    // 페이지 계산
    const totalPages = useMemo(() => {
        if (filteredUsers.length === 0) return 1;
        return Math.ceil(filteredUsers.length / pageSize);
    }, [filteredUsers.length, pageSize]);

    const pagedUsers = useMemo(() => {
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        return filteredUsers.slice(start, end);
    }, [filteredUsers, page, pageSize]);

    const goPrev = () => setPage((p) => (p > 1 ? p - 1 : p));
    const goNext = () => setPage((p) => (p < totalPages ? p + 1 : p));

    // 밴 모달 열기
    const openBanModal = (user) => {
        setSelectedUser(user);
        setBanReason("");
        setBanModalOpen(true);
    };

    const closeBanModal = () => {
        setBanModalOpen(false);
        setSelectedUser(null);
    };

    // 밴 API 호출 + 화면 상태 반영
    const handleConfirmBan = async () => {
        if (!selectedUser) return;

        try {
            await banMember(selectedUser.id, banReason);

            // 이 유저를 밴된 리스트에 추가
            setBannedUserIds((prev) =>
                prev.includes(selectedUser.id) ? prev : [...prev, selectedUser.id]
            );
            setBanResultUser(selectedUser);
            setBanModalOpen(false);
        } catch (e) {
            console.error(e);
            alert("회원 밴 처리 중 오류가 발생했습니다.");
        }
    };

    // 로딩 / 에러 처리
    if (loading) {
        return (
            <Wrap>
                <Inner>
                    <Title>회원 관리</Title>
                    <div>로딩 중...</div>
                </Inner>
            </Wrap>
        );
    }

    if (error) {
        return (
            <Wrap>
                <Inner>
                    <Title>회원 관리</Title>
                    <div>{error}</div>
                </Inner>
            </Wrap>
        );
    }

    return (
        <Wrap>
            <Inner>
                <HeaderRow>
                    <Title>회원 관리</Title>
                    <SearchInput
                        type="text"
                        placeholder="유저 검색"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setPage(1);           // 검색하면 항상 1페이지로
                        }}
                    />
                </HeaderRow>

                {/* 상단 요약 영역 – 마지막으로 밴한 유저 안내 */}
                {banResultUser && (
                    <WarnWrap>
                        <WarnCard>
                            <p>{banResultUser.name} 님이 밴 처리되었습니다.</p>
                        </WarnCard>
                    </WarnWrap>
                )}

                {/* 회원 리스트 */}
                <UserList>
                    {pagedUsers.map((user) => {
                        const isBanned = bannedUserIds.includes(user.id);

                        return (
                            <UserRow key={user.id}>
                                <Avatar>
                                    {user.name?.[0] ?? "유"}
                                </Avatar>

                                <UserInfo>
                                    <UserName>{user.name}</UserName>
                                    <UserRole>{user.role}</UserRole>
                                    <WarningText>
                                        {isBanned ? "밴 처리된 회원" : "정상 회원"}
                                    </WarningText>
                                </UserInfo>

                                <UserRight>
                                    <IconButton
                                        type="button"
                                        onClick={() => openBanModal(user)}
                                        disabled={isBanned}
                                    >
                                        {isBanned ? "밴 완료" : "밴"}
                                    </IconButton>
                                </UserRight>
                            </UserRow>
                        );
                    })}

                    {users.length === 0 && <div>회원이 없습니다.</div>}
                </UserList>

                {/* 페이지네이션 */}
                <Pagination>
                    <PagerBtn type="button" onClick={goPrev} disabled={page === 1}>
                        이전
                    </PagerBtn>
                    <PageInfo>
                        {page} / {totalPages}
                    </PageInfo>
                    <PagerBtn type="button" onClick={goNext} disabled={page === totalPages}>
                        다음
                    </PagerBtn>
                </Pagination>

                {/* 밴 모달 */}
                {banModalOpen && selectedUser && (
                    <ModalOverlay>
                        <ModalBox>
                            <ModalTitle>
                                {selectedUser.name} 님을 밴 처리하시겠습니까?
                            </ModalTitle>
                            <ModalTextarea
                                placeholder="밴 사유를 입력하세요 (선택)"
                                value={banReason}
                                onChange={(e) => setBanReason(e.target.value)}
                            />
                            <ModalButtons>
                                <button type="button" onClick={closeBanModal}>
                                    취소
                                </button>
                                <button type="button" onClick={handleConfirmBan}>
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
