// src/pages/about/AboutPage.jsx
import React, { useEffect, useRef, useState } from "react";
import {
    Wrap,
    Hero,
    HeroBadge,
    HeroTitle,
    HeroSubtitle,
    HeroTagRow,
    HeroTag,
    Inner,
    Section,
    SectionTitle,
    SectionDesc,
    Highlight,
    Grid,
    Card,
    CardTitle,
    CardText,
    Badge,
    StatRow,
    StatItem,
    StatNumber,
    StatLabel,
    Timeline,
    TimelineItem,
    TimelineDot,
    TimelineContent,
} from "./AboutPage.style";

// 공통 섹션 컴포넌트: 화면에 보일 때 서서히 나타나도록
const AnimatedSection = ({ children }) => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    io.disconnect();
                }
            },
            { threshold: 0.2 }
        );

        if (ref.current) io.observe(ref.current);
        return () => io.disconnect();
    }, []);

    return (
        <Section ref={ref} $visible={visible}>
            {children}
        </Section>
    );
};

const AboutPage = () => {
    return (
        <Wrap>
            {/* 상단 히어로 영역 */}
            <Hero>
                <HeroBadge>About</HeroBadge>
                <HeroTitle>
                    피부 타입에 진심인
                    <br />
                    <span>뷰티 리뷰 플랫폼, Re:View</span>
                </HeroTitle>
                <HeroSubtitle>
                    수많은 별점 속에서 <Highlight>“나와 비슷한 피부의 리뷰”</Highlight>만
                    골라 보고 싶다는 고민에서 시작했습니다.
                </HeroSubtitle>

                <HeroTagRow>
                    <HeroTag>#Baumann 피부 타입</HeroTag>
                    <HeroTag>#데이터 기반 추천</HeroTag>
                    <HeroTag>#진짜 사용 후기</HeroTag>
                </HeroTagRow>
            </Hero>

            <Inner>
                {/* 섹션 1: 문제 인식 */}
                <AnimatedSection>
                    <SectionTitle>우리가 해결하고 싶은 문제</SectionTitle>
                    <SectionDesc>
                        “리뷰는 많은데, <strong>나한테 맞는 리뷰</strong>를 찾기가 너무
                        어렵다.”
                        <br />
                        Re:View는 사용자의 <Highlight>Baumann 피부 타입</Highlight>과 실제
                        사용 후기를 연결해서,
                        <br />
                        나와 비슷한 피부를 가진 사람들의 솔직한 경험을 한눈에 볼 수 있게
                        만드는 것을 목표로 합니다.
                    </SectionDesc>
                </AnimatedSection>

                {/* 섹션 2: 핵심 가치 */}
                <AnimatedSection>
                    <SectionTitle>Re:View가 만들어 가는 경험</SectionTitle>
                    <Grid>
                        <Card>
                            <Badge>01</Badge>
                            <CardTitle>데이터로 필터링되는 리뷰</CardTitle>
                            <CardText>
                                Baumann 타입을 기반으로 리뷰를{" "}<br />
                                <Highlight>피부 타입별로 분류</Highlight>합니다.
                                <br />
                                “전체 평점”이 아니라, <strong>나와 같은 타입</strong>의 사람들은<br />
                                이 제품을 어떻게 느꼈는지 먼저 보여줍니다.
                            </CardText>
                        </Card>

                        <Card>
                            <Badge>02</Badge>
                            <CardTitle>솔직한 후기, 구조화된 기록</CardTitle>
                            <CardText>
                                단순 별점/한 줄 코멘트가 아니라,{" "}
                                <Highlight>사용 상황과 <br/>느낌을 함께 남길 수 있는</Highlight>{" "}
                                폼을 제공합니다.
                                <br />
                                시간이 지나도 다시 꺼내 볼 수 있는<br />
                                “나만의 피부 데이터”가 됩니다.
                            </CardText>
                        </Card>

                        <Card>
                            <Badge>03</Badge>
                            <CardTitle>기여에 대한 보상</CardTitle>
                            <CardText>
                                정성스러운 리뷰에는 <Highlight>포인트 적립</Highlight> 등
                                실제로 도움이 되는 보상을 준비하고 있습니다.
                                <br />
                                좋은 정보를 나눠 준 만큼, 그 가치도 함께 <br />
                                쌓여가도록 설계하고 있습니다.
                            </CardText>
                        </Card>
                    </Grid>
                </AnimatedSection>

                {/* 섹션 3: 숫자로 보는 Re:View */}
                <AnimatedSection>
                    <SectionTitle>숫자로 보는 Re:View</SectionTitle>
                    <StatRow>
                        <StatItem>
                            <StatNumber>4</StatNumber>
                            <StatLabel>
                                Baumann 축
                                <br />
                                (O/D · S/R · P/N · W/T)
                            </StatLabel>
                        </StatItem>
                        <StatItem>
                            <StatNumber>80+</StatNumber>
                            <StatLabel>
                                한국 사용자에 맞게
                                <br />
                                다시 설계한 설문 문항
                            </StatLabel>
                        </StatItem>
                        <StatItem>
                            <StatNumber>∞</StatNumber>
                            <StatLabel>
                                앞으로 쌓여갈
                                <br />
                                진짜 사용자 리뷰
                            </StatLabel>
                        </StatItem>
                    </StatRow>
                </AnimatedSection>

                {/* 섹션 4: 프로젝트 히스토리 */}
                <AnimatedSection>
                    <SectionTitle>Re:View 팀의 여정</SectionTitle>
                    <Timeline>
                        <TimelineItem>
                            <TimelineDot />
                            <TimelineContent>
                                <h4>01. 아이디어 시작</h4>
                                <p>
                                    팀원들 각자가 겪었던{" "}
                                    <Highlight>스킨케어 실패 경험</Highlight>에서 시작했습니다.
                                    <br />
                                    “제품이 나빠서가 아니라, <strong>나와 안 맞아서</strong>{" "}
                                    실패한 건 아닐까?” 라는 질문을 붙잡고 파기 시작했어요.
                                </p>
                            </TimelineContent>
                        </TimelineItem>

                        <TimelineItem>
                            <TimelineDot />
                            <TimelineContent>
                                <h4>02. Baumann 타입 연구</h4>
                                <p>
                                    해외 논문과 자료를 참고해, 한국 사용자에게 맞게{" "}
                                    <Highlight>표현과 예시를 재작성</Highlight>했습니다.
                                    <br />
                                    그리고 이를 서비스 DB 구조, 설문, UI까지 연결하는 작업을
                                    진행했습니다.
                                </p>
                            </TimelineContent>
                        </TimelineItem>

                        <TimelineItem>
                            <TimelineDot />
                            <TimelineContent>
                                <h4>03. Re:View 프로토타입 개발</h4>
                                <p>
                                    설문, 제품, 리뷰, 관리자 페이지까지 연결된{" "}
                                    <strong>통합 뷰티 리뷰 플랫폼</strong>으로 확장하고 있습니다.
                                    <br />
                                    지금은 프로토타입 단계지만, “진짜 쓸 수 있는 서비스”를
                                    목표로 계속 다듬어 가고 있어요.
                                </p>
                            </TimelineContent>
                        </TimelineItem>
                    </Timeline>
                </AnimatedSection>
            </Inner>
        </Wrap>
    );
};

export default AboutPage;
