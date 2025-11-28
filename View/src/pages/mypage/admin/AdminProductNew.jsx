import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../../api/admin/adminProductApi"; // JSON 등록 API
import axiosClient from "../../../api/axiosClient"; // 이미지 업로드에 필요

import {
    Wrap, Title, Panel, Row, Cell, Label, Input, Textarea,
    UploadBox, Thumb, UploadBtn, Actions, Primary, Ghost
} from "./AdminProductNew.style";


// Baumann 코드 → ID 매핑표
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


export default function AdminProductNew() {
    const nav = useNavigate();

    // form 상태
    const [form, setForm] = useState({
        prdName: "",
        prdBrand: "",
        ingredient: "",
        description: "",
        price: "",
        category: "",
        stock: "",
        baumannType: "",
    });

    const onChange = (k) => (e) =>
        setForm((s) => ({ ...s, [k]: e.target.value }));


    // 이미지 선택 관련
    const [mainFile, setMainFile] = useState(null);
    const [mainPreview, setMainPreview] = useState(null);

    const [detailFiles, setDetailFiles] = useState([]);
    const [detailPreviews, setDetailPreviews] = useState([]);

    const mainRef = useRef(null);
    const detailRef = useRef(null);


    /** =========================
     *   대표 이미지 선택
     ==========================*/
    const onPickMain = () => mainRef.current?.click();

    const onMainChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setMainFile(file);

        // 기존 미리보기 URL revoke
        if (mainPreview) URL.revokeObjectURL(mainPreview);

        // 새 미리보기
        setMainPreview(URL.createObjectURL(file));

        e.target.value = "";
    };


    /** =========================
     *   상세 이미지 선택
     ==========================*/
    const onPickDetail = () => detailRef.current?.click();

    const onDetailChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        const key = (f) => `${f.name}-${f.size}-${f.lastModified}`;
        const existing = new Set(detailFiles.map(key));

        const filtered = files.filter((f) => !existing.has(key(f)));

        setDetailFiles((prev) => [...prev, ...filtered]);
        setDetailPreviews((prev) => [...prev, ...filtered.map((f) => URL.createObjectURL(f))]);

        e.target.value = "";
    };

    const removeDetail = (idx) => {
        setDetailFiles((prev) => prev.filter((_, i) => i !== idx));
        setDetailPreviews((prev) => {
            URL.revokeObjectURL(prev[idx]);
            return prev.filter((_, i) => i !== idx);
        });
    };


    /** =========================
     *   이미지 업로드 API 호출
     *   POST /api/images/products
     ==========================*/
    const uploadImages = async () => {
        const fd = new FormData();

        // 대표 이미지
        if (mainFile) fd.append("images", mainFile);

        // 상세 이미지들
        detailFiles.forEach((file) => fd.append("images", file));

        const res = await axiosClient.post("/api/images/products", fd);
        return res.data; // ["url1", "url2", ...]
    };


    /** =========================
     *   최종 상품 등록
     *   POST /api/admin/products (JSON)
     ==========================*/
    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            // 1) Baumann 타입 → ID
            const type = form.baumannType.trim().toUpperCase();
            const baumannId = BAUMANN_ID_MAP[type] ?? null;

            // 2) 이미지 업로드
            const imageUrls = await uploadImages(); // S3 URL 배열

            // 3) JSON DTO 구성
            const dto = {
               /* product_id: 0,
                prd_name: form.prdName.trim(),
                prd_brand: form.prdBrand.trim(),
                ingredient: form.ingredient.trim(),
                description: form.description.trim(),
                price: Number(form.price || 0),
                category: form.category.trim(),
                rating : 3.0,
                review_count: 0,
                is_sold_out: "N",
                stock: Number(form.stock || 0),
                baumann_id: baumannId,
                product_images: imageUrls,*/
                "product_images_list": [
                    "/uploads/products/33c01284-8085-4f34-83fe-9a5a0b38780a.jpg",
                    "/uploads/products/e7ac40e4-44b0-4d1b-90c2-7e4ec095afda.jpg"
                ],
                "product": {
                    product_id: 0,
                    prd_name: form.prdName.trim(),
                    prd_brand: form.prdBrand.trim(),
                    ingredient: form.ingredient.trim(),
                    price: Number(form.price || 0),
                    category: form.category.trim(),
                    stock: Number(form.stock || 0),
                    rating : 3.0,
                    description: form.description.trim(),
                    review_count: 0,
                    is_sold_out: "N",
                    baumann_id: baumannId,
                }
                ,
                "thumbnailUrl" : "/uploads/products/33c01284-8085-4f34-83fe-9a5a0b38780a.jpg"
            };

            // 4) 상품 등록(JSON)
            await createProduct(dto);

            alert("상품 등록 완료되었습니다.");
            nav("/admin/allproducts");

        } catch (err) {
            console.error("[상품 등록 오류]", err);
            alert("상품 등록에 실패했습니다.");
        }
    };


    return (
        <Wrap>
            <Title>상품 등록</Title>

            <form onSubmit={onSubmit}>
                <Panel>

                    {/* 상품명 */}
                    <Row>
                        <Cell>
                            <Label>상품명</Label>
                            <Input
                                placeholder="상품명을 입력해주세요."
                                value={form.prdName}
                                onChange={onChange("prdName")}
                            />
                        </Cell>
                    </Row>

                    {/* 성분 */}
                    <Row>
                        <Cell>
                            <Label>성분</Label>
                            <Textarea
                                placeholder="성분을 입력해주세요."
                                value={form.ingredient}
                                onChange={onChange("ingredient")}
                            />
                        </Cell>
                    </Row>

                    {/* 상세 설명 */}
                    <Row>
                        <Cell>
                            <Label>상세 설명</Label>
                            <Textarea
                                placeholder="상세 설명을 입력해주세요."
                                value={form.description}
                                onChange={onChange("description")}
                            />
                        </Cell>
                    </Row>

                    {/* 대표 이미지 */}
                    <Row>
                        <Cell>
                            <Label>대표 이미지</Label>
                            <UploadBox>
                                <Thumb>
                                    {mainPreview ? (
                                        <img src={mainPreview} alt="대표" style={{
                                            width: "100%", height: "100%", objectFit: "cover"
                                        }} />
                                    ) : "대표"}
                                </Thumb>
                                <UploadBtn type="button" onClick={onPickMain}>
                                    대표 사진 첨부 +
                                </UploadBtn>
                                <input
                                    type="file"
                                    ref={mainRef}
                                    hidden
                                    accept="image/*"
                                    onChange={onMainChange}
                                />
                            </UploadBox>
                        </Cell>
                    </Row>


                    {/* 상세 이미지 */}
                    <Row>
                        <Cell>
                            <Label>상세 이미지</Label>
                            <UploadBox>
                                <Thumb>
                                    {detailPreviews.length
                                        ? `${detailPreviews.length}장`
                                        : "상세"}
                                </Thumb>

                                <UploadBtn type="button" onClick={onPickDetail}>
                                    상세 사진 첨부 +
                                </UploadBtn>

                                <input
                                    type="file"
                                    ref={detailRef}
                                    hidden
                                    accept="image/*"
                                    multiple
                                    onChange={onDetailChange}
                                />
                            </UploadBox>

                            {detailPreviews.length > 0 && (
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(4, 1fr)",
                                        gap: 12,
                                        marginTop: 12,
                                    }}
                                >
                                    {detailPreviews.map((src, i) => (
                                        <div key={i} style={{ position: "relative" }}>
                                            <img
                                                src={src}
                                                style={{
                                                    width: "100%",
                                                    aspectRatio: "1/1",
                                                    borderRadius: 8,
                                                    objectFit: "cover",
                                                }}
                                            />

                                            <button
                                                type="button"
                                                onClick={() => removeDetail(i)}
                                                style={{
                                                    position: "absolute",
                                                    top: 6,
                                                    right: 6,
                                                    width: 24,
                                                    height: 24,
                                                    borderRadius: "50%",
                                                    border: "1px solid #ccc",
                                                    background: "#fff",
                                                }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Cell>
                    </Row>

                    {/* 브랜드 + 카테고리 */}
                    <Row>
                        <Cell>
                            <Label>브랜드</Label>
                            <Input
                                value={form.prdBrand}
                                onChange={onChange("prdBrand")}
                                placeholder="브랜드명을 입력해주세요."
                            />
                        </Cell>
                        <Cell>
                            <Label>카테고리</Label>
                            <Input
                                value={form.category}
                                onChange={onChange("category")}
                                placeholder="예) 크림, 세럼..."
                            />
                        </Cell>
                    </Row>

                    {/* 가격 + 재고 */}
                    <Row>
                        <Cell>
                            <Label>가격(원)</Label>
                            <Input
                                type="number"
                                value={form.price}
                                onChange={onChange("price")}
                                placeholder="0"
                            />
                        </Cell>
                        <Cell>
                            <Label>재고 수량</Label>
                            <Input
                                type="number"
                                value={form.stock}
                                onChange={onChange("stock")}
                                placeholder="0"
                            />
                        </Cell>
                    </Row>

                    {/* Baumann 타입 */}
                    <Row>
                        <Cell>
                            <Label>Baumann 타입</Label>
                            <Input
                                value={form.baumannType}
                                onChange={onChange("baumannType")}
                                placeholder="예) DRNT, DSPW, OSNT..."
                            />
                            <p style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>
                                * Baumann 피부 타입 코드 입력 시 ID로 자동 변환됩니다.
                            </p>
                        </Cell>
                    </Row>

                </Panel>

                <Actions>
                    <Ghost type="button" onClick={() => nav(-1)}>
                        취소
                    </Ghost>
                    <Primary type="submit">상품 등록</Primary>
                </Actions>

            </form>
        </Wrap>
    );
}
