import React, { useState, useEffect } from 'react';
import axiosClient from "api/axiosClient"
import { useNavigate } from 'react-router-dom'; // 1. useNavigate 추가
import './AdminPickReview.css';

function formatPrice(n) {
    try {
        return Number(n).toLocaleString();
    } catch {
        return n;
    }
}

export default function AdminPick() {
    // 2. navigate 훅 생성
    const navigate = useNavigate();

    const [adminItem, setAdminItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAdminPick = async () => {
            try {
                const response = await axiosClient.get('/api/recommendations/admin-pick');
                const wrapper = response.data;

                if (wrapper.admin_pick) {
                    setAdminItem(wrapper.admin_pick);
                } else {
                    setAdminItem(null);
                }
            } catch (err) {
                console.error("Failed to fetch admin pick:", err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminPick();
    }, []);

    // 3. 클릭 핸들러 추가: 요청하신 /product/{product_id} 경로로 이동
    const handleCardClick = () => {
        if (adminItem && adminItem.product_id) {
            navigate(`/product/${adminItem.product_id}`);
        } else {
            console.warn("이동할 상품 ID가 없습니다.");
        }
    };

    // Loading State
    if (loading) {
        return (
            <section className="best-review">
                <h2 className="best-review__title">운영자 Pick 리뷰</h2>
                <div className="best-review__card" style={{ justifyContent: 'center', padding: '20px' }}>
                    Loading...
                </div>
            </section>
        );
    }

    if (error || !adminItem) {
        return null;
    }

    return (
        <section className="best-review" aria-label="운영자 추천 상품">
            <h2 className="best-review__title">운영자 Pick 리뷰</h2>

            <article
                className="best-review__card"
                onClick={handleCardClick}      // 4. 클릭 이벤트 연결
                style={{ cursor: 'pointer' }}  // 5. 마우스 커서를 손가락 모양으로 변경
            >
                {/* Thumbnail */}
                <div className="best-review__thumb">
                    {adminItem.thumbnail_url ? (
                        <img src={adminItem.thumbnail_url} alt={adminItem.product_name} />
                    ) : (
                        <div className="best-review__thumb--placeholder" aria-hidden="true">
                            <svg width="64" height="64" viewBox="0 0 24 24">
                                <path d="M4 5h16v14H4z" fill="none" stroke="currentColor" />
                                <circle cx="8" cy="9" r="1.5" fill="currentColor" />
                                <path d="M4 17l5-5 3 3 3-4 5 6" fill="none" stroke="currentColor" />
                            </svg>
                        </div>
                    )}
                </div>

                <div className="best-review__content">
                    <div className="best-review__brand">{adminItem.product_brand}</div>

                    <div className="best-review__row">
                        <h3 className="best-review__name">{adminItem.product_name}</h3>
                        <span className="best-review__badge">추천 리뷰</span>
                    </div>

                    <div className="best-review__price-row">
                        <span className="best-review__price">
                            {formatPrice(adminItem.price)} <span className="best-review__price-unit">원</span>
                        </span>
                    </div>

                    <p className="best-review__excerpt">{adminItem.content}</p>
                </div>
            </article>
        </section>
    );
}