import React from "react";
import { useLocation } from "react-router-dom";
import "./SearchPage.css";
import CategoryFilter from "./components/CategoryFilter";
import BrandFilter from "./components/BrandFilter";
import SearchBar from "./components/SearchBar";

export default function SearchPage() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const keyword = queryParams.get("query") || ""; // 검색어 값

    return (
        <section className="search-page">
            {/*  검색어가 있으면 '검색 결과 = "선크림"' 형태로 표시 */}
            <h2 className="search-title">
                검색 결과{keyword && <span> = '{keyword}'</span>}
            </h2>
            <hr className="divider-strong" />

            {/* 필터 영역 */}
            <div className="search-filters">
                <CategoryFilter />
                <BrandFilter />
                <hr className="divider-strong" />
            </div>
            <SearchBar />


            {/* 실제 검색 결과 목록 (나중에 연결 가능) */}
            <div className="search-results">
                <p>여기에 "{keyword}" 관련 상품이 표시됩니다.</p>
            </div>
        </section>
    );
}
