import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Wrap, Inner, TitleRow, Title, AddButton,
    Layout, Sidebar, SideItem, Content, Grid,
    Card, Badge, Thumb, CardBody, Name, Price, Actions,
    Pagination, PagerBtn, PageInfo
} from "./adminProductPage.style";



// 임시 데이터 (API 연동 전)
const mock = Array.from({ length: 18 }).map((_, i) => ({
    id: i + 1,
    name: "수분 크림",
    price: 25,
    isNew: i < 3
}));

export default function AdminProductPage() {
    const [page, setPage] = useState(1);        // 1..3
    const pageSize = 9;
    const total = mock.length;
    const maxPage = Math.ceil(total / pageSize);
    const navigate = useNavigate();

    const list = useMemo(() => {
        const s = (page - 1) * pageSize;
        return mock.slice(s, s + pageSize);
    }, [page]);

    return (
        <Wrap>
            <Inner>
                {/* 좌측 사이드바 */}
                <Layout>
                    <Sidebar>
                        <SideItem $active>상품 등록/수정/삭제</SideItem>
                        <SideItem>리뷰 관리</SideItem>
                        <SideItem>Q&A 관리</SideItem>
                        <SideItem>유저 관리</SideItem>
                        <SideItem>통계 및 분석</SideItem>
                    </Sidebar>

                    {/* 우측 콘텐츠 */}
                    <Content>
                        <TitleRow>
                            <Title>등록된 상품들</Title>
                            <AddButton onClick={()=>alert("상품 등록 폼 오픈!")}>상품 등록</AddButton>
                        </TitleRow>

                        <Grid>
                            {list.map(p => (
                                <Card key={p.id}>
                                    {p.isNew && <Badge>신제품</Badge>}
                                    <Thumb>이미지</Thumb>
                                    <CardBody>
                                        <Name>수분 크림</Name>
                                        <Price>${p.price}</Price>
                                        <Actions>
                                            <button
                                                type="button"
                                                title="수정"
                                                onClick={() => {
                                                    console.log("edit", p.id); // ← 클릭 여부 확인용
                                                    navigate(`/admin/products/${p.id}/edit`);
                                                }}
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                type="button"
                                                title="삭제"
                                                onClick={() => navigate(`/admin/products/${p.id}/delete`)}
                                            >
                                                🗑️
                                            </button>
                                        </Actions>
                                    </CardBody>
                                </Card>
                            ))}
                        </Grid>

                        <Pagination>
                            <PagerBtn disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))}>{"<"}</PagerBtn>
                            <PageInfo>{page} / {maxPage}</PageInfo>
                            <PagerBtn disabled={page===maxPage} onClick={()=>setPage(p=>Math.min(maxPage,p+1))}>{">"}</PagerBtn>
                        </Pagination>
                    </Content>
                </Layout>
            </Inner>
        </Wrap>
    );
}
