// src/pages/mypage/admin/AdminProductPage.jsx
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAdminProducts } from "../../../api/admin/adminProductApi";
import {
    Wrap, Inner, Content, TitleRow, Title, AddButton,
    Grid, Card, Badge, Thumb, CardBody, Name,
    Price, Actions, Pagination, PagerBtn, PageInfo, EmptyState,
} from "./adminProductPage.style";

export default function AdminProductPage() {
    const [list, setList] = useState([]); // 서버 데이터
    const [page, setPage] = useState(1);
    const pageSize = 9;
    const navigate = useNavigate();

    // API 연동
    useEffect(() => {
        const load = async () => {
            try {
                console.log("[ADMIN] 상품 목록 호출 시작");
                const data = await fetchAdminProducts(); // res.data가 그대로 들어옴
                console.log("[ADMIN] 원본 응답 data:", data);

                const items = Array.isArray(data)
                    ? data
                    : data?.data || data?.content || data?.result || [];

                console.log("[ADMIN] 파싱된 items:", items);
                setList(items);
            } catch (err) {
                console.error("[ADMIN] 상품 목록 불러오기 실패:", err);
                setList([]); // 실패 시 빈 배열
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

    const isEmpty = total === 0;

    return (
        <Wrap>
            <Inner>
                <Content>
                    <TitleRow>
                        <Title>등록된 상품</Title>
                        <AddButton
                            onClick={() =>
                                navigate("/mypage/admin/allproducts/new")
                            }
                        >
                            상품 등록
                        </AddButton>
                    </TitleRow>

                    {isEmpty ? (
                        // 🔹 상품이 없을 때
                        <EmptyState>
                            <h3>등록된 상품이 없습니다.</h3>
                            <p>
                                오른쪽 상단의 <strong>상품 등록</strong> 버튼을 눌러
                                첫 상품을 추가해 주세요.
                            </p>
                        </EmptyState>
                    ) : (
                        <>
                            <Grid>
                                {pageList.map((p) => (
                                    <Card key={p.productId}>
                                        {p.isNew && <Badge>신제품</Badge>}
                                        <Thumb>
                                            {p.imageUrl ? (
                                                <img src={p.imageUrl} alt={p.prdName} />
                                            ) : (
                                                "이미지"
                                            )}
                                        </Thumb>
                                        <CardBody>
                                            <Name>{p.prdName}</Name>
                                            <Price>₩{(p.price ?? 0).toLocaleString()}</Price>
                                            <Actions>
                                                <button
                                                    type="button"
                                                    title="수정"
                                                    onClick={() =>
                                                        navigate(
                                                            `/mypage/admin/allproducts/${p.productId}/edit`
                                                        )
                                                    }
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    type="button"
                                                    title="삭제"
                                                    onClick={() =>
                                                        navigate(
                                                            `/mypage/admin/allproducts/${p.productId}/delete`
                                                        )
                                                    }
                                                >
                                                    🗑️
                                                </button>
                                            </Actions>
                                        </CardBody>
                                    </Card>
                                ))}
                            </Grid>

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
                        </>
                    )}
                </Content>
            </Inner>
        </Wrap>
    );
}
