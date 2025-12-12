// src/pages/product/ProductPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import { fetchProductsByCategory } from "../../api/products/productApi";

import "./ProductPage.css";

import CategoryTabs from "./components/CategoryTabs";
import ProductSortSelect from "./components/ProductSortSelect";
import ProductList from "./components/ProductList";

export default function ProductPage() {
    const CATEGORIES = ["스킨/토너", "에센스/세럼/앰플", "크림", "로션", "클렌징"];
    const CATEGORY_MAP = {
        "스킨/토너": ["스킨", "토너"],
        "에센스/세럼/앰플": ["에센스", "세럼", "앰플"],
        "크림": ["크림"],
        "로션": ["로션"],
        "클렌징": ["클렌징"],
    };

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [sortType, setSortType] = useState("recommend");
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [loading, setLoading] = useState(false);
    const [brandReady, setBrandReady] = useState(false);
    const [showTopBtn, setShowTopBtn] = useState(false);

    useEffect(() => {
        setLoading(true);
        setBrandReady(false);
        setProducts([]);
        setSelectedBrand(null);

        async function load() {
            try {
                if (selectedCategory === null) {
                    const res = await fetchProductsByCategory(null);
                    const list = Array.isArray(res.data) ? res.data : (res.data?.content ?? []);
                    setProducts(list);
                    setBrandReady(true);
                    return;
                }

                const categoriesToCall = CATEGORY_MAP[selectedCategory] || [];
                const responses = await Promise.all(
                    categoriesToCall.map((cat) => fetchProductsByCategory(cat))
                );

                // 🔧 이 줄이 핵심 수정!
                const merged = responses.flatMap((res) =>
                    Array.isArray(res.data) ? res.data : (res.data?.content ?? [])
                );

                const unique = Array.from(
                    new Map(merged.map((item) => [item.product_id, item])).values()
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

    const selectedText = (() => {
        const catLabel = selectedCategory === null ? "전체" : selectedCategory;
        if (selectedBrand) return `${catLabel} · ${selectedBrand}`;
        return catLabel;
    })();

    useEffect(() => {
        const onScroll = () => {
            setShowTopBtn(window.scrollY > 300);
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

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
                <ProductSortSelect sortType={sortType} setSortType={setSortType} />
            </div>

            {loading ? (
                <div className="productLoading">로딩중...</div>
            ) : filteredProducts.length === 0 ? (
                <div className="productEmpty">상품이 없습니다.</div>
            ) : (
                <ProductList products={filteredProducts} />
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
