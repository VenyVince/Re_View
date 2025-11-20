import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Wrap, Inner, Title, Panel, Row, Label, Input,
    TextArea, ImageBox, UploadBtn, FooterRow, SubmitBtn, Helper
} from "./adminProductEdit.style";
import { updateProduct, fetchAdminProduct } from "../../../api/admin/adminProductApi";

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

// id -> 코드 역매핑(기존 상품의 baumann_id 코드 보여주기 위함)
const BAUMANN_CODE_BY_ID = Object.fromEntries(
    Object.entries(BAUMANN_ID_MAP).map(([code, id]) => [id, code])
);

export default function AdminProductEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        prd_name: "",
        ingredient: "",
        prd_brand: "",
        category: "",
        price: "",        // 문자열로 두고 submit 할 때 숫자로 변환
        stock: "",
        description: "",
        baumannType: "",

        product_images: [],   // 서버에서 내려온 이미지 URL 배열
        mainPreview: "",      // 대표 이미지 미리보기
        detailPreview: "",    // 상세 이미지 미리보기(일단 1장만)
        mainImage: null,      // 추후 업로드용 파일
        detailImage: null,
    });
    const [loading, setLoading] = useState(true);

    // 기존 데이터 가져오기
    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchAdminProduct(id);
                console.log("[EDIT] 기존 상품 데이터:", data);

                const images = data.product_images ?? [];
                const repImage = images[0] ?? "";
                const detailImage = images[1] ?? "";

                setForm((prev) => ({
                    ...prev,
                    prd_name: data.prd_name ?? "",
                    ingredient: data.ingredient ?? "",
                    prd_brand: data.prd_brand ?? "",
                    category: data.category ?? "",
                    price: data.price != null ? String(data.price) : "",
                    stock: data.stock != null ? String(data.stock) : "",
                    product_images: images,
                    mainPreview: repImage,
                    detailPreview: detailImage,
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

    // input 변경 공동 처리
    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // 이미지 선택(현재는 미리보기만, 업로드 연동은 나중에)
    const onPickImage = (key, previewKey) => (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        setForm((p) => ({ ...p, [key]: file, [previewKey]: url }));
    };

    // 제출
    const onSubmit = async (e) => {
        e.preventDefault();

        // Baumann 타입 변환
        const type = form.baumannType.trim().toUpperCase();
        let baumann_id = null;

        if (type) {
            baumann_id = BAUMANN_ID_MAP[type];
            if (!baumann_id) {
                alert(`'${type}' 은(는) 유효한 Baumann 타입이 아닙니다. 다시 확인해 주세요.`);
                return;
            }
        }

        try {
            const payload = {
                prd_name: form.prd_name.trim(),
                ingredient: form.ingredient.trim(),
                prd_brand: form.prd_brand.trim(),
                category: form.category.trim(),
                price: Number(form.price) || 0,
                stock: Number(form.stock) || 0,
                description: form.description.trim(),
                baumann_id, // 없으면 null
                // 이미지 쪽은 백엔드랑 멀티파트 협의되면 여기서 FormData로 다시 처리
            };

            console.log("[EDIT PAYLOAD]", payload);
            await updateProduct(id, payload);

            alert("상품이 수정되었습니다!");
            navigate("/admin/allproducts");
        } catch (error) {
            console.error(error);
            alert("상품 수정에 실패했습니다.");
        }
    };

    if(loading){
        return (
            <Wrap>
                <Inner>
                    <Title>상품 수정</Title>
                    <p>불러오는 중...</p>
                </Inner>
            </Wrap>
        )
    }

    return (
        <Wrap>
            <Inner>
                <Title>상품 수정</Title>
                <form onSubmit={onSubmit}>
                    <Panel>
                        <Row>
                            <Label>상품명</Label>
                            <Input  name="prd_name"
                                    value={form.prd_name}
                                    onChange={onChange}
                                    placeholder="상품명을 입력해주세요." />
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

                        <Row>
                            <Label>대표 사진</Label>
                            <ImageBox>
                                <div className="thumb">
                                    {form.mainPreview ? <img src={form.mainPreview} alt="대표 미리보기" /> : "이미지"}
                                </div>
                                <UploadBtn htmlFor="mainImg">대표 사진 첨부 +</UploadBtn>
                                <input id="mainImg" type="file" accept="image/*" onChange={onPickImage("mainImage","mainPreview")} />
                            </ImageBox>
                        </Row>

                        <Row>
                            <Label>상세 사진</Label>
                            <ImageBox>
                                <div className="thumb">
                                    {form.detailPreview ? <img src={form.detailPreview} alt="상세 미리보기" /> : "이미지"}
                                </div>
                                <UploadBtn htmlFor="detailImg">상세 사진 첨부 +</UploadBtn>
                                <input id="detailImg" type="file" accept="image/*" onChange={onPickImage("detailImage","detailPreview")} />
                            </ImageBox>
                        </Row>
                        <Row>
                            <Label>브랜드 / 카테고리</Label>
                            <div style={{ flex: 1, display: "flex", gap: "12px" }}>
                                <Input
                                    name="prd_brand"
                                    value={form.prd_brand}
                                    onChange={onChange}
                                    placeholder="브랜드명을 입력해주세요."
                                />
                                <Input
                                    name="category"
                                    value={form.category}
                                    onChange={onChange}
                                    placeholder="예) 크림, 토너, 세럼"
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
                                    placeholder="재고 수량"
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
                                    * Baumann 피부 타입 코드 (예: DRNT). 입력하면 자동으로 ID(baumann_id)로 변환됩니다.
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
