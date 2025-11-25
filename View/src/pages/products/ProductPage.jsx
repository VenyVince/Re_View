// src/pages/product/ProductPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import { fetchAllProducts } from "../../api/products/productApi";

import "./ProductPage.css";

import CategoryTabs from "./components/CategoryTabs";
import SortSelect from "./components/SortSelect";
import ProductSlider from "./components/ProductSlider";

export default function ProductPage() {
    // 카테고리 목록
    const CATEGORIES = ["스킨/토너", "에센스/세럼/앰플", "크림", "로션", "클렌징"];

    // 카테고리별 포함 키워드
    const KEYWORDS = {
        "스킨/토너": ["스킨", "토너"],
        "에센스/세럼/앰플": ["에센스", "세럼", "앰플"],
        크림: ["크림"],
        로션: ["로션"],
        클렌징: ["클렌징"]
    };

    // 한 페이지당 상품 개수
    const PAGE_SIZE = 8;

    // 슬라이더 width
    const PAGE_WIDTH = 1200;

    // 선택된 카테고리
    const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);

    // 카테고리별 그룹핑된 데이터
    const [grouped, setGrouped] = useState({});

    // 카테고리별 현재 페이지 인덱스
    const [pageState, setPageState] = useState({});

    // 정렬 기준
    const [sortType, setSortType] = useState("recommend");

    // 모든 상품 조회 후 카테고리별 분류
    useEffect(() => {
        fetchAllProducts().then((res) => {
            const data = res?.data ?? [];

            const groupedData = {};
            const pageMap = {};

            CATEGORIES.forEach((cat) => {
                const list = data.filter((p) =>
                    KEYWORDS[cat].some((k) => p.category?.includes(k))
                );

                const pages = [];
                for (let i = 0; i < list.length; i += PAGE_SIZE) {
                    pages.push(list.slice(i, i + PAGE_SIZE));
                }

                groupedData[cat] = pages;
                pageMap[cat] = 0;
            });

            setGrouped(groupedData);
            setPageState(pageMap);
        });
    }, []);

    // 현재 카테고리의 페이지 데이터
    const rawPages = grouped[selectedCategory] || [];
    const currentPage = pageState[selectedCategory] || 0;

    // 정렬된 페이지 계산
    const sortedPages = useMemo(() => {
        if (!rawPages.length) return [];

        const all = rawPages.flat();

        const sorted = [...all].sort((a, b) => {
            switch (sortType) {
                case "price_low":
                    return a.price - b.price;
                case "price_high":
                    return b.price - a.price;
                case "name":
                    return a.prd_name.localeCompare(b.prd_name);
                default:
                    return 0;
            }
        });

        const pages = [];
        for (let i = 0; i < sorted.length; i += PAGE_SIZE) {
            pages.push(sorted.slice(i, i + PAGE_SIZE));
        }

        return pages;
    }, [rawPages, sortType]);

    return (
        <div className="pageWrapper">
            {/* 카테고리 탭 */}
            <CategoryTabs
                categories={CATEGORIES}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
                resetPageState={setPageState}
            />

            {/* 카테고리 제목 + 정렬 */}
            <div className="titleRow">
                <h2 className="categoryTitle">{selectedCategory}</h2>

                <SortSelect
                    sortType={sortType}
                    setSortType={setSortType}
                    selectedCategory={selectedCategory}
                    setPageState={setPageState}
                />
            </div>

            {/* 상품 슬라이더 */}
            <ProductSlider
                sortedPages={sortedPages}
                currentPage={currentPage}
                pageWidth={PAGE_WIDTH}
                selectedCategory={selectedCategory}
                setPageState={setPageState}
            />
        </div>
    );
}
