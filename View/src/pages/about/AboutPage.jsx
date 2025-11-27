// src/pages/about/AboutPage.jsx
import React, { useEffect, useRef, useState } from "react";
import {
    Wrap, Hero, HeroBadge, HeroTitle, HeroSubtitle, HeroTagRow, HeroTag, Inner, Section,
    SectionTitle, SectionDesc, Highlight, Grid, Card, CardTitle, CardText, Badge, StatRow,
    StatItem, StatNumber, StatLabel, Timeline, TimelineItem, TimelineDot, TimelineContent,
    SurveyDetail, SurveyDetailTitle, SurveyGroup, SurveyGroupTitle, SurveyQuestionList, SurveyQuestionItem,
} from "./AboutPage.style";

// Baumann 설문 문항 목록
const SURVEY_GROUPS = [
    {
        key: "OD",
        title: "수분/유분 밸런스 (O/D)",
        questions: [
            {
                id: "od1",
                text: "세안 후 아무것도 바르지 않았을 때 피부 상태는 어떤가요?",
                options: [
                    { label: "세안 직후부터 심하게 당기고 건조하다", side: "D" },
                    { label: "약간 당기지만 시간이 지나면 괜찮아진다", side: "D" },
                    { label: "당김은 없고 이마와 코 주변에 약간 기름기가 돈다", side: "O" },
                    { label: "얼굴 전체에 금방 기름기가 올라온다", side: "O" },
                ],
            },
            {
                id: "od2",
                text: "하루를 보내고 난 뒤, 피부는 어떤 상태인가요?",
                options: [
                    { label: "오후에도 건조하고 각질이 눈에 띈다", side: "D" },
                    { label: "약간 건조하게 느껴진다", side: "D" },
                    { label: "이마나 코 주변이 약간 번들거린다", side: "O" },
                    { label: "얼굴 전체가 번들거리거나 기름기가 많다", side: "O" },
                ],
            },
            {
                id: "od3",
                text: "지금(혹은 외출 후) 피부 표면을 직접 확인했을 때 어떤 상태인가요? (손으로 만지거나 티슈/기름종이로 가볍게 눌러 확인해보세요)",
                options: [
                    { label: "손으로 만지면 거칠고 당김이 느껴진다 (각질/건조)", side: "D" },
                    { label: "일부 부위만 거칠게 느껴진다 (부분적 건조)", side: "D" },
                    { label: "손으로 만지면 이마·코 쪽이 약간 끈적거리거나 기름진 느낌이다", side: "O" },
                    { label: "손으로 만지면 얼굴 전체가 번들거리고 티슈/기름종이에 넓게 묻는다", side: "O" },
                ],
            },
        ],
    },
    {
        key: "SR",
        title: "민감도 (S/R)",
        questions: [
            {
                id: "sr1",
                text: "새로운 스킨케어나 로션 등 제품을 처음 사용할 때 피부 반응은 어떤가요?",
                options: [
                    { label: "바르면 바로 따갑거나 빨갛게 될 때가 많다", side: "S" },
                    { label: "가끔 따갑거나 간지러울 때가 있다", side: "S" },
                    { label: "대부분 무난하게 잘 맞는다", side: "R" },
                    { label: "거의 모든 제품을 문제 없이 사용한다", side: "R" },
                ],
            },
            {
                id: "sr2",
                text: "날씨나 환경이 바뀔 때(더위·추위·건조함·먼지 등) 피부 반응은 어떤가요?",
                options: [
                    { label: "쉽게 가렵거나 빨개진다", side: "S" },
                    { label: "민감하게 느껴질 때가 종종 있다", side: "S" },
                    { label: "크게 변화나 자극은 없다", side: "R" },
                    { label: "거의 영향받지 않는다", side: "R" },
                ],
            },
            {
                id: "sr3",
                text: "피부에 자극이 있을 수 있는 제품(예: 각질 제거 패드, 스크럽, 강한 토너, 면도 후 로션 등)을 사용할 때 반응은?",
                options: [
                    { label: "바로 따갑거나 빨갛게 되고 자극이 자주 생긴다", side: "S" },
                    { label: "가끔 따갑거나 붉어질 때가 있다", side: "S" },
                    { label: "대체로 무난하고 잘 적응한다", side: "R" },
                    { label: "거의 자극이 없고 문제 없이 사용한다", side: "R" },
                ],
            },
        ],
    },
    {
        key: "PN",
        title: "색소 침착 경향 (P/N)",
        questions: [
            {
                id: "pn1",
                text: "여드름 자국이나 상처가 난 뒤 피부 상태는 어떤가요?",
                options: [
                    { label: "검은색·갈색 자국이 쉽게 남고 오래 간다", side: "P" },
                    { label: "자국이 남는 편이다", side: "P" },
                    { label: "자국이 생겨도 금방 옅어진다", side: "N" },
                    { label: "거의 자국이 남지 않는다", side: "N" },
                ],
            },
            {
                id: "pn2",
                text: "햇볕에 노출된 뒤 피부 변화는 어떤가요?",
                options: [
                    { label: "쉽게 타고 기미나 잡티가 잘 생긴다", side: "P" },
                    { label: "피부가 그을리고 색이 남는다", side: "P" },
                    { label: "잠시 그을렸다가 금방 원래 톤으로 돌아온다", side: "N" },
                    { label: "잘 타지 않고 피부 톤이 일정하다", side: "N" },
                ],
            },
            {
                id: "pn3",
                text: "전체적인 피부 톤과 잡티 상태는 어떤가요?",
                options: [
                    { label: "기미·주근깨 같은 검은 얼룩이 잘 생기고 눈에 띈다", side: "P" },
                    { label: "잡티가 생기기 쉬운 편이다", side: "P" },
                    { label: "피부 톤이 대체로 균일하다", side: "N" },
                    { label: "눈에 띄는 잡티가 거의 없다", side: "N" },
                ],
            },
        ],
    },
    {
        key: "WT",
        title: "주름/탄력 (W/T)",
        questions: [
            {
                id: "wt1",
                text: "눈가나 입가처럼 자주 움직이는 부위의 주름 상태는 어떤가요?",
                options: [
                    { label: "표정을 짓지 않아도 잔주름이 보인다", side: "T" },
                    { label: "표정 지은 후 주름이 오래 남는다", side: "T" },
                    { label: "주름이 거의 보이지 않는다", side: "W" },
                    { label: "피부가 탱탱하고 탄력이 좋다", side: "W" },
                ],
            },
            {
                id: "wt2",
                text: "본인 나이에 비해 피부 나이(노화 정도)는 어떻게 느껴지나요?",
                options: [
                    { label: "또래보다 피부가 더 늘어지고 주름이 많다", side: "T" },
                    { label: "약간 빠른 편이다", side: "T" },
                    { label: "또래와 비슷하다", side: "W" },
                    { label: "또래보다 탄력이 좋고 어려 보인다", side: "W" },
                ],
            },
            {
                id: "wt3",
                text: "생활 습관(수면, 자외선, 흡연, 스트레스 등)이 피부에 미치는 영향은 어떤가요?",
                options: [
                    { label: "영향이 크고 주름이나 탄력 저하로 남는다", side: "T" },
                    { label: "피부가 영향을 받는 편이다", side: "T" },
                    { label: "영향은 있지만 금방 회복된다", side: "W" },
                    { label: "꾸준히 관리하면 피부가 건강하고 탄력 있게 유지된다", side: "W" },
                ],
            },
        ],
    },
];

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
    const [showSurveyDetail, setShowSurveyDetail] = useState(false);
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

                {/* 섹션 2.5: Baumann 타입 소개 */}
                <AnimatedSection>
                    <SectionTitle>Baumann 피부 타입이란?</SectionTitle>
                    <SectionDesc>
                        Baumann 피부 타입은 미국 피부과 전문의 <strong>Leslie Baumann</strong> 박사가
                        제안한 과학 기반 피부 분류 시스템으로<br/>
                        <Highlight>피부를 4가지 축(O/D · S/R · P/N · W/T)</Highlight>으로 나누어
                        총 <strong>16가지 타입</strong>으로 정의합니다.
                        <br /><br />
                        이 방식은 단순히 "건성/지성"만 보는 것이 아니라,
                        <strong>유분/수분 · 민감도 · 색소침착 경향 · 주름/탄력</strong>을 하나의 프로파일로 분석하여<br/>
                        <Highlight>더 정확한 스킨케어 추천</Highlight>이 가능하다는 점에서 전 세계적으로 사용되고 있습니다.
                    </SectionDesc>

                    <Grid style={{
                        marginTop: "18px",
                        gridTemplateColumns: "repeat(2, 1fr)"
                    }}>
                        <Card>
                            <Badge>O/D</Badge>
                            <CardTitle>유분/수분 밸런스</CardTitle>
                            <CardText>
                                피부 건조함(D)부터 번들거림(O)까지<br/>
                                피부의 기본적인 유·수분 상태를 나타냅니다.
                            </CardText>
                        </Card>

                        <Card>
                            <Badge>S/R</Badge>
                            <CardTitle>민감도</CardTitle>
                            <CardText>
                                자극에 얼마나 취약한지(S) 또는 안정적인지(R)를 뜻합니다.<br/>
                                민감한 피부일수록 성분 선택이 중요하죠.
                            </CardText>
                        </Card>

                        <Card>
                            <Badge>P/N</Badge>
                            <CardTitle>색소침착 경향</CardTitle>
                            <CardText>
                                색소가 잘 생기는 타입(P)인지,<br/>
                                비교적 균일한 톤을 유지하는 타입(N)인지 보여줍니다.
                            </CardText>
                        </Card>

                        <Card>
                            <Badge>W/T</Badge>
                            <CardTitle>주름/탄력</CardTitle>
                            <CardText>
                                피부 탄력(W) 혹은 주름 발생(T) 경향을 나타내며<br/>
                                노화 관리 방향을 세우는 기준이 됩니다.
                            </CardText>
                        </Card>
                    </Grid>

                    <SectionDesc style={{ marginTop: "22px" }}>
                        Re:View는 이 Baumann 모델을 기반으로
                        <Highlight>한국 사용자에게 맞춘 한국형 피부 타입 설문</Highlight>을 개발했습니다.<br/>
                        따라서 사용자는 자신의 타입을 더 정확히 알 수 있고<br/>
                        <strong>나와 같은 타입의 리뷰만 골라 보는 경험</strong>을 할 수 있습니다.
                    </SectionDesc>
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

                        {/* ★ 클릭하면 문항 리스트 토글 */}
                        <StatItem
                            $clickable
                            onClick={() => setShowSurveyDetail(prev => !prev)}
                        >
                            <StatNumber>12</StatNumber>
                            <StatLabel>
                                Baumann 모델 기반
                                <br />
                                한국형 피부 타입 설문
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
                    {showSurveyDetail && (
                        <SurveyDetail $open={showSurveyDetail}>
                            <SurveyDetailTitle>Baumann 피부 타입 설문 문항</SurveyDetailTitle>

                            {SURVEY_GROUPS.map(group => (
                                <SurveyGroup key={group.key}>
                                    <SurveyGroupTitle>{group.title}</SurveyGroupTitle>

                                    <SurveyQuestionList>
                                        {group.questions.map(q => (
                                            <SurveyQuestionItem key={q.id}>
                                                <div className="q-text">{q.text}</div>
                                                <ul className="q-options">
                                                    {q.options.map((opt, idx) => (
                                                        <li key={idx}>
                                                            <span className="opt-label">{opt.label}</span>
                                                            <span className="opt-side">{opt.side}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </SurveyQuestionItem>
                                        ))}
                                    </SurveyQuestionList>
                                </SurveyGroup>
                            ))}
                        </SurveyDetail>
                    )}

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
