// src/pages/review/ReviewPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

import "./ReviewPage.css";

import CategoryTabs from "./components/CategoryTabs";
import SortSelect from "./components/SortSelect";
import ReviewSlider from "./components/ReviewSlider";

export default function ReviewPage() {

    const CATEGORIES = ["스킨/토너", "에센스/세럼/앰플", "크림", "로션", "클렌징"];

    // UI 카테고리 → 백엔드 카테고리 매핑
    const CATEGORY_MAP = {
        "스킨/토너": ["스킨", "토너"],
        "에센스/세럼/앰플": ["에센스", "세럼", "앰플"],
        "크림": ["크림"],
        "로션": ["로션"],
        "클렌징": ["클렌징"]
    };

    const PAGE_WIDTH = 1200;

    const [reviews, setReviews] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("스킨/토너");
    const [sortType, setSortType] = useState("popular");
    const [loading, setLoading] = useState(true);

    // 🔥 카테고리별로 리뷰 호출
    useEffect(() => {
        setLoading(true);

        const backendCategories = CATEGORY_MAP[selectedCategory];

        Promise.all(
            backendCategories.map(cat =>
                axios.get("/api/reviews", {
                    params: { page: 1, size: 50, category: cat }
                }).catch(err => {
                    console.log("🔥 카테고리 요청 실패:", cat);
                    return { data: { content: [] } }; // 실패 시 빈 배열
                })
            )
        )
            .then(results => {
                const merged = results.flatMap(res => res.data.content || []);
                setReviews(merged);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setReviews([]);
                setLoading(false);
            });
    }, [selectedCategory]);

    // 🔥 정렬
    const sortedReviews = useMemo(() => {
        let list = [...reviews];

        if (sortType === "low") list.sort((a, b) => a.price - b.price);
        if (sortType === "high") list.sort((a, b) => b.price - a.price);

        return list;
    }, [reviews, sortType]);

    return (
        <div className="reviewPageWrapper">

            <CategoryTabs
                categories={CATEGORIES}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
            />

            <div className="reviewTitleRow">
                <h2 className="reviewCategoryTitle">{selectedCategory}</h2>

                <SortSelect
                    sortType={sortType}
                    setSortType={setSortType}
                />
            </div>

            {loading ? (
                <div className="reviewLoading">로딩중...</div>
            ) : sortedReviews.length === 0 ? (
                <div className="reviewEmpty">리뷰가 없습니다.</div>
            ) : (
                <ReviewSlider
                    reviews={sortedReviews}
                    pageWidth={PAGE_WIDTH}
                />
            )}
        </div>
    );
}
