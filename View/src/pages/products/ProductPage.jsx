// src/pages/product/ProductPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import { fetchProductsByCategory } from "../../api/products/productApi";

import "./ProductPage.css";

import CategoryTabs from "./components/CategoryTabs";
import SortSelect from "./components/SortSelect";
import ProductSlider from "./components/ProductSlider";

export default function ProductPage() {
    const CATEGORIES = ["스킨/토너", "에센스/세럼/앰플", "크림", "로션", "클렌징"];

    const CATEGORY_MAP = {
        "스킨/토너": ["토너", "스킨"],
        "에센스/세럼/앰플": ["에센스", "세럼", "앰플"],
        "크림": ["크림", "스킨케어/크림"],
        "로션": ["로션"],
        "클렌징": ["클렌징"]
    };

    const PAGE_SIZE = 8;
    const PAGE_WIDTH = 1200;

    const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
    const [grouped, setGrouped] = useState({});
    const [pageState, setPageState] = useState({});
    const [sortType, setSortType] = useState("recommend");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const backendCats = CATEGORY_MAP[selectedCategory] ?? [];

        setLoading(true);

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
            .finally(() => setLoading(false));
    }, [selectedCategory]);

    useEffect(() => {
        const backendCats = CATEGORY_MAP[selectedCategory] ?? [];

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
            });
    }, [selectedCategory]);

    const rawPages = grouped[selectedCategory] || [];
    const currentPage = pageState[selectedCategory] || 0;

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
        <div className="productPageWrapper">

            <CategoryTabs
                categories={CATEGORIES}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
                resetPageState={setPageState}
            />

            <div className="productTitleRow">
                <h2 className="productCategoryTitle">{selectedCategory}</h2>

                <SortSelect
                    sortType={sortType}
                    setSortType={setSortType}
                    selectedCategory={selectedCategory}
                    setPageState={setPageState}
                />
            </div>

            {loading ? (
                <div className="productLoading">로딩중...</div>
            ) : sortedPages.length === 0 ? (
                <div className="productEmpty">상품이 없습니다.</div>
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
