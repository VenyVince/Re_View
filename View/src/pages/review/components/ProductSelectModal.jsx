// src/pages/review/components/ProductSelectModal.jsx
import React, { useEffect, useState } from "react";
import "./ProductSelectModal.css";
import {
    fetchOrders,
    fetchOrderDetail,
    checkReviewExists,
} from "../../../api/review/reviewApi";

// 날짜 자르기
function formatDate(dateString) {
    if (!dateString) return "";

    const d = new Date(dateString);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

const PAGE_SIZE = 5;

const ProductSelectModal = ({ onClose, onSelect }) => {
    const [items, setItems] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadItems();
    }, []);

    async function loadItems() {
        try {
            const orderRes = await fetchOrders();
            const orders = orderRes.data;

            let allItems = [];

            for (const order of orders) {
                const detail = await fetchOrderDetail(order.order_id);
                const orderItems = detail.data.order_items.map((item) => ({
                    ...item,
                    purchase_date: order.created_at,
                }));
                allItems.push(...orderItems);
            }

            const withStatus = await Promise.all(
                allItems.map(async (item) => {
                    try {
                        const r = await checkReviewExists(item.order_item_id);
                        return {
                            ...item,
                            canCreate: r.data.canCreate,
                        };
                    } catch {
                        return { ...item, canCreate: null };
                    }
                })
            );

            setItems(withStatus);
            applyFilter(withStatus);
        } catch (error) {
            console.error(error);
            alert("구매한 상품을 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    }

    const applyFilter = (baseList = items) => {
        const result = baseList.filter((i) => i.canCreate === true);
        setFiltered(result);
        setPage(1);
    };

    const startIndex = (page - 1) * PAGE_SIZE;
    const paginated = filtered.slice(startIndex, startIndex + PAGE_SIZE);

    return (
        <div className="modal-backdrop">
            <div className="modal-box">
                <h2 className="modal-title">구매한 상품 선택</h2>

                <div className="item-list">
                    {loading ? (
                        <div className="empty">⏳ 불러오는 중...</div>
                    ) : paginated.length === 0 ? (
                        <div className="empty">상품이 없습니다</div>
                    ) : (
                        paginated.map((item) => (
                            <div
                                key={item.order_item_id}
                                className="item-card"
                                onClick={() => onSelect(item)}
                            >
                                <div className="item-info">
                                    <div className="name">{item.product_name}</div>
                                    <div className="price">
                                        ₩{item.product_price.toLocaleString()}
                                    </div>
                                    <div className="date">
                                        구매 날짜 {formatDate(item.purchase_date)}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="pagination">
                    <button disabled={page === 1} onClick={() => setPage(page - 1)}>
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
