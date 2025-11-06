import React from 'react';
import { Link } from 'react-router-dom';
import {
    Wrap, Hero, HeroInner, HeroTitle, HeroSub,
    Container, List, Item, Thumb, Body, Title, Excerpt, Meta
} from './NoticePage.styled';


export default function NoticePage(){
    // 공지사항보다 다른 걸 먼저 해결해야 할 거 같아서.. 임시 데이터로 넣어뒀습니다.
    const notices = [
        {
            id: 1,
            title: '2025년 신제품 출시',
            excerpt: '모든 피부 타입을 위한 새로운 제품이 출시 되었습니다. 지금 확인해보세요!',
            date: '2025-01-15'
        },
        {
            id: 2,
            title: '할인 이벤트',
            excerpt: '다음 주까지 특별 할인 이벤트가 진행됩니다!',
            date: '2025-01-10'
        }
    ];

    return (
        <Wrap>
            {/* 상단 히어로 */}
            <Hero>
                <HeroInner>
                    <HeroTitle>공지사항</HeroTitle>
                    <HeroSub>최신 공지사항을 확인하세요.</HeroSub>
                </HeroInner>
            </Hero>

            {/* 목록 */}
            <Container>
                <List>
                    {notices.map(n => (
                        <Item key={n.id} as={Link} to={`/notice/${n.id}`} aria-label={`${n.title} 상세보기`}>
                            <Body>
                                <Title>{n.title}</Title>
                                <Excerpt>{n.excerpt}</Excerpt>
                                <Meta>{n.date}</Meta>
                            </Body>
                        </Item>
                    ))}
                </List>
            </Container>
        </Wrap>
    );
}