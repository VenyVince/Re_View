import React, { useEffect, useState } from "react";
import "./BaumannProduct.css";
import dummyData from "../../../../assets/dummyData.png";
import { getBaumannBadge } from "../../../../assets/baumann";
import {
    fetchMyBaumannType,
    fetchRecommendByGroup
} from "../../../../api/recommend/recommendApi.js";
import { useNavigate } from "react-router-dom";

export default function BaumannProduct({}) {
    // 리뷰 이미지가 없을 때 할당할 이미지(상품 이미지 할당할거면 나중에 상품 이미지 url 할당시키면 됨.
    const DEFAULT_REVIEW_IMAGE = "이미지 없을 때 할당할 이미지 나중에 url할당.";

    
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [currentType, setCurrentType] = useState(null);
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

    const mapProducts = (rawProducts) => {
        return rawProducts.map((p) => ({
            id: p.product_id,
            name: p.prd_name,
            brand: p.prd_brand,
            imageUrl: p.product_image_url,
            price: p.price,
            rating: p.rating,
            ratingText: p.rating ? `${p.rating}/5.0` : "-",
            isBest: p.rating >= 4.5 //나중에 best리뷰이면 best띄우기
        }));
    };

    const mapReviews = (rawReviews) => {
        return rawReviews.map(r => ({
            id: r.review_id,
            content: r.content,
            rating: r.review_rating,
            likes: r.like_count,
            productId: r.product_id,
            productName: r.prd_name,
            nickname: r.nickname,
            imageUrl: r.review_image_url || DEFAULT_REVIEW_IMAGE,
        }));
    };

    const productPageSize = 8;
    const productStart = (productPage - 1) * productPageSize;
    const displayedProducts = products.slice(productStart, productStart + productPageSize);
    const productTotalPages = Math.ceil(products.length / productPageSize);

    const reviewPageSize = 8;
    const reviewStart = (reviewPage - 1) * reviewPageSize;
    const displayedReviews = reviews.slice(reviewStart, reviewStart + reviewPageSize);
    const reviewTotalPages = Math.ceil(reviews.length / reviewPageSize);

    const handleTagClick = async (group) => {
        try {
            setProductPage(1);
            setReviewPage(1);
            setLoading(true);
            setError("");

            const res = await fetchRecommendByGroup(group);

            setProducts(mapProducts(res.data?.products || []));
            setReviews(mapReviews(res.data?.reviews || []));
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



    useEffect(() => {
        if (activeTab === "review") setReviewPage(1);
        else setProductPage(1);
    }, [activeTab]);

    return (
        <section className="bauman-section">
            <h2 className="bauman-title">{displayType}의 추천 상품</h2>

            <div className="bauman-tabs">
                <button
                    className={activeTab === "review" ? "tab-active" : ""}
                    onClick={() => setActiveTab("review")}
                >
                    리뷰
                </button>
                <button
                    className={activeTab === "product" ? "tab-active" : ""}
                    onClick={() => setActiveTab("product")}
                >
                    상품
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

                                {reviews.length === 0 && (
                                    <p style={{ textAlign: "center", marginTop: "40px" }}>
                                        아직 이 타입에 대한 리뷰가 없습니다.
                                    </p>
                                )}

                                {reviews.length > 0 && (
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
                                                            <span className="review-nickname">{review.nickname}</span>
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