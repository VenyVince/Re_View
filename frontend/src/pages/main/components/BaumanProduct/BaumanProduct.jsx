// src/features/skin/components/BaumanProduct/BaumanProduct.jsx
import React, { useEffect, useState } from "react";
import "./BaumanProduct.css";
import dummyData from "../../../../assets/dummyData.png";
import { getBaumannBadge } from "../../../../assets/baumann";
import { getTagIcon as getSkinTagIcon } from "../../../../assets/skinTag";
import axios from "axios";

export default function BaumanProduct() {
    // TODO: 나중에 로그인한 유저의 타입으로 교체
    const currentType = "DRNW";

    const skinTypeList = [
        { type: "DRNT", tags: ["건성", "저자극", "비색소", "탄력"] },
        { type: "DRNW", tags: ["건성", "저자극", "비색소", "주름"] },
        { type: "DRPT", tags: ["건성", "저자극", "색소성", "탄력"] },
        { type: "DRPW", tags: ["건성", "저자극", "색소성", "주름"] },
        { type: "DSNT", tags: ["건성", "민감성", "비색소", "탄력"] },
        { type: "DSNW", tags: ["건성", "민감성", "비색소", "주름"] },
        { type: "DSPT", tags: ["건성", "민감성", "색소성", "탄력"] },
        { type: "DSPW", tags: ["건성", "민감성", "색소성", "주름"] },
        { type: "ORNT", tags: ["지성", "저자극", "비색소", "탄력"] },
        { type: "ORNW", tags: ["지성", "저자극", "비색소", "주름"] },
        { type: "ORPT", tags: ["지성", "저자극", "색소성", "탄력"] },
        { type: "ORPW", tags: ["지성", "저자극", "색소성", "주름"] },
        { type: "OSNT", tags: ["지성", "민감성", "비색소", "탄력"] },
        { type: "OSNW", tags: ["지성", "민감성", "비색소", "주름"] },
        { type: "OSPT", tags: ["지성", "민감성", "색소성", "탄력"] },
        { type: "OSPW", tags: ["지성", "민감성", "색소성", "주름"] },
    ];

    const selectedType = skinTypeList.find((t) => t.type === currentType);

    // 🔥 추천 상품 상태
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // 컴포넌트 마운트 시 추천 상품 불러오기
    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                setLoading(true);
                setError("");

                const res = await axios.get("/api/products/recommendations/baumann");

                // 백엔드에서 오는 형식에 대비해서 두 가지 케이스 처리:
                // 1) 바로 배열
                // 2) { status, message, data: [...] }
                const raw =
                    Array.isArray(res.data)
                        ? res.data
                        : Array.isArray(res.data?.data)
                            ? res.data.data
                            : [];

                const mapped = raw.map((p) => {
                    const ratingValue =
                        typeof p.rating === "number" ? p.rating : Number(p.rating || 0);

                    return {
                        id: p.product_id ?? p.id,
                        brand: p.prd_brand ?? p.brand,
                        name: p.prd_name ?? p.name,
                        price: p.price ?? 0,
                        ratingText: `${ratingValue.toFixed(1)}/5.0`,
                        imageUrl: p.image_url || null,
                        // 태그 정보는 API 명세에 없어서 일단 비워둠 (나중에 추가 가능)
                        tags: [],
                        discount: 0,
                        isBest: true,
                    };
                });

                setProducts(mapped);
            } catch (e) {
                console.error("추천 상품 불러오기 실패:", e);
                setError("추천 상품을 불러오지 못했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    if (!selectedType) return null;

    // (참고) 나중에 상품 클릭 시 상세 조회 / 페이지 이동에 쓸 수 있는 자리
    // 지금은 아직 상세 페이지 라우트가 없으니 콘솔만 찍어둔다.
    const handleClickProduct = (id) => {
        console.log("상품 클릭:", id);
        // 예시) 나중에 만들면
        // navigate(`/products/${id}`);
        // 또는 axios.get(`/api/products/${id}`) 로 상세데이터를 따로 가져올 수도 있음
    };

    return (
        <section className="bauman-section">
            {/* 상단 제목 */}
            <h2 className="bauman-title">{selectedType.type} 의 추천 상품</h2>

            <div className="bauman-box">
                {/* 상단 타입 박스 영역 */}
                <div className="bauman-header">
                    <div className="bauman-header-right">
                        {/* 타입 배지 */}
                        <div className="bauman-type-badge">
                            <img
                                src={getBaumannBadge(currentType)}
                                alt={selectedType.type}
                                className="bauman-main-img"
                            />
                            <div className="bauman-type-text">
                                <div className="bauman-type-code">{selectedType.type}</div>
                                <div className="bauman-type-tags">
                                    {selectedType.tags.map((tag, idx) => (
                                        <span key={idx}>#{tag} </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 태그 버튼들 */}
                        <div className="bauman-tag-buttons">
                            <button className="bauman-tag-btn bauman-tag-all">ALL</button>
                            {selectedType.tags.map((tag, idx) => (
                                <button key={idx} className="bauman-tag-btn">
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* (선택) 에러 메시지 표시 */}
                {error && (
                    <p className="bauman-error">
                        {error}
                    </p>
                )}

                {/* ===== 상품 카드 그리드 ===== */}
                <div className="product-grid">
                    {/* 로딩 중일 때는 더미 카드 몇 개 보여주고 싶으면 여기서 처리해도 됨 */}
                    {loading && products.length === 0 && (
                        <>
                            {Array.from({ length: 8 }).map((_, idx) => (
                                <article key={idx} className="product-card">
                                    <div className="product-thumb">
                                        <div className="product-thumb-inner">
                                            <img src={dummyData} alt="loading" />
                                        </div>
                                    </div>
                                    <div className="product-meta">
                                        <div className="product-brand-row">
                                            <span className="product-brand">로딩 중...</span>
                                        </div>
                                        <p className="product-name">&nbsp;</p>
                                    </div>
                                </article>
                            ))}
                        </>
                    )}

                    {!loading && products.length === 0 && !error && (
                        <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "#777" }}>
                            추천 상품이 없습니다.
                        </p>
                    )}

                    {products.map((item) => (
                        <article
                            key={item.id}
                            className="product-card"
                            onClick={() => handleClickProduct(item.id)}
                            style={{ cursor: "pointer" }}
                        >
                            {/* 썸네일 + BEST 뱃지 */}
                            <div className="product-thumb">
                                {item.isBest && <span className="product-badge">Best</span>}
                                <div className="product-thumb-inner">
                                    <img
                                        src={item.imageUrl || dummyData}
                                        alt={item.name}
                                    />
                                </div>
                            </div>

                            {/* 텍스트 영역 */}
                            <div className="product-meta">
                                {/* 브랜드 / 평점 */}
                                <div className="product-brand-row">
                                    <span className="product-brand">{item.brand}</span>
                                    <span className="product-rating">{item.ratingText}</span>
                                </div>

                                {/* 상품명 */}
                                <p className="product-name">{item.name}</p>

                                {/* 해시태그 (지금은 더미/빈 데이터) */}
                                {item.tags.length > 0 && (
                                    <p className="product-tags">
                                        {item.tags.map((tag, i) => (
                                            <span key={i}>#{tag} </span>
                                        ))}
                                    </p>
                                )}

                                {/* 가격 */}
                                <div className="product-price-row">
                                    <span className="product-discount">
                                        {item.discount.toString().padStart(2, "0")}%
                                    </span>
                                    <span className="product-price">
                                        {item.price.toLocaleString()}
                                        <span className="product-price-unit"> 원</span>
                                    </span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                {/* 하단 페이지네이션 (모양만) */}
                <div className="bauman-pagination">
                    <button className="page-arrow" disabled>
                        &lt;
                    </button>
                    <span className="page-indicator">1 / 3</span>
                    <button className="page-arrow" disabled>
                        &gt;
                    </button>
                </div>
            </div>
        </section>
    );
}

