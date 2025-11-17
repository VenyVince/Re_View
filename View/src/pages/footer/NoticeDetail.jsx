import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
    Wrap, Hero, HeroInner, HeroTitle, HeroSub,
    Container, DetailWrap, DetailHeader, DetailTitle, DetailMeta, DetailContent, BackLink
} from "./NoticePage.styled";

export default function NoticeDetail() {
    const { id } = useParams();

    // 목록과 동일 스키마(date, title, excerpt)로 임시 데이터
    const mock = [
        {
            id: 1,
            title: "2025년 신제품 출시",
            date: "2025-01-15",
            content:
                "모든 피부 타입을 위한 새로운 제품이 출시되었습니다.\n" +
                "주요 성분과 사용법은 추후 상세 공지에서 안내드리겠습니다.",
        },
        {
            id: 2,
            title: "할인 이벤트",
            date: "2025-01-10",
            content:
                "다음 주까지 특별 할인 이벤트가 진행됩니다!\n" +
                "장바구니 쿠폰과 적립 혜택을 함께 이용해 보세요.",
        },
    ];

    const notice = useMemo(() => mock.find(n => String(n.id) === id), [id]);

    if (!notice) {
        return (
            <Wrap>
                <Hero>
                    <HeroInner>
                        <HeroTitle>공지사항</HeroTitle>
                        <HeroSub>요청하신 공지를 찾을 수 없습니다.</HeroSub>
                        <BackLink as={Link} to="/notice">← 목록으로</BackLink>
                    </HeroInner>
                </Hero>
            </Wrap>
        );
    }

    return (
        <Wrap>
            <Hero>
                <HeroInner>
                    <HeroTitle>공지사항</HeroTitle>
                    <HeroSub>최신 공지사항을 확인하세요.</HeroSub>
                </HeroInner>
            </Hero>

            <Container>
                <DetailWrap>
                    <DetailHeader>
                        <DetailTitle>{notice.title}</DetailTitle>
                        <DetailMeta>{notice.date}</DetailMeta>
                    </DetailHeader>

                    <DetailContent>
                        {notice.content.split("\n").map((line, i) => <p key={i}>{line}</p>)}
                    </DetailContent>

                    <BackLink as={Link} to="/notice" aria-label="공지사항 목록으로 돌아가기">
                        ← 목록으로
                    </BackLink>
                </DetailWrap>
            </Container>
        </Wrap>
    );
}
