// src/pages/mypage/user/review/UserReviewPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import UserMyPageLayout from "../layout/UserMyPageLayout";
import "./UserReviewPage.css";

export default function UserMyReviewPage() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // 수정 모드 상태
    const [editingId, setEditingId] = useState(null);
    const [editContent, setEditContent] = useState("");
    const [editRating, setEditRating] = useState(0);

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
    useEffect(() => {
        const fetchMyReviews = async () => {
            try {
                setLoading(true);
                setError("");

                // 마이페이지용 내 리뷰 목록
                const res = await axios.get("/api/users/reviews/search", {
                    params: {
                        keyword: "",
                        sort: "latest",
                        filter_rating: 0,
                    },
                    withCredentials: true,
                });

                const root = res.data.data || res.data;

                // 백엔드 응답 필드 이름 : myPageReviews (추가 안전장치)
                let list =
                    root.myPageReviews ||
                    root.reviews ||
                    root.reviewList ||
                    root.content ||
                    root.items ||
                    root.list ||
                    [];

                if (!Array.isArray(list)) list = [];

                // 리뷰별 수정/삭제 권한 체크 (/api/reviews/exists/update)
                const listWithPerms = await Promise.all(
                    list.map(async (review) => {
                        if (!review.review_id) {
                            // review_id 없으면 권한 체크 불가 → 버튼 비활성화
                            return { ...review, canUpdate: false };
                        }
                        try {
                            const permRes = await axios({
                                method: "get",
                                url: "/api/reviews/exists/update",
                                //️ 이 컨트롤러는 @RequestBody int review_id 를 받으므로
                                // params 가 아니라 data 로 넘겨야 함
                                data: review.review_id,
                                withCredentials: true,
                            });

                            const permData = permRes.data || {};
                            const canUpdate =
                                permData.canUpdate ??
                                permData.can_update ??
                                permData.result ??
                                false;

                            return { ...review, canUpdate: Boolean(canUpdate) };
                        } catch (e) {
                            console.error(
                                "권한 체크 실패 (exists/update):",
                                review.review_id,
                                e
                            );
                            return { ...review, canUpdate: false };
                        }
                    })
                );

                setReviews(listWithPerms);
            } catch (e) {
                setError("작성한 후기를 불러오는 중 오류가 발생했어요.");
            } finally {
                setLoading(false);
            }
        };

        fetchMyReviews();
    }, []);

    // === 2. 삭제 ===
    const handleDelete = async (review) => {
        if (!review.canUpdate) {
            alert("이 리뷰는 삭제 권한이 없습니다.");
            return;
        }

        if (!review.review_id) {
            alert("이 리뷰에는 review_id 정보가 없어 삭제할 수 없습니다. (백엔드 DTO 확인 필요)");
            return;
        }
        if (!review.product_id) {
            // deleteReview 컨트롤러는 product_id 도 PathVariable 로 받는다.
            alert("이 리뷰에는 product_id 정보가 없어 삭제할 수 없습니다. (MyPageReviewDTO에 product_id 추가 필요)");
            return;
        }

        if (!window.confirm("이 후기를 삭제하시겠습니까?")) return;

        try {
            // 컨트롤러 시그니처: @DeleteMapping("/{product_id}/{review_id}")
            await axios.delete(
                `/api/reviews/${review.product_id}/${review.review_id}`,
                {
                    withCredentials: true,
                }
            );

            // 화면에서 제거
            setReviews((prev) =>
                prev.filter((r) => r.review_id !== review.review_id)
            );
            alert("후기가 삭제되었어요.");
        } catch (e) {
            alert("후기 삭제 중 오류가 발생했습니다.");
        }
    };

    // === 3. 수정 모드 진입 ===
    const handleStartEdit = (review) => {
        if (!review.canUpdate) {
            alert("이 리뷰는 수정 권한이 없습니다.");
            return;
        }

        if (!review.review_id) {
            alert("이 리뷰에는 review_id 정보가 없어 수정할 수 없습니다. (백엔드 DTO 확인 필요)");
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
            //  컨트롤러 시그니처: @PatchMapping("/{review_id}")
            //  RequestBody: UpdateReviewRequestDTO (content, rating, imageUrls)
            await axios.patch(
                `/api/reviews/${editingId}`,
                {
                    content: editContent.trim(),
                    rating: ratingNumber,
                    imageUrls: target?.imageUrls || null, // 지금은 이미지 수정 안 쓰면 null/빈배열
                },
                { withCredentials: true }
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
            alert("후기 수정 중 오류가 발생했습니다.");
        }
    };

    return (
        <UserMyPageLayout>
            <section className="mypage-section myreview-section">
                <h3 className="reivew-card-title">나의 작성 후기</h3>
                <p className="review-card-sub">
                    내가 작성한 상품 후기를 한눈에 확인할 수 있어요.
                </p>

                {loading && <p className="myreview-loading">불러오는 중...</p>}
                {error && <p className="myreview-error">{error}</p>}

                {!loading && !error && reviews.length === 0 && (
                    <p className="myreview-empty">아직 작성한 후기가 없어요.</p>
                )}

                <div className="myreview-list">
                    {reviews.map((review) => {
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
                                        {/* DTO에 brand_name 있으면 여기서 같이 표기 가능 */}
                                        <div className="myreview-product">
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
                                                    onClick={() =>
                                                        handleStartEdit(review)
                                                    }
                                                    disabled={!canUpdate}
                                                >
                                                    수정
                                                </button>
                                                <button
                                                    type="button"
                                                    className="myreview-meta-btn"
                                                    onClick={() =>
                                                        handleDelete(review)
                                                    }
                                                    disabled={!canUpdate}
                                                >
                                                    삭제
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                type="button"
                                                className="myreview-meta-btn"
                                                onClick={handleCancelEdit}
                                            >
                                                취소
                                            </button>
                                        )}
                                    </div>
                                </header>

                                {/* 평점 */}
                                <div className="myreview-rating-row">
                                    <div className="myreview-stars">
                                        {Array.from({ length: 5 }).map((_, idx) => {
                                            const score = isEditing
                                                ? Number(editRating) || 0
                                                : Number(review.rating) || 0;
                                            const filled = score >= idx + 1;
                                            return (
                                                <span
                                                    key={idx}
                                                    className={
                                                        "myreview-star" +
                                                        (filled
                                                            ? " myreview-star--on"
                                                            : "")
                                                    }
                                                >
                                                    ★
                                                </span>
                                            );
                                        })}
                                        <span className="myreview-score">
                                            {isEditing
                                                ? Number(
                                                    editRating || 0
                                                ).toFixed(1)
                                                : formatRating(review.rating)}
                                        </span>
                                    </div>
                                </div>

                                {/* 내용: 보기 모드 / 수정 모드 분기 */}
                                {!isEditing ? (
                                    <p className="myreview-content">
                                        {review.content}
                                    </p>
                                ) : (
                                    <div className="myreview-edit-area">
                                        <div className="myreview-edit-rating-input">
                                            <label>
                                                별점
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="5"
                                                    step="0.5"
                                                    value={editRating}
                                                    onChange={(e) =>
                                                        setEditRating(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </label>
                                        </div>
                                        <textarea
                                            className="myreview-edit-textarea"
                                            value={editContent}
                                            onChange={(e) =>
                                                setEditContent(e.target.value)
                                            }
                                            rows={4}
                                        />
                                        <button
                                            type="button"
                                            className="myreview-save-btn"
                                            onClick={handleSaveEdit}
                                        >
                                            저장하기
                                        </button>
                                    </div>
                                )}

                                {/* 이미지가 필요하면 DTO에 image_url(또는 imageUrls) 추가 후 여기서 렌더링 */}
                            </article>
                        );
                    })}
                </div>
            </section>
        </UserMyPageLayout>
    );
}