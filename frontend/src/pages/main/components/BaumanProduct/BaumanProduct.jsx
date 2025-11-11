// src/features/skin/components/BaumanProduct/BaumanProduct.jsx
import React, { useEffect, useState } from "react";
import "./BaumanProduct.css";
import dummyData from "../../../../assets/dummyData.png";
import { getBaumannBadge } from "../../../../assets/baumann";
import { getTagIcon as getSkinTagIcon } from "../../../../assets/skinTag";
import axios from "axios";

// ✅ 먼저 화면에 보여줄 기본 더미 상품들
const DEFAULT_PRODUCTS = [
    {
        id: 1,
        brand: "라곰(LACOM)",
        name: "셀럽 마이크로 폼 클렌저",
        ratingText: "5.0/5.0",
        tags: ["저자극", "수분감"],
        discount: 0,
        price: 10000,
        isBest: true,
        imageUrl: null,
    },
    {
        id: 2,
        brand: "라곰(LACOM)",
        name: "셀럽 마이크로 폼 클렌저",
        ratingText: "5.0/5.0",
        tags: ["저자극", "수분감"],
        discount: 0,
        price: 10000,
        isBest: true,
        imageUrl: null,
    },
    {
        id: 3,
        brand: "라곰(LACOM)",
        name: "셀럽 마이크로 폼 클렌저",
        ratingText: "5.0/5.0",
        tags: ["저자극", "수분감"],
        discount: 0,
        price: 10000,
        isBest: true,
        imageUrl: null,
    },
    {
        id: 4,
        brand: "라곰(LACOM)",
        name: "셀럽 마이크로 폼 클렌저",
        ratingText: "5.0/5.0",
        tags: ["저자극", "수분감"],
        discount: 0,
        price: 10000,
        isBest: true,
        imageUrl: null,
    },
    {
        id: 5,
        brand: "라곰(LACOM)",
        name: "셀럽 마이크로 폼 클렌저",
        ratingText: "5.0/5.0",
        tags: ["저자극", "수분감"],
        discount: 0,
        price: 10000,
        isBest: true,
        imageUrl: null,
    },
    {
        id: 6,
        brand: "라곰(LACOM)",
        name: "셀럽 마이크로 폼 클렌저",
        ratingText: "5.0/5.0",
        tags: ["저자극", "수분감"],
        discount: 0,
        price: 10000,
        isBest: true,
        imageUrl: null,
    },
    {
        id: 7,
        brand: "라곰(LACOM)",
        name: "셀럽 마이크로 폼 클렌저",
        ratingText: "5.0/5.0",
        tags: ["저자극", "수분감"],
        discount: 0,
        price: 10000,
        isBest: true,
        imageUrl: null,
    },
    {
        id: 8,
        brand: "라곰(LACOM)",
        name: "셀럽 마이크로 폼 클렌저",
        ratingText: "5.0/5.0",
        tags: ["저자극", "수분감"],
        discount: 0,
        price: 10000,
        isBest: true,
        imageUrl: null,
    },
];

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

    // ✅ 처음에는 더미 상품이 바로 보이도록
    const [products, setProducts] = useState(DEFAULT_PRODUCTS);
    const [error, setError] = useState("");

    // 마운트 시 백엔드 추천 상품 불러오기 (성공하면 덮어쓰기)
    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                setError("");

                const res = await axios.get("/api/products/recommendations/baumann");

                const raw = Array.isArray(res.data)
                    ? res.data
                    : Array.isArray(res.data?.data)
                        ? res.data.data
                        : [];

                // 응답이 비어있으면 그냥 더미 유지
                if (!raw.length) return;

                const mapped = raw.map((p, idx) => {
                    const ratingValue =
                        typeof p.rating === "number" ? p.rating : Number(p.rating || 0);

                    return {
                        id: p.product_id ?? p.id ?? idx,
                        brand: p.prd_brand ?? p.brand ?? "",
                        name: p.prd_name ?? p.name ?? "",
                        price: p.price ?? 0,
                        ratingText: `${ratingValue.toFixed(1)}/5.0`,
                        imageUrl: p.image_url || null,
                        tags: [],      // 아직 API에 태그 정보 없으니 비워둠
                        discount: 0,
                        isBest: true,
                    };
                });

                setProducts(mapped);
            } catch (e) {
                console.error("추천 상품 불러오기 실패:", e);
                // 에러가 나더라도 화면은 DEFAULT_PRODUCTS 그대로 보여줌
                setError("추천 상품을 불러오지 못했습니다.");
            }
        };

        fetchRecommendations();
    }, []);

    if (!selectedType) return null;

    const handleClickProduct = (id) => {
        console.log("상품 클릭:", id);
        // 나중에 상세 페이지 있으면 여기서 navigate(`/products/${id}`)
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

                {/* (선택) 에러 메시지 */}
                {error && (
                    <p className="bauman-error">
                        {error}
                    </p>
                )}

                {/* ===== 상품 카드 그리드 ===== */}
                <div className="product-grid">
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
                                    <img src={item.imageUrl || dummyData} alt={item.name} />
                                </div>
                            </div>

                            {/* 텍스트 영역 */}
                            <div className="product-meta">
                                <div className="product-brand-row">
                                    <span className="product-brand">{item.brand}</span>
                                    <span className="product-rating">{item.ratingText}</span>
                                </div>

                                <p className="product-name">{item.name}</p>

                                {item.tags?.length > 0 && (
                                    <p className="product-tags">
                                        {item.tags.map((tag, i) => (
                                            <span key={i}>#{tag} </span>
                                        ))}
                                    </p>
                                )}

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