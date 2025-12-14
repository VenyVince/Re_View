import React, { useEffect, useState, useMemo } from "react";
import "./ReviewPage.css";

import axiosClient from "api/axiosClient";

import CategoryTabs from "./components/CategoryTabs";
import ReviewSortSelect from "./components/ReviewSortSelect";
import ReviewList from "./components/ReviewList";

export default function ReviewPage() {

    // 카테고리 및 매핑
    const CATEGORIES = ["전체", "토너", "앰플", "크림", "로션", "클렌징"];

    const [reviews, setReviews] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("전체");
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [sortType, setSortType] = useState("like_count");
    const [loading, setLoading] = useState(true);
    const [showTopBtn, setShowTopBtn] = useState(false);

    // 리뷰 목록 조회
    useEffect(() => {
        setLoading(true);
        // 전체 카테고리
            axiosClient.get("/api/reviews", {
            params: {
                sort: sortType || "like_count",
                category: selectedCategory === "전체" ? "" : selectedCategory,
            },
        })
                .then((res) => {
                    setReviews(res.data || []);
                    setSelectedBrand(null);
                    setLoading(false);
                })
                .catch(() => {
                    setReviews([]);
                    setLoading(false);
                });
    }, [selectedCategory, sortType]);

    // 브랜드 목록 생성
    const brandList = useMemo(() => {
        const brands = reviews.map((r) => r.brand_name).filter(Boolean);
        return Array.from(new Set(brands)).sort((a, b) => a.localeCompare(b));
    }, [reviews]);

    // 정렬 및 브랜드 필터
    const filteredReviews = useMemo(() => {
        if (!selectedBrand) return reviews;
        return reviews.filter(r => r.brand_name === selectedBrand);
    }, [reviews, selectedBrand]);

    // 상단 선택 텍스트
    const selectedText = (() => {
        if (selectedBrand) return `${selectedCategory} · ${selectedBrand}`;
        return selectedCategory;
    })();

    useEffect(() => {
        const onScroll = () => setShowTopBtn(window.scrollY > 300);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);


    return (
        <div className="reviewPageWrapper">

            <div className="selected-info">{selectedText}</div>

            <CategoryTabs
                categories={CATEGORIES}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
                brandList={brandList}
                selectedBrand={selectedBrand}
                onBrandSelect={setSelectedBrand}
            />

            <div className="reviewTitleRow">
                <ReviewSortSelect
                    sortType={sortType}
                    setSortType={setSortType}
                />
            </div>

            {loading ? (
                <div className="reviewLoading">로딩중...</div>
            ) : filteredReviews.length === 0 ? (
                <div className="reviewEmpty">리뷰가 없습니다.</div>
            ) : (
                <ReviewList reviews={filteredReviews} />
            )}

            {showTopBtn && (
                <button
                    className="pd-top-btn"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                    <span className="top-arrow">∧</span>
                    <span className="top-text">TOP</span>
                </button>
            )}

        </div>
    );
}
