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

    const BAUMANN_ID_MAP = {
        DSPW: 1, DSPT: 2, DSP_: 3, DSNW: 4, DSNT: 5, DSN_: 6, DS_W: 7, DS_T: 8, DS__: 9,
        DRPW: 10, DRPT: 11, DRP_: 12, DRNW: 13, DRNT: 14, DRN_: 15, DR_W: 16, DR_T: 17, DR__: 18,
        D_PW: 19, D_PT: 20, D_P_: 21, D_NW: 22, D_NT: 23, D_N_: 24, D__W: 25, D__T: 26, D___: 27,
        OSPW: 28, OSPT: 29, OSP_: 30, OSNW: 31, OSNT: 32, OSN_: 33, OS_W: 34, OS_T: 35, OS__: 36,
        ORPW: 37, ORPT: 38, ORP_: 39, ORNW: 40, ORNT: 41, ORN_: 42, OR_W: 43, OR_T: 44, OR__: 45,
        O_PW: 46, O_PT: 47, O_P_: 48, O_NW: 49, O_NT: 50, O_N_: 51, O__W: 52, O__T: 53, O___: 54,
        _SPW: 55, _SPT: 56, _SP_: 57, _SNW: 58, _SNT: 59, _SN_: 60, _S_W: 61, _S_T: 62, _S__: 63,
        _RPW: 64, _RPT: 65, _RP_: 66, _RNW: 67, _RNT: 68, _RN_: 69, _R_W: 70, _R_T: 71, _R__: 72,
        __PW: 73, __PT: 74, __P_: 75, __NW: 76, __NT: 77, __N_: 78, ___W: 79, ___T: 80, ____: 81,
    };
    const getBaumannTypeById = (id) => {
        return Object.keys(BAUMANN_ID_MAP).find(
            key => BAUMANN_ID_MAP[key] === id
        ) || 'UNKNOWN';
    };

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
        if (adminItem && adminItem.review_id) {
            navigate(`/review/${adminItem.review_id}`);
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

                    {/* MORE 버튼 */}
                    <button
                        className="best-review__more"
                        onClick={(e) => {
                            e.stopPropagation(); // 카드 클릭 방지
                            navigate(`/reviews`);
                        }}
                        aria-label="다른 리뷰 더보기"
                    >
                         more >>
                    </button>

                    <div className="best-review__meta">
                        <span className="best-review__baumann">{getBaumannTypeById(adminItem.baumann_id)}</span>
                        <span className="best-review__author">{adminItem.nickname}</span>
                    </div>
                    <div className="best-review__row">
                        <h3 className="best-review__name">{adminItem.product_name}</h3>
                        <span className="best-review__badge">추천 리뷰</span>
                    </div>
                    <div className="best-review__price-row">
                        <span className="best-review__price">
                            {formatPrice(adminItem.price)}
                            <span className="best-review__price-unit">원</span>
                        </span>
                    </div>
                    <p className="best-review__excerpt">{adminItem.content}</p>
                </div>

            </article>
        </section>
    );
}