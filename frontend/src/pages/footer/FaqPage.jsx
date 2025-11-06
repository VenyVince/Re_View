import React from 'react';
import {
    Wrap, Hero, HeroInner, HeroTitle, HeroSub,
    Container, List, Item, Body, Title, Excerpt
} from './FaqPage.styled';


export default function FaqPage(){
    // 다른 게 우선인 거 같아서 이것 또한 임시데이터 넣어뒀습니다.
    const faqs =[
        {
            id: 1,
            title: '제품 반품 정책은?',
            excerpt: '제품은 구매 후 30일 이내에 반품 가능합니다.'
        },
        {
            id : 2,
            title : '배송 시간은 얼마나 걸리나요?',
            excerpt:'주문 후 3~5일 이내에 배송됩니다.'
        }
    ];

    return (
        <Wrap>
            <Hero>
                <HeroInner>
                    <HeroTitle>자주 묻는 질문 (FAQ)</HeroTitle>
                    <HeroSub>클릭 없이 한눈에 확인하세요.</HeroSub>
                </HeroInner>
            </Hero>

            <Container role="list">
                <List>
                    {faqs.map(f => (
                        <Item key={f.id} role="listitem" aria-label={`${f.title} 항목`}>
                            <Body>
                                <Title>{f.title}</Title>
                                <Excerpt>{f.excerpt}</Excerpt>
                            </Body>
                        </Item>
                    ))}
                </List>
            </Container>
        </Wrap>
    );
}