// src/pages/product/components/ProductSlider.jsx
import React from "react";
import "./ProductSlider.css";
import ProductCard from "./ProductCard";

// 상품 슬라이더 컴포넌트
export default function ProductSlider({
                                          sortedPages,       // 정렬된 페이지 목록
                                          currentPage,       // 현재 페이지 인덱스
                                          pageWidth,         // 슬라이더 이동 너비
                                          selectedCategory,  // 선택된 카테고리
                                          setPageState       // 페이지 상태 업데이트 함수
                                      }) {
    // 이전 페이지 이동
    const goPrev = () => {
        setPageState((prev) => ({
            ...prev,
            [selectedCategory]: Math.max(currentPage - 1, 0)
        }));
    };

    // 다음 페이지 이동
    const goNext = () => {
        const last = sortedPages.length - 1;
        setPageState((prev) => ({
            ...prev,
            [selectedCategory]: Math.min(currentPage + 1, last)
        }));
    };

    return (
        <>
            {sortedPages.length > 0 ? (
                <div className="carousel">

                    {/* 왼쪽 버튼 */}
                    <button
                        className={`slideButton left ${currentPage === 0 ? "disabled" : ""}`}
                        onClick={goPrev}
                    >
                        &lt;
                    </button>

                    {/* 화면 영역 */}
                    <div className="window">
                        <div
                            className="track"
                            style={{ transform: `translateX(${-currentPage * pageWidth}px)` }}
                        >
                            {sortedPages.map((page, i) => (
                                <div className="page" key={i}>

                                    {/* 첫 번째 줄 */}
                                    <div className="row">
                                        {page.slice(0, 4).map((p) => (
                                            <ProductCard key={p.product_id} product={p} />
                                        ))}
                                    </div>

                                    {/* 두 번째 줄 */}
                                    <div className="row">
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
                        className={`slideButton right ${
                            currentPage === sortedPages.length - 1 ? "disabled" : ""
                        }`}
                        onClick={goNext}
                    >
                        &gt;
                    </button>

                </div>
            ) : (
                <div className="empty">상품이 없습니다.</div>
            )}
        </>
    );
}
