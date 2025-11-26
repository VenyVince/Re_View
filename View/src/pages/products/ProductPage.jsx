// src/pages/product/ProductPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import { fetchProductsByCategory } from "../../api/products/productApi";

import "./ProductPage.css";

import CategoryTabs from "./components/CategoryTabs";
import SortSelect from "./components/SortSelect";
import ProductSlider from "./components/ProductSlider";

export default function ProductPage() {
    // 프론트 탭 카테고리
    const CATEGORIES = ["스킨/토너", "에센스/세럼/앰플", "크림", "로션", "클렌징"];

    // 프론트 카테고리 → 백엔드 category값 여러 개 매핑
    const CATEGORY_MAP = {
        "스킨/토너": ["토너", "스킨"],
        "에센스/세럼/앰플": ["에센스", "세럼", "앰플"],
        "크림": ["크림", "스킨케어/크림"],
        "로션": ["로션"],
        "클렌징": ["클렌징"]
    };

    // 한 페이지당 상품 개수
    const PAGE_SIZE = 8;

    // 슬라이더 width
    const PAGE_WIDTH = 1200;

    const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
    const [grouped, setGrouped] = useState({});
    const [pageState, setPageState] = useState({});
    const [sortType, setSortType] = useState("recommend");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const backendCats = CATEGORY_MAP[selectedCategory] ?? [];

        setLoading(true); // 로딩 시작

        Promise.all(backendCats.map(cat => fetchProductsByCategory(cat)))
            .then(responses => {
                const merged = responses.flatMap(r => r.data?.content ?? []);

                const unique = Array.from(
                    new Map(merged.map(item => [item.product_id, item])).values()
                );

                const pages = [];
                for (let i = 0; i < unique.length; i += PAGE_SIZE) {
                    pages.push(unique.slice(i, i + PAGE_SIZE));
                }

                setGrouped(prev => ({
                    ...prev,
                    [selectedCategory]: pages
                }));

                setPageState(prev => ({
                    ...prev,
                    [selectedCategory]: 0
                }));
            })
            .finally(() => {
                setLoading(false); // 로딩 끝
            });
    }, [selectedCategory]);

    // 복합 카테고리 처리 (★ 핵심 로직)
    useEffect(() => {
        const backendCats = CATEGORY_MAP[selectedCategory] ?? [];

        // 여러 category를 가진 경우 여러 번 API 호출 → 합치기
        Promise.all(backendCats.map(cat => fetchProductsByCategory(cat)))
            .then(responses => {
                // 응답 content 전체 합치기
                const merged = responses.flatMap(r => r.data?.content ?? []);

                // 중복 제거 (product_id 기준)
                const unique = Array.from(
                    new Map(merged.map(item => [item.product_id, item])).values()
                );

                // PAGE_SIZE로 분할
                const pages = [];
                for (let i = 0; i < unique.length; i += PAGE_SIZE) {
                    pages.push(unique.slice(i, i + PAGE_SIZE));
                }

                setGrouped(prev => ({
                    ...prev,
                    [selectedCategory]: pages
                }));

                setPageState(prev => ({
                    ...prev,
                    [selectedCategory]: 0
                }));
            });
    }, [selectedCategory]);

    // 현재 카테고리의 페이지 데이터
    const rawPages = grouped[selectedCategory] || [];
    const currentPage = pageState[selectedCategory] || 0;

    // 정렬된 페이지 (★ 그대로 유지)
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

            {/* 제목 + 정렬 */}
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
            {loading ? (
                <div className="loading">로딩중...</div>
            ) : sortedPages.length === 0 ? (
                <div className="no-products">상품이 없습니다.</div>
            ) : (
                <ProductSlider
                    sortedPages={sortedPages}
                    currentPage={currentPage}
                    pageWidth={PAGE_WIDTH}
                    selectedCategory={selectedCategory}
                    setPageState={setPageState}
                />
            )}

        </div>
    );
}
