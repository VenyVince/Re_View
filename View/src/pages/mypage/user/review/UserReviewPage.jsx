// src/pages/mypage/user/review/UserReviewPage.jsx
import React, { useEffect, useState } from "react";
import axiosClient from "../../../../api/axiosClient";
import UserMyPageLayout from "../layout/UserMyPageLayout";
import "./UserReviewPage.css";
import { useNavigate } from "react-router-dom";

export default function UserMyReviewPage() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // 페이지네이션 상태 (10개씩 노출)
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 10;

    // 수정 모드 상태
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [editRating, setEditRating] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [sort, setSort] = useState("latest");
    const [filterRating, setFilterRating] = useState(0);

    const navigate = useNavigate();

    // 날짜 포맷 (YYYY-MM-DD)
    const formatDate = (isoString) => {
        if (!isoString) return "";
        return isoString.slice(0, 10);
    };

    const formatRating = (rating) => {
        if (rating == null) return "-";
        return Number(rating).toFixed(1);
    };

    // === 1. 내 리뷰 목록 불러오기 ===
    const fetchMyReviews = async ({
                                      keywordValue = keyword,
                                      sortValue = sort,
                                      filterRatingValue = filterRating,
                                  } = {}) => {
        try {
            setLoading(true);
            setError("");

            const res = await axiosClient.get("/api/users/reviews/search", {
                params: {
                    keyword: keywordValue,
                    sort: sortValue,
                    filter_rating: filterRatingValue,
                },
            });

            // MyPageReviewResponseDTO 래퍼 안에 들어있다고 가정
            const root = res.data.data || res.data;

            let list =
                root.myPageReviews ||
                root.reviews ||
                root.reviewList ||
                root.content ||
                root.items ||
                root.list ||
                [];

            if (!Array.isArray(list)) list = [];

            // API 스키마 정규화(필드 이름 통일 + 이미지 배열 정리)
            const normalized = list.map((review) => ({
                ...review,
                product_id: review.product_id ?? review.productId,
                review_id: review.review_id ?? review.reviewId,
                imageUrls:
                    review.image_urls ??
                    review.imageUrls ??
                    (review.image_url ? [review.image_url] : []),
                // 마이페이지에서 보는 건 어차피 "내 리뷰"라 기본적으로 수정/삭제 가능하다고 봄
                // 백엔드에서 추가 규칙이 있으면 canUpdate 플래그를 따로 내려줘도 됨
                canUpdate:
                    review.canUpdate ??
                    review.can_update ??
                    true,
            }));

            setReviews(normalized);
            setCurrentPage(1); // 새로 불러올 때는 항상 1페이지로
        } catch (e) {
            console.error("내 리뷰 목록 조회 오류:", e);
            setError("작성한 후기를 불러오는 중 오류가 발생했어요.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // 초기 진입 시 기본 조건으로 한 번 조회
        fetchMyReviews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchMyReviews({
            keywordValue: keyword,
            sortValue: sort,
            filterRatingValue: filterRating,
        });
    };

    // === 2. 삭제 ===
    const handleDelete = async (review) => {
        if (!review.review_id) {
            alert(
                "이 리뷰에는 review_id 정보가 없어 삭제할 수 없습니다. (백엔드 DTO 확인 필요)"
            );
            return;
        }

        // 프론트에서 내려받은 canUpdate 플래그로만 삭제 가능 여부 확인
        if (!review.canUpdate) {
            alert("이 리뷰는 삭제 권한이 없습니다.");
            return;
        }

        if (!review.product_id) {
            alert(
                "이 리뷰에는 product_id 정보가 없어 삭제할 수 없습니다. (MyPageReviewDTO에 product_id 추가 필요)"
            );
            return;
        }

        if (!window.confirm("이 후기를 삭제하시겠습니까?")) return;

        try {
            // DELETE /api/reviews/{product_id}/{review_id}
            await axiosClient.delete(
                `/api/reviews/${review.product_id}/${review.review_id}`
            );

            setReviews((prev) =>
                prev.filter((r) => r.review_id !== review.review_id)
            );
            alert("후기가 삭제되었어요.");
        } catch (e) {
            console.error("리뷰 삭제 오류:", e);
            alert("후기 삭제 중 오류가 발생했습니다.");
        }
    };

    // === 3. 수정 모드 진입 ===
    const handleStartEdit = async (review) => {
        if (!review.review_id) {
            alert(
                "이 리뷰에는 review_id 정보가 없어 수정할 수 없습니다. (백엔드 DTO 확인 필요)"
            );
            return;
        }

        // 프론트에서 내려받은 canUpdate 플래그로만 수정 가능 여부 확인
        if (!review.canUpdate) {
            alert("이 리뷰는 수정 권한이 없습니다.");
            return;
        }

        setEditingId(review.review_id);
        setEditContent(review.content || "");
        setEditRating(Number(review.rating || 0));
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditContent("");
        setEditRating(0);
    };

    // === 4. 수정 저장 ===
    const handleSaveEdit = async () => {
        if (!editingId) return;

        const target = reviews.find((r) => r.review_id === editingId);
        if (target && !target.canUpdate) {
            alert("이 리뷰는 수정 권한이 없습니다.");
            return;
        }

        if (!editContent.trim()) {
            alert("리뷰 내용을 입력해주세요.");
            return;
        }

        const ratingNumber = Number(editRating);
        if (Number.isNaN(ratingNumber) || ratingNumber <= 0 || ratingNumber > 5) {
            alert("별점은 1 ~ 5 사이의 숫자로 입력해주세요.");
            return;
        }

        try {
            // PATCH /api/reviews/{review_id}
            await axiosClient.patch(
                `/api/reviews/${editingId}`,
                {
                    content: editContent.trim(),
                    rating: ratingNumber,
                    // 지금은 이미지 수정 UI는 없으니 기존 배열 그대로 보내기
                    imageUrls: target?.imageUrls ?? [],
                }
            );

            // 프론트 상태 업데이트
            setReviews((prev) =>
                prev.map((r) =>
                    r.review_id === editingId
                        ? {
                            ...r,
                            content: editContent.trim(),
                            rating: ratingNumber,
                        }
                        : r
                )
            );

            alert("후기가 수정되었어요.");
            handleCancelEdit();
        } catch (e) {
            console.error("리뷰 수정 오류:", e);
            alert("후기 수정 중 오류가 발생했습니다.");
        }
    };

    // 페이지네이션 계산
    const totalPages = Math.max(1, Math.ceil(reviews.length / PAGE_SIZE));
    const pagedReviews = reviews.slice(
        (currentPage - 1) * PAGE_SIZE,
        currentPage * PAGE_SIZE
    );

    const handlePageChange = (nextPage) => {
        if (nextPage < 1 || nextPage > totalPages) return;
        setCurrentPage(nextPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <UserMyPageLayout>
            <section className="mypage-section myreview-section">
                <h3 className="reivew-card-title">나의 작성 후기</h3>
                <p className="review-card-sub">
                    내가 작성한 상품 후기를 한눈에 확인할 수 있어요.
                </p>
                <form className="myreview-search-bar" onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        className="myreview-search-input"
                        placeholder="상품명 또는 내용으로 검색"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />

                    <select
                        className="myreview-search-select"
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                    >
                        <option value="latest">최신순</option>
                        <option value="oldest">오래된순</option>
                        <option value="rating_highest">별점 높은순</option>
                        <option value="rating_lowest">별점 낮은순</option>
                        <option value="likes">도움돼요 많은순</option>
                    </select>

                    <select
                        className="myreview-search-select"
                        value={filterRating}
                        onChange={(e) => setFilterRating(Number(e.target.value))}
                    >
                        <option value={0}>전체 평점</option>
                        <option value={4.5}>4.5점 이상</option>
                        <option value={4}>4.0점 이상</option>
                        <option value={3}>3.0점 이상</option>
                    </select>

                    <button type="submit" className="myreview-search-btn">
                        검색
                    </button>
                </form>

                {loading && <p className="myreview-loading">불러오는 중...</p>}
                {error && <p className="myreview-error">{error}</p>}

                {!loading && !error && reviews.length === 0 && (
                    <p className="myreview-empty">아직 작성한 후기가 없어요.</p>
                )}

                <div className="myreview-list">
                    {pagedReviews.map((review) => {
                        const isEditing = editingId === review.review_id;
                        const canUpdate = Boolean(review.canUpdate);

                        return (
                            <article
                                key={
                                    review.review_id ??
                                    `${review.prd_name}-${review.created_at}`
                                }
                                className="myreview-card"
                            >
                                {/* 상단: 상품명 + 날짜 + 버튼 */}
                                <header className="myreview-header">
                                    <div className="myreview-title-block">
                                        <div
                                            className="myreview-product"
                                            onClick={() =>
                                                review.review_id &&
                                                navigate(`/review/${review.review_id}`)
                                            }
                                        >
                                            {review.prd_name}
                                        </div>
                                    </div>

                                    <div className="myreview-meta">
                                        <span className="myreview-date">
                                            {formatDate(review.created_at)}
                                        </span>

                                        {!isEditing ? (
                                            <>
                                                <button
                                                    type="button"
                                                    className="myreview-meta-btn"
                                                    onClick={() => handleStartEdit(review)}
                                                    disabled={!canUpdate}
                                                >
                                                    수정
                                                </button>
                                                <button
                                                    type="button"
                                                    className="myreview-meta-btn"
                                                    onClick={() => handleDelete(review)}
                                                    disabled={!canUpdate}
                                                >
                                                    삭제
                                                </button>
                                            </>
                                        ) : null}
                                    </div>
                                </header>

                                {/* 평점 */}
                                <div className="myreview-rating-row">
                                    <div className="myreview-stars">
                                        {Array.from({ length: 5 }).map((_, idx) => {
                                            const score = isEditing
                                                ? Number(editRating) || 0
                                                : Number(review.rating) || 0;

                                            let starClass = "myreview-star";
                                            if (score >= idx + 1) {
                                                starClass += " myreview-star--on";
                                            } else if (score >= idx + 0.5) {
                                                starClass += " myreview-star--half";
                                            }

                                            return (
                                                <span key={idx} className={starClass}>
                                                    ★
                                                </span>
                                            );
                                        })}
                                        <span className="myreview-score">
                                            {isEditing
                                                ? Number(editRating || 0).toFixed(1)
                                                : formatRating(review.rating)}
                                        </span>
                                    </div>
                                </div>

                                {/* 내용: 보기 모드 / 수정 모드 */}
                                {!isEditing ? (
                                    <p className="myreview-content">{review.content}</p>
                                ) : (
                                    <div className="myreview-edit-area">
                                        {/* 상단: 별점 입력 */}
                                        <div className="myreview-edit-header">
                                            <div className="myreview-edit-rating">
                                                <span className="myreview-edit-label">별점</span>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="5"
                                                    step="0.5"
                                                    className="myreview-edit-rating-input"
                                                    value={editRating}
                                                    onChange={(e) =>
                                                        setEditRating(e.target.value)
                                                    }
                                                />
                                                <span className="myreview-edit-rating-max">
                                                    / 5
                                                </span>
                                            </div>
                                            <span className="myreview-edit-help">
                                                내용과 별점을 수정한 뒤 &ldquo;저장하기&rdquo;를 눌러주세요.
                                            </span>
                                        </div>

                                        {/* 내용 입력 */}
                                        <textarea
                                            className="myreview-edit-textarea"
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            rows={5}
                                            placeholder="상품을 사용해 본 느낌을 자세히 적어주세요."
                                        />

                                        {/* 버튼 영역 */}
                                        <div className="myreview-edit-actions">
                                            <button
                                                type="button"
                                                className="myreview-cancel-btn"
                                                onClick={handleCancelEdit}
                                            >
                                                취소
                                            </button>
                                            <button
                                                type="button"
                                                className="myreview-save-btn"
                                                onClick={handleSaveEdit}
                                            >
                                                저장하기
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* 리뷰 이미지 */}
                                {Array.isArray(review.imageUrls) &&
                                    review.imageUrls.length > 0 && (
                                        <div className="myreview-images">
                                            {review.imageUrls.map((url, idx) => (
                                                <div key={idx} className="myreview-thumb">
                                                    <img
                                                        src={url}
                                                        alt={`리뷰 이미지 ${idx + 1}`}
                                                        className="myreview-thumb-img"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                            </article>
                        );
                    })}
                </div>
                {/* 페이지네이션 */}
                {totalPages > 1 && (
                    <div className="myreview-pagination">
                        <button
                            type="button"
                            className="myreview-page-btn myreview-page-prev"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            이전
                        </button>

                        {Array.from({ length: totalPages }).map((_, idx) => {
                            const page = idx + 1;
                            return (
                                <button
                                    key={page}
                                    type="button"
                                    className={
                                        "myreview-page-btn" +
                                        (page === currentPage
                                            ? " myreview-page-btn--active"
                                            : "")
                                    }
                                    onClick={() => handlePageChange(page)}
                                >
                                    {page}
                                </button>
                            );
                        })}

                        <button
                            type="button"
                            className="myreview-page-btn myreview-page-next"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            다음
                        </button>
                    </div>
                )}
            </section>
        </UserMyPageLayout>
    );
}