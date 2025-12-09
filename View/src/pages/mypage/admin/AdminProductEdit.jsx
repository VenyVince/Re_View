import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Wrap, Inner, Title, Panel, Row, Label, Input,
    TextArea, ImageBox, UploadBtn, FooterRow, SubmitBtn, Helper
} from "./adminProductEdit.style";
import { updateProduct, fetchAdminProduct, updateProductImages } from "../../../api/admin/adminProductApi";

const BAUMANN_ID_MAP = {
    DSPW: 1, DSPT: 2, DSP_: 3, DSNW: 4, DSNT: 5, DSN_: 6, DS_W: 7, DS_T: 8, DS__: 9,
    DRPW: 10, DRPT: 11, DRP_: 12, DRNW: 13, DRNT: 14, DRN_: 15, DR_W: 16, DR_T: 17, DR__: 18,
    D_PW: 19, D_PT: 20, D_P_: 21, D_NW: 22, D_NT: 23, D_N_: 24, D__W: 25, D__T: 26, D___: 27,
    OSPW: 28, OSPT: 29, OSP_: 30, OSNW: 31, OSNT: 32, OSN_: 33, OS_W: 34, OS_T: 35, OS__: 36,
    ORPW: 37, ORPT: 38, ORP_: 39, ORNW: 40, ORNT: 41, ORN_: 42, OR_W: 43, OR_T: 44, OR__: 45,
    O_PW: 46, O_PT: 47, O_P_: 48, O_NW: 49, O_NT: 50, O_N_: 51, O__W: 52, O__T: 53, O___: 54,
    _SPW: 55, _SPT: 56, _SP_: 57, _SNW: 58, _SNT: 59, _SN_: 60, _S_W: 61, _S_T: 62, _S__: 63,
    _RPW: 64, _RPT: 65, _RP_: 66, _RNW: 67, _RNT: 68, _RN_: 69, _R_W: 70, _R_T: 71, _R__: 72,
    __PW: 73, __PT: 74, __P_: 75, __NW: 76, __NT: 77, __N_: 78, ___W: 79, ___T: 80, ____: 81,
};

const BAUMANN_CODE_BY_ID = Object.fromEntries(
    Object.entries(BAUMANN_ID_MAP).map(([code, id]) => [id, code])
);

