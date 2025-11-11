// src/pages/survey/questions.js

// 섹션 구성: O/D, S/R, P/W, N/T (바우만 표기 표준)
export const SECTIONS = [
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
