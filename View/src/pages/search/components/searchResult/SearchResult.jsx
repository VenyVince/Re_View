// src/pages/search/components/SearchResult/SearchResult.jsx
import React from "react";
import ProductResult from "./ProductResult";
import ReviewResult from "./ReviewResult";
import "./SearchResult.css";

export default function SearchResult({
                                         mode,
                                         products = [],
                                         reviews = [],
                                         selectedBrand,
                                         selectedCategory,
                                         sortType
                                     }) {
    return (
        <div className="search-result">
            {mode === "product" ? (
                <ProductResult
                    products={products}
                    selectedBrand={selectedBrand}
                    selectedCategory={selectedCategory}
                    sortType={sortType}
                />
            ) : (
                <ReviewResult
                    reviews={reviews}
                    selectedBrand={selectedBrand}
                    selectedCategory={selectedCategory}
                    sortType={sortType}
                />
            )}
        </div>
    );
}
