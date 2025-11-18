// src/pages/mypage/admin/AdminProductPage.jsx
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAdminProducts } from "../../../api/admin/adminProductApi";
import {
    Wrap, Inner, Content, TitleRow, Title, AddButton,
    Grid, Card, Badge, Thumb, CardBody, Name,
    Price, Actions, Pagination, PagerBtn, PageInfo, EmptyState,
} from "./adminProductPage.style";

// 상품 id 추출 핼퍼 함수
const getProductId = (p) =>
    p.productId ??
    p.product_id ??
    p.id ??
    p.prdId ??
    p.productno ??
    p.productNo;

export default function AdminProductPage() {
    const [list, setList] = useState([]);
    const [page, setPage] = useState(1);
    const pageSize = 21;
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            try {
                console.log("[ADMIN] 상품 목록 호출 시작");
                const data = await fetchAdminProducts();
                console.log("[ADMIN] 원본 응답 data:", data);

                const items = Array.isArray(data)
                    ? data
                    : data?.data || data?.content || data?.result || [];

                console.log("[ADMIN] 파싱된 items:", items);
                setList(items);
            } catch (err) {
                console.error("[ADMIN] 상품 목록 불러오기 실패:", err);
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

    const isEmpty = total === 0;

    return (
            <Wrap>
                <Inner>
                    <Content>
                        <TitleRow>
                            <Title>등록된 상품</Title>
                            <AddButton
                                onClick={() =>
                                    navigate("/admin/products/new")
                                }
                            >
                                상품 등록
                            </AddButton>

                        </TitleRow>

                        {isEmpty ? (
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
                                        <Card key={getProductId(p)}>
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
                                                    {/* 수정 버튼 */}
                                                    <button
                                                        type="button"
                                                        title="수정"
                                                        onClick={() => {
                                                            // 수정도 마찬가지로 같은 방식으로 ID 꺼내기
                                                            const pid =
                                                                p.productId ??
                                                                p.id ??
                                                                p.prdId ??
                                                                p.productno ??
                                                                p.productNo; // <- productno / productNo 둘 다 시도

                                                            console.log("[EDIT] 선택한 상품:", p, "ID:", pid);

                                                            if (!pid && pid !== 0) {
                                                                console.error("수정하려는 상품에 ID가 없습니다:", p);
                                                                alert("상품 ID가 없어 수정할 수 없습니다. 콘솔을 확인해 주세요.");
                                                                return;
                                                            }
                                                            navigate(`/admin/products/${pid}/edit`);
                                                        }}
                                                    >
                                                        ✏️
                                                    </button>

                                                    {/* 삭제 버튼 */}
                                                    <button
                                                        type="button"
                                                        title="삭제"
                                                        onClick={() => {
                                                            const pid =
                                                                p.productId ??
                                                                p.id ??
                                                                p.prdId ??
                                                                p.productno ??
                                                                p.productNo; // <- 여기!!

                                                            console.log("[DELETE] 선택한 상품:", p, "ID:", pid);

                                                            if (!pid && pid !== 0) {
                                                                console.error("삭제하려는 상품에 ID가 없습니다:", p);
                                                                alert("상품 ID가 없어 삭제할 수 없습니다. 콘솔을 확인해 주세요.");
                                                                return;
                                                            }
                                                            navigate(`/admin/products/${pid}/delete`);
                                                        }}
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
