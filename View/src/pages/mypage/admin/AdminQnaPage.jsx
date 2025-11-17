import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Wrap,
    Inner,
    Title,
    SectionTitle,
    List,
    Row,
    IconCircle,
    TextBlock,
    QuestionText,
    Meta,
    Pagination,
    PagerBtn,
    PageInfo,
} from "./adminQnaPage.style";

const dummyQna = [
    {
        id: 1,
        question: "수분 크림 언제 재입고되나요?",
        customer: "이연수",
    },
    {
        id: 2,
        question: "선크림 사용법은 어떤가요?",
        customer: "김철수",
    },
    {
        id: 3,
        question: "수분 크림 언제 재입고되나요?",
        customer: "이연수",
    },
    {
        id: 4,
        question: "선크림 사용법은 어떤가요?",
        customer: "김철수",
    },
    {
        id: 5,
        question: "지성 피부에 맞는 토너 추천해주세요.",
        customer: "박민지",
    },
    {
        id: 6,
        question: "트러블 피부도 사용 가능할까요?",
        customer: "정가영",
    },
];

export default function AdminQnaPage() {
    const [list] = useState(dummyQna);
    const [page, setPage] = useState(1);
    const pageSize = 4;
    const navigate = useNavigate();

    const total = list.length;
    const maxPage = Math.max(1, Math.ceil(total / pageSize));

    const pageList = useMemo(() => {
        const s = (page - 1) * pageSize;
        return list.slice(s, s + pageSize);
    }, [list, page]);

    const handleClickRow = (item) => {
        // 질문 클릭 시 답변 페이지로 이동 + 상태 전달
        navigate(`/admin/qna/${item.id}`, { state: item });
    };

    return (
        <Wrap>
            <Inner>
                <Title>Q&A 관리</Title>
                <SectionTitle>질문 목록</SectionTitle>

                <List>
                    {pageList.map((q) => (
                        <Row key={q.id} onClick={() => handleClickRow(q)}>
                            <IconCircle>?</IconCircle>
                            <TextBlock>
                                <QuestionText>{q.question}</QuestionText>
                                <Meta>고객: {q.customer}</Meta>
                            </TextBlock>
                        </Row>
                    ))}
                </List>

                <Pagination>
                    <PagerBtn
                        disabled={page === 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                        {"<"}
                    </PagerBtn>
                    <PageInfo>
                        {page} / {maxPage}
                    </PageInfo>
                    <PagerBtn
                        disabled={page === maxPage}
                        onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
                    >
                        {">"}
                    </PagerBtn>
                </Pagination>
            </Inner>
        </Wrap>
    );
}
