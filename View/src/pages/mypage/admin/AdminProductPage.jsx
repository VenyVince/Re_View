// src/pages/mypage/admin/AdminProductPage.jsx
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Wrap, Inner, Content, TitleRow, Title, AddButton,
    Grid, Card, Badge, Thumb, CardBody, Name,
    Price, Actions, Pagination, PagerBtn, PageInfo, EmptyState,
    SearchRow, SearchInput,
    DeleteOverlay, DeleteBox, DeleteButtons
} from "./adminProductPage.style";
import { fetchAdminProducts, deleteProduct } from "../../../api/admin/adminProductApi";

// 상품 id 추출
const getProductId = (p) =>
    p.product_id ??
    p.productId ??
    p.id ??
    p.prdId ??
    p.productno ??
    p.productNo;

// 상품명 추출 (실제 모든 경우 포함)
const getProductName = (p) =>
    p.prd_name ??
    p.product_name ??
    p.prdName ??
    p.productName ??
    p.name ??
    "";

// 썸네일 추출
const getThumbnail = (p) => {
    if (p.thumbnail_url) {
        return p.thumbnail_url;
    }
    return null;
};

export default function AdminProductPage() {
    const navigate = useNavigate();

    const [list, setList] = useState([]);
    const [page, setPage] = useState(1);
    const [keyword, setKeyword] = useState("");
    const [deleteTarget, setDeleteTarget] = useState(null);

    const pageSize = 21;

    // 상품 목록 불러오기
    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchAdminProducts();

                const items = Array.isArray(data)
                    ? data
                    : data?.data || data?.content || data?.result || [];

                setList(items);
            } catch (err) {
                console.error(err);
                setList([]);
            }
        };

        load();
    }, []);

    // 검색 필터 (회원관리 방식과 동일)
    const filteredList = useMemo(() => {
        if (!keyword.trim()) return list;

        const q = keyword.toLowerCase();
        return list.filter((item) =>
            getProductName(item).toLowerCase().includes(q)
        );
    }, [list, keyword]);

    // 페이지 계산
    const total = filteredList.length;
    const maxPage = Math.max(1, Math.ceil(total / pageSize));

    const pageList = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filteredList.slice(start, start + pageSize);
    }, [filteredList, page]);

    const isEmpty = total === 0;

    return (
        <Wrap>
            <Inner>
                <Content>

                    <TitleRow>
                        <Title>등록된 상품</Title>
                        <AddButton onClick={() => navigate("/admin/products/new")}>
                            상품 등록
                        </AddButton>
                    </TitleRow>

                    {/* 검색 */}
                    <SearchRow>
                        <SearchInput
                            placeholder="상품명 검색"
                            value={keyword}
                            onChange={(e) => {
                                setKeyword(e.target.value);
                                setPage(1);
                            }}
                        />
                    </SearchRow>

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
                                {pageList.map((p) => {
                                    const pid = getProductId(p);
                                    const name = getProductName(p);
                                    const thumb = getThumbnail(p);

                                    return (
                                        <Card key={pid ?? Math.random()}>
                                            {p.isNew && <Badge>신제품</Badge>}

                                            <Thumb>
                                                {thumb ? <img src={thumb} alt={name} /> : "이미지"}
                                            </Thumb>

                                            <CardBody>
                                                <Name>{name}</Name>
                                                <Price>₩{(p.price ?? 0).toLocaleString()}</Price>

                                                <Actions>
                                                    <button
                                                        type="button"
                                                        title="수정"
                                                        onClick={() =>
                                                            navigate(`/admin/products/${pid}/edit`)
                                                        }
                                                    >
                                                        ✏️
                                                    </button>

                                                    <button
                                                        type="button"
                                                        title="삭제"
                                                        onClick={() =>
                                                            setDeleteTarget({ id: pid, name })
                                                        }
                                                    >
                                                        🗑️
                                                    </button>
                                                </Actions>
                                            </CardBody>
                                        </Card>
                                    );
                                })}
                            </Grid>

                            <Pagination>
                                <PagerBtn
                                    disabled={page === 1}
                                    onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                                >
                                    {"<"}
                                </PagerBtn>

                                <PageInfo>{page} / {maxPage}</PageInfo>

                                <PagerBtn
                                    disabled={page === maxPage}
                                    onClick={() => setPage((prev) => Math.min(maxPage, prev + 1))}
                                >
                                    {">"}
                                </PagerBtn>
                            </Pagination>
                        </>
                    )}

                    {/* 삭제 모달 */}
                    {deleteTarget && (
                        <DeleteOverlay>
                            <DeleteBox>
                                <p style={{ fontSize: "18px", marginBottom: "16px" }}>
                                    <strong>{deleteTarget.id}</strong> 번 상품<br />
                                    <strong>“{deleteTarget.name}”</strong><br />
                                    을(를) 삭제하시겠습니까?
                                </p>

                                <DeleteButtons>
                                    <button
                                        type="button"
                                        className="cancel-btn"
                                        onClick={() => setDeleteTarget(null)}
                                    >
                                        취소
                                    </button>

                                    <button
                                        type="button"
                                        className="confirm-btn"
                                        onClick={async () => {
                                            try {
                                                await deleteProduct(deleteTarget.id);
                                                setList((prev) =>
                                                    prev.filter(
                                                        (item) => getProductId(item) !== deleteTarget.id
                                                    )
                                                );
                                                alert("상품이 삭제되었습니다.");
                                            } catch (e) {
                                                console.error(e);
                                                alert("상품 삭제 실패…!");
                                            } finally {
                                                setDeleteTarget(null);
                                            }
                                        }}
                                    >
                                        예
                                    </button>
                                </DeleteButtons>
                            </DeleteBox>
                        </DeleteOverlay>
                    )}

                </Content>
            </Inner>
        </Wrap>
    );
}