export default function AdminProductEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [originalBaumannId, setOriginalBaumannId] = useState(null);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        prd_name: "",
        ingredient: "",
        prd_brand: "",
        category: "",
        price: "",
        stock: "",
        description: "",
        baumannType: "",
        mainPreview: "",
        detailPreview: "",
        mainImage: null,
        detailImage: null,
        rating: 0,
        review_count: 0,
        is_sold_out: 0
    });

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchAdminProduct(id);
                const { product, thumbnail_image, detail_image } = data;

                if (!product) {
                    throw new Error("No product data");
                }

                setOriginalBaumannId(product.baumann_id);

                setForm((prev) => ({
                    ...prev,
                    prd_name: product.prd_name ?? "",
                    ingredient: product.ingredient ?? "",
                    prd_brand: product.prd_brand ?? "",
                    category: product.category ?? "",
                    price: String(product.price ?? ""),
                    stock: String(product.stock ?? ""),
                    description: product.description ?? "",
                    baumannType: BAUMANN_CODE_BY_ID[product.baumann_id] ?? "",
                    rating: product.rating ?? 0,
                    review_count: product.review_count ?? 0,
                    is_sold_out: product.is_sold_out ?? 0,
                    mainPreview: thumbnail_image ?? "",
                    detailPreview: detail_image ?? "",
                    mainImage: null,
                    detailImage: null
                }));
            } catch (e) {
                console.error(e);
                alert("상품 정보를 불러오지 못했습니다.");
                navigate("/admin/allproducts");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id, navigate]);

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const onPickImage = (key, previewKey) => (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const url = URL.createObjectURL(file);

        setForm((prev) => ({
            ...prev,
            [key]: file,
            [previewKey]: url
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            let baumann_id = originalBaumannId;
            if (form.baumannType.trim()) {
                const type = form.baumannType.trim().toUpperCase();
                baumann_id = BAUMANN_ID_MAP[type];
                if (!baumann_id) {
                    alert("유효하지 않은 Baumann 코드입니다.");
                    return;
                }
            }

            if (form.mainImage || form.detailImage) {
                await updateProductImages(id, form.mainImage, form.detailImage);
            }

            const payload = {
                product: {
                    product_id: Number(id), // ID도 DTO 안에 포함
                    prd_name: form.prd_name,
                    prd_brand: form.prd_brand,
                    ingredient: form.ingredient,
                    category: form.category,
                    price: Number(form.price),
                    stock: Number(form.stock),
                    description: form.description,
                    baumann_id: baumann_id,
                    is_sold_out: form.is_sold_out ?? 0,
                    rating: form.rating ?? 0,
                    review_count: form.review_count ?? 0
                },
                thumbnail_image: form.mainPreview,
                detail_image: form.detailPreview
            };

            await updateProduct(id, payload);

            alert("상품이 성공적으로 수정되었습니다.");
            navigate("/admin/allproducts");
        } catch (err) {
            console.error(err);
            alert("상품 수정 중 오류가 발생했습니다.");
        }
    };

    if (loading) {
        return (
            <Wrap>
                <Inner>
                    <Title>상품 수정</Title>
                    <p>불러오는 중...</p>
                </Inner>
            </Wrap>
        );
    }

    return (
        <Wrap>
            <Inner>
                <Title>상품 수정</Title>
                <form onSubmit={onSubmit}>
                    <Panel>
                        <Row>
                            <Label>상품명</Label>
                            <Input
                                name="prd_name"
                                value={form.prd_name}
                                onChange={onChange}
                                placeholder="상품명을 입력해주세요."
                            />
                        </Row>
                        <Row>
                            <Label>성분</Label>
                            <TextArea
                                name="ingredient"
                                value={form.ingredient}
                                onChange={onChange}
                                placeholder="성분을 입력해주세요."
                            />
                        </Row>
                        <Row>
                            <Label>대표 사진</Label>
                            <ImageBox>
                                <div className="thumb">
                                    {form.mainPreview ? (
                                        <img src={form.mainPreview} alt="대표 미리보기" />
                                    ) : (
                                        "이미지"
                                    )}
                                </div>
                                <UploadBtn htmlFor="mainImg">대표 사진 첨부 +</UploadBtn>
                                <input
                                    id="mainImg"
                                    type="file"
                                    accept="image/*"
                                    onChange={onPickImage("mainImage", "mainPreview")}
                                />
                            </ImageBox>
                        </Row>
                        <Row>
                            <Label>상세 사진</Label>
                            <ImageBox>
                                <div className="thumb">
                                    {form.detailPreview ? (
                                        <img src={form.detailPreview} alt="상세 미리보기" />
                                    ) : (
                                        "이미지"
                                    )}
                                </div>
                                <UploadBtn htmlFor="detailImg">상세 사진 첨부 +</UploadBtn>
                                <input
                                    id="detailImg"
                                    type="file"
                                    accept="image/*"
                                    onChange={onPickImage("detailImage", "detailPreview")}
                                />
                            </ImageBox>
                        </Row>
                        <Row>
                            <Label>브랜드 / 카테고리</Label>
                            <div style={{ flex: 1, display: "flex", gap: "12px" }}>
                                <Input
                                    name="prd_brand"
                                    value={form.prd_brand}
                                    onChange={onChange}
                                    placeholder="브랜드명"
                                />
                                <Input
                                    name="category"
                                    value={form.category}
                                    onChange={onChange}
                                    placeholder="예: 크림, 토너"
                                />
                            </div>
                        </Row>
                        <Row>
                            <Label>가격 / 재고</Label>
                            <div style={{ flex: 1, display: "flex", gap: "12px" }}>
                                <Input
                                    type="number"
                                    min="0"
                                    name="price"
                                    value={form.price}
                                    onChange={onChange}
                                    placeholder="가격(원)"
                                />
                                <Input
                                    type="number"
                                    min="0"
                                    name="stock"
                                    value={form.stock}
                                    onChange={onChange}
                                    placeholder="재고"
                                />
                            </div>
                        </Row>
                        <Row>
                            <Label>Baumann 타입</Label>
                            <div style={{ flex: 1 }}>
                                <Input
                                    name="baumannType"
                                    value={form.baumannType}
                                    onChange={onChange}
                                    placeholder="예) DRNT, DSPW, OSNT ..."
                                />
                                <Helper>
                                    * Baumann 코드 입력 → 자동으로 baumann_id 변환됩니다.
                                </Helper>
                            </div>
                        </Row>
                    </Panel>
                    <FooterRow>
                        <SubmitBtn type="submit">상품 수정</SubmitBtn>
                    </FooterRow>
                    <Helper>* 저장 시 목록으로 이동합니다.</Helper>
                </form>
            </Inner>
        </Wrap>
    );
}