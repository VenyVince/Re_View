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

    const [mode, setMode] = useState("review");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedBrand, setSelectedBrand] = useState("");
    const [products, setProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [brands, setBrands] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        if (categoryParam) {
            setSelectedCategory(categoryParam);
        }
    }, [categoryParam]);

    useEffect(() => {
        const fetchSearch = async () => {
            if (!keyword || keyword.length < 2) {
                setProducts([]);
                setReviews([]);
                return;
            }

            try {
                const res = await axios.get("/api/search", {
                    params: {
                        keyword,
                        sort: "latest",
                        filter_rating: 0,
                        filter_brand: selectedBrand,
                        filter_category: selectedCategory
                    }
                });

                const responseProducts = res.data.products || [];
                const responseReviews = res.data.reviews || [];

                setProducts(responseProducts);
                setReviews(responseReviews);

                const brandCountMap = {};
                responseReviews.forEach(r => {
                    const brand = r.prd_brand || "기타";
                    brandCountMap[brand] = (brandCountMap[brand] || 0) + 1;
                });

                const sortedBrands = Object.entries(brandCountMap)
                    .map(([name, count]) => ({ name, count }))
                    .sort((a, b) => b.count - a.count);

                setBrands(sortedBrands);

                setError("");

            } catch (err) {
                setError("검색 결과를 불러오지 못했습니다.");
                setProducts([]);
                setReviews([]);
            }
        };

        fetchSearch();
    }, [keyword, selectedBrand, selectedCategory]);

    // ⭐ 카테고리 값 확인용 (문제 해결 전 필요한 최소 변경)
    console.log("🔥 category check:", products[0]?.prd_category);

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
