import React, { useEffect, useState, useMemo } from "react";
import "./ReviewPage.css";

import axiosClient from "../../api/axiosClient";

import CategoryTabs from "./components/CategoryTabs";
import ReviewSortSelect from "./components/ReviewSortSelect";
import ReviewList from "./components/ReviewList";

export default function ReviewPage() {

    // 카테고리 및 매핑
    const CATEGORIES = ["전체", "스킨/토너", "에센스/세럼/앰플", "크림", "로션", "클렌징"];
    const CATEGORY_MAP = {
        "전체": null,
        "스킨/토너": ["스킨", "토너"],
        "에센스/세럼/앰플": ["에센스", "세럼", "앰플"],
        "크림": ["크림"],
        "로션": ["로션"],
        "클렌징": ["클렌징"],
    };

    const [reviews, setReviews] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("전체");
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [sortType, setSortType] = useState("popular");
    const [loading, setLoading] = useState(true);
    const [showTopBtn, setShowTopBtn] = useState(false);

    // 리뷰 목록 조회
    useEffect(() => {
        setLoading(true);

        const backendCategories = CATEGORY_MAP[selectedCategory];

        // 전체 카테고리
        if (backendCategories === null) {
            axiosClient.get("/api/reviews")
                .then((res) => {
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

        // 하위 카테고리 병렬 조회
        Promise.all(
            backendCategories.map((cat) =>
                axiosClient.get("/api/reviews", {
                    params: { category: cat },
                }).catch(() => ({ data: [] }))
            )
        )
            .then((results) => {
                const merged = results.flatMap((res) => res.data || []);
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
        const brands = reviews.map((r) => r.brand_name).filter(Boolean);
        return Array.from(new Set(brands)).sort((a, b) => a.localeCompare(b));
    }, [reviews]);

    // 정렬 및 브랜드 필터
    const filteredReviews = useMemo(() => {
        let list = [...reviews];

        if (selectedBrand) {
            list = list.filter((r) => r.brand_name === selectedBrand);
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
            list.sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );
        }

        return list;
    }, [reviews, selectedBrand, sortType]);

    // 상단 선택 텍스트
    const selectedText = (() => {
        if (selectedBrand) return `${selectedCategory} · ${selectedBrand}`;
        return selectedCategory;
    })();

    useEffect(() => {
        const onScroll = () => {
            setShowTopBtn(window.scrollY > 300);
        };

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
