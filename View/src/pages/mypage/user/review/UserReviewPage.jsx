// src/pages/mypage/user/review/UserReviewPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import axiosClient from "api/axiosClient";
import UserMyPageLayout from "../layout/UserMyPageLayout";
import "./UserReviewPage.css";
import { useNavigate } from "react-router-dom";


// (프로젝트 경로가 다르면 이 import만 맞춰주면 됨)
import { getPresignedUrls } from "../../../../api/review/reviewApi";

export default function UserMyReviewPage() {
    const MIN_EDIT_LENGTH = 20;
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

    // 수정 폼 실시간 검증(최소 글자수)
    const editTrimmed = editContent.trim();
    const editContentLength = editTrimmed.length;
    const isEditContentValid = editContentLength >= MIN_EDIT_LENGTH;

    // 기존(서버에 이미 저장된) 이미지 objectKey 목록
    const [editExistingImageKeys, setEditExistingImageKeys] = useState([]);

    // 새로 추가한 이미지 파일 + 미리보기
    const [editNewFiles, setEditNewFiles] = useState([]); // File[]
    const [editNewPreviews, setEditNewPreviews] = useState([]); // string[]

    const [keyword, setKeyword] = useState("");
    const [sort, setSort] = useState("latest");
    const [filterRating, setFilterRating] = useState(0);

    const navigate = useNavigate();

    const apiBase = useMemo(() => {
        // axiosClient baseURL을 활용
        return axiosClient?.defaults?.baseURL || "http://localhost:8080";
    }, []);


    // - CRA: REACT_APP_MINIO_URL / REACT_APP_MINIO_BUCKET
    // - Vite: VITE_MINIO_URL / VITE_MINIO_BUCKET
    const MINIO_URL =
        (typeof process !== "undefined" && process.env && process.env.REACT_APP_MINIO_URL) ||
        // (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_MINIO_URL) ||
        "";
    const MINIO_BUCKET =
        (typeof process !== "undefined" && process.env && process.env.REACT_APP_MINIO_BUCKET) ||
        // (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_MINIO_BUCKET) ||
        "";


    // - 예: http://localhost:8080/api/images?objectKey=...
    // - 현재 로그상 `/api/images`가 정적 리소스로 처리되며(NoResourceFoundException) 동작하지 않아서,
    //   이 값이 없으면 프록시는 절대 사용하지 않도록 처리합니다.
    const IMAGE_PROXY_BASE =
        (typeof process !== "undefined" && process.env && process.env.REACT_APP_IMAGE_PROXY_BASE) ||
        // (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_IMAGE_PROXY_BASE) ||
        "";

    // 날짜 포맷 (YYYY-MM-DD)
    const formatDate = (isoString) => {
        if (!isoString) return "";
        return String(isoString).slice(0, 10);
    };

    const formatRating = (rating) => {
        if (rating == null) return "-";
        return Number(rating).toFixed(1);
    };

    // objectKey → 실제 이미지 URL 변환
    //  - objectKey 예: review/xxxx.png, thumb/xxxx.jpg
    //  - MinIO 직접 URL:  http://<MINIO_HOST>:9000/<BUCKET>/<objectKey>
    //  - (선택) 프록시 URL: <IMAGE_PROXY_BASE>?objectKey=<objectKey>
    const toImageSrc = (keyOrUrl) => {
        if (!keyOrUrl) return "";
        const s = String(keyOrUrl);

        // 0) 이미 절대 URL이면 그대로 사용
        if (s.startsWith("http://") || s.startsWith("https://")) return s;

        // 1) 백엔드가 이미 내려준 상대 경로(/api/... 또는 api/...)면
        //    빌드 환경(프록시 없음)에서도 동작하도록 baseURL을 붙여 절대경로로 만든다.
        //    예) /api/images?objectKey=...  ->  http://localhost:8080/api/images?objectKey=...
        if (s.startsWith("/api/") || s.startsWith("api/")) {
            const path = s.startsWith("/") ? s : `/${s}`;
            const base = String(apiBase || "").replace(/\/$/, "");
            return base ? `${base}${path}` : path;
        }

        // 2) objectKey 처리 (앞의 / 제거)
        const key = s.replace(/^\/+/, "");

        // 2-1) MinIO 직접 URL (권장)
        if (MINIO_URL && MINIO_BUCKET) {
            const base = String(MINIO_URL).replace(/\/$/, "");
            return `${base}/${MINIO_BUCKET}/${key}`;
        }

        // 2-2) (선택) 백엔드 이미지 프록시가 따로 있을 때만 사용
        if (IMAGE_PROXY_BASE) {
            const proxy = String(IMAGE_PROXY_BASE).replace(/\?$/, "");
            return `${proxy}?objectKey=${encodeURIComponent(key)}`;
        }

        // 3) 마지막 fallback: 빌드 환경에서 프록시가 없으면 상대 경로로는 깨질 수 있으니
        //    baseURL + /api/images 로 한 번 더 시도한다. (백엔드에 해당 컨트롤러가 있을 때)
        //    ※ 현재 프로젝트 로그에는 /api/images가 정적 리소스로 처리되는 케이스가 있어
        //      이 fallback은 "있으면" 쓰이는 정도로만 둔다.
        {
            const base = String(apiBase || "").replace(/\/$/, "");
            if (base) return `${base}/api/images?objectKey=${encodeURIComponent(key)}`;
        }

        if (typeof window !== "undefined") {
            // eslint-disable-next-line no-console
            console.warn(
                "[UserReviewPage] 이미지 URL을 만들 수 없습니다. MINIO_URL/MINIO_BUCKET 또는 IMAGE_PROXY_BASE 환경변수를 설정하세요.",
                { key }
            );
        }
        return "";
    };

    // === 권한(수정/삭제 가능 여부) 조회 ===
    // 백엔드가 GET에 body를 받는 형태면 브라우저에서 body가 누락될 수 있습니다.
    // "GET 유지(쿼리)" 버전으로 맞추기 위해 아래처럼 review_id를 query param 으로 호출합니다.

    // 중복 호출 방지용(리뷰 수가 많으면 네트워크 폭주 방지)
    const [canUpdateCache, setCanUpdateCache] = useState({}); // { [reviewId]: boolean }

    const fetchCanUpdate = async (reviewId) => {
        const rid = Number(reviewId);
        if (!rid) return false;

        // 캐시 히트
        if (Object.prototype.hasOwnProperty.call(canUpdateCache, rid)) {
            return Boolean(canUpdateCache[rid]);
        }

        const saveCache = (val) => {
            setCanUpdateCache((prev) => ({ ...prev, [rid]: Boolean(val) }));
        };

        try {
            // GET /api/reviews/exists/update?review_id=123
            const res = await axiosClient.get("/api/reviews/exists/update", {
                params: { review_id: rid },
            });
            const root = res?.data?.data ?? res?.data;
            const can = root?.canUpdate ?? root?.can_update;
            const boolVal = Boolean(can);
            saveCache(boolVal);
            return boolVal;
        } catch (e) {
            console.warn("[UserReviewPage] canUpdate(GET query) 실패:", e);
            saveCache(false);
            return false;
        }
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

            const root = res.data?.data ?? res.data;

            let list = [];
            if (Array.isArray(root)) {
                list = root;
            } else if (root && typeof root === "object") {
                list =
                    root.myPageReviews ||
                    root.reviews ||
                    root.reviewList ||
                    root.content ||
                    root.items ||
                    root.list ||
                    [];
            }

            if (!Array.isArray(list)) list = [];

            const normalized = list.map((review) => ({
                ...review,
                product_id: review.product_id ?? review.productId,
                review_id: review.review_id ?? review.reviewId,
                // MyPageReviewDTO.image_urls (objectKey list) 기준
                imageUrls:
                    review.images ??
                    review.image_urls ??
                    review.imageUrls ??
                    (review.image_url ? [review.image_url] : []),
                // 목록 API에 canUpdate가 없거나 신뢰하기 어려워서(또는 최신 규칙 반영 위해) 아래에서 별도 조회로 보정
                canUpdate: review.canUpdate ?? review.can_update ?? null,
            }));

            // 별점 필터: 선택한 점수만 보이게 (예: 4점 선택 시 4.0 ~ 4.9)
            const selectedStar = Number(filterRatingValue) || 0;
            const filteredNormalized = selectedStar > 0
                ? normalized.filter((item) => {
                    const score = Number(item.rating ?? item.review_rating ?? item.reviewRating ?? 0);
                    if (Number.isNaN(score)) return false;
                    if (selectedStar >= 5) return score >= 5;
                    return score >= selectedStar && score < selectedStar + 1;
                })
                : normalized;

            // 1차: 목록 응답 + canUpdate(수정/삭제 가능 여부) 보정
            const withPermissions = await Promise.all(
                filteredNormalized.map(async (item) => {
                    // 목록에서 canUpdate가 이미 boolean으로 오면 그대로 사용
                    if (typeof item.canUpdate === "boolean") return item;
                    const can = await fetchCanUpdate(item.review_id);
                    return { ...item, canUpdate: can };
                })
            );

            setReviews(withPermissions);
            setCurrentPage(1);

            // 2차: 각 리뷰 상세에서 이미지 URL(또는 objectKey 리스트)을 다시 받아서 보정
            // ReviewDetailPage에서는 이미지가 정상 노출되므로 그 응답 구조를 우선 신뢰
            try {
                const enriched = await Promise.all(
                    withPermissions.map(async (item) => {
                        // 이미지가 아예 없으면 스킵
                        const cur = Array.isArray(item.imageUrls) ? item.imageUrls : [];
                        if (cur.length === 0) return item;

                        // 이미 절대 URL/상대 API URL이 들어있다면 굳이 재조회하지 않음
                        const alreadyRenderable = cur.some((v) => {
                            const s = String(v || "");
                            return s.startsWith("http://") || s.startsWith("https://") || s.startsWith("/api/") || s.startsWith("api/");
                        });
                        if (alreadyRenderable) return item;

                        // review_id가 없으면 스킵
                        if (!item.review_id) return item;

                        // 리뷰 상세 재조회
                        const res2 = await axiosClient.get(`/api/reviews/${item.review_id}`);
                        const r2 = res2?.data?.review;

                        const nextImages =
                            r2?.images ??
                            r2?.image_urls ??
                            r2?.imageUrls ??
                            (r2?.image_url ? [r2.image_url] : cur);

                        return {
                            ...item,
                            imageUrls: Array.isArray(nextImages) ? nextImages : cur,
                        };
                    })
                );

                setReviews(enriched);
            } catch (enrichErr) {
                console.warn("[UserReviewPage] 리뷰 상세 기반 이미지 보정 실패:", enrichErr);
            }
        } catch (e) {
            setError("아직 작성한 후기가 없습니다.");

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
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
            alert("이 리뷰에는 review_id 정보가 없어 삭제할 수 없습니다.");
            return;
        }
        if (!review.canUpdate) {
            alert("이 리뷰는 삭제 권한이 없습니다.");
            return;
        }
        if (!review.product_id) {
            alert("이 리뷰에는 product_id 정보가 없어 삭제할 수 없습니다.");
            return;
        }
        if (!window.confirm("이 후기를 삭제하시겠습니까?")) return;

        try {
            await axiosClient.delete(`/api/reviews/${review.product_id}/${review.review_id}`);

            setReviews((prev) => prev.filter((r) => r.review_id !== review.review_id));
            alert("후기가 삭제되었어요.");
        } catch (e) {
            console.error("리뷰 삭제 오류:", e);
            alert("후기 삭제 중 오류가 발생했습니다.");
        }
    };

    // === 3. 수정 모드 진입 ===
    const handleStartEdit = async (review) => {
        if (!review.review_id) {
            alert("이 리뷰에는 review_id 정보가 없어 수정할 수 없습니다.");
            return;
        }
        if (!review.canUpdate) {
            alert("이 리뷰는 수정 권한이 없습니다.");
            return;
        }

        setEditingId(review.review_id);
        setEditContent(review.content || "");
        setEditRating(Number(review.rating || 0));

        // 수정 모드에서는 기존 이미지를 유지하지 않고, 새로 추가하는 방식으로 진행
        setEditExistingImageKeys([]);

        // 새로 추가한 파일/미리보기 초기화
        editNewPreviews.forEach((u) => URL.revokeObjectURL(u));
        setEditNewFiles([]);
        setEditNewPreviews([]);
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditContent("");
        setEditRating(0);

        setEditExistingImageKeys([]);

        editNewPreviews.forEach((u) => URL.revokeObjectURL(u));
        setEditNewFiles([]);
        setEditNewPreviews([]);
    };

    // 기존 이미지 삭제(서버에 남길 목록에서 제외)
    const handleRemoveExistingImage = (index) => {
        setEditExistingImageKeys((prev) => prev.filter((_, i) => i !== index));
    };

    // 새 이미지 추가(파일 선택)
    const handleNewImageFilesChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const totalAfter =
            (editExistingImageKeys?.length || 0) + (editNewFiles?.length || 0) + files.length;

        if (totalAfter > 5) {
            alert("이미지는 최대 5장까지 업로드 할 수 있습니다.");
            return;
        }

        const previewUrls = files.map((f) => URL.createObjectURL(f));
        setEditNewFiles((prev) => [...prev, ...files]);
        setEditNewPreviews((prev) => [...prev, ...previewUrls]);

        // 같은 파일 다시 선택 가능하게 초기화
        e.target.value = "";
    };

    // 새 이미지 삭제(업로드 예정 목록에서 제거)
    const handleRemoveNewImage = (index) => {
        setEditNewFiles((prev) => prev.filter((_, i) => i !== index));
        setEditNewPreviews((prev) => {
            const next = prev.filter((_, i) => i !== index);
            // revoke는 제거되는 것만
            const removed = prev[index];
            if (removed) URL.revokeObjectURL(removed);
            return next;
        });
    };

    //  MinIO presigned URL 방식 업로드 (ReviewWrite.jsx 방식)
    //  - 팀/브랜치마다 presigned 발급 엔드포인트가 다를 수 있어서 404면 fallback 시도
    const uploadImagesToMinIO = async (imageFiles) => {
        if (!imageFiles || imageFiles.length === 0) return [];

        // 1) presigned URL 요청 파라미터 구성
        //    리뷰 이미지는 보통 review 폴더를 쓰는 경우가 많아서 기본값을 review로 둠
        //    (백엔드가 thumb를 쓰면 여기만 "thumb"로 바꾸면 됨)
        const params = imageFiles.map((file) => ({
            fileName: file.name,
            folder: "review",
        }));

        // 2) presigned URL 발급 (기존 reviewApi.getPresignedUrls 우선 사용)
        const requestPresigned = async () => {
            try {
                const data = await getPresignedUrls(params);
                if (Array.isArray(data)) return data;
                // 혹시 {data: [...] } 형태면 대응
                if (data?.data && Array.isArray(data.data)) return data.data;
                return data;
            } catch (err) {
                // 404면 프로젝트마다 다른 경로일 수 있어서 fallback
                const status = err?.response?.status;
                if (status !== 404) throw err;

                const fallbackEndpoints = [
                    // (스크린샷에서 보이던 경로)
                    "/api/images/products/review",
                    // 흔히 쓰는 대체 경로들
                    "/api/images/presigned",
                    "/api/images/presigned-urls",
                ];

                let lastError = err;
                for (const ep of fallbackEndpoints) {
                    try {
                        const res = await axiosClient.post(ep, params);
                        const root = res?.data;
                        if (Array.isArray(root)) return root;
                        if (root?.data && Array.isArray(root.data)) return root.data;
                        if (root?.presignedUrls && Array.isArray(root.presignedUrls)) return root.presignedUrls;
                        return root;
                    } catch (e2) {
                        lastError = e2;
                    }
                }
                throw lastError;
            }
        };

        const presignedDataArray = await requestPresigned();

        if (!Array.isArray(presignedDataArray) || presignedDataArray.length !== imageFiles.length) {
            throw new Error("presigned URL 응답 형식이 올바르지 않습니다.");
        }

        // 3) presignedUrl로 PUT 업로드
        const uploadPromises = imageFiles.map(async (file, index) => {
            const item = presignedDataArray[index];
            const presignedUrl = item?.presignedUrl ?? item?.presigned_url ?? item?.url;
            const objectKey = item?.objectKey ?? item?.object_key ?? item?.key;

            if (!presignedUrl || !objectKey) {
                throw new Error("presigned URL 응답에 presignedUrl/objectKey가 없습니다.");
            }

            const uploadResponse = await fetch(presignedUrl, {
                method: "PUT",
                body: file,
                headers: {
                    "Content-Type": file.type,
                },
            });

            if (!uploadResponse.ok) {
                throw new Error(`이미지 업로드 실패: ${file.name}`);
            }

            return objectKey;
        });

        return Promise.all(uploadPromises);
    };

    // === 4. 수정 저장 ===
    const handleSaveEdit = async () => {
        if (!editingId) return;

        const target = reviews.find((r) => r.review_id === editingId);
        if (target && !target.canUpdate) {
            alert("이 리뷰는 수정 권한이 없습니다.");
            return;
        }

        const trimmed = editContent.trim();
        if (!trimmed) {
            alert("리뷰 내용을 입력해주세요.");
            return;
        }
        if (trimmed.length < 20) {
            alert("리뷰는 20자 이상 작성해 주세요.");
            return;
        }

        const ratingNumber = Number(editRating);
        if (Number.isNaN(ratingNumber) || ratingNumber <= 0 || ratingNumber > 5) {
            alert("별점은 1 ~ 5 사이의 숫자로 입력해주세요.");
            return;
        }

        const totalCount = (editNewFiles?.length || 0);
        if (totalCount > 5) {
            alert("이미지는 최대 5장까지 업로드 할 수 있습니다.");
            return;
        }

        try {
            //  새 파일이 있으면 업로드 → objectKey 배열 받기
            let newObjectKeys = [];
            if (editNewFiles.length > 0) {
                newObjectKeys = await uploadImagesToMinIO(editNewFiles);
            }

            //  최종 imageUrls(objectKey) = 새로 업로드된 것만 사용 (기존 이미지는 유지하지 않음)
            const finalImageUrls = [...(newObjectKeys || [])];

            // PATCH /api/reviews/{review_id}
            await axiosClient.patch(`/api/reviews/${editingId}`, {
                content: trimmed,
                rating: ratingNumber,
                imageUrls: finalImageUrls,
            });

            // 프론트 상태 업데이트
            setReviews((prev) =>
                prev.map((r) =>
                    r.review_id === editingId
                        ? {
                            ...r,
                            content: trimmed,
                            rating: ratingNumber,
                            imageUrls: finalImageUrls,
                        }
                        : r
                )
            );

            alert("후기가 수정되었어요.");
            handleCancelEdit();
            window.location.reload();
        } catch (e) {
            console.error("리뷰 수정 오류:", e);
            alert("후기 수정 중 오류가 발생했습니다.");
        }
    };

    // 페이지네이션 계산
    const totalPages = Math.max(1, Math.ceil(reviews.length / PAGE_SIZE));
    const pagedReviews = reviews.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const handlePageChange = (nextPage) => {
        if (nextPage < 1 || nextPage > totalPages) return;
        setCurrentPage(nextPage);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <UserMyPageLayout>
            <section className="mypage-section myreview-section">
                <h3 className="reivew-card-title">나의 작성 후기</h3>
                <p className="review-card-sub">내가 작성한 상품 후기를 한눈에 확인할 수 있어요.</p>

                <form className="myreview-search-bar" onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        className="myreview-search-input"
                        placeholder="상품명 또는 내용으로 검색"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />

                    <select className="myreview-search-select" value={sort} onChange={(e) => setSort(e.target.value)}>
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
                        <option value={0}>전체 별점</option>
                        <option value={5}>5점</option>
                        <option value={4}>4점</option>
                        <option value={3}>3점</option>
                        <option value={2}>2점</option>
                        <option value={1}>1점</option>
                    </select>

                    <button type="submit" className="myreview-search-btn">
                        검색
                    </button>
                </form>

                {loading && <p className="myreview-loading">불러오는 중...</p>}
                {error && <p className="myreview-error">{error}</p>}

                {!loading && !error && reviews.length === 0 && <p className="myreview-empty">아직 작성한 후기가 없어요.</p>}

                <div className="myreview-list">
                    {pagedReviews.map((review) => {
                        const isEditing = editingId === review.review_id;
                        const canUpdate = Boolean(review.canUpdate);

                        return (
                            <article
                                key={review.review_id ?? `${review.prd_name}-${review.created_at}`}
                                className="myreview-card"
                            >
                                <header className="myreview-header">
                                    <div className="myreview-title-block">
                                        <div
                                            className="myreview-product"
                                            onClick={() => review.review_id && navigate(`/review/${review.review_id}`)}
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && review.review_id) navigate(`/review/${review.review_id}`);
                                            }}
                                        >
                                            {review.prd_name}
                                        </div>
                                    </div>

                                    <div className="myreview-meta">
                                        <span className="myreview-date">{formatDate(review.created_at)}</span>

                                        {!isEditing ? (
                                            <>
                                                <button
                                                    type="button"
                                                    className="myreview-meta-btn"
                                                    onClick={() => handleStartEdit(review)}
                                                    disabled={!canUpdate}
                                                    title={!canUpdate ? "이 리뷰는 수정할 수 없습니다." : ""}
                                                >
                                                    수정
                                                </button>
                                                <button
                                                    type="button"
                                                    className="myreview-meta-btn"
                                                    onClick={() => handleDelete(review)}
                                                    disabled={!canUpdate}
                                                    title={!canUpdate ? "이 리뷰는 삭제할 수 없습니다." : ""}
                                                >
                                                    삭제
                                                </button>
                                            </>
                                        ) : null}
                                    </div>
                                </header>

                                {/* 평점 (수정 모드에서는 숨김: 저장/취소 후 다시 보이게) */}
                                {!isEditing && (
                                    <div className="myreview-rating-row">
                                        <div className="myreview-stars">
                                            {Array.from({ length: 5 }).map((_, idx) => {
                                                const score = Number(review.rating) || 0;

                                                let starClass = "myreview-star";
                                                if (score >= idx + 1) starClass += " myreview-star--on";
                                                else if (score >= idx + 0.5) starClass += " myreview-star--half";

                                                return (<span key={idx} className={starClass}>★</span>);
                                            })}

                                            <span className="myreview-score">
                                                {formatRating(review.rating)}
                                            </span>
                                        </div>
                                    </div>
                                )}


                                {/* 내용: 보기 / 수정 */}
                                {!isEditing ? (
                                    <p className="myreview-content">{review.content}</p>
                                ) : (
                                    <div className="myreview-edit-area">
                                        <div className="myreview-edit-header">
                                            <div className="myreview-edit-rating">
                                                <span className="myreview-edit-label">별점</span>

                                                <div className="myreview-stars" style={{ cursor: "pointer" }}>
                                                    {Array.from({ length: 5 }).map((_, idx) => {
                                                        const starValue = idx + 1;
                                                        const current = Number(editRating) || 0;

                                                        let starClass = "myreview-star";
                                                        if (current >= starValue) starClass += " myreview-star--on";
                                                        else if (current >= starValue - 0.5) starClass += " myreview-star--half";

                                                        return (
                                                            <span
                                                                key={idx}
                                                                className={starClass}
                                                                onClick={() => setEditRating(starValue)}
                                                                role="button"
                                                                tabIndex={0}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === "Enter") setEditRating(starValue);
                                                                }}
                                                            >
                                                                ★
                                                            </span>
                                                        );
                                                    })}
                                                    <span className="myreview-score">
                                                        {Number(editRating || 0).toFixed(1)} / 5.0
                                                    </span>
                                                </div>
                                            </div>

                                        </div>

                                        <textarea
                                            className="myreview-edit-textarea"
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            rows={5}
                                            placeholder="상품을 사용해 본 느낌을 자세히 적어주세요."
                                        />
                                        <p
                                            className="myreview-edit-content-help"
                                            style={{
                                                marginTop: 6,
                                                fontSize: 12,
                                                color: editContentLength === 0 ? "#9ca3af" : isEditContentValid ? "#16a34a" : "#ef4444",

                                            }}
                                        >
                                            {editContentLength === 0
                                                ? "리뷰를 작성해 주세요."
                                                : isEditContentValid
                                                    ? "작성 조건을 충족했습니다."
                                                    : `글자 수가 부족합니다. (현재 ${editContentLength}자 / 최소 ${MIN_EDIT_LENGTH}자)`}
                                        </p>

                                        {/* 이미지 수정 UI (ReviewWrite 방식) */}
                                        <div className="myreview-edit-images">
                                            <div className="myreview-edit-images-header">
                                                <span className="myreview-edit-label">이미지</span>
                                                <span className="myreview-edit-help">최대 5장까지 첨부할 수 있어요.</span>
                                            </div>

                                            {/* 썸네일 + 이미지 추가 버튼을 같은 줄(그리드)로 */}
                                            <div className="myreview-edit-images-list">
                                                {/* 기존 이미지(objectKey) */}
                                                {editExistingImageKeys.map((key, idx) => (
                                                    <div key={`exist-${idx}`} className="myreview-edit-thumb">
                                                        <img
                                                            src={toImageSrc(key)}
                                                            alt={`기존 리뷰 이미지 ${idx + 1}`}
                                                            className="myreview-edit-thumb-img"
                                                            onError={(e) => {
                                                                e.currentTarget.src =
                                                                    "data:image/svg+xml;charset=utf-8," +
                                                                    encodeURIComponent(
                                                                        '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-size="14">이미지 로드 실패</text></svg>'
                                                                    );
                                                            }}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="myreview-edit-thumb-remove"
                                                            onClick={() => handleRemoveExistingImage(idx)}
                                                        >
                                                            삭제
                                                        </button>
                                                    </div>
                                                ))}

                                                {/* 새로 추가한 이미지(로컬 미리보기) */}
                                                {editNewPreviews.map((src, idx) => (
                                                    <div key={`new-${idx}`} className="myreview-edit-thumb">
                                                        <img
                                                            src={src}
                                                            alt={`새 리뷰 이미지 ${idx + 1}`}
                                                            className="myreview-edit-thumb-img"
                                                            onError={(e) => {
                                                                e.currentTarget.src =
                                                                    "data:image/svg+xml;charset=utf-8," +
                                                                    encodeURIComponent(
                                                                        '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-size="14">이미지 로드 실패</text></svg>'
                                                                    );
                                                            }}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="myreview-edit-thumb-remove"
                                                            onClick={() => handleRemoveNewImage(idx)}
                                                        >
                                                            삭제
                                                        </button>
                                                    </div>
                                                ))}

                                                {/* 파일 선택: 썸네일 크기와 같은 타일 */}
                                                {(editExistingImageKeys.length + editNewFiles.length) < 5 && (
                                                    <div className="myreview-edit-add-tile">
                                                        <label className="myreview-edit-file-label" htmlFor="myreviewEditFiles">
                                                            + 이미지 추가
                                                        </label>
                                                        <input
                                                            id="myreviewEditFiles"
                                                            type="file"
                                                            accept="image/*"
                                                            multiple
                                                            className="myreview-edit-file-input"
                                                            onChange={handleNewImageFilesChange}
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            {/* 이미지가 하나도 없을 때만 문구 표시 */}
                                            {editExistingImageKeys.length === 0 && editNewPreviews.length === 0 && (
                                                <p className="myreview-edit-images-empty">등록된 이미지가 없습니다.</p>
                                            )}
                                        </div>
                                        <div className="myreview-edit-actions">
                                            <button type="button" className="myreview-cancel-btn" onClick={handleCancelEdit}>
                                                취소
                                            </button>
                                            <button
                                                type="button"
                                                className="myreview-save-btn"
                                                onClick={handleSaveEdit}
                                                disabled={!isEditContentValid}
                                                title={!isEditContentValid ? `리뷰는 ${MIN_EDIT_LENGTH}자 이상 작성해야 저장할 수 있어요.` : ""}
                                            >
                                                저장하기
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* 리뷰 이미지(보기 모드) */}
                                {Array.isArray(review.imageUrls) && review.imageUrls.length > 0 && (
                                    <div className="myreview-images">
                                        {review.imageUrls.map((keyOrUrl, idx) => (
                                            <div key={idx} className="myreview-thumb">
                                                <img
                                                    src={toImageSrc(keyOrUrl)}
                                                    alt={`리뷰 이미지 ${idx + 1}`}
                                                    className="myreview-thumb-img"
                                                    onError={(e) => {
                                                        e.currentTarget.src = "data:image/svg+xml;charset=utf-8," +
                                                            encodeURIComponent(
                                                                '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect width="100%" height="100%" fill="#f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-size="14">이미지 로드 실패</text></svg>'
                                                            );
                                                    }}
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
                                        "myreview-page-btn" + (page === currentPage ? " myreview-page-btn--active" : "")
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