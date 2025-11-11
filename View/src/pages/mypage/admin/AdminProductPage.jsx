import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../api/axiosClient";
import {
    Wrap, Inner, TitleRow, Title, AddButton,
    Layout, Sidebar, SideItem, Content, Grid,
    Card, Badge, Thumb, CardBody, Name, Price, Actions,
    Pagination, PagerBtn, PageInfo
} from "./adminProductPage.style";

export default function AdminProductPage() {
    const [list, setList] = useState([]);   // 서버 데이터
    const [page, setPage] = useState(1);
    const pageSize = 9;
    const navigate = useNavigate();

    // API 연동
    useEffect(() => {
        axiosClient.get("/api/admin/allproducts")
            .then(res => {
                // 응답이 배열이면 그대로, 아니면 흔한 래핑 키에서 꺼냄
                const items = Array.isArray(res.data)
                    ? res.data
                    : res.data?.data || res.data?.content || res.data?.result || [];
                console.log("상품 목록:", items);
                setList(items);
            })
            .catch(err => {
                console.error("상품 목록 불러오기 실패:", err);
                setList([]); // 실패 시 빈 배열로
            });
    }, []);

    const total = list.length;
    const maxPage = Math.max(1, Math.ceil(total / pageSize));
    const pageList = useMemo(() => {
        const s = (page - 1) * pageSize;
        return list.slice(s, s + pageSize);
    }, [list, page]);

    return (
        <Wrap>
            <Inner>
                <Layout>
                    <Sidebar>
                        <SideItem $active>상품 등록/수정/삭제</SideItem>
                        <SideItem>리뷰 관리</SideItem>
                        <SideItem>Q&amp;A 관리</SideItem>
                        <SideItem>유저 관리</SideItem>
                        <SideItem>통계 및 분석</SideItem>
                    </Sidebar>

                    <Content>
                        <TitleRow>
                            <Title>등록된 상품들</Title>
                            <AddButton onClick={() => navigate("/admin/products/new")}>
                                상품 등록
                            </AddButton>
                        </TitleRow>

                        <Grid>
                            {pageList.map(p => (
                                <Card key={p.productId}>
                                    {p.isNew && <Badge>신제품</Badge>}
                                    <Thumb>
                                        {p.imageUrl ? <img src={p.imageUrl} alt={p.prdName}/> : "이미지"}
                                    </Thumb>
                                    <CardBody>
                                        <Name>{p.prdName}</Name>
                                        <Price>₩{(p.price ?? 0).toLocaleString()}</Price>
                                        <Actions>
                                            <button
                                                type="button"
                                                title="수정"
                                                onClick={() => navigate(`/admin/products/${p.productId}/edit`)}
                                            >✏️</button>
                                            <button
                                                type="button"
                                                title="삭제"
                                                onClick={() => navigate(`/admin/products/${p.productId}/delete`)}
                                            >🗑️</button>
                                        </Actions>
                                    </CardBody>
                                </Card>
                            ))}
                        </Grid>

                        <Pagination>
                            <PagerBtn disabled={page===1} onClick={() => setPage(p => Math.max(1, p-1))}>{"<"}</PagerBtn>
                            <PageInfo>{page} / {maxPage}</PageInfo>
                            <PagerBtn disabled={page===maxPage} onClick={() => setPage(p => Math.min(maxPage, p+1))}>{">"}</PagerBtn>
                        </Pagination>
                    </Content>
                </Layout>
            </Inner>
        </Wrap>
    );
}