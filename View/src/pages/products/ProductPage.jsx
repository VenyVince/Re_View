// src/pages/product/ProductPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import { fetchProductsByCategory } from "../../api/products/productApi";

import "./ProductPage.css";

import CategoryTabs from "./components/CategoryTabs";
import ProductSortSelect from "./components/ProductSortSelect";
import ProductList from "./components/ProductList";

export default function ProductPage() {

    // 카테고리 및 상태값
    const CATEGORIES = ["스킨/토너", "에센스/세럼/앰플", "크림", "로션", "클렌징"];
    const CATEGORY_MAP = {
        "스킨/토너": ["스킨", "토너"],
        "에센스/세럼/앰플": ["에센스", "세럼", "앰플"],
        "크림": ["크림", "스킨케어/크림"],
        "로션": ["로션"],
        "클렌징": ["클렌징"]
    };
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [sortType, setSortType] = useState("recommend");
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [loading, setLoading] = useState(false);
    const [brandReady, setBrandReady] = useState(false);

    // 카테고리 변경 시 상품 조회
    useEffect(() => {
        setLoading(true);
        setBrandReady(false);
        setProducts([]);
        setSelectedBrand(null);

        async function load() {
            try {
                if (selectedCategory === null) {
                    const res = await fetchProductsByCategory(null);
                    setProducts(res.data ?? []);
                    setBrandReady(true);
                    return;
                }

                const categoriesToCall = CATEGORY_MAP[selectedCategory] || [];

                const responses = await Promise.all(
                    categoriesToCall.map(cat => fetchProductsByCategory(cat))
                );

                const merged = responses.flatMap(res => res.data?.content ?? []);

                const unique = Array.from(
                    new Map(merged.map(item => [item.product_id, item])).values()
                );

                setProducts(unique);
                setBrandReady(true);
            } catch (err) {
                console.error("상품 조회 오류:", err);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [selectedCategory]);

    // 브랜드 및 정렬 필터 적용
    const filteredProducts = useMemo(() => {
        let items = [...products];

        if (selectedBrand) {
            items = items.filter((p) => p.prd_brand === selectedBrand);
        }

        switch (sortType) {
            case "price_low":
                return items.sort((a, b) => a.price - b.price);
            case "price_high":
                return items.sort((a, b) => b.price - a.price);
            case "name":
                return items.sort((a, b) => a.prd_name.localeCompare(b.prd_name));
            default:
                return items;
        }
    }, [products, selectedBrand, sortType]);

    // 선택 텍스트 생성
    const selectedText = (() => {
        const catLabel = selectedCategory === null ? "전체" : selectedCategory;
        if (selectedBrand) return `${catLabel} · ${selectedBrand}`;
        return catLabel;
    })();

    // UI 렌더링
    return (
        <div className="productPageWrapper">

            <div className="selected-info">{selectedText}</div>

            <CategoryTabs
                categories={CATEGORIES}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
                products={products}
                selectedBrand={selectedBrand}
                onBrandSelect={setSelectedBrand}
                loading={loading}
            />

            <div className="productTitleRow">
                <ProductSortSelect
                    sortType={sortType}
                    setSortType={setSortType}
                />
            </div>

            {loading ? (
                <div className="productLoading">로딩중...</div>
            ) : filteredProducts.length === 0 ? (
                <div className="productEmpty">상품이 없습니다.</div>
            ) : (
                <ProductList products={filteredProducts} />
            )}
        </div>
    );
}
