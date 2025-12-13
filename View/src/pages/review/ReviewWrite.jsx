// src/pages/review/ReviewWrite.jsx
import React, {useEffect, useState} from "react";
import { useNavigate,useParams,useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { createReview, getPresignedUrls, fetchOrderDetail,fetchOrders } from "../../api/review/reviewApi";
import {
    Wrap, Inner, Title, Panel, Row, Label, ProfileBox, Avatar, ProfileName, ProductBox,
    ProductInfo, ProductTop, ProductName, PriceText, RatingSelect, StarButton,
    RatingValue, PurchaseDate, TextArea, Helper, FooterRow, SubmitBtn,SubTitle
} from "./ReviewWrite.style";
import ProductSelectModal from "./components/ProductSelectModal";

// 최소 글자 수
const MIN_LENGTH = 20;

// 날짜 자르기
function formatDate(dateString) {
    if (!dateString) return "";
    const d = new Date(dateString);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

async function fetchOrderDetailByOrderItemId(orderItemId) {
    const ordersRes = await fetchOrders();
    const orders = ordersRes.data;

    for (const order of orders) {
        const detailRes = await fetchOrderDetail(order.order_id);
        const items = detailRes.data.order_items;

        const matched = items.find(i => String(i.order_item_id) === String(orderItemId));
        if (matched) {
            return {
                product: {
                    product_id: matched.product_id,
                    product_name: matched.product_name,
                    product_price: matched.product_price,
                    purchase_date: order.created_at
                }
            };
        }
    }

    return null;
}

const buttonStyle = {
    padding: "6px 12px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    background: "white",
    cursor: "pointer",
    fontSize: "14px"
};

const ReviewWrite = () => {
    const navigate = useNavigate();
    const { product_id } = useParams();
    const { auth } = useAuth();

    const [content, setContent] = useState("");
    const [rating, setRating] = useState(5);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedOrderItemId, setSelectedOrderItemId] = useState(null);
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const [searchParams] = useSearchParams();
    const orderItemId = searchParams.get("orderItemId");

    // 리뷰 길이 상태
    const trimmedContent = content.trim();
    const contentLength = trimmedContent.length;
    const isContentValid = contentLength >= MIN_LENGTH;

    // 이미지 추가
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);

        if(files.length + images.length > 5){
            alert("이미지는 최대 5장까지 업로드 할 수 있습니다.");
            return;
        }

        const previewUrls = files.map((f) => URL.createObjectURL(f));
        setImages((prev) =>[...prev, ...files]);
        setPreviews((prev) => [...prev, ...previewUrls]);
    };

    // 이미지 삭제
    const removeImage = (idx) => {
        setImages(images.filter((_, i) => i !== idx));
        setPreviews(previews.filter((_, i) => i !== idx));
    }

    // MinIO presigned URL을 이용한 이미지 업로드
    const uploadImagesToMinIO = async (imageFiles) => {
        try {
            // 1. 파일명과 폴더명으로 presigned URL 요청
            const params = imageFiles.map((file) => ({
                fileName: file.name,
                folder: "thumb"
            }));

            // 백엔드로부터 { presignedUrl, objectKey }[] 받기
            const presignedDataArray = await getPresignedUrls(params);

            // 2. 각 파일을 presigned URL로 업로드
            const uploadPromises = imageFiles.map(async (file, index) => {
                const { presignedUrl, objectKey } = presignedDataArray[index];

                // presigned URL로 이미지 업로드 (PUT)
                const uploadResponse = await fetch(presignedUrl, {
                    method: 'PUT',
                    body: file,
                    headers: {
                        'Content-Type': file.type
                    }
                });

                if (!uploadResponse.ok) {
                    throw new Error(`이미지 업로드 실패: ${file.name}`);
                }

                // objectKey 반환 (DB에 저장할 값)
                return objectKey;
            });

            // 3. 모든 업로드 완료 후 objectKey 배열 반환
            const objectKeys = await Promise.all(uploadPromises);
            return objectKeys;

        } catch (error) {
            console.error('MinIO 업로드 에러:', error);
            throw error;
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        // URL fallback
        const finalProductId =
            selectedProduct?.product_id ??
            (product_id ? parseInt(product_id) : null);

        if (!finalProductId || isNaN(finalProductId)) {
            alert("상품 ID가 유효하지 않습니다. 다시 상품을 선택해 주세요.");
            return;
        }

        if (!selectedOrderItemId) {
            alert("주문한 상품을 선택해 주세요.");
            return;
        }

        const trimmedContent = content.trim();

        if (!trimmedContent) {
            alert("리뷰 내용을 입력해 주세요.");
            return;
        }

        if (trimmedContent.length < 20) {
            alert("리뷰는 20자 이상 작성해 주세요.");
            return;
        }

        setSubmitting(true);

        try {
            let imageUrls = [];

            // MinIO를 통한 이미지 업로드 (objectKey 배열 받기)
            if (images.length > 0) {
                imageUrls = await uploadImagesToMinIO(images);
            }

            // 백엔드로 전송할 데이터
            // imageUrls는 실제로는 objectKey 배열 (예: ["thumb/abc.jpg", "thumb/def.jpg"])
            const body = {
                content: content.trim(),
                rating,
                order_item_id: selectedOrderItemId,
                imageUrls  // Object Key 배열
            };

            await createReview(finalProductId, body);

            alert("리뷰가 등록되었습니다.");
            navigate(`/review`);
        } catch (error) {
            console.error(error);
            alert("리뷰 등록에 실패했습니다.");
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        async function load() {
            if (!orderItemId) return;

            // orderItemId로 주문상품 정보 불러오기
            const detail = await fetchOrderDetailByOrderItemId(orderItemId);

            setSelectedProduct(detail.product);
            setSelectedOrderItemId(orderItemId);
        }

        load();
    }, [orderItemId]);

    return (
        <Wrap>
            <Inner>
                <Title>리뷰 작성</Title>
                <SubTitle>
                    사용 후 느낀 점을 솔직하게 남겨주세요.
                </SubTitle>

                {/* 상품 선택 모달 */}
                {openModal && (
                    <ProductSelectModal
                        onClose={() => setOpenModal(false)}
                        onSelect={(item) => {
                            setSelectedProduct(item);
                            setSelectedOrderItemId(item.order_item_id);
                            setOpenModal(false);
                        }}
                    />
                )}

                <form onSubmit={onSubmit}>
                    <Panel>
                        {/* 작성자 */}
                        <Row style={{ borderTop: "none" }}>
                            <Label>작성자</Label>
                            <ProfileBox>
                                <Avatar>{auth.nickname?.charAt(0) ?? "🙂"}</Avatar>
                                <ProfileName>{auth.nickname ?? "로그인 사용자"} 님</ProfileName>
                            </ProfileBox>
                        </Row>

                        {/* 상품 정보 */}
                        <Row>
                            <Label>상품 정보</Label>

                            <div
                                style={{
                                    flex: 1,
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    gap: "16px"
                                }}
                            >
                                {selectedProduct ? (
                                    <ProductBox style={{ paddingLeft: 0 }}>
                                        <ProductInfo style={{ paddingLeft: 0 }}>
                                            <ProductTop>
                                                <div className="left-info" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                    <ProductName>{selectedProduct.product_name}</ProductName>
                                                    <PriceText>{selectedProduct.product_price.toLocaleString()}원</PriceText>
                                                </div>

                                                <PurchaseDate  style={{ marginLeft: "10px" }}>
                                                    구매 날짜 {formatDate(selectedProduct.purchase_date)}
                                                </PurchaseDate>
                                            </ProductTop>

                                            <RatingSelect>
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <StarButton
                                                        key={star}
                                                        type="button"
                                                        $active={rating >= star}
                                                        onClick={() => setRating(star)}
                                                    >
                                                        ★
                                                    </StarButton>
                                                ))}
                                                <RatingValue>{rating}.0 / 5.0</RatingValue>
                                            </RatingSelect>
                                        </ProductInfo>
                                    </ProductBox>
                                ) : (
                                    <div style={{ color: "#9ca3af" }}>상품을 선택해 주세요.</div>
                                )}

                                <button
                                    type="button"
                                    onClick={() => setOpenModal(true)}
                                    style={buttonStyle}
                                >
                                    다른 상품 선택하기
                                </button>
                            </div>
                        </Row>

                        {/* 리뷰 내용 */}
                        <Row $fullHeight>
                            <Label>리뷰 내용</Label>
                            <div style={{ flex: 1 }}>
                                <TextArea
                                    placeholder="제품을 사용해 보신 솔직한 후기를 작성해 주세요."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                />
                                <Helper
                                    $valid={isContentValid}
                                    $warning={contentLength === 0}
                                >
                                    {contentLength === 0 && "리뷰를 작성해 주세요."}

                                    {contentLength > 0 && !isContentValid &&
                                        `글자 수가 부족합니다. (현재 ${contentLength}자 / 최소 20자)`
                                    }

                                    {isContentValid && "작성 조건을 충족했습니다."}
                                </Helper>
                            </div>
                        </Row>

                        {/* 이미지 업로드 */}
                        <Row>
                            <Label>사진 첨부</Label>
                            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                                {previews.map((src, i) => (
                                    <div key={i} style={{ position: "relative" }}>
                                        <img
                                            src={src}
                                            alt=""
                                            style={{
                                                width: 70,
                                                height: 70,
                                                borderRadius: 12,
                                                objectFit: "cover",
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(i)}
                                            style={{
                                                position: "absolute",
                                                top: -5,
                                                right: -5,
                                                width: 22,
                                                height: 22,
                                                borderRadius: "50%",
                                                background: "#111827",
                                                color: "#fff",
                                                fontSize: 10,
                                                border: "none",
                                                cursor: "pointer",
                                            }}
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}

                                {/* 이미지 선택 버튼 */}
                                {images.length < 5 && (
                                    <>
                                        <label
                                            htmlFor="reviewImg"
                                            style={{
                                                width: 70,
                                                height: 70,
                                                borderRadius: 12,
                                                border: "1px dashed #d1d5db",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                cursor: "pointer",
                                                color: "#9ca3af",
                                            }}
                                        >
                                            +
                                        </label>
                                        <input
                                            id="reviewImg"
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            style={{ display: "none" }}
                                            onChange={handleImageChange}
                                        />
                                    </>
                                )}
                            </div>
                        </Row>
                    </Panel>

                    <FooterRow>
                        <SubmitBtn type="submit" disabled={submitting}>
                            {submitting ? "등록 중..." : "등록하기"}
                        </SubmitBtn>
                    </FooterRow>
                </form>
            </Inner>
        </Wrap>
    );
};

export default ReviewWrite;