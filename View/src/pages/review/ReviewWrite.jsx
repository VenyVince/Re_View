// src/pages/review/ReviewWrite.jsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createReview } from "../../api/review/reviewApi";
import {
    Wrap, Inner, Title, Panel, Row, Label, ProfileBox, Avatar, ProfileName, ProductBox,
    ProductThumb, ProductInfo, ProductTop, ProductName, PriceText, RatingSelect, StarButton,
    RatingValue, PurchaseDate, TextArea, Helper, FooterRow, SubmitBtn,
} from "./ReviewWrite.style";

const ReviewWrite = () => {
    const { productId } = useParams();
    const navigate = useNavigate();

    const [content, setContent] = useState("");
    const [rating, setRating] = useState(5); // 1~5 클릭으로 변경
    const [submitting, setSubmitting] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!content.trim()) {
            alert("리뷰 내용을 입력해 주세요.");
            return;
        }

        try {
            setSubmitting(true);

            const payload = {
                content: content.trim(),
                rating,
                imageUrls: [], // 나중에 이미지 기능 붙이면 여기 채우면 됨
            };

            await createReview(productId, payload);

            alert("리뷰가 등록되었습니다.");
            navigate(`/products/${productId}`); // 원하는 경로로 수정
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

                <form onSubmit={onSubmit}>
                    <Panel>
                        {/* 작성자 */}
                        <Row>
                            <Label>작성자</Label>
                            <ProfileBox>
                                <Avatar>🙂</Avatar>
                                <ProfileName>홍길동 님</ProfileName>
                            </ProfileBox>
                        </Row>

                        {/* 상품 정보 */}
                        <Row>
                            <Label>상품 정보</Label>
                            <ProductBox>
                                <ProductThumb>
                                    {/* TODO: 실제 상품 이미지 URL로 교체 */}
                                    <span>🖼</span>
                                </ProductThumb>

                                <ProductInfo>
                                    <ProductTop>
                                        {/* 왼쪽: 상품명 + 가격 묶음 */}
                                        <div className="left-info">
                                            <ProductName>샐럿 마이크로 폼 클렌저</ProductName>
                                            <PriceText>₩32,000</PriceText>
                                        </div>

                                        {/* 오른쪽: 구매 날짜 */}
                                        <PurchaseDate>구매 날짜 2025.10.27</PurchaseDate>
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
                    </Panel>

                    <FooterRow>
                        <SubmitBtn type="submit" disabled={submitting}>
                            {submitting ? "등록 중..." : "확인"}
                        </SubmitBtn>
                    </FooterRow>
                </form>
            </Inner>
        </Wrap>
    );
};

export default ReviewWrite;