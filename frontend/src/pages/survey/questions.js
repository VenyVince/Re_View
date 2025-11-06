// src/pages/survey/questions.js

// 섹션 구성: O/D, S/R, P/W, N/T (바우만 표기 표준)
export const SECTIONS = [
    {
        key: "OD",
        title: "수분/유분 밸런스 (O/D)",
        questions: [
            {
                id: "od1",
                text: "세안 후 아무것도 바르지 않았을 때는?",
                options: [
                    { label: "금방 땅기고 당김이 심하다", side: "D" },
                    { label: "약간 당기지만 곧 괜찮아진다", side: "D" },
                    { label: "당김은 없고 T존에 약간 유분이 생긴다", side: "O" },
                    { label: "전체적으로 유분이 금방 올라온다", side: "O" },
                ],
            },
            {
                id: "od2",
                text: "하루가 지나면 피부는 어떤가요?",
                options: [
                    { label: "오후에도 건조/각질이 보인다", side: "D" },
                    { label: "약간 건조하다", side: "D" },
                    { label: "T존 번들거림 있다", side: "O" },
                    { label: "전반적으로 번들거린다", side: "O" },
                ],
            },
            {
                id: "od3",
                text: "파운데이션/쿠션의 무너짐 패턴은?",
                options: [
                    { label: "건조로 들뜸/각질 부각", side: "D" },
                    { label: "부분적 들뜸", side: "D" },
                    { label: "T존 유분으로 뭉침", side: "O" },
                    { label: "광/유분으로 쉽게 무너짐", side: "O" },
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
                text: "새로운 화장품 사용 시 반응은?",
                options: [
                    { label: "자주 따가움/홍조/가려움", side: "S" },
                    { label: "가끔 자극/트러블", side: "S" },
                    { label: "대부분 무난", side: "R" },
                    { label: "웬만하면 모두 잘 맞음", side: "R" },
                ],
            },
            {
                id: "sr2",
                text: "환경 변화(온도·습도·먼지)에 대한 피부 반응은?",
                options: [
                    { label: "쉽게 민감/가려움", side: "S" },
                    { label: "민감한 편", side: "S" },
                    { label: "크게 변화 없음", side: "R" },
                    { label: "거의 영향 없음", side: "R" },
                ],
            },
            {
                id: "sr3",
                text: "각질 제거/레티놀/산성 제품 사용 시?",
                options: [
                    { label: "자극/따가움이 매우 잦음", side: "S" },
                    { label: "가끔 자극 있음", side: "S" },
                    { label: "대체로 잘 적응", side: "R" },
                    { label: "문제 거의 없음", side: "R" },
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
                text: "여드름 자국/상처 후 착색은?",
                options: [
                    { label: "쉽게 남고 오래감", side: "P" },
                    { label: "남는 편", side: "P" },
                    { label: "금방 옅어짐", side: "N" },
                    { label: "거의 남지 않음", side: "N" },
                ],
            },
            {
                id: "pn2",
                text: "햇볕 노출 후 반응은?",
                options: [
                    { label: "쉽게 타고 기미/잡티가 잘 생김", side: "P" },
                    { label: "그을리고 착색 남음", side: "P" },
                    { label: "살짝 그을렸다가 돌아옴", side: "N" },
                    { label: "잘 타지 않고 톤 일정", side: "N" },
                ],
            },
            {
                id: "pn3",
                text: "피부톤 균일도/잡티 경향은?",
                options: [
                    { label: "잡티/주근깨/멜라닌 증가 경향", side: "P" },
                    { label: "잡티가 생기기 쉬움", side: "P" },
                    { label: "톤이 대체로 균일", side: "N" },
                    { label: "잡티 거의 없음", side: "N" },
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
                text: "눈가/입가 등 표정 주름은?",
                options: [
                    { label: "정적 주름이 보임", side: "T" },
                    { label: "표정 후 주름이 오래감", side: "T" },
                    { label: "주름 거의 없음", side: "W" },
                    { label: "탄력이 좋음", side: "W" },
                ],
            },
            {
                id: "wt2",
                text: "본인 나이에 비한 피부 노화 체감은?",
                options: [
                    { label: "또래보다 노화 체감 큼", side: "T" },
                    { label: "다소 빠른 편", side: "T" },
                    { label: "또래 수준", side: "W" },
                    { label: "또래 대비 느린 편", side: "W" },
                ],
            },
            {
                id: "wt3",
                text: "생활 습관(수면/자외선/흡연/스트레스)과 피부의 상관은?",
                options: [
                    { label: "영향 크고 흔적/탄력 저하로 남음", side: "T" },
                    { label: "영향 받는 편", side: "T" },
                    { label: "영향은 있으나 회복 빠름", side: "W" },
                    { label: "관리해도 비교적 건강/탄력", side: "W" },
                ],
            },
        ],
    },
];

// 라디오 선택 결과({[qid]: 선택지 인덱스}) → 축별 tally
export function buildTallyFromSelections(selections) {
    const tally = { O:0, D:0, S:0, R:0, P:0, W:0, N:0, T:0 };
    SECTIONS.forEach(sec => {
        sec.questions.forEach(q => {
            const idx = selections[q.id];
            if (typeof idx === "number") {
                const side = q.options[idx]?.side;
                if (side && tally[side] != null) tally[side] += 1;
            }
        });
    });
    return tally;
}

// 문항 순서대로 “선택 인덱스 배열” 생성(백엔드 answers: number[] 용)
export function selectionsToAnswerArray(selections) {
    return SECTIONS.flatMap(s => s.questions.map(q => {
        const idx = selections[q.id];
        return typeof idx === "number" ? idx : 0;
    }));
}

// 총 문항 수
export const QUESTION_COUNT = SECTIONS.reduce((n, s) => n + s.questions.length, 0);
