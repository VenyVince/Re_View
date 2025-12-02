// src/pages/review/components/ProductSelectModal.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProductSelectModal.css"; // 스타일 따로 분리

const PAGE_SIZE = 5;

const ProductSelectModal = ({ onClose, onSelect }) => {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    const startIndex = (page - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;

    const paginatedItems = items.slice(startIndex, endIndex);

    useEffect(() => {
        fetchOrders();
    }, []);

    async function fetchOrders() {
        try {
            // 주문 목록 가져오기
            const res = await axios.get("/api/orders");
            const orders = res.data;

            let allItems = [];

            // 주문 상세에서 order_items 가져오기
            for (const order of orders) {
                const detail = await axios.get(`/api/orders/${order.order_id}`);

                if (detail.data.order_items) {
                    // order_items에 구매 날짜(created_at)도 붙여주기
                    const items = detail.data.order_items.map((item) => ({
                        ...item,
                        purchase_date: order.created_at
                    }));
                    allItems.push(...items);
                }
            }

            setItems(allItems);
        } catch (error) {
            console.error(error);
            alert("구매한 상품을 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="modal-backdrop">
            <div className="modal-box">
                <h2 className="modal-title">구매한 상품 선택</h2>

                <div className="item-list">
                    {/* 로딩 중 */}
                    {loading ? (
                        <div className="empty">⏳ 불러오는 중...</div>
                    ) : paginatedItems.length === 0 ? (
                        <div className="empty">구매한 상품이 없습니다</div>
                    ) : (
                        paginatedItems.map((item) => {
                            const name = item?.product_name ?? "상품명 없음";
                            const price = item?.product_price ?? 0;
                            const date = item?.purchase_date ?? "날짜 없음";

                            return (
                                <div
                                    key={item.order_item_id}
                                    className="item-box"
                                    onClick={() => onSelect(item)}
                                >
                                    <div className="thumb">🛒</div>

                                    <div className="item-info">
                                        <div className="name">{name}</div>
                                        <div className="price">
                                            ₩{price.toLocaleString()}
                                        </div>
                                        <div className="date">
                                            구매 날짜 {date}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="pagination">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(page - 1)}
                    >
                        이전
                    </button>

                    <span>{page}</span>

                    <button
                        disabled={endIndex >= items.length}
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
