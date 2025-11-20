// src/pages/mypage/user/UserWishPage.jsx
import React, { useState } from "react";
import UserMyPageLayout from "./UserMyPageLayout";
import wishDummy from "./dummy/wishDummy";
import "./UserWishPage.css";

export default function UserWishPage() {
    const [items, setItems] = useState(wishDummy);

    const handleRemove = (wishId) => {
        if (!window.confirm("이 상품을 찜 목록에서 삭제할까요?")) return;
        setItems((prev) => prev.filter((it) => it.wish_id !== wishId));
    };

    const handleAddToCart = (item) => {
        if (item.is_sold_out) {
            alert("품절된 상품은 장바구니에 담을 수 없습니다.");
            return;
        }
        alert(
            `"[더미] ${item.prd_name}" 상품을 장바구니에 담는 API가 나중에 연동될 예정입니다.`
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

                {items.length === 0 ? (
                    <div className="wish-empty-box">
                        아직 찜한 상품이 없습니다.
                        <br />
                        마음에 드는 상품을 찜해 보세요.
                    </div>
                ) : (
                    <div className="wish-card">
                        <div className="wish-list">
                            {items.map((item) => (
                                <article
                                    key={item.wish_id}
                                    className={`wish-item ${
                                        item.is_sold_out ? "wish-item-soldout" : ""
                                    }`}
                                >
                                    {/* 썸네일 */}
                                    <div className="wish-thumb">
                                        {item.thumbnail_url ? (
                                            <img src={item.thumbnail_url} alt={item.prd_name} />
                                        ) : (
                                            <span className="wish-thumb-placeholder">이미지</span>
                                        )}

                                        {item.is_best && (
                                            <span className="wish-badge wish-badge-best">best</span>
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
                        {item.price.toLocaleString("ko-KR")}원
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
                                            onClick={() => handleRemove(item.wish_id)}
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