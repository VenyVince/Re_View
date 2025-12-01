import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Wrap, Inner, Title, Panel, Row, Label, Input,
    TextArea, ImageBox, UploadBtn, FooterRow, SubmitBtn, Helper
} from "./adminProductEdit.style";
import { updateProduct, fetchAdminProduct, uploadProductImages } from "../../../api/admin/adminProductApi";

// 바우만 타입 코드
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

// 역매핑
const BAUMANN_CODE_BY_ID = Object.fromEntries(
    Object.entries(BAUMANN_ID_MAP).map(([code, id]) => [id, code])
);

export default function AdminProductEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [originalBaumannId, setOriginalBaumannId] = useState(null);

    const [form, setForm] = useState({
        prd_name: "",
        ingredient: "",
        prd_brand: "",
        category: "",
        price: "",
        stock: "",
        description: "",
        baumannType: "",

        product_images: [],
        mainPreview: "",
        detailPreview: "",
        mainImage: null,
        detailImage: null,
    });

    const [loading, setLoading] = useState(true);

    // 기존 데이터 가져오기
    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchAdminProduct(id);

                // 이미지 null-safe 처리
                const images = Array.isArray(data.product_images)
                    ? data.product_images
                    : [];

                // baumann_id 원본 저장
                setOriginalBaumannId(data.baumann_id);

                setForm((prev) => ({
                    ...prev,
                    prd_name: data.prd_name ?? "",
                    ingredient: data.ingredient ?? "",
                    prd_brand: data.prd_brand ?? "",
                    category: data.category ?? "",
                    price: String(data.price ?? ""),
                    stock: String(data.stock ?? ""),
                    description: data.description ?? "",
                    baumannType: BAUMANN_CODE_BY_ID[data.baumann_id] ?? "",
                    product_images: images,
                    mainPreview: images[0] ?? "",
                    detailPreview: images[1] ?? "",
                }));
            } catch (e) {
                console.error(e);
                alert("상품 정보를 불러오지 못했습니다.\n상품 ID: " + id);
                navigate("/admin/allproducts");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id, navigate]);

    // input 변경 처리
    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // 이미지 선택 미리보기
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

    // 제출
    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            let baumann_id = null;
            if (form.baumannType.trim()) {
                const type = form.baumannType.trim().toUpperCase();
                baumann_id = BAUMANN_ID_MAP[type];
                if (!baumann_id) {
                    alert("유효하지 않은 Baumann 코드입니다.");
                    return;
                }
            }

            // 기존이미지 유지 + 새 이미지 업로드 병합
            let finalImages = [...form.product_images];

            // 대표/상세 새 이미지 업로드한 경우
            if (form.mainImage || form.detailImage) {
                const uploaded = await uploadProductImages(
                    form.mainImage,
                    form.detailImage ? [form.detailImage] : []
                );

                // 반환 결과는 배열 → 그대로 덮어씀
                finalImages = uploaded;
            }

            if (finalImages.length === 0) {
                alert("상품 이미지는 최소 1개 이상이어야 합니다.");
                return;
            }

            // update payload 구성
            const payload = {
                prd_name: form.prd_name.trim(),
                ingredient: form.ingredient.trim(),
                prd_brand: form.prd_brand.trim(),
                category: form.category.trim(),
                price: Number(form.price) || 0,
                stock: Number(form.stock) || 0,
                description: form.description.trim(),
                baumann_id,
                is_sold_out: "N",

                // Oracle 체크 제약 조건 방지
                rating: 0,
                review_count: 0,

                // 항상 product_images 포함해야 함
                product_images: finalImages
            };

            console.log("[PATCH PAYLOAD]", payload);

            await updateProduct(id, payload);
            alert("상품이 성공적으로 수정되었습니다!");
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
                            <Label>상세 설명</Label>
                            <TextArea
                                name="description"
                                value={form.description}
                                onChange={onChange}
                                placeholder="상세 설명을 입력해주세요."
                            />
                        </Row>

                        {/* 대표 사진 */}
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

                        {/* 상세 사진 */}
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

                        {/* 브랜드/카테고리 */}
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

                        {/* 가격/재고 */}
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

                        {/* 바우만 타입 */}
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
