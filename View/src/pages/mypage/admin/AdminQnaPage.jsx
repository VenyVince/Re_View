// src/pages/mypage/admin/AdminQnaPage.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Wrap, Inner, Title, SectionTitle,
    List, Row, IconCircle, TextBlock,
    QuestionText, Meta, Pagination, PagerBtn, PageInfo,} from "./adminQnaPage.style";
import { fetchQnaList } from "../../../api/admin/adminQnaApi";

export default function AdminQnaPage() {
    const [list, setList] = useState([]);
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const navigate = useNavigate();

    // QnA 목록 로딩
    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetchQnaList();  // axios 응답
                console.log("QNA 목록 응답:", res);

                // 실제 백엔드 응답에서 data 배열만 추출
                const items = res.data ?? [];

                setList(Array.isArray(items) ? items : []);
            } catch (error) {
                console.error("[ADMIN] QnA 목록 불러오기 실패:", error);
                setList([]);
            }
        };

        load();
    }, []);

    const total = list.length;
    const maxPage = Math.max(1, Math.ceil(total / pageSize));

    const pageList = useMemo(() => {
        const s = (page - 1) * pageSize;
        return list.slice(s, s + pageSize);
    }, [list, page]);

    const handleClickRow = (item) => {
        navigate(`/admin/qna/${item.qna_id}`, { state: item });
    };


    return (
        <Wrap>
            <Inner>
                <Title>Q&A 관리</Title>
                <SectionTitle>질문 목록</SectionTitle>

                <List>
                    {pageList.map((q) => (
                        <Row key={q.qna_id} onClick={() => handleClickRow(q)}>
                            <IconCircle status={q.status}>
                                {q.status === "답변완료" ? "✔" : "?"}
                            </IconCircle>
                            <TextBlock>
                                <QuestionText>{q.title}</QuestionText>
                                <Meta>고객: {q.user_name}</Meta>
                                {q.answer && (
                                    <Meta style={{ color: "#0ea5e9" }}>
                                        ✔ 답변 완료
                                    </Meta>
                                )}
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
