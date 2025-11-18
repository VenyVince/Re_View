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
    const categoryParam = queryParams.get("category") || "";

    const [mode, setMode] = useState("product"); // 상품 먼저 표시
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("");
    const [products, setProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [brands, setBrands] = useState([]);
    const [error, setError] = useState("");

    // 카테고리 자동 감지용 매핑
    const categoryKeywords = {
        "스킨": "스킨 / 토너",
        "토너": "스킨 / 토너",
        "에센스": "에센스 / 세럼 / 앰플",
        "세럼": "에센스 / 세럼 / 앰플",
        "앰플": "에센스 / 세럼 / 앰플",
        "크림": "크림",
        "로션": "로션",
        "미스트": "미스트 / 오일",
        "오일": "미스트 / 오일",
    };

    // URL categoryParam 적용
    useEffect(() => {
        if (categoryParam) {
            setSelectedCategory(categoryParam);
        }
    }, [categoryParam]);

    // keyword 기반 카테고리 자동 선택
    useEffect(() => {
        if (!keyword) return;

        for (const [key, value] of Object.entries(categoryKeywords)) {
            if (keyword.includes(key)) {
                setSelectedCategory(value);
                break;
            }
        }
    }, [keyword]);

    // 검색 API
    useEffect(() => {
        const fetchSearch = async () => {
            if (!keyword || keyword.length < 2) {
                setProducts([]);
                setReviews([]);
                setError("");
                return;
            }

            try {
                const res = await axios.get("/api/search", {
                    params: {
                        keyword,
                        sort: "latest",
                    },
                });

                const responseProducts = res.data.products || [];
                const responseReviews = res.data.reviews || [];

                setProducts(responseProducts);
                setReviews(responseReviews);

                const brandCountMap = {};
                responseProducts.forEach((p) => {
                    const brand = p.prd_brand || "";
                    brandCountMap[brand] = (brandCountMap[brand] || 0) + 1;
                });

                const sortedBrands = Object.entries(brandCountMap)
                    .map(([name, count]) => ({ name, count }))
                    .sort((a, b) => b.count - a.count);

                setBrands(sortedBrands);
                setError("");

                // keyword가 브랜드라면 자동 active
                const brandNames = sortedBrands.map((b) => b.name);
                if (brandNames.includes(keyword)) {
                    setSelectedBrand(keyword);
                }

            } catch (err) {
                setError("검색 결과를 불러오지 못했습니다.");
                setProducts([]);
                setReviews([]);
            }
        };

        fetchSearch();
    }, [keyword]);

    return (
        <section className="search-page">
            <h2 className="search-title">
                검색 결과{keyword && <span> = '{keyword}'</span>}
            </h2>

            <hr className="divider-strong" />

            <div className="search-filters">
                <CategoryFilter
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

            <SearchBar mode={mode} setMode={setMode} />

            {error ? (
                <p className="no-result">{error}</p>
            ) : (
                <SearchResult
                    mode={mode}
                    results={mode === "product" ? products : reviews}
                    selectedCategory={selectedCategory}
                    selectedBrand={selectedBrand}
                />
            )}
        </section>
    );
}
