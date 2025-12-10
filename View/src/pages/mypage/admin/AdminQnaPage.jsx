import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Wrap, Inner, Content, TitleRow, Title,
    Pagination, PagerBtn, PageInfo, DetailButton,Answered, Unanswered,
    QnaTable, FilterSelect, FilterRow, SearchInput, FilterLabel,TableWrapper
} from "./adminQnaPage.style";
import { fetchQnaList } from "../../../api/admin/adminQnaApi";

export default function AdminQnaPage() {
    const [list, setList] = useState([]);
    const [page, setPage] = useState(1);
    const pageSize = 10;
    const navigate = useNavigate();
    const [filterStatus, setFilterStatus] = useState("ALL"); // ALL / WAITING / ANSWERED
    const [keyword, setKeyword] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetchQnaList();
                const items = res.data ?? [];
                setList(Array.isArray(items) ? items : []);
            } catch (err) {
                console.error("[ADMIN] QnA 목록 실패", err);
                setList([]);
            }
        };
        load();
    }, []);

    const filteredList = useMemo(() => {
        let base = [...list];

        // 검색
        if (keyword.trim()) {
            const k = keyword.toLowerCase();
            base = base.filter(q =>
                q.user_name?.toLowerCase().includes(k) ||
                q.title?.toLowerCase().includes(k)
            );
        }

        // 상태 필터
        if (filterStatus === "WAITING") {
            base = base.filter(q => !q.answer);
        } else if (filterStatus === "ANSWERED") {
            base = base.filter(q => q.answer);
        }

        return base;
    }, [list, filterStatus, keyword]);


    const total = list.length;
    const maxPage = Math.max(1, Math.ceil(total / pageSize));

    const pageList = useMemo(() => {
        const s = (page - 1) * pageSize;
        return filteredList.slice(s, s + pageSize);
    }, [filteredList, page]);

    const handleRowClick = (q) => {
        navigate(`/admin/qna/${q.qna_id}`, { state: q });
    };

    return (
        <Wrap>
            <Inner>
                <Content>

                    <TitleRow>
                        <Title>Q&A 관리</Title>
                    </TitleRow>

                    <FilterRow>

                        {/* 상태 필터 */}
                        <FilterLabel>상태</FilterLabel>
                        <FilterSelect
                            value={filterStatus}
                            onChange={(e) => {
                                setFilterStatus(e.target.value);
                                setPage(1);
                            }}
                        >
                            <option value="ALL">전체</option>
                            <option value="WAITING">미답변</option>
                            <option value="ANSWERED">답변완료</option>
                        </FilterSelect>

                        {/* 검색창 */}
                        <SearchInput
                            placeholder="고객명 / 제목 검색"
                            value={keyword}
                            onChange={(e) => {
                                setKeyword(e.target.value);
                                setPage(1);
                            }}
                        />

                    </FilterRow>

                    <TableWrapper>
                    <QnaTable>
                        <thead>
                        <tr>
                            <th>No.</th>
                            <th>고객</th>
                            <th>질문 제목</th>
                            <th>답변 여부</th>
                            <th>질문 보기</th>
                        </tr>
                        </thead>

                        <tbody>
                        {pageList.map((q, idx) => {
                            const rowNumber = (page - 1) * pageSize + idx + 1;

                            // 답변 여부 판단 → 추후 answered_at으로 변경해도 여기만 고치면 됨
                            const isAnswered =
                                q.answer !== null &&
                                q.answer !== undefined &&
                                q.answer.trim() !== "";

                            return (
                                <tr
                                    key={q.qna_id}
                                    onClick={() => handleRowClick(q)}
                                    style={{ cursor: "pointer" }}
                                >
                                    <td>{rowNumber}</td>
                                    <td>{q.user_name}</td>
                                    <td>{q.title}</td>

                                    {/* 답변 여부 출력 */}
                                    <td>
                                        {isAnswered ? (
                                            <Answered>답변완료</Answered>
                                        ) : (
                                            <Unanswered>미답변</Unanswered>
                                        )}
                                    </td>

                                    {/* 상세보기 버튼 */}
                                    <td>
                                        <DetailButton
                                            onClick={(e) => {
                                                e.stopPropagation(); // row 클릭 막기
                                                navigate(`/admin/qna/${q.qna_id}`);
                                            }}
                                        >
                                            상세보기
                                        </DetailButton>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>


                    </QnaTable>
                    </TableWrapper>

                    <Pagination>
                        <PagerBtn disabled={page === 1} onClick={() => setPage(p => p - 1)}>
                            {"<"}
                        </PagerBtn>

                        <PageInfo>{page} / {maxPage}</PageInfo>

                        <PagerBtn disabled={page === maxPage} onClick={() => setPage(p => p + 1)}>
                            {">"}
                        </PagerBtn>
                    </Pagination>

                </Content>
            </Inner>
        </Wrap>
    );
}
