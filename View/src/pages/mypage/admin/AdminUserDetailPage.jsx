import React from "react";
import { useLocation, useParams } from "react-router-dom";
import {
    Wrap,
    Inner,
    Title,
    Avatar,
    UserHeader,
    UserHeaderInfo,
    UserHeaderName,
    UserHeaderRole,
    UserHeaderRight,
    HeaderStat,
    DetailBody,
    DetailSection,
    DetailTitle,
    DetailBlock,
    DetailRow,
} from "./adminUserPage.style";

// 더미 주문/주소/결제/포인트 정보
const dummyDetail = {
    orderDate: "2025.10.30 09:25:00",
    orderNo: "00000000000000000000",
    productName: "샘플 아이크림 & 촉촉세럼 세트",
    option: "옵션: 지성용 1개",
    orderPrice: 10000,
    receiver: "홍길동",
    phone: "010-0000-0000",
    address: "전라북도 익산시 익산대로 460 원광대학교",
    totalPrice: 10000,
    discount: 0,
    shippingFee: 0,
    payMethod: "카드결제",
    cardInfo: "9490 **** **** **** / 현대 일시불",
    pointReward: 100,
};

export default function AdminUserDetailPage() {
    const { id } = useParams();
    const location = useLocation();
    const user = location.state || {
        id,
        name: "회원",
        role: "회원",
        coupons: 0,
        points: 0,
    };

    const d = dummyDetail;

    return (
        <Wrap>
            <Inner>
                <Title>유저 관리</Title>

                {/* 상단 사용자 정보 + 쿠폰/포인트 */}
                <UserHeader>
                    <Avatar>👤</Avatar>
                    <UserHeaderInfo>
                        <UserHeaderName>{user.name} 님</UserHeaderName>
                        <UserHeaderRole>{user.role}</UserHeaderRole>
                    </UserHeaderInfo>

                    <UserHeaderRight>
                        <HeaderStat>
                            <span>쿠폰</span>
                            <span>{user.coupons ?? 0}장</span>
                        </HeaderStat>
                        <HeaderStat>
                            <span>보유 포인트</span>
                            <span>{(user.points ?? 0).toLocaleString()}점</span>
                        </HeaderStat>
                    </UserHeaderRight>
                </UserHeader>

                {/* 주문/배송/결제/포인트 섹션 */}
                <DetailBody>
                    <DetailSection>
                        <DetailTitle>주문 상세내역</DetailTitle>
                        <DetailBlock>
                            <DetailRow>
                                <span>{d.orderDate}</span>
                                <span>주문번호 {d.orderNo}</span>
                            </DetailRow>
                            <div style={{ marginTop: 10 }}>
                                <div>{d.productName}</div>
                                <div>{d.option}</div>
                                <div style={{ marginTop: 4, fontWeight: 700 }}>
                                    {d.orderPrice.toLocaleString()}원
                                </div>
                            </div>
                        </DetailBlock>
                    </DetailSection>

                    <DetailSection>
                        <DetailTitle>배송지</DetailTitle>
                        <DetailBlock>
                            <div>{d.receiver}</div>
                            <div>{d.phone}</div>
                            <div>{d.address}</div>
                        </DetailBlock>
                    </DetailSection>

                    <DetailSection>
                        <DetailTitle>결제정보</DetailTitle>
                        <DetailBlock>
                            <DetailRow>
                                <span>주문금액</span>
                                <span>{d.totalPrice.toLocaleString()}원</span>
                            </DetailRow>
                            <DetailRow>
                                <span>상품금액</span>
                                <span>{d.orderPrice.toLocaleString()}원</span>
                            </DetailRow>
                            <DetailRow>
                                <span>할인</span>
                                <span>{d.discount}원</span>
                            </DetailRow>
                            <DetailRow>
                                <span>배송비</span>
                                <span>{d.shippingFee}원</span>
                            </DetailRow>
                            <DetailRow style={{ marginTop: 10, fontWeight: 700 }}>
                                <span>{d.payMethod}</span>
                                <span>{d.cardInfo}</span>
                            </DetailRow>
                        </DetailBlock>
                    </DetailSection>

                    <DetailSection>
                        <DetailTitle>포인트</DetailTitle>
                        <DetailBlock>
                            <DetailRow>
                                <span>적립금</span>
                                <span>예상 {d.pointReward}원</span>
                            </DetailRow>
                        </DetailBlock>
                    </DetailSection>
                </DetailBody>
            </Inner>
        </Wrap>
    );
}
