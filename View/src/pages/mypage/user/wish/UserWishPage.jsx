// src/pages/mypage/user/UserWishPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import UserMyPageLayout from "../layout/UserMyPageLayout";
import "./UserWishPage.css";

export default function UserWishPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // 공통 가격 포맷
    const formatPrice = (price) => {
        if (price == null) return "";
        return price.toLocaleString("ko-KR");
    };

    // ✅ 1. 찜 목록 조회
    const fetchWishlist = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await axios.get("/api/wishlist", {
                withCredentials: true,
            });

            // 응답 방어적 파싱 (WishlistResponseDTO 구조에 맞춰서)
            const raw = res.data;

            // 보통 DTO 이름: WishlistResponseDTO -> 안에 리스트가 하나 있을 가능성 높음
            let list = [];

            if (Array.isArray(raw)) {
                list = raw;
            } else if (Array.isArray(raw.wishlistItems)) {
                list = raw.wishlistItems;
            } else if (Array.isArray(raw.items)) {
                list = raw.items;
            } else if (Array.isArray(raw.wishlist)) {
                list = raw.wishlist;
            } else if (Array.isArray(raw.content)) {
                list = raw.content;
            } else {
                console.warn("예상치 못한 wishlist 응답 구조:", raw);
                list = [];
            }

            // 프론트에서 쓰기 편한 형태로 매핑
            const mapped = list.map((it) => ({
                // 키로 쓸 ID (wishlist_id / wish_id / product_id 등)
                wish_id:
                    it.wish_id ??
                    it.wishlist_id ??
                    it.id ??
                    it.product_id,

                product_id: it.product_id ?? it.prd_id ?? null,
                prd_name: it.prd_name ?? it.product_name ?? it.name ?? "",
                prd_brand: it.prd_brand ?? it.brand_name ?? it.brand ?? "",
                category: it.category ?? it.category_name ?? "",
                price: it.price ?? 0,
                is_sold_out: it.is_sold_out ?? it.sold_out ?? false,
                thumbnail_url:
                    it.thumbnail_url ??
                    it.image_url ??
                    it.thumbnailUrl ??
                    "",
            }));

            setItems(mapped);
        } catch (e) {
            console.error("❌ /api/wishlist 조회 실패:", e);
            setError("찜 목록을 불러오는 중 오류가 발생했어요.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    // ✅ 2. 찜 삭제 (컨트롤러: DELETE /api/wishlist?product_id=)
    const handleRemove = async (item) => {
        if (!window.confirm("이 상품을 찜 목록에서 삭제할까요?")) return;

        if (!item.product_id) {
            alert("상품 ID를 찾을 수 없어 삭제할 수 없습니다.");
            return;
        }

        try {
            await axios.delete("/api/wishlist", {
                params: { product_id: item.product_id },
                withCredentials: true,
            });

            // 프론트 목록에서도 제거
            setItems((prev) =>
                prev.filter((it) => it.product_id !== item.product_id)
            );
        } catch (e) {
            console.error("❌ 찜 삭제 실패:", e);
            alert("찜 목록에서 삭제하는 중 오류가 발생했어요.");
        }
    };

    // 🔸 장바구니 담기는 아직 백엔드 스펙 안 받았으니까 더미 알럿 유지
    const handleAddToCart = (item) => {
        if (item.is_sold_out) {
            alert("품절된 상품은 장바구니에 담을 수 없습니다.");
            return;
        }
        alert(
            `"${item.prd_name}" 상품을 장바구니에 담는 API는 나중에 연동될 예정입니다.`
        );
    };

    return (
        <UserMyPageLayout>
            <section className="mypage-section wish-section">
                <div className="wish-header-row">
                    <h3 className="mypage-section-title">찜 상품</h3>
                    <span className="wish-count">
                        총 <strong>{items.length}</strong>개
                    </span>
                </div>

                {/* 로딩 / 에러 */}
                {loading && (
                    <div className="wish-empty-box">찜 상품을 불러오는 중입니다...</div>
                )}
                {error && <div className="wish-error">{error}</div>}

                {!loading && !error && items.length === 0 && (
                    <div className="wish-empty-box">
                        아직 찜한 상품이 없습니다.
                        <br />
                        마음에 드는 상품을 찜해 보세요.
                    </div>
                )}

                {!loading && !error && items.length > 0 && (
                    <div className="wish-card">
                        <div className="wish-list">
                            {items.map((item) => (
                                <article
                                    key={item.wish_id ?? item.product_id}
                                    className={`wish-item ${
                                        item.is_sold_out ? "wish-item-soldout" : ""
                                    }`}
                                >
                                    {/* 썸네일 */}
                                    <div className="wish-thumb">
                                        {item.thumbnail_url ? (
                                            <img
                                                src={item.thumbnail_url}
                                                alt={item.prd_name}
                                            />
                                        ) : (
                                            <span className="wish-thumb-placeholder">
                                                이미지
                                            </span>
                                        )}

                                        {item.is_sold_out && (
                                            <span className="wish-badge wish-badge-soldout">
                                                품절
                                            </span>
                                        )}
                                    </div>

                                    {/* 가운데 정보 */}
                                    <div className="wish-info">
                                        <div className="wish-brand">{item.prd_brand}</div>
                                        <div className="wish-name">{item.prd_name}</div>
                                        <div className="wish-category">{item.category}</div>
                                        <div className="wish-price-row">
                                            <span className="wish-price">
                                                {formatPrice(item.price)}원
                                            </span>
                                        </div>
                                    </div>

                                    {/* 우측 버튼 */}
                                    <div className="wish-actions">
                                        <button
                                            type="button"
                                            className="wish-cart-btn"
                                            onClick={() => handleAddToCart(item)}
                                            disabled={item.is_sold_out}
                                        >
                                            장바구니 담기
                                        </button>
                                        <button
                                            type="button"
                                            className="wish-remove-btn"
                                            onClick={() => handleRemove(item)}
                                        >
                                            삭제
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                )}
            </section>
        </UserMyPageLayout>
    );
}