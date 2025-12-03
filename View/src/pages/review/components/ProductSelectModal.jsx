// src/pages/review/components/ProductSelectModal.jsx
import React, { useEffect, useState } from "react";
import "./ProductSelectModal.css";
import {
    fetchOrders,
    fetchOrderDetail,
    checkReviewExists,
} from "../../../api/review/reviewApi";

const PAGE_SIZE = 5;

const ProductSelectModal = ({ onClose, onSelect }) => {
    const [items, setItems] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [page, setPage] = useState(1);
    const [filterType, setFilterType] = useState("ALL"); // ALL | NOT_WRITTEN | DONE
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadItems();
    }, []);

    async function loadItems() {
        try {
            const orderRes = await fetchOrders();
            const orders = orderRes.data;

            let allItems = [];

            // 주문 상세 불러오기
            for (const order of orders) {
                const detail = await fetchOrderDetail(order.order_id);
                const orderItems = detail.data.order_items.map((item) => ({
                    ...item,
                    purchase_date: order.created_at,
                }));
                allItems.push(...orderItems);
            }

            // 리뷰 존재 여부 확인
            const withStatus = await Promise.all(
                allItems.map(async (item) => {
                    try {
                        const r = await checkReviewExists(item.order_item_id);

                        return {
                            ...item,
                            canCreate: r.data.canCreate, // true = 작성 가능
                        };
                    } catch (e) {
                        return {
                            ...item,
                            canCreate: null, // 오류 시 null 처리
                        };
                    }
                })
            );

            setItems(withStatus);
            applyFilter(filterType, withStatus);
        } catch (error) {
            console.error(error);
            alert("구매한 상품을 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    }

    // 필터 적용
    const applyFilter = (type, baseList = items) => {
        let result = baseList;

        if (type === "NOT_WRITTEN") {
            result = baseList.filter((i) => i.canCreate === true);
        } else if (type === "DONE") {
            result = baseList.filter((i) => i.canCreate === false);
        }

        setFiltered(result);
        setPage(1);
    };

    useEffect(() => {
        applyFilter(filterType);
    }, [filterType]);

    const startIndex = (page - 1) * PAGE_SIZE;
    const paginated = filtered.slice(startIndex, startIndex + PAGE_SIZE);

    return (
        <div className="modal-backdrop">
            <div className="modal-box">
                <h2 className="modal-title">구매한 상품 선택</h2>

                {/* 필터 */}
                <div className="filter-tabs">
                    <button
                        className={filterType === "ALL" ? "active" : ""}
                        onClick={() => setFilterType("ALL")}
                    >
                        전체
                    </button>
                    <button
                        className={filterType === "NOT_WRITTEN" ? "active" : ""}
                        onClick={() => setFilterType("NOT_WRITTEN")}
                    >
                        미작성
                    </button>
                    <button
                        className={filterType === "DONE" ? "active" : ""}
                        onClick={() => setFilterType("DONE")}
                    >
                        작성완료
                    </button>
                </div>

                {/* 목록 */}
                <div className="item-list">
                    {loading ? (
                        <div className="empty">⏳ 불러오는 중...</div>
                    ) : paginated.length === 0 ? (
                        <div className="empty">상품이 없습니다</div>
                    ) : (
                        paginated.map((item) => (
                            <div
                                key={item.order_item_id}
                                className="item-box"
                                onClick={() => onSelect(item)}
                            >
                                <div className="thumb">🛒</div>

                                <div className="item-info">
                                    <div className="name">{item.product_name}</div>
                                    <div className="price">
                                        ₩{item.product_price.toLocaleString()}
                                    </div>
                                    <div className="date">
                                        구매 날짜 {item.purchase_date}
                                    </div>
                                </div>

                                {/* 체크 아이콘 (리뷰 작성 완료) */}
                                {item.canCreate === false && (
                                    <div className="check-icon">✔</div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* 페이지네이션 */}
                <div className="pagination">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                    >
                        이전
                    </button>
                    <span>{page}</span>
                    <button
                        disabled={startIndex + PAGE_SIZE >= filtered.length}
                        onClick={() => setPage(page + 1)}
                    >
                        다음
                    </button>
                </div>

                <button className="close-btn" onClick={onClose}>
                    닫기
                </button>
            </div>
        </div>
    );
};

export default ProductSelectModal;
