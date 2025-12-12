// src/pages/mypage/user/UserWishPage.jsx
import React, { useEffect, useState } from "react";
import axiosClient from "../../../../api/axiosClient";
import { useNavigate } from "react-router-dom";
import UserMyPageLayout from "../layout/UserMyPageLayout";
import "./UserWishPage.css";

export default function UserWishPage() {
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const buildImageUrl = (path) => {
        if (!path) return "";
        // 이미 절대 URL이면 그대로 사용
        if (path.startsWith("http://") || path.startsWith("https://")) {
            return path;
        }

        const base = process.env.REACT_APP_MINIO_URL || "http://localhost:9000";
        const bucket = process.env.REACT_APP_MINIO_BUCKET || "reviewhub-image";

        // 앞에 / 가 붙어 있으면 제거
        const cleanPath = path.startsWith("/") ? path.slice(1) : path;

        return `${base}/${bucket}/${cleanPath}`;
    };


    // 공통 가격 포맷
    const formatPrice = (price) => {
        if (price == null) return "";
        return price.toLocaleString("ko-KR");
    };

    // 찜 목록 조회
    const fetchWishlist = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await axiosClient.get("/api/wishlist", {
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
                    it.product_thumbnail_url ??
                    it.thumbnail_url ??
                    it.image_url ??
                    it.thumbnailUrl ??
                    "",
            }));

            setItems(mapped);
        } catch (e) {
            setError("찜 목록을 불러오는 중 오류가 발생했어요.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    // 찜 삭제 (컨트롤러: DELETE /api/wishlist?product_id=)
    const handleRemove = async (item) => {
        if (!window.confirm("이 상품을 찜 목록에서 삭제할까요?")) return;

        if (!item.product_id) {
            alert("상품 ID를 찾을 수 없어 삭제할 수 없습니다.");
            return;
        }

        try {
            await axiosClient.delete("/api/wishlist", {
                params: { product_id: item.product_id },
                withCredentials: true,
            });

            // 프론트 목록에서도 제거
            setItems((prev) =>
                prev.filter((it) => it.product_id !== item.product_id)
            );
        } catch (e) {
            alert("찜 목록에서 삭제하는 중 오류가 발생했어요.");
        }
    };

    // 장바구니 담기: /api/cart POST 후, 찜 목록에서 제거
    const handleAddToCart = async (item) => {
        if (item.is_sold_out) {
            alert("품절된 상품은 장바구니에 담을 수 없습니다.");
            return;
        }

        if (!item.product_id) {
            alert("상품 ID를 찾을 수 없어 장바구니에 담을 수 없습니다.");
            return;
        }

        try {
            // 1) 장바구니에 추가 (quantity는 1로 고정)
            await axiosClient.post(
                "/api/cart",
                {
                    product_id: item.product_id,
                    quantity: 1,
                },
                { withCredentials: true }
            );

            // 2) 찜 목록에서 제거
            await axiosClient.delete("/api/wishlist", {
                params: { product_id: item.product_id },
                withCredentials: true,
            });

            setItems((prev) =>
                prev.filter((it) => it.product_id !== item.product_id)
            );

            // 3) 알림 + 장바구니 이동 여부 확인
            const goCart = window.confirm(
                "장바구니에 담겼습니다! 장바구니로 이동하시겠습니까?"
            );

            if (goCart) {
                // 프로젝트에서 사용하는 장바구니 경로에 맞춰 변경
                navigate("/mypage/cart");
            }
        } catch (e) {
            console.error("장바구니 담기 오류:", e);
            alert("장바구니에 담는 중 오류가 발생했습니다.");
        }
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
                            {items.map((item) => {
                                const thumbUrl = buildImageUrl(item.thumbnail_url);
                                return (
                                <article
                                    key={item.wish_id ?? item.product_id}
                                    className={`wish-item ${
                                        item.is_sold_out ? "wish-item-soldout" : ""
                                    }`}
                                >
                                    {/* 썸네일 */}
                                    <div
                                        className="wish-thumb"
                                        onClick={() =>
                                            item.product_id &&
                                            navigate(`/product/${item.product_id}`)
                                        }
                                    >
                                        {item.thumbnail_url ? (
                                            <img
                                                src={thumbUrl}
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
                                    <div
                                        className="wish-info"
                                        onClick={() =>
                                            item.product_id &&
                                            navigate(`/product/${item.product_id}`)
                                        }
                                    >
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
                                );
                            })}
                        </div>
                    </div>
                )}
            </section>
        </UserMyPageLayout>
    );
}