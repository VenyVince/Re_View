// src/pages/search/SearchPage.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axiosClient from "api/axiosClient";
import "./SearchPage.css";
import CategoryFilter from "./components/CategoryFilter";
import BrandFilter from "./components/BrandFilter";
import SearchBar from "./components/SearchBar";
import SearchResult from "./components/searchResult/SearchResult";

export default function SearchPage() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const keyword = queryParams.get("keyword") || "";

    const [mode, setMode] = useState("product");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("");
    const [products, setProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [brands, setBrands] = useState([]);
    const [error, setError] = useState("");
    const [sortType, setSortType] = useState("popular");

    // 검색 결과 기반 카테고리
    const [dynamicCategories, setDynamicCategories] = useState([]);

    // 카테고리 필터 공통 함수
    const filterByCategory = (list, category) => {
        if (!category || category === "전체") return list;
        return list.filter(item => item.category === category);
    };

    useEffect(() => {
        const fetchSearch = async () => {
            if (!keyword || keyword.length < 2) {
                setProducts([]);
                setReviews([]);
                setBrands([]);
                setDynamicCategories([]);
                setMode("product");
                return;
            }

            try {
                const res = await axiosClient.get("/api/search", {
                    params: {
                        keyword,
                        sort: sortType,
                        filter_rating: 0
                    }
                });

                const originalProducts = res.data.products || [];
                const originalReviews = res.data.reviews || [];

                /** -------------------------------------------
                 * 1) 검색 결과 기반 카테고리 생성
                 ------------------------------------------- */
                const categoriesFromProducts = originalProducts
                    .map(p => p.category)
                    .filter(Boolean);

                const categoriesFromReviews = originalReviews
                    .map(r => r.category)
                    .filter(Boolean);

                const merged = [...categoriesFromProducts, ...categoriesFromReviews];
                const unique = [...new Set(merged)];

                setDynamicCategories(["전체", ...unique]);

                /** -------------------------------------------
                 * 2) product / review 카테고리 필터
                 ------------------------------------------- */
                const filteredProducts = filterByCategory(originalProducts, selectedCategory);
                const filteredReviews = filterByCategory(originalReviews, selectedCategory);

                setProducts(filteredProducts);
                setReviews(filteredReviews);

                /** -------------------------------------------
                 * 3) 브랜드 생성
                 ------------------------------------------- */
                const brandMap = {};
                filteredProducts.forEach(item => {
                    const brand = item.prd_brand || "기타";
                    brandMap[brand] = (brandMap[brand] || 0) + 1;
                });

                const sortedBrands = Object.entries(brandMap)
                    .map(([name, count]) => ({ name, count }))
                    .sort((a, b) => b.count - a.count);

                setBrands(sortedBrands);


            } catch {
                setError("검색 결과를 불러오지 못했습니다.");
                setProducts([]);
                setReviews([]);
                setBrands([]);
                setDynamicCategories([]);
                setMode("product");
            }
        };

        fetchSearch();
    }, [keyword, selectedCategory, sortType, mode, selectedBrand]);

    return (
        <section className="search-page">
            <h2 className="search-title">
                검색 결과{keyword && <span> = '{keyword}'</span>}
            </h2>

            <hr className="divider-strong" />

            <div className="search-filters">
                <CategoryFilter
                    categories={dynamicCategories}
                    selectedCategory={selectedCategory}
                    onSelect={setSelectedCategory}
                />

                <hr className="divider-light" />

                <BrandFilter
                    selectedBrand={selectedBrand}
                    onSelect={setSelectedBrand}
                    brands={brands}
                    keyword={keyword}
                />

                <hr className="divider-strong" />
            </div>

            <SearchBar mode={mode} setMode={setMode} setSortType={setSortType} />

            {error ? (
                <p className="no-result">{error}</p>
            ) : (
                <SearchResult
                    mode={mode}
                    products={products}
                    reviews={reviews}
                    selectedCategory={selectedCategory}
                    selectedBrand={selectedBrand}
                    sortType={sortType}
                />
            )}
        </section>
    );
}
