import React, { useState } from "react";
import "./ProductReviewSection.css";

export default function ProductReviewSection({ reviews }) {
    const [reviewList, setReviewList] = useState(reviews);

    const [newContent, setNewContent] = useState("");
    const [newRating, setNewRating] = useState(0);
    const [newImages, setNewImages] = useState([]);
    const [sortType, setSortType] = useState("latest");

    // ---------------- 정렬 로직 ----------------
    const sortedList = [...reviewList].sort((a, b) => {

        // 최신순 (날짜 내림차순)
        if (sortType === "latest") {
            return new Date(b.created_at) - new Date(a.created_at);
        }

        // 좋아요순
        if (sortType === "like") {
            // 1차 기준: 좋아요 많은 순
            if (b.like_count !== a.like_count) {
                return b.like_count - a.like_count;
            }
            // 2차 기준: 싫어요 적은 순
            return a.dislike_count - b.dislike_count;
        }

        // 싫어요순
        if (sortType === "dislike") {
            // 1차 기준: 싫어요 많은 순
            if (b.dislike_count !== a.dislike_count) {
                return b.dislike_count - a.dislike_count;
            }
            // 2차 기준: 좋아요 많은 순
            return b.like_count - a.like_count;
        }

        return 0;
    });

    // ---------------- 이미지 업로드 ----------------
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        const preview = files.map((f) => URL.createObjectURL(f));
        setNewImages([...newImages, ...preview]);
    };

    // ---------------- 리뷰 등록 (현재 임시) ----------------
    const handleSubmit = () => {
        alert("등록 완료 (백엔드 연결 예정)");
        setNewContent("");
        setNewRating(0);
        setNewImages([]);
    };

    // ---------------- 좋아요 기능 ----------------
    const toggleLike = (id) => {
        setReviewList((prev) =>
            prev.map((rev) => {
                if (rev.review_id !== id) return rev;

                // 좋아요 OFF → ON
                if (!rev.userLiked) {
                    return {
                        ...rev,
                        like_count: rev.like_count + 1,
                        dislike_count: rev.userDisliked ? rev.dislike_count - 1 : rev.dislike_count,
                        userLiked: true,
                        userDisliked: false,
                    };
                }

                // 좋아요 ON → OFF
                return {
                    ...rev,
                    like_count: rev.like_count - 1,
                    userLiked: false,
                };
            })
        );
    };

    // ---------------- 싫어요 기능 ----------------
    const toggleDislike = (id) => {
        setReviewList((prev) =>
            prev.map((rev) => {
                if (rev.review_id !== id) return rev;

                // 싫어요 OFF → ON
                if (!rev.userDisliked) {
                    return {
                        ...rev,
                        dislike_count: rev.dislike_count + 1,
                        like_count: rev.userLiked ? rev.like_count - 1 : rev.like_count,
                        userDisliked: true,
                        userLiked: false,
                    };
                }

                // 싫어요 ON → OFF
                return {
                    ...rev,
                    dislike_count: rev.dislike_count - 1,
                    userDisliked: false,
                };
            })
        );
    };

    return (
        <div className="review-wrapper">

            {/* ---------------- 리뷰 작성 ---------------- */}
            <div className="review-form">
                <h3>리뷰 작성</h3>

                <div className="rating-input">
                    <span>평점:</span>
                    {[1, 2, 3, 4, 5].map((n) => (
                        <span
                            key={n}
                            className={newRating >= n ? "star active" : "star"}
                            onClick={() => setNewRating(n)}
                        >
                            ★
                        </span>
                    ))}
                </div>

                <textarea
                    placeholder="리뷰 내용을 입력하세요..."
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                />

                {/* 사진 추가 + 등록하기 한 줄 */}
                <div className="review-controls">
                    <label className="add-image">
                        + 사진 추가
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleImageUpload}
                        />
                    </label>

                    <button className="submit-btn" onClick={handleSubmit}>
                        등록하기
                    </button>
                </div>

                {/* 이미지 미리보기 */}
                <div className="preview-box">
                    {newImages.map((src, i) => (
                        <img key={i} src={src} alt="preview" />
                    ))}
                </div>
            </div>

            {/* ---------------- 정렬 UI ---------------- */}
            <div className="review-sort">
                <span
                    className={sortType === "latest" ? "active" : ""}
                    onClick={() => setSortType("latest")}
                >
                    최신순
                </span>

                <span
                    className={sortType === "like" ? "active" : ""}
                    onClick={() => setSortType("like")}
                >
                    좋아요순
                </span>

                <span
                    className={sortType === "dislike" ? "active" : ""}
                    onClick={() => setSortType("dislike")}
                >
                    싫어요순
                </span>
            </div>

            {/* ---------------- 리뷰 목록 ---------------- */}
            <div className="review-list">
                {sortedList.map((r) => (
                    <div className="review-card" key={r.review_id}>

                        {/* 1줄 */}
                        <div className="review-top">
                            <div className="left">
                                <span className="nickname">{r.nickname}</span>
                                <span className="baumann">{r.baumann_type}</span>
                            </div>

                            <div className="right">
                                <span
                                    className={`like ${r.userLiked ? "active" : ""}`}
                                    onClick={() => toggleLike(r.review_id)}
                                >
                                    👍 {r.like_count}
                                </span>

                                <span
                                    className={`dislike ${r.userDisliked ? "active" : ""}`}
                                    onClick={() => toggleDislike(r.review_id)}
                                >
                                    👎 {r.dislike_count}
                                </span>
                            </div>
                        </div>

                        {/* 2줄 */}
                        <div className="rating-line">
                            <span className="stars">
                                {"★".repeat(r.rating)}
                                {"☆".repeat(5 - r.rating)}
                            </span>
                            <span className="rating-num">{r.rating}/5</span>
                        </div>

                        {/* 3줄 */}
                        <div className="review-body">
                            <div className="review-content">{r.content}</div>

                            <div className="review-extra">
                                {r.images.length > 0 && (
                                    <img className="review-img" src={r.images[0]} alt="" />
                                )}
                                <div className="date">{r.created_at}</div>
                            </div>
                        </div>

                    </div>
                ))}
            </div>

        </div>
    );
}
