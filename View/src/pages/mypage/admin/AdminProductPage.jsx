// src/pages/mypage/admin/AdminProductPage.jsx
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Wrap, Inner, Content, TitleRow, Title, AddButton,
    Grid, Card, Badge, Thumb, CardBody, Name,
    Price, Actions, Pagination, PagerBtn, PageInfo, EmptyState,
} from "./adminProductPage.style";
import { fetchAdminProducts, deleteProduct } from "../../../api/admin/adminProductApi";

// 상품 id 추출 헬퍼 함수
const getProductId = (p) =>
    p.product_id ??
    p.productId ??
    p.id ??
    p.prdId ??
    p.productno ??
    p.productNo;

// 상품명/썸네일 안전하게 꺼내는 헬퍼
const getProductName = (p) =>
    p.prd_name ?? p.prdName ?? p.productName ?? "이름 없는 상품";

const getThumbnail = (p) => {
    // 새 DTO: List<String> product_images
    if (Array.isArray(p.product_images) && p.product_images.length > 0) {
        return p.product_images[0]; // 첫 번째 이미지를 썸네일로 사용
    }
    // 예전 필드가 남아있을 수도 있으니 백업용
    if (p.imageUrl) return p.imageUrl;
    return null;
};

export default function AdminProductPage() {
    const [list, setList] = useState([]);
    const [page, setPage] = useState(1);
    const pageSize = 21;
    const navigate = useNavigate();

    const [deleteTarget, setDeleteTarget] = useState(null); // { id, name } or null

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
                                {pageList.map((p) => {
                                    const pid = getProductId(p);
                                    const name = getProductName(p);
                                    const thumb = getThumbnail(p);

                                    return (
                                        <Card key={pid ?? Math.random()}>
                                            {p.isNew && <Badge>신제품</Badge>}
                                            <Thumb>
                                                {thumb ? (
                                                    <img src={thumb} alt={name} />
                                                ) : (
                                                    "이미지"
                                                )}
                                            </Thumb>
                                            <CardBody>
                                                <Name>{name}</Name>
                                                <Price>₩{(p.price ?? 0).toLocaleString()}</Price>
                                                <Actions>
                                                    {/* 수정 버튼 */}
                                                    <button
                                                        type="button"
                                                        title="수정"
                                                        onClick={() => {
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
                                                        onClick={async () => {
                                                            console.log("[DELETE] 선택한 상품:", p, "ID:", pid);

                                                            if (!pid && pid !== 0) {
                                                                console.error("삭제하려는 상품에 ID가 없습니다:", p);
                                                                alert("상품 ID가 없어 삭제할 수 없습니다. 콘솔을 확인해 주세요.");
                                                                return;
                                                            }

                                                            setDeleteTarget({
                                                                id: pid,
                                                                name,
                                                            });
                                                        }}
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
                    {deleteTarget && (
                        <div
                        style={{
                            position: "fixed",
                            inset: 0,
                            background: "rgba(0,0,0,0.4)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            zIndex: 9999,
                        }}>
                            <div
                                style={{
                                    background: "#fff",
                                    padding: "32px 40px",
                                    borderRadius: "16px",
                                    minWidth: "320px",
                                    textAlign: "center",
                                }}
                            >
                                <p style={{ fontSize: "18px", marginBottom: "16px" }}>
                                    <strong>{deleteTarget.id}</strong> 번 상품
                                    <br />
                                    <strong>“{deleteTarget.name}”</strong>
                                    <br />
                                    을(를) 삭제하시겠습니까?
                                </p>

                                <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "8px" }}>
                                    <button
                                        type="button"
                                        onClick={()=>setDeleteTarget(null)}
                                        style={{
                                            padding: "8px 16px",
                                            borderRadius: "999px",
                                            border: "1px solid #ccc",
                                            background: "#fff",
                                            cursor: "pointer",
                                        }}
                                    >
                                        취소
                                    </button>
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            try {
                                                await deleteProduct(deleteTarget.id); // 🔥 실제 삭제
                                                setList(prev =>
                                                    prev.filter(item => getProductId(item) !== deleteTarget.id)
                                                );
                                                alert("상품이 삭제되었습니다.");
                                            } catch (e) {
                                                console.error(e);
                                                alert("상품 삭제 실패…!");
                                            } finally {
                                                setDeleteTarget(null); // 모달 닫기
                                            }
                                        }}
                                        style={{
                                            padding: "8px 24px",
                                            borderRadius: "999px",
                                            border: "none",
                                            background: "#000",
                                            color: "#fff",
                                            cursor: "pointer",
                                        }}>
                                        예
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </Content>
            </Inner>
        </Wrap>
    );
}
