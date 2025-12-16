import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import "./ReviewPage.css";

import axiosClient from "api/axiosClient";

import CategoryTabs from "./components/CategoryTabs";
import ReviewSortSelect from "./components/ReviewSortSelect";
import ReviewList from "./components/ReviewList";

export default function ReviewPage() {

    // 카테고리 및 매핑
    const CATEGORIES = ["전체", "토너", "앰플", "크림", "로션", "클렌징"];

    const [reviews, setReviews] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("전체");
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [sortType, setSortType] = useState("like_count");
    const [loading, setLoading] = useState(true);
    const [showTopBtn, setShowTopBtn] = useState(false);

    // 인피니티 스크롤 관련 상태
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);

    // Intersection Observer를 위한 ref
    const observerTarget = useRef(null);

    // 리뷰 데이터 가져오기 함수
    const fetchReviews = useCallback(async (currentPage, isInitial = false) => {
        if (isInitial) {
            setLoading(true);
        } else {
            setIsLoadingMore(true);
        }

        try {
            const res = await axiosClient.get("/api/reviews", {
                params: {
                    sort: sortType || "like_count",
                    category: selectedCategory === "전체" ? "" : selectedCategory,
                    page: currentPage,
                },
            });

            const newReviews = res.data || [];

            // 100개 미만이면 더 이상 데이터가 없음
            if (newReviews.length < 100) {
                setHasMore(false);
            }

            if (isInitial) {
                setReviews(newReviews);
            } else {
                setReviews(prev => [...prev, ...newReviews]);
            }
        } catch (error) {
            console.error("리뷰 로딩 실패:", error);
            if (isInitial) {
                setReviews([]);
            }
            setHasMore(false);
        } finally {
            setLoading(false);
            setIsLoadingMore(false);
        }
    }, [sortType, selectedCategory]);

    // 카테고리 변경 시
    useEffect(() => {
        setPage(0);
        setHasMore(true);
        setSelectedBrand(null);
        fetchReviews(0, true);
    }, [selectedCategory]);

    // 정렬 변경 시
    useEffect(() => {
        setPage(0);
        setHasMore(true);
        fetchReviews(0, true);
    }, [sortType]);

    // Intersection Observer 설정
    useEffect(() => {
        const observer = new IntersectionObserver(
            entries => {
                // 타겟이 화면에 보이고, 로딩 중이 아니며, 더 불러올 데이터가 있을 때
                if (entries[0].isIntersecting && !isLoadingMore && hasMore && !loading) {
                    setPage(prev => {
                        const nextPage = prev + 1;
                        fetchReviews(nextPage, false);
                        return nextPage;
                    });
                }
            },
            { threshold: 0.1 } // 10%만 보여도 트리거
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [isLoadingMore, hasMore, loading, fetchReviews]);

    // 브랜드 목록 생성
    const brandList = useMemo(() => {
        const brands = reviews.map((r) => r.brand_name).filter(Boolean);
        return Array.from(new Set(brands)).sort((a, b) => a.localeCompare(b));
    }, [reviews]);

    // 정렬 및 브랜드 필터
    const filteredReviews = useMemo(() => {
        if (!selectedBrand) return reviews;
        return reviews.filter(r => r.brand_name === selectedBrand);
    }, [reviews, selectedBrand]);

    // 상단 선택 텍스트
    const selectedText = (() => {
        if (selectedBrand) return `${selectedCategory} · ${selectedBrand}`;
        return selectedCategory;
    })();

    useEffect(() => {
        const onScroll = () => setShowTopBtn(window.scrollY > 300);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <div className="reviewPageWrapper">

            <div className="selected-info">{selectedText}</div>

            <CategoryTabs
                categories={CATEGORIES}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
                brandList={brandList}
                selectedBrand={selectedBrand}
                onBrandSelect={setSelectedBrand}
            />

            <div className="reviewTitleRow">
                <ReviewSortSelect
                    sortType={sortType}
                    setSortType={setSortType}
                />
            </div>

            {loading ? (
                <div className="reviewLoading">로딩중...</div>
            ) : filteredReviews.length === 0 ? (
                <div className="reviewEmpty">리뷰가 없습니다.</div>
            ) : (
                <>
                    <ReviewList reviews={filteredReviews} />

                    {/* 인피니티 스크롤 트리거 영역 */}
                    {hasMore && (
                        <div
                            ref={observerTarget}
                            style={{
                                height: '50px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '20px 0'
                            }}
                        >
                            {isLoadingMore && (
                                <div className="reviewLoading">더 불러오는 중...</div>
                            )}
                        </div>
                    )}

                    {!hasMore && filteredReviews.length > 0 && (
                        <div style={{
                            textAlign: 'center',
                            padding: '20px',
                            color: '#999'
                        }}>
                            모든 리뷰를 불러왔습니다.
                        </div>
                    )}
                </>
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