import React, { useEffect, useState } from "react";
import "./BaumanProduct.css";
import dummyData from "../../../../assets/dummyData.png";
import { getBaumannBadge } from "../../../../assets/baumann";
import axios from "axios";

const PAGE_SIZE = 32; // 한 페이지 32개

export default function BaumanProduct() {
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

    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1); // ✅ 전체 페이지 수
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const res = await axios.get("/api/products", {
                    params: { page, size: PAGE_SIZE, sort: "latest" },
                });

                // 응답 구조 확인
                const raw = Array.isArray(res.data)
                    ? res.data
                    : Array.isArray(res.data?.data)
                        ? res.data.data
                        : [];

                // ✅ 백엔드가 totalCount 내려줄 경우 사용
                const totalCount = res.data?.totalCount || 0;
                if (totalCount > 0) {
                    setTotalPages(Math.ceil(totalCount / PAGE_SIZE));
                } else {
                    // 혹시 totalCount가 없으면 임시 추정 (상품이 꽉 차면 다음 페이지 있다고 가정)
                    setTotalPages(raw.length < PAGE_SIZE ? page : page + 1);
                }

                // 백엔드 → 프론트 매핑
                const mapped = raw.map((p) => {
                    const id = p.product_id ?? p.id;
                    const name = p.prd_name ?? p.name ?? "-";
                    const brand = p.prd_brand ?? p.brand ?? "브랜드 미정";
                    const imageUrl = p.image_url ?? p.imageUrl ?? null;
                    const price =
                        typeof p.price === "number" ? p.price : Number(p.price || 0);
                    const rating =
                        typeof p.rating === "number"
                            ? p.rating
                            : Number(p.rating || 0);

                    return {
                        id,
                        name,
                        brand,
                        imageUrl,
                        price,
                        ratingText: rating ? `${rating.toFixed(1)}/5.0` : "-",
                        discount: 0,
                        isBest: true,
                    };
                });

                setProducts(mapped);
            } catch (err) {
                console.error("상품 조회 실패:", err);
                setError("추천 상품을 불러오지 못했습니다.");
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [page]);

    if (!selectedType) return null;

    const hasNext = !loading && products.length === PAGE_SIZE;

    const handlePrevPage = () => {
        if (page > 1 && !loading) {
            setPage((prev) => prev - 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleNextPage = () => {
        if ((hasNext || page < totalPages) && !loading) {
            setPage((prev) => prev + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <section className="bauman-section">
            <h2 className="bauman-title">{selectedType.type}의 추천 상품</h2>

            <div className="bauman-box">
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

                {error && <p className="bauman-error">{error}</p>}

                <div className="product-grid">
                    {loading && products.length === 0 ? (
                        <p
                            className="bauman-loading"
                            style={{
                                gridColumn: "1 / -1",
                                textAlign: "center",
                            }}
                        >
                            상품을 불러오는 중입니다...
                        </p>
                    ) : products.length === 0 ? (
                        <p
                            className="bauman-empty"
                            style={{
                                gridColumn: "1 / -1",
                                textAlign: "center",
                            }}
                        >
                            추천 상품이 없습니다.
                        </p>
                    ) : (
                        products.map((item) => (
                            <article
                                key={item.id}
                                className="product-card"
                                onClick={() => console.log("상품 클릭:", item.id)}
                                style={{ cursor: "pointer" }}
                            >
                                <div className="product-thumb">
                                    {item.isBest && <span className="product-badge">Best</span>}
                                    <div className="product-thumb-inner">
                                        <img
                                            src={item.imageUrl || dummyData}
                                            alt={item.name}
                                        />
                                    </div>
                                </div>

                                <div className="product-meta">
                                    <div className="product-brand-row">
                                        <span className="product-brand">{item.brand}</span>
                                        <span className="product-rating">{item.ratingText}</span>
                                    </div>
                                    <p className="product-name">{item.name}</p>

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
                        ))
                    )}
                </div>

                {/* ✅ 페이지네이션 */}
                <div className="bauman-pagination">
                    <button
                        className="page-arrow"
                        onClick={handlePrevPage}
                        disabled={page === 1 || loading}
                    >
                        &lt;
                    </button>
                    <span className="page-indicator">
            {page} / {totalPages}
          </span>
                    <button
                        className="page-arrow"
                        onClick={handleNextPage}
                        disabled={page >= totalPages || loading}
                    >
                        &gt;
                    </button>
                </div>
            </div>
        </section>
    );
}