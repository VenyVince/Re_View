import React, { useEffect, useMemo, useState } from "react";
import {
    Wrap, Inner, Content, TitleRow, Title,
    FilterRow, FilterLabel, FilterSelect,
    SearchInput, TableWrapper, UserTable, EmptyState,
    SmallButton, Pagination, PagerBtn, PageInfo,
    ModalOverlay, ModalBox, ModalButtons
} from "./adminUserPage.style";

import { fetchMembers, banMember } from "../../../api/admin/adminUserApi";

export default function AdminUserPage() {

    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const pageSize = 20;

    const [filterStatus, setFilterStatus] = useState("ALL");   // ALL / NORMAL / BANNED
    const [filterRole, setFilterRole] = useState("ALL");       // ALL / ADMIN / USER
    const [keyword, setKeyword] = useState("");

    // 밴 관련
    const [banModalOpen, setBanModalOpen] = useState(false);
    const [banReason, setBanReason] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [bannedUserIds, setBannedUserIds] = useState([]);

    // 사용자 불러오기
    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetchMembers();
                const data = Array.isArray(res.data) ? res.data : [];

                const mapped = data.map((u) => {
                    const loginId = u.id != null ? String(u.id) : "";
                    const isAdmin = loginId.toLowerCase().includes("admin");

                    return {
                        id: u.user_id,
                        loginId,
                        name: u.nickname || u.name || loginId,
                        realName: u.name,
                        nickname: u.nickname,
                        role: isAdmin ? "ADMIN" : "USER",
                    };
                });

                setUsers(mapped);
            } catch (e) {
                console.error("회원 목록 조회 실패:", e);
            }
        };

        load();
    }, []);

    // 검색 + 필터
    const filteredUsers = useMemo(() => {
        let base = [...users];

        // 검색
        if (keyword.trim()) {
            const k = keyword.toLowerCase();
            base = base.filter((u) =>
                u.name?.toLowerCase().includes(k) ||
                u.loginId?.toLowerCase().includes(k) ||
                u.nickname?.toLowerCase().includes(k)
            );
        }

        // 상태 필터
        if (filterStatus === "NORMAL") {
            base = base.filter((u) => !bannedUserIds.includes(u.id));
        } else if (filterStatus === "BANNED") {
            base = base.filter((u) => bannedUserIds.includes(u.id));
        }

        // 역할 필터
        if (filterRole === "ADMIN") {
            base = base.filter((u) => u.role === "ADMIN");
        } else if (filterRole === "USER") {
            base = base.filter((u) => u.role === "USER");
        }

        return base;
    }, [users, bannedUserIds, keyword, filterStatus, filterRole]);

    // 페이지네이션
    const pagedUsers = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filteredUsers.slice(start, start + pageSize);
    }, [filteredUsers, page]);

    const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));

    // 밴 모달
    const openBanModal = (user) => {
        setSelectedUser(user);
        setBanReason("");
        setBanModalOpen(true);
    };

    const closeBanModal = () => {
        setBanModalOpen(false);
        setSelectedUser(null);
    };

    const handleBan = async () => {
        if (!selectedUser) return;

        try {
            await banMember(selectedUser.id, banReason);

            setBannedUserIds((prev) =>
                prev.includes(selectedUser.id) ? prev : [...prev, selectedUser.id]
            );

            alert(`${selectedUser.name} 님이 밴 처리되었습니다.`);
        } catch (e) {
            console.error("밴 처리 실패:", e);
            alert("밴 처리 중 오류가 발생했습니다.");
        } finally {
            closeBanModal();
        }
    };

    return (
        <Wrap>
            <Inner>
                <Content>

                    {/* 제목 */}
                    <TitleRow>
                        <Title>회원 관리</Title>
                    </TitleRow>

                    {/* 필터 + 검색 */}
                    <FilterRow>

                        <FilterLabel>상태</FilterLabel>
                        <FilterSelect
                            value={filterStatus}
                            onChange={(e) => {
                                setFilterStatus(e.target.value);
                                setPage(1);
                            }}
                        >
                            <option value="ALL">전체</option>
                            <option value="NORMAL">정상회원</option>
                            <option value="BANNED">밴된 회원</option>
                        </FilterSelect>

                        <FilterLabel>역할</FilterLabel>
                        <FilterSelect
                            value={filterRole}
                            onChange={(e) => {
                                setFilterRole(e.target.value);
                                setPage(1);
                            }}
                        >
                            <option value="ALL">전체</option>
                            <option value="ADMIN">관리자</option>
                            <option value="USER">일반 회원</option>
                        </FilterSelect>

                        <SearchInput
                            placeholder="이름 / 닉네임 / 아이디 검색"
                            value={keyword}
                            onChange={(e) => {
                                setKeyword(e.target.value);
                                setPage(1);
                            }}
                        />
                    </FilterRow>

                    {/* 테이블 */}
                    <TableWrapper>
                        {filteredUsers.length === 0 ? (
                            <EmptyState>조건에 맞는 회원이 없습니다.</EmptyState>
                        ) : (
                            <UserTable>
                                <thead>
                                <tr>
                                    <th>유저 ID</th>
                                    <th>이름</th>
                                    <th>닉네임</th>
                                    <th>역할</th>
                                    <th>상태</th>
                                    <th>관리</th>
                                </tr>
                                </thead>

                                <tbody>
                                {pagedUsers.map((u) => {
                                    const isBanned = bannedUserIds.includes(u.id);

                                    return (
                                        <tr key={u.id}>
                                            <td>{u.id}</td>
                                            <td>{u.realName || "-"}</td>
                                            <td>{u.nickname || "-"}</td>
                                            <td>{u.role === "ADMIN" ? "관리자" : "회원"}</td>
                                            <td style={{ color: isBanned ? "#b91c1c" : "#333" }}>
                                                {isBanned ? "밴됨" : "정상"}
                                            </td>
                                            <td>
                                                <SmallButton
                                                    disabled={isBanned}
                                                    onClick={() => openBanModal(u)}
                                                >
                                                    {isBanned ? "밴 완료" : "밴"}
                                                </SmallButton>
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </UserTable>
                        )}
                    </TableWrapper>

                    {/* 페이지네이션 */}
                    <Pagination>
                        <PagerBtn
                            disabled={page <= 1}
                            onClick={() => setPage((p) => p - 1)}
                        >
                            {"<"}
                        </PagerBtn>

                        <PageInfo>{page} / {totalPages}</PageInfo>

                        <PagerBtn
                            disabled={page >= totalPages}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            {">"}
                        </PagerBtn>
                    </Pagination>

                </Content>
            </Inner>

            {/* 밴 모달 */}
            {banModalOpen && selectedUser && (
                <ModalOverlay>
                    <ModalBox>
                        <h2>{selectedUser.name} 님을 밴 처리하시겠습니까?</h2>

                        <textarea
                            placeholder="밴 사유"
                            value={banReason}
                            onChange={(e) => setBanReason(e.target.value)}
                            style={{
                                width: "100%",
                                minHeight: "120px",
                                borderRadius: "12px",
                                border: "1px solid #ddd",
                                padding: "12px",
                                outline: "none",
                                resize: "none",
                                marginBottom: "20px"
                            }}
                        />

                        <ModalButtons>
                            <button onClick={closeBanModal}>취소</button>
                            <button onClick={handleBan}>예</button>
                        </ModalButtons>
                    </ModalBox>
                </ModalOverlay>
            )}
        </Wrap>
    );
}
