import React, { useEffect, useState } from "react";
import "./BaumannProduct.css";
import dummyData from "../../../../assets/dummyData.png";
import { getBaumannBadge } from "../../../../assets/baumann";
import {
    fetchMyBaumannType,
    fetchRecommendByGroup
} from "../../../../api/recommend/recommendApi.js";
import { useNavigate } from "react-router-dom";

export default function BaumannProduct() {
    const navigate = useNavigate();

    const [activeTag, setActiveTag] = useState("all");
    const [currentType, setCurrentType] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState("product");

    const [productPage, setProductPage] = useState(1);
    const [reviewPage, setReviewPage] = useState(1);

    const allTypes = [
        "DRNT","DRNW","DRPT","DRPW",
        "DSNT","DSNW","DSPT","DSPW",
        "ORNT","ORNW","ORPT","ORPW",
        "OSNT","OSNW","OSPT","OSPW"
    ];

    const tagToGroup = {
        "건성": "first",
        "저자극": "second",
        "비색소": "third",
        "탄력": "fourth",
        "주름": "fourth",
        "색소성": "third",
        "민감성": "second",
        "지성": "first",
    };

    function getRandomType() {
        return allTypes[Math.floor(Math.random() * allTypes.length)];
    }

    useEffect(() => {
        const fetchUserType = async () => {
            try {
                const res = await fetchMyBaumannType();

                if (typeof res.data === "string" && res.data.length > 0) {
                    setCurrentType(res.data);
                } else {
                    setCurrentType(null);
                }
            } catch (err) {
                setCurrentType(null);
            }
        };

        fetchUserType();
    }, []);

    const mapProducts = (raw) => {
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
                    reviewImageUrl: p.top_review_image_url
                }
                : null,
        }));

        mapped.sort((a, b) => a.id - b.id);
        return mapped;
    };

    const handleTagClick = async (group) => {
        try {
            setActiveTag(group);
            setProductPage(1);
            setReviewPage(1);
            setLoading(true);
            setError("");

            const res = await fetchRecommendByGroup(group);
            const raw = res.data?.recommended_products || [];

            setProducts(mapProducts(raw));
        } catch {
            setError("추천 상품을 불러오지 못했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!currentType) {
            handleTagClick("all");
            return;
        }

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
        setActiveTag(mappedType);
        handleTagClick(mappedType);
    }, [currentType]);

    const displayType = currentType || getRandomType();

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

    const selectedType = skinTypeList.find((t) => t.type === displayType);

    const reviewList = products
        .filter((p) => p.topReview)
        .map((p) => ({
            ...p.topReview,
            productName: p.name,
            brand: p.brand,
            imageUrl: p.topReview.reviewImageUrl || p.imageUrl,
        }));

    const productPageSize = 16;
    const productStart = (productPage - 1) * productPageSize;
    const displayedProducts = products.slice(productStart, productStart + productPageSize);
    const productTotalPages = Math.ceil(products.length / productPageSize);

    const reviewPageSize = 16;
    const reviewStart = (reviewPage - 1) * reviewPageSize;
    const displayedReviews = reviewList.slice(reviewStart, reviewStart + reviewPageSize);
    const reviewTotalPages = Math.ceil(reviewList.length / reviewPageSize);

    useEffect(() => {
        if (activeTab === "product") setProductPage(1);
        else setReviewPage(1);
    }, [activeTab]);

    return (
        <section className="bauman-section">
            <h2 className="bauman-title">{displayType}의 추천 상품</h2>

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

                            <div className="bauman-tag-buttons">
                                <button
                                    className={`bauman-tag-btn ${activeTag === "all" ? "active-tag" : ""}`}
                                    onClick={() => handleTagClick("all")}
                                >
                                    맞춤
                                </button>

                                {selectedType.tags.map((tag, index) => {
                                    const group = tagToGroup[tag];
                                    return (
                                        <button
                                            key={index}
                                            className={`bauman-tag-btn ${activeTag === group ? "active-tag" : ""}`}
                                            onClick={() => handleTagClick(group)}
                                        >
                                            {tag}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {error && currentType !== null && (
                    <p className="bauman-error">{error}</p>
                )}

                {activeTab === "product" && (
                    <div className="overlay-container">
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
                                                currentType && navigate(`/product/${item.id}`)
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

                            <div className="pagination">
                                <button
                                    disabled={productPage === 1}
                                    onClick={() => setProductPage(productPage - 1)}
                                >
                                    이전
                                </button>
                                <span>{productPage} / {productTotalPages || 1}</span>
                                <button
                                    disabled={productPage === productTotalPages}
                                    onClick={() => setProductPage(productPage + 1)}
                                >
                                    다음
                                </button>
                            </div>
                        </div>

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

                {activeTab === "review" && (
                    <div className="overlay-container">
                        <div className={currentType ? "" : "blur-block"}>
                            <div className="review-list-area">

                                {reviewList.length === 0 && (
                                    <p style={{ textAlign: "center", marginTop: "40px" }}>
                                        아직 이 타입에 대한 리뷰가 없습니다.
                                    </p>
                                )}

                                {reviewList.length > 0 && (
                                    <>
                                        <div className="review-grid">
                                            {displayedReviews.map((review) => (
                                                <div
                                                    key={review.id}
                                                    className="review-card-box"
                                                    onClick={() =>
                                                        currentType && navigate(`/review/${review.id}`)
                                                    }
                                                >
                                                    <div className="review-thumb">
                                                        <div className="review-thumb-inner">
                                                            <img src={review.imageUrl || dummyData} alt={review.productName} />
                                                        </div>
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

                                        <div className="pagination">
                                            <button
                                                disabled={reviewPage === 1}
                                                onClick={() => setReviewPage(reviewPage - 1)}
                                            >
                                                이전
                                            </button>

                                            <span>{reviewPage} / {reviewTotalPages || 1}</span>

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
                        </div>

                        {!currentType && (
                            <div className="overlay-lock">
                                <p style={{ fontSize: "17px", fontWeight: "700" }}>
                                    회원가입하고 리뷰를 확인해보세요!
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
            </div>
        </section>
    );
}