// src/pages/product/components/ProductSlider.jsx
import React from "react";
import "./ProductSlider.css";
import ProductCard from "./ProductCard";

export default function ProductSlider({
                                          sortedPages,
                                          currentPage,
                                          pageWidth,
                                          selectedCategory,
                                          setPageState
                                      }) {
    const goPrev = () => {
        setPageState((prev) => ({
            ...prev,
            [selectedCategory]: Math.max(currentPage - 1, 0)
        }));
    };

    const goNext = () => {
        const last = sortedPages.length - 1;
        setPageState((prev) => ({
            ...prev,
            [selectedCategory]: Math.min(currentPage + 1, last)
        }));
    };

    const goToPage = (index) => {
        setPageState((prev) => ({
            ...prev,
            [selectedCategory]: index
        }));
    };

    return (
        <>
            {sortedPages.length > 0 ? (
                <div className="productCarousel">

                    {/* 왼쪽 버튼 */}
                    <button
                        className={`productSlideButton left ${
                            currentPage === 0 ? "disabled" : ""
                        }`}
                        onClick={goPrev}
                    >
                        &lt;
                    </button>

                    {/* 화면 영역 */}
                    <div className="productWindow">
                        <div
                            className="productTrack"
                            style={{ transform: `translateX(${-currentPage * pageWidth}px)` }}
                        >
                            {sortedPages.map((page, i) => (
                                <div className="productPage" key={i}>

                                    {/* 첫 번째 줄 */}
                                    <div className="productRow">
                                        {page.slice(0, 4).map((p) => (
                                            <ProductCard key={p.product_id} product={p} />
                                        ))}
                                    </div>

                                    {/* 두 번째 줄 */}
                                    <div className="productRow">
                                        {page.slice(4, 8).map((p) => (
                                            <ProductCard key={p.product_id} product={p} />
                                        ))}
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 오른쪽 버튼 */}
                    <button
                        className={`productSlideButton right ${
                            currentPage === sortedPages.length - 1 ? "disabled" : ""
                        }`}
                        onClick={goNext}
                    >
                        &gt;
                    </button>

                    {/* ⭐ 페이지 번호 버튼 추가 */}
                    <div className="productPagination">
                        {sortedPages.map((_, idx) => (
                            <button
                                key={idx}
                                className={`productPageNumber ${
                                    currentPage === idx ? "active" : ""
                                }`}
                                onClick={() => goToPage(idx)}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>

                </div>
            ) : (
                <div className="productEmpty">상품이 없습니다.</div>
            )}
        </>
    );
}
