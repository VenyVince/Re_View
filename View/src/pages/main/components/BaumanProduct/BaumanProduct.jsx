import React, { useEffect, useState } from "react";
import "./BaumanProduct.css";
import dummyData from "../../../../assets/dummyData.png";
import { getBaumannBadge } from "../../../../assets/baumann";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function BaumanProduct() {
    const navigate = useNavigate();

    // 바우만 타입 상태
    const [currentType, setCurrentType] = useState(null);

    const allBaumannTypes = [
        "DRNT","DRNW","DRPT","DRPW",
        "DSNT","DSNW","DSPT","DSPW",
        "ORNT","ORNW","ORPT","ORPW",
        "OSNT","OSNW","OSPT","OSPW"
    ];

    function getRandomType() {
        return allBaumannTypes[Math.floor(Math.random() * allBaumannTypes.length)];
    }

    /* 로그인 상태 체크 → 타입 결정 */
    useEffect(() => {
        const fetchUserType = async () => {
            try {
                const res = await axios.get("/api/auth/my-baumann-type");

                if (typeof res.data === "string" && res.data.length > 0) {
                    setCurrentType(res.data);
                    console.log("바우만 타입 응답:", res.data);
                } else {
                    setCurrentType(getRandomType());
                }

            } catch (err) {
                setCurrentType(getRandomType());
            }
        };

        fetchUserType();
    }, []);


    /* 바우만 타입 태그 표시용 리스트 */
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
        { type: "OSPW", tags: ["지성", "민감성", "색소성", "주름"] }
    ];

    const selectedType = skinTypeList.find((t) => t.type === currentType);


    /* 탭 상태 */
    const [activeTab, setActiveTab] = useState("product");

    /* 데이터 상태 */
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // 상품 호출
    useEffect(() => {
        if (!currentType) return;

        const fetchRecommendProducts = async () => {
            try {
                setLoading(true);
                setError("");

                // DRNW → first/second/third/fourth 매핑
                // 16가지 Baumann 타입을 백엔드 추천 모델에서 요구하는 4가지 그룹(first~fourth)으로 단순화하기 위해, 피부 특성축(S/R, P/N 조합)을 기준으로 비슷한 타입끼리 묶어 매핑
                const typeMap = {
                    DRNT: "first", DRNW: "first",
                    DRPT: "second", DRPW: "second",
                    DSNT: "third", DSNW: "third",
                    DSPT: "fourth", DSPW: "fourth",
                    ORNT: "first", ORNW: "first",
                    ORPT: "second", ORPW: "second",
                    OSNT: "third", OSNW: "third",
                    OSPT: "fourth", OSPW: "fourth",
                };

                const mappedType = typeMap[currentType] || "all";
                const res = await axios.post(`/api/recommendations/${mappedType}`);

                const rawProducts = res.data?.recommended_products || [];

                // 상품 + 대표 리뷰 매핑
                const mappedProducts = rawProducts.map((p) => ({
                    id: p.product_id,
                    name: p.prd_name,
                    brand: p.prd_brand,
                    imageUrl: p.image_url,
                    price: p.price,
                    rating: p.rating,
                    ratingText: p.rating ? `${p.rating}/5.0` : "-",
                    discount: 0,
                    isBest: p.rating >= 4.5, // 별점 4.5 이상 → BEST 표시
                    topReview: p.top_review_content
                        ? {
                            id: p.top_review_id,
                            content: p.top_review_content,
                            rating: p.top_review_rating,
                            likes: p.top_review_likes
                        }
                        : null
                }));

                setProducts(mappedProducts);

            } catch (err) {
                console.error(err);
                setError("추천 상품을 불러오지 못했습니다.");
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendProducts();
    }, [currentType]);

    if (!selectedType) return <p style={{textAlign:"center"}}>로딩 중...</p>;


    return (
        <section className="bauman-section">
            <h2 className="bauman-title">{selectedType.type}의 추천 상품</h2>

            {/* 탭 UI */}
            <div className="bauman-tabs">
                <button
                    className={activeTab === "product" ? "tab-active" : ""}
                    onClick={() => setActiveTab("product")}
                >
                    추천상품
                </button>

                <button
                    className={activeTab === "review" ? "tab-active" : ""}
                    onClick={() => setActiveTab("review")}
                >
                    리뷰
                </button>
            </div>

            <div className="bauman-box">

                {/* 타입 정보 박스 */}
                <div className="bauman-header">
                    <div className="bauman-header-right">
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
                    </div>
                </div>

                {error && <p className="bauman-error">{error}</p>}

                {/* 상품 탭 */}
                {activeTab === "product" && (
                    <div className="product-grid">
                        {loading ? (
                            <p style={{ textAlign: "center" }}>상품을 불러오는 중입니다...</p>
                        ) : products.length === 0 ? (
                            <p style={{ textAlign: "center" }}>추천 상품이 없습니다.</p>
                        ) : (
                            products.map((item) => (
                                <article key={item.id} className="product-card"
                                         onClick={() => navigate(`/product/${item.id}`)}
                                         style={{ cursor: "pointer" }}>

                                    <div className="product-thumb">
                                        {item.isBest && <span className="product-badge">Best</span>}
                                        <div className="product-thumb-inner">
                                            <img src={item.imageUrl || dummyData} alt={item.name} />
                                        </div>
                                    </div>

                                    <div className="product-text-box">
                                        <div className="product-text-top">
                                            <span className="product-brand">{item.brand}</span>
                                            <span className="product-rating">{item.ratingText}</span>
                                        </div>

                                        <p className="product-title">{item.name}</p>

                                        <div className="product-price-line">
                                            <span className="product-discount">
                                                {item.discount.toString().padStart(2, "0")}%
                                            </span>
                                            <span className="product-price">
                                                {item.price.toLocaleString()}
                                                <span className="unit"> 원</span>
                                            </span>
                                        </div>
                                    </div>

                                </article>
                            ))
                        )}
                    </div>
                )}

                {/* 리뷰탭 */}
                {activeTab === "review" && (
                    <div className="product-grid">
                        {products.filter(p => p.topReview).length === 0 ? (
                            <p style={{ textAlign: "center" }}>리뷰가 없습니다.</p>
                        ) : (
                            products
                                .filter(p => p.topReview)
                                .map((item) => {

                                    // 리뷰 내용 줄이기 (최대 60자)
                                    const previewText =
                                        item.topReview.content.length > 60
                                            ? item.topReview.content.slice(0, 60) + "..."
                                            : item.topReview.content;

                                    return (
                                        <article
                                            key={item.id}
                                            className="product-card"
                                            onClick={() => navigate(`/review/${item.topReview.id}`)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <div className="product-thumb">
                                                <div className="product-thumb-inner">
                                                    <img src={item.imageUrl || dummyData} alt={item.name} />
                                                </div>
                                            </div>

                                            <div className="product-text-box">
                                                <div className="product-text-top">
                                                    <span className="product-brand">{item.brand}</span>
                                                    <span className="product-rating">{item.ratingText}</span>
                                                </div>

                                                <p className="product-title">{item.name}</p>

                                                <p className="product-review-preview">
                                                    {previewText}
                                                </p>
                                            </div>
                                        </article>
                                    );
                                })
                        )}
                    </div>
                )}

            </div>
        </section>
    );
}
