import React from 'react';
import './BestReview.css';

// 데모용 아이템들
const demoItems = [
    {
        id: 1,
        brand: '라곰(LACOM)',
        title: '셀럽 마이크로 폼 클렌저',
        badge: '1.2k 추천',
        discount: 0,
        price: 10000,
        excerpt: '왜 사람들이 극찬하는지 알 것 같은 제품이에요. 세정력이 좋고 마무리도 깔끔…',
        image: null,
    },
    {
        id: 2,
        brand: '바이오더마',
        title: '하이드라비오 토너',
        badge: 'BEST',
        discount: 15,
        price: 38000,
        excerpt: '수분감이 오래가고 자극이 적어서 데일리 토너로 좋아요.',
        image: null,
    },
];

function formatPrice(n) {
    try { return Number(n).toLocaleString(); } catch { return n; }
}

/**
 * BestReview
 * - 메인에서는 대표 1개만 보여주되, 필요하면 props.index로 어떤 걸 보여줄지 선택 가능
 */
export default function BestReview({ items = demoItems, index = 0 }) {
    const item = items[index] || items[0];

    return (
        <section className="best-review" aria-label="베스트 리뷰">
            <h2 className="best-review__title">Best 리뷰</h2>

            <article className="best-review__card">
                {/* 썸네일 */}
                <div className="best-review__thumb">
                    {item.image ? (
                        <img src={item.image} alt={item.title} />
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

                {/* 내용 */}
                <div className="best-review__content">
                    <div className="best-review__brand">{item.brand}</div>

                    <div className="best-review__row">
                        <h3 className="best-review__name">{item.title}</h3>
                        {item.badge && <span className="best-review__badge">{item.badge}</span>}
                    </div>

                    <div className="best-review__price-row">
                        <span className="best-review__discount">{item.discount}%</span>
                        <span className="best-review__price">
              {formatPrice(item.price)} <span className="best-review__price-unit">원</span>
            </span>
                    </div>

                    <p className="best-review__excerpt">{item.excerpt}</p>
                </div>
            </article>
        </section>
    );
}