// src/pages/review/ReviewPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

import "./ReviewPage.css";

import CategoryTabs from "./components/CategoryTabs";
import ReviewSortSelect from "./components/ReviewSortSelect";
import ReviewList from "./components/ReviewList";

export default function ReviewPage() {

    // 카테고리 및 상태값
    const CATEGORIES = ["전체", "스킨/토너", "에센스/세럼/앰플", "크림", "로션", "클렌징"];
    const CATEGORY_MAP = {
        "전체": null,
        "스킨/토너": ["스킨", "토너"],
        "에센스/세럼/앰플": ["에센스", "세럼", "앰플"],
        "크림": ["크림"],
        "로션": ["로션"],
        "클렌징": ["클렌징"]
    };

    const [reviews, setReviews] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("전체");
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [sortType, setSortType] = useState("popular");
    const [loading, setLoading] = useState(true);

    // 리뷰 API 호출
    useEffect(() => {
        setLoading(true);

        const backendCategories = CATEGORY_MAP[selectedCategory];

        // "전체" 카테고리 선택 시
        if (backendCategories === null) {
            // [수정] params에서 page, size 제거
            axios.get("/api/reviews")
                .then(res => {
                    // [수정] res.data.content -> res.data
                    // 백엔드가 이제 리스트를 바로 줍니다.
                    setReviews(res.data || []);
                    setSelectedBrand(null);
                    setLoading(false);
                })
                .catch(() => {
                    setReviews([]);
                    setLoading(false);
                });
            return;
        }

        // 특정 카테고리 선택 시 (여러 하위 카테고리 호출)
        Promise.all(
            backendCategories.map(cat =>
                // [수정] params에서 page, size 제거
                axios.get("/api/reviews", {
                    params: { category: cat }
                }).catch(() => ({ data: [] })) // [수정] 에러 시 빈 배열 반환 구조 맞춤
            )
        )
            .then(results => {
                // [수정] res.data.content -> res.data
                const merged = results.flatMap(res => res.data || []);

                setReviews(merged);
                setSelectedBrand(null);
                setLoading(false);
            })
            .catch(() => {
                setReviews([]);
                setLoading(false);
            });

    }, [selectedCategory]);

    // 브랜드 목록 생성
    const brandList = useMemo(() => {
        const brands = reviews.map(r => r.brand_name).filter(Boolean);
        return Array.from(new Set(brands)).sort((a, b) => a.localeCompare(b));
    }, [reviews]);

    // 정렬 및 브랜드 필터 적용
    const filteredReviews = useMemo(() => {
        let list = [...reviews];

        if (selectedBrand) {
            list = list.filter(r => r.brand_name === selectedBrand);
        }

        if (sortType === "popular") {
            list.sort((a, b) => b.like_count - a.like_count);
        }
        if (sortType === "rating_high") {
            list.sort((a, b) => b.rating - a.rating);
        }
        if (sortType === "rating_low") {
            list.sort((a, b) => a.rating - b.rating);
        }
        if (sortType === "recent") {
            list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }

        return list;
    }, [reviews, selectedBrand, sortType]);

    // 상단 선택 텍스트
    const selectedText = (() => {
        if (selectedBrand) return `${selectedCategory} · ${selectedBrand}`;
        return selectedCategory;
    })();

    // UI 렌더링
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
        </div>
    );
}
