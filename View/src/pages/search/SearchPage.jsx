// src/pages/search/SearchPage.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import "./SearchPage.css";
import CategoryFilter from "./components/CategoryFilter";
import BrandFilter from "./components/BrandFilter";
import SearchBar from "./components/SearchBar";
import SearchResult from "./components/SearchResult";

export default function SearchPage() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const keyword = queryParams.get("keyword") || "";

    const [mode, setMode] = useState("product");
    const [selectedCategory, setSelectedCategory] = useState(""); // 단일 카테고리
    const [selectedBrand, setSelectedBrand] = useState("");
    const [products, setProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [brands, setBrands] = useState([]);
    const [error, setError] = useState("");
    const [sortType, setSortType] = useState("popular");

    // 🔥 단일 카테고리 필터에 맞춰 data를 필터링하는 함수
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
                setMode("product");
                return;
            }

            try {
                const res = await axios.get("/api/search", {
                    params: {
                        keyword,
                        sort: "latest",
                        filter_rating: 0
                    }
                });

                let dataProducts = res.data.products || [];
                let dataReviews = res.data.reviews || [];

                // 🔥 선택된 category 에 따라 필터
                dataProducts = filterByCategory(dataProducts, selectedCategory);
                dataReviews = filterByCategory(dataReviews, selectedCategory);

                setProducts(dataProducts);
                setReviews(dataReviews);

                // 🔥 브랜드 카운트
                const brandMap = {};
                [...dataProducts, ...dataReviews].forEach(item => {
                    const brand = item.prd_brand || "기타";
                    brandMap[brand] = (brandMap[brand] || 0) + 1;
                });

                const sortedBrands = Object.entries(brandMap)
                    .map(([name, count]) => ({ name, count }))
                    .sort((a, b) => b.count - a.count);

                setBrands(sortedBrands);

                // 🔥 리뷰 자동 전환 (닉네임 검색 등에만)
                if (dataReviews.length > 0 && dataProducts.length === 0) {
                    setMode("review");
                } else {
                    setMode("product");
                }

                setError("");

            } catch {
                setError("검색 결과를 불러오지 못했습니다.");
                setProducts([]);
                setReviews([]);
                setBrands([]);
                setMode("product");
            }
        };

        fetchSearch();
    }, [keyword, selectedCategory]);

    return (
        <section className="search-page">
            <h2 className="search-title">
                검색 결과{keyword && <span> = '{keyword}'</span>}
            </h2>

            <hr className="divider-strong" />

            <div className="search-filters">
                <CategoryFilter
                    selectedCategory={selectedCategory}
                    onSelect={(cat) => {
                        setSelectedCategory(cat); // 🔥 keyword 변경 없음
                    }}
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

            <SearchBar
                mode={mode}
                setMode={setMode}
                setSortType={setSortType}
            />

            {error ? (
                <p className="no-result">{error}</p>
            ) : (
                <SearchResult
                    mode={mode}
                    results={mode === "product" ? products : reviews}
                    selectedCategory={selectedCategory}
                    selectedBrand={selectedBrand}
                    sortType={sortType}
                />
            )}
        </section>
    );
}
