import React, { useEffect, useState } from "react";
import "./BaumanProduct.css";
import dummyData from "../../../../assets/dummyData.png";
import { getBaumannBadge } from "../../../../assets/baumann";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function BaumanProduct() {
    const navigate = useNavigate();

    /* 전체 바우만 타입 리스트 */
    const allTypes = [
        "DRNT","DRNW","DRPT","DRPW",
        "DSNT","DSNW","DSPT","DSPW",
        "ORNT","ORNW","ORPT","ORPW",
        "OSNT","OSNW","OSPT","OSPW"
    ];

    /* 랜덤 타입 뽑기 */
    function getRandomType() {
        return allTypes[Math.floor(Math.random() * allTypes.length)];
    }

    // 로그인 유저의 실제 타입
    const [currentType, setCurrentType] = useState(null);

    /* 로그인 여부 + 타입 조회 */
    useEffect(() => {
        const fetchUserType = async () => {
            try {
                const res = await axios.get("/api/auth/my-baumann-type");

                if (typeof res.data === "string" && res.data.length > 0) {
                    setCurrentType(res.data); // 로그인 + 타입 존재
                } else {
                    setCurrentType(null); // 타입 없음
                }
            } catch (err) {
                setCurrentType(null); // 비로그인
            }
        };

        fetchUserType();
    }, []);

    /* 바우만 타입 태그 리스트 */
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

    /*
      UI에 보여줄 타입 결정
      - 로그인: 유저의 currentType
      - 비로그인: 랜덤 타입
    */
    const displayType = currentType || getRandomType();
    const selectedType = skinTypeList.find((t) => t.type === displayType);

    /* 탭 */
    const [activeTab, setActiveTab] = useState("product");

    /* 상품 데이터 */
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /* 상품 호출 */
    useEffect(() => {
        if (!currentType) {
            // 비로그인 → 추천상품 API 호출 안 함
            setLoading(false);
            return;
        }

        const fetchRecommendProducts = async () => {
            try {
                setLoading(true);
                setError("");

                /*
                   first/second/third/fourth 매핑 이유
                   백엔드 추천 모델은 16가지 Baumann 타입을 그대로 사용하지 않고,
                   피부 특성축 (S/R, P/N 조합)에 따라 유사한 그룹 4가지로 단순화한다.

                   예:
                   - DR(N/T) → first 그룹
                   - DP(N/T) → second 그룹
                   - DS(N/T) → third 그룹
                   - DW(N/T) → fourth 그룹

                   즉, 16 타입을 4 타입으로 축약해서 추천 알고리즘 효율을 높이는 구조임.
                */
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
                const raw = res.data?.recommended_products || [];

                const mapped = raw.map((p) => ({
                    id: p.product_id,
                    name: p.prd_name,
                    brand: p.prd_brand,
                    imageUrl: p.image_url,
                    price: p.price,
                    rating: p.rating,
                    ratingText: p.rating ? `${p.rating}/5.0` : "-",
                    discount: 0,
                    isBest: p.rating >= 4.5,
                    topReview: p.top_review_content
                        ? {
                            id: p.top_review_id,
                            content: p.top_review_content,
                            rating: p.top_review_rating,
                            likes: p.top_review_likes,
                            productName: p.prd_name,
                        }
                        : null
                }));

                setProducts(mapped);

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

    // 리뷰 모아서 하나의 리스트로 사용
    const reviewList = products
        .filter((p) => p.topReview)
        .map((p) => ({
            ...p.topReview,
            productName: p.name,
            brand: p.brand,
            imageUrl: p.imageUrl,
        }));

    // 상품 페이지네이션
    const [productPage, setProductPage] = useState(1);
    const productPageSize = 16;

    // 리뷰 페이지네이션
    const [reviewPage, setReviewPage] = useState(1);
    const reviewPageSize = 16;

    // 페이지 별 데이터 분리
    // 상품
    const productStart = (productPage - 1) * productPageSize;
    const displayedProducts = products.slice(productStart, productStart + productPageSize);

    const productTotalPages = Math.ceil(products.length / productPageSize);

    // 리뷰
    const reviewStart = (reviewPage - 1) * reviewPageSize;
    const displayedReviews = reviewList.slice(reviewStart, reviewStart + reviewPageSize);

    const reviewTotalPages = Math.ceil(reviewList.length / reviewPageSize);

    // 탭 전환 시 페이지 초기화
    useEffect(() => {
        if (activeTab === "product") {
            setProductPage(1);
        } else {
            setReviewPage(1);
        }
    }, [activeTab]);


    return (
        <section className="bauman-section">
            <h2 className="bauman-title">
                {displayType}의 추천 상품
            </h2>

            {/* 탭 */}
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

                {/* 타입 박스  */}
                {selectedType && (
                    <div className="bauman-header">
                        <div className="bauman-header-right">
                            <div className="bauman-type-badge">
                                <img
                                    src={getBaumannBadge(displayType)}
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
                )}

                {/* 에러표시 */}
                {error && currentType !== null && (
                    <p className="bauman-error">{error}</p>
                )}

                {/* 추천 상품 탭 랜더링*/}
                {activeTab === "product" && (
                    <div style={{ position: "relative" }}>
                        {/* 상품 영역 (비로그인 → blur 처리) */}
                        <div className={currentType ? "" : "blur-block"}>
                            <div className="product-grid">
                                {loading ? (
                                    <p style={{ textAlign: "center" }}>상품을 불러오는 중입니다...</p>
                                ) : products.length === 0 ? (
                                    <p style={{ textAlign: "center" }}>추천 상품이 없습니다.</p>
                                ) : (
                                    displayedProducts.map((item) => (
                                        <article
                                            key={item.id}
                                            className="product-card"
                                            style={{ cursor: currentType ? "pointer" : "default" }}
                                            onClick={() =>
                                                currentType &&
                                                navigate(`/product/${item.id}`)
                                            }
                                        >
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
                            {/* 상품 페이지 네이션*/}
                            <div className="pagination">
                                <button
                                    disabled={productPage === 1}
                                    onClick={() => setProductPage(productPage - 1)}
                                >
                                    이전
                                </button>

                                <span>{productPage} / {productTotalPages}</span>

                                <button
                                    disabled={productPage === productTotalPages}
                                    onClick={() => setProductPage(productPage + 1)}
                                >
                                    다음
                                </button>
                            </div>
                        </div>



                        {/* 비로그인 → 회원가입 유도 오버레이 */}
                        {!currentType && (
                            <div className="overlay-lock">
                                <p style={{ fontSize: "17px", fontWeight: "700" }}>
                                    회원가입하고 추천 상품을 만나보세요!
                                </p>
                                <button
                                    className="overlay-btn"
                                    onClick={() => navigate("/register")}
                                >
                                    회원가입 하러가기
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* 리뷰 탭 */}
                {activeTab === "review" && (
                    <div className="review-list-area">
                        {/* 리뷰 없을 때 */}
                        {reviewList.length === 0 && (
                            <p style={{ textAlign: "center", marginTop: "40px" }}>
                                아직 이 타입에 대한 리뷰가 없습니다.
                            </p>
                        )}

                        {/* 리뷰 목록 */}
                        {reviewList.length > 0 && (
                            <>
                                <div className="review-grid">
                                    {displayedReviews.map((review) => (
                                        <div
                                            key={review.id}
                                            className="review-card-box"
                                            onClick={() => navigate(`/review/${review.id}`)}
                                        >
                                            <div className="review-thumb">
                                                <img
                                                    src={review.imageUrl || dummyData}
                                                    alt={review.productName}
                                                />
                                            </div>

                                            <div className="review-text-box">
                                                <div className="review-text-top">
                                                    <span className="review-brand">{review.brand}</span>
                                                    <span className="review-rating">
                                                        {review.rating?.toFixed(1)} / 5.0
                                                    </span>
                                                </div>

                                                <p className="review-title">{review.productName}</p>

                                                <p className="review-content-line">
                                                    "{review.content}"
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* 리뷰 페이지네이션 */}
                                <div className="pagination">
                                    <button
                                        disabled={reviewPage === 1}
                                        onClick={() => setReviewPage(reviewPage - 1)}
                                    >
                                        이전
                                    </button>

                                    <span>
                                        {reviewPage} / {reviewTotalPages}
                                    </span>

                                    <button
                                        disabled={reviewPage === reviewTotalPages}
                                        onClick={() => setReviewPage(reviewPage + 1)}
                                    >
                                        다음
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}

            </div>
        </section>
    );
}
