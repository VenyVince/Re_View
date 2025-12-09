import React, { useEffect, useState } from "react";
import {
    Wrap, Inner, Content, TitleRow, Title, FilterRow, LeftFilterGroup,
    RightSearchGroup, SearchInput, FilterSelect, TableWrapper, OrderTable, StatusBadge,
    ActionButton, PaginationBox} from "./AdminOrderPage.style";
import OrderStatusModal from "./OrderStatusModal";
import { searchOrders, updateOrderStatus } from "../../../api/admin/adminOrderApi";

const normalizeStatus = (status) => {
    if (!status) return null;

    const map = {
        "주문완료": "completed",
        "배송중": "in_delivery",
        "배송 중": "in_delivery",
        "배송완료": "delivered",

        // 이미 영어일 수도 있으니 그대로 유지
        "completed": "completed",
        "in_delivery": "in_delivery",
        "delivered": "delivered",

        // Swagger 예시
        "SHIPPED": "in_delivery",
        "DELIVERED": "delivered"
    };

    return map[status] || status;
};

const displayLabel = {
    "completed": "주문완료",
    "in_delivery": "배송중",
    "delivered": "배송완료"
};


export default function AdminOrderPage() {
    const [orders, setOrders] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [status, setStatus] = useState("all");
    const [sort, setSort] = useState("latest");

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const pageSize = 20;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    const pagedOrders = orders.slice(start, end);


    const statusMap = {
        "주문완료": "completed",
        "배송중": "in_delivery",
        "배송완료": "delivered",

        // 혹시 백엔드가 영문으로 보내줄 수도 있으니 대비
        "completed": "completed",
        "in_delivery": "in_delivery",
        "delivered": "delivered",
    };

    const statusLabelMap = {
        "completed": "주문완료",
        "in_delivery": "배송중",
        "delivered": "배송완료",

        // DB에 들어 있을 수 있는 한글 값들도 매핑
        "배송중": "배송중",
        "배송완료": "배송완료",
        "주문완료": "주문완료",

        // 혹시 SHIPPED 같은 영문도 대비
        "SHIPPED": "배송중",
        "DELIVERED": "배송완료",
    };



    /** 주문 조회 */
    const fetchOrders = async () => {
        try {
            const res = await searchOrders(keyword, status, sort, page);

            // 응답이 배열이면 그대로 orders로 사용
            setOrders(Array.isArray(res.data) ? res.data : []);

        } catch (err) {
            console.error(err);
            alert("주문 목록을 불러오지 못했습니다.");
        }
    };

    useEffect(() => {
        setTotalPages(Math.ceil(orders.length / pageSize));
    }, [orders]);


    useEffect(() => {
        fetchOrders();
    }, [status, sort, page]);

    /** 상태 흐름 */
    const getNextStatus = (cur) => {
        const key = normalizeStatus(cur);

        if (key === "completed") return "in_delivery";
        if (key === "in_delivery") return "delivered";
        return null;
    };

    const displayMap = {
        "completed": "주문완료",
        "in_delivery": "배송중",
        "delivered": "배송완료",

        "주문완료": "주문완료",
        "배송중": "배송중",
        "배송완료": "배송완료",
    };


    /** 상태 변경 */
    const handleUpdateStatus = async (orderId, nextStatus) => {
        try {
            await updateOrderStatus(orderId, nextStatus);
            alert("주문 상태가 변경되었습니다.");
            fetchOrders();
        } catch (err) {
            console.error(err);
            alert("상태 변경 실패");
        }
    };

    return (
        <Wrap>
            <Inner>
                <Content>

                    {/* 제목 */}
                    <TitleRow>
                        <Title>주문 / 배송 관리</Title>
                    </TitleRow>

                    {/* 필터 */}
                    <FilterRow>

                        {/* 왼쪽 : 상태/정렬 */}
                        <LeftFilterGroup>
                            <FilterSelect value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }}>
                                <option value="all">전체</option>
                                <option value="completed">주문완료</option>
                                <option value="in_delivery">배송중</option>
                                <option value="delivered">배송완료</option>
                            </FilterSelect>

                            <FilterSelect value={sort} onChange={(e) => { setPage(1); setSort(e.target.value); }}>
                                <option value="latest">최신순</option>
                                <option value="oldest">오래된순</option>
                            </FilterSelect>
                        </LeftFilterGroup>

                        {/* 오른쪽 : 검색 */}
                        <RightSearchGroup>
                            <SearchInput
                                placeholder="주문번호 또는 운송장 번호 입력"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />

                            <ActionButton onClick={() => { setPage(1); fetchOrders(); }}>
                                검색
                            </ActionButton>
                        </RightSearchGroup>

                    </FilterRow>

                    {/* 테이블 */}
                    <TableWrapper>
                        <OrderTable>
                            <thead>
                            <tr>
                                <th>주문번호</th>
                                <th>사용자</th>
                                <th>가격</th>
                                <th>상태</th>
                                <th>주문일</th>
                                <th>관리</th>
                            </tr>
                            </thead>

                            <tbody>
                            {orders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: "center", padding: "30px" }}>
                                        주문 내역이 없습니다.
                                    </td>
                                </tr>
                            ) : (
                                pagedOrders.map(order => {
                                    const next = getNextStatus(order.order_status);

                                    return (
                                        <tr key={order.order_id}>
                                            <td>{order.order_no}</td>
                                            <td>{order.user_name}</td>

                                            <td>{Number(order.total_price).toLocaleString()} 원</td>

                                            <td>
                                                <StatusBadge status={normalizeStatus(order.order_status)}>
                                                    {displayLabel[normalizeStatus(order.order_status)]}
                                                </StatusBadge>
                                            </td>

                                            <td>{order.created_at}</td>

                                            <td>
                                                <ActionButton
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setModalOpen(true);
                                                    }}
                                                >
                                                    상태 변경
                                                </ActionButton>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                            </tbody>

                        </OrderTable>
                    </TableWrapper>

                    {/* 페이지네이션 */}
                    <PaginationBox>
                        <button disabled={page === 1} onClick={() => setPage(page - 1)}>이전</button>
                        <span>{page} / {totalPages}</span>
                        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>다음</button>
                    </PaginationBox>

                    <OrderStatusModal
                        visible={modalOpen}
                        currentStatus={selectedOrder?.order_status}
                        onClose={() => setModalOpen(false)}
                        onSave={(newStatus) => {
                            handleUpdateStatus(selectedOrder.order_id, newStatus);
                            setModalOpen(false);
                        }}
                    />

                </Content>
            </Inner>
        </Wrap>
    );
}
