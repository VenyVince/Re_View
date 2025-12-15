// src/pages/product/ProductPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import axiosClient from "api/axiosClient";

import "./ProductPage.css";

import CategoryTabs from "./components/CategoryTabs";
import ProductSortSelect from "./components/ProductSortSelect";
import ProductList from "./components/ProductList";

export default function ProductPage() {
    const CATEGORIES = ["전체", "토너", "앰플", "크림", "로션", "클렌징"];

    const [selectedCategory, setSelectedCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [sortType, setSortType] = useState("latest");
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showTopBtn, setShowTopBtn] = useState(false);

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setSelectedBrand(null);

        setProducts([]);      // 카테고리 변경 즉시 초기화
        setLoading(true);
    };

    useEffect(() => {
        setLoading(true);

        axiosClient.get("/api/products", {
            params: {
                sort: sortType,
                category:
                    selectedCategory === null || selectedCategory === "전체"
                        ? ""
                        : selectedCategory,
            },
        })
            .then((res) => {
                setProducts(res.data || []);
                setLoading(false);
            })
            .catch(() => {
                setProducts([]);
                setLoading(false);
            });
    }, [selectedCategory, sortType]);

    const filteredProducts = useMemo(() => {
        if (!selectedBrand) return products;
        return products.filter((p) => p.prd_brand === selectedBrand);
    }, [products, selectedBrand]);

    const selectedText = (() => {
        const catLabel = selectedCategory === null ? "전체" : selectedCategory;
        if (selectedBrand) return `${catLabel} · ${selectedBrand}`;
        return catLabel;
    })();

    useEffect(() => {
        const onScroll = () => setShowTopBtn(window.scrollY > 300);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <div className="productPageWrapper">
            <div className="selected-info">{selectedText}</div>

            <CategoryTabs
                categories={CATEGORIES}
                selected={selectedCategory}
                onSelect={handleCategorySelect}
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

            {showTopBtn && (
                <button
                    className="pd-top-btn"
                    onClick={() =>
                        window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                >
                    <span className="top-arrow">∧</span>
                    <span className="top-text">TOP</span>
                </button>
            )}
        </div>
    );
}
