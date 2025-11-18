// src/pages/mypage/admin/AdminQnaPage.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Wrap, Inner, Title, SectionTitle,
    List, Row, IconCircle, TextBlock,
    QuestionText, Meta, Pagination, PagerBtn, PageInfo,} from "./adminQnaPage.style";
import { fetchQnaList } from "../../../api/admin/adminQnaApi";

export default function AdminQnaPage() {
    const [list, setList] = useState([]);      // 🔹 서버에서 온 QnA 리스트
    const [page, setPage] = useState(1);
    const pageSize = 4;
    const navigate = useNavigate();

    // QnA 목록 API 연동
    useEffect(() => {
        const load = async () => {
            try {
                console.log("[ADMIN] QnA 목록 호출 시작");
                const data = await fetchQnaList();   // fetchQnaList가 data만 돌려주든, 응답 통째로 돌려주든 대비
                console.log("[ADMIN] 원본 응답 data:", data);

                const items = Array.isArray(data)
                    ? data
                    : data?.data || data?.content || data?.result || [];

                console.log("[ADMIN] 파싱된 QnA items:", items);
                setList(items);
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
        // 🔹 질문 클릭 시 답변 페이지로 이동 + 상태 전달
        const qnaId = item.qnaId ?? item.id;
        navigate(`/admin/qna/${qnaId}`, { state: item });
    };

    return (
        <Wrap>
            <Inner>
                <Title>Q&A 관리</Title>
                <SectionTitle>질문 목록</SectionTitle>

                <List>
                    {pageList.map((q) => (
                        <Row key={q.qnaId ?? q.id} onClick={() => handleClickRow(q)}>
                            <IconCircle>?</IconCircle>
                            <TextBlock>
                                {/* 스웨거 기준 title, username 사용 */}
                                <QuestionText>{q.title ?? q.question}</QuestionText>
                                { (q.username || q.customer) && (
                                    <Meta>고객: {q.username ?? q.customer}</Meta>
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
