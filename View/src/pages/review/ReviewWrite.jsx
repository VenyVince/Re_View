// src/pages/review/ReviewWrite.jsx
import React, {useEffect, useState} from "react";
import { useNavigate,useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { createReview, uploadReviewImages } from "../../api/review/reviewApi";
import {
    Wrap, Inner, Title, Panel, Row, Label, ProfileBox, Avatar, ProfileName, ProductBox,
    ProductInfo, ProductTop, ProductName, PriceText, RatingSelect, StarButton,
    RatingValue, PurchaseDate, TextArea, Helper, FooterRow, SubmitBtn,} from "./ReviewWrite.style";
import ProductSelectModal from "./components/ProductSelectModal";

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

const ReviewWrite = () => {
    const navigate = useNavigate();
    const { product_id } = useParams();

    // 로그인 사용자 정보 가져옴
    const { auth } = useAuth();

    const [content, setContent] = useState("");
    const [rating, setRating] = useState(5);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedOrderItemId, setSelectedOrderItemId] = useState(null);

    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);

    const [submitting, setSubmitting] = useState(false);
    const [openModal, setOpenModal] = useState(false);

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

        if (!content.trim()) {
            alert("리뷰 내용을 입력해 주세요.");
            return;
        }

        setSubmitting(true);

        try {
            let imageUrls = [];
            if (images.length > 0) {
                const formData = new FormData();
                images.forEach((f) => formData.append("images", f));

                const uploadRes = await uploadReviewImages(formData);
                imageUrls = uploadRes.data;
            }

            const body = {
                content: content.trim(),
                rating,
                ["order_item_id"]: selectedOrderItemId,
                imageUrls,
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

    return (
        <Wrap>
            <Inner>
                <Title>리뷰 작성</Title>

                {/* 상품 선택 모달 */}
                {openModal && (
                    <ProductSelectModal
                        onClose={() => setOpenModal(false)}
                        onSelect={(item) => {
                            setSelectedProduct(item);
                            setSelectedOrderItemId(item.order_item_id);
                            // url을 /review/write/{product_id} 로 갱신
                            navigate(`/review/write/${item.product_id}`);
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
                            <div style={{
                                flex: 1,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                gap: "8px"
                            }}>
                                {selectedProduct ? (
                                    <ProductBox style={{ paddingLeft: 0 }}>
                                        <ProductInfo style={{ paddingLeft: 0 }}>
                                            <ProductTop>
                                                <div className="left-info">
                                                    <ProductName>{selectedProduct.product_name}</ProductName>
                                                    <PriceText style={{paddingLeft:"10px"}}>
                                                        {selectedProduct.product_price.toLocaleString()}원
                                                    </PriceText>
                                                </div>

                                                <PurchaseDate style={{paddingLeft:"10px"}}>
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
                                    style={{
                                        marginTop: 10,
                                        padding: "6px 12px",
                                        borderRadius: 8,
                                        border: "1px solid #d1d5db",
                                        background: "white",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => setOpenModal(true)}
                                >
                                    구매한 상품 선택하기
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
                                <Helper>※ 포인트 적립을 위해 20자 이상 작성해 주세요.</Helper>
                            </div>
                        </Row>

                        {/* 이미지 업로드 */}
                        <Row>
                            <Label>사진 첨부</Label>
                            <div style={{ display: "flex", gap: 10 }}>
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