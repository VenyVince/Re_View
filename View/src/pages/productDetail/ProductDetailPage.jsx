import React, { useState, useEffect } from "react";
import "./ProductDetailPage.css";

import ProductInfoSection from "./components/ProductInfoSection";
import ProductReviewSection from "./components/ProductReviewSection";
import QnaSection from "./components/QnaSection";

export default function ProductDetailPage() {
    const [activeTab, setActiveTab] = useState("info");
    const [wish, setWish] = useState(false);
    const [showTopBtn, setShowTopBtn] = useState(false);
    const [qty, setQty] = useState(1);

    // 🔥 Q&A 데이터 (카테고리 제거된 버전)
    const [qnaList, setQnaList] = useState([
        {
            qna_id: 1,
            title: "이 제품의 개봉 전·후 사용기한은 언제까지인가요?",
            answer: "이 제품은 개봉 후 사용기한은 6개월입니다.",
            user_nickname: "user01",
            created_at: "2025-02-01",
        },
        {
            qna_id: 2,
            title: "비슷한 제품에서 발암물질이 검출되었다는데 안전한가요?",
            answer: "",
            user_nickname: "user02",
            created_at: "2025-02-01",
        },
    ]);

    // 🔥 Q&A 등록 기능
    const handleWriteQna = (newQna) => {
        const today = new Date().toISOString().slice(0, 10);

        const data = {
            qna_id: qnaList.length + 1,
            title: newQna.title,
            content: newQna.content,
            user_nickname: "user99",
            created_at: today,
            answer: "",
        };

        setQnaList([data, ...qnaList]);
    };

    // 🔥 상품 샘플 데이터
    const product = {
        product_id: 1,
        prd_name: "바이오더마 하이드라비오 토너",
        prd_brand: "바이오더마",
        price: 38000,
        image_url: "",
        category: "토너",
        rating: 4.5,
        ingredient:
            "정제수, 글리세린, 폴리솔베이트20, 다이소듐이디티에이, 세트리모늄브로마이드, 향료, 나이아신아마이드, 자일리톨, 알란토인, 프룩토올리고사카라이드, 만니톨, 헥실데칸올, 소듐하이드록사이드, 시트릭애씨드, 람노오스, 사과씨추출물, 유채스테롤, 토코페롤",
        description: "건조한 피부를 위한 진정 토너",
    };

    const reviews = [
        {
            review_id: 1,
            nickname: "스킨케어러버",
            baumann_type: "DSPT",
            rating: 5,
            like_count: 12,
            dislike_count: 1,
            title: "인생 토너 찾았어요",
            content: "촉촉하고 피부가 편안해져요. 재구매 확정!",
            created_at: "2025-02-01",
            images: ["https://picsum.photos/150?1"],
        },
        {
            review_id: 2,
            nickname: "글로우러버",
            baumann_type: "OSPW",
            rating: 4,
            like_count: 5,
            dislike_count: 0,
            title: "보습감 굿",
            content: "확실히 수분감이 좋아요. 다만 향이 조금 강해요.",
            created_at: "2025-02-03",
            images: ["https://picsum.photos/150?2"],
        },
        {
            review_id: 3,
            nickname: "민감한피부",
            baumann_type: "DSNW",
            rating: 3,
            like_count: 2,
            dislike_count: 1,
            title: "저는 그냥 그랬어요",
            content:
                "자극은 없었는데 특별히 좋은 느낌도 없었어요. 그래도 무난합니다.",
            created_at: "2025-02-05",
            images: ["https://picsum.photos/150?3"],
        },
    ];


    // 🔥 TOP 버튼 표시
    useEffect(() => {
        const handleScroll = () => {
            setShowTopBtn(window.scrollY > 300);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="pd-detail-wrapper">
            <div className="pd-page">
                {/* 상단 상품 영역 */}
                <div className="pd-wrap">
                    <div className="pd-left">
                        {product.image_url ? (
                            <img
                                src={product.image_url}
                                alt={product.prd_name}
                                className="pd-image"
                            />
                        ) : (
                            <div className="pd-image-placeholder">상품 이미지</div>
                        )}
                    </div>

                    <div className="pd-right">
                        <div className="pd-brand">{product.prd_brand}</div>
                        <div className="pd-name">{product.prd_name}</div>
                        <div className="pd-price">
                            {product.price.toLocaleString()}원
                        </div>

                        <div className="pd-field-box">
                            <span className="pd-field-label">카테고리</span>
                            <div className="pd-field-value">#{product.category}</div>
                        </div>

                        <div className="pd-field-box">
                            <span className="pd-field-label">평균 별점</span>
                            <div className="pd-field-value">
                                {product.rating} / 5.0
                            </div>
                        </div>

                        {/* 항상 보이는 성분표시 */}
                        <div className="pd-ingredient-toggle">성분표시</div>
                        <div className="pd-ingredient-balloon">{product.ingredient}</div>

                        {/* 구매 수량 */}
                        <div className="pd-qty-box">
                            <span className="pd-qty-label">구매 수량</span>
                            <div className="pd-qty-control">
                                <button onClick={() => setQty(qty > 1 ? qty - 1 : 1)}>
                                    -
                                </button>
                                <span>{qty}</span>
                                <button onClick={() => setQty(qty + 1)}>+</button>
                            </div>
                        </div>

                        {/* 총 상품 금액 */}
                        <div className="pd-total-price">
                            총 상품금액:{" "}
                            <span>{(product.price * qty).toLocaleString()}원</span>
                        </div>
                    </div>
                </div>

                {/* 탭 */}
                <div className="pd-bottom-section">
                    <div className="pd-tabs-row">
                        <button
                            className={activeTab === "info" ? "active" : ""}
                            onClick={() => setActiveTab("info")}
                        >
                            상품 정보
                        </button>

                        <button
                            className={activeTab === "review" ? "active" : ""}
                            onClick={() => setActiveTab("review")}
                        >
                            상품 후기
                        </button>

                        <button
                            className={activeTab === "qna" ? "active" : ""}
                            onClick={() => setActiveTab("qna")}
                        >
                            상품 문의
                        </button>
                    </div>

                    {/* 탭 내용 */}
                    <div className="pd-content-area">
                        {activeTab === "info" && (
                            <ProductInfoSection product={product} />
                        )}

                        {activeTab === "review" && (
                            <ProductReviewSection reviews={reviews} />
                        )}

                        {activeTab === "qna" && (
                            <QnaSection
                                qnaList={qnaList}
                                onWrite={handleWriteQna}
                            />
                        )}
                    </div>

                    {/* 하단 바 */}
                    <div className="pd-bottom-bar">
                        <button
                            className={`pd-btm-btn wish ${wish ? "active" : ""}`}
                            onClick={() => setWish(!wish)}
                        >
                            {wish ? "♥" : "♡"}
                        </button>
                        <button className="pd-btm-btn cart">장바구니</button>
                        <button className="pd-btm-btn buy">바로구매</button>
                    </div>
                </div>

                {/* TOP 버튼 */}
                {showTopBtn && (
                    <button
                        className="pd-top-btn"
                        onClick={() =>
                            window.scrollTo({ top: 0, behavior: "smooth" })
                        }
                    >
                        <span className="top-arrow">∧</span>
                        <span className="top-text">TOP</span>
                    </button>
                )}
            </div>
        </div>
    );
}
