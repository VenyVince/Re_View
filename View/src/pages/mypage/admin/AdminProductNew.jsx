import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../../api/admin/adminProductApi";
import axiosClient from "api/axiosClient";

import {
    Wrap, Title, Panel, Row, Cell, Label, Input, Textarea,
    UploadBox, Thumb, UploadBtn, Actions, Primary, Ghost, Select
} from "./AdminProductNew.style";

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
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [form, setForm] = useState({
        prdName: "",
        prdBrand: "",
        ingredient: "",
        // description 제거됨
        price: "",
        category: "",
        stock: "",
        baumannType: "",
    });

    const onChange = (k) => (e) =>
        setForm((s) => ({ ...s, [k]: e.target.value }));

    // --- 이미지 상태 관리 (대표 1장 / 상세 1장) ---
    const [mainFile, setMainFile] = useState(null);
    const [mainPreview, setMainPreview] = useState(null);

    // 단일 파일로 관리
    const [detailFile, setDetailFile] = useState(null);
    const [detailPreview, setDetailPreview] = useState(null);

    const mainRef = useRef(null);
    const detailRef = useRef(null);

    // 대표 이미지 선택
    const onPickMain = () => mainRef.current?.click();
    const onMainChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setMainFile(file);
        if (mainPreview) URL.revokeObjectURL(mainPreview);
        setMainPreview(URL.createObjectURL(file));
        e.target.value = "";
    };

    // 상세 이미지 선택
    const onPickDetail = () => detailRef.current?.click();
    const onDetailChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setDetailFile(file);
        if (detailPreview) URL.revokeObjectURL(detailPreview);
        setDetailPreview(URL.createObjectURL(file));
        e.target.value = "";
    };

    /**
     * 이미지 업로드 로직
     */
    /**
     * 이미지 업로드 로직 (수정됨: 단일 API 호출 방식)
     */
    const uploadImages = async () => {
        let thumbnailKey = null;
        let detailKey = null;

        try {
            // 1. 대표 이미지 처리
            if (mainFile) {

                // 우선 convert-data에 파일명만 보내서 presigned URL과 objectKey 받기
                const res = await axiosClient.post(
                    "/api/images/products/convert-data",
                    { folder: "thumb", fileName: mainFile.name }
                );

                // dto 형식: { objectKey: string, presignedUrl: string }
                const { objectKey, presignedUrl } = res.data;

                // 받은 presigned URL로 실제 파일 업로드
                await fetch(presignedUrl, {
                    method: "PUT",
                    body: mainFile,
                    headers: { "Content-Type": mainFile.type },
                });

                // db 저장용 key 저장
                thumbnailKey = objectKey;
            }

            // 2. 상세 이미지 처리
            if (detailFile) {
                // 위와 동일
                const res = await axiosClient.post(
                    "/api/images/products/convert-data",
                    { folder: "desc", fileName: detailFile.name }
                );

                const { objectKey, presignedUrl } = res.data;

                await fetch(presignedUrl, {
                    method: "PUT",
                    body: detailFile,
                    headers: { "Content-Type": detailFile.type },
                });

                detailKey = objectKey;
            }

            return { thumbnailKey, detailKey };

        } catch (err) {
            console.error("[이미지 업로드 오류]", err);
            throw err;
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        if (!mainFile) {
            alert("대표 이미지는 필수입니다.");
            return;
        }
        if (!detailFile) {
            alert("상세 이미지는 필수입니다.");
            return;
        }

        setIsSubmitting(true);

        try {
            const type = form.baumannType.trim().toUpperCase();
            // baumann_id가 int형이므로, 매핑 안 되면 0(또는 기본값)으로 보내야 에러가 안남
            const baumannId = BAUMANN_ID_MAP[type] ?? 0;

            // 1. 이미지 업로드, key 받기
            const { thumbnailKey, detailKey } = await uploadImages();

            // 2. DTO 생성
            const dto = {
                product: {
                    product_id: 0, // 신규 등록이라 0
                    prd_name: form.prdName.trim(),
                    prd_brand: form.prdBrand.trim(),
                    ingredient: form.ingredient.trim(),
                    price: Number(form.price) || 0,
                    category: form.category.trim(),
                    stock: Number(form.stock) || 0,
                    rating: 3.0,
                    description: "",
                    review_count: 0,
                    baumann_id: baumannId,
                    is_sold_out: 0
                },
                // (Java: thumbnail_image)
                thumbnail_image: thumbnailKey,

                // (Java: detail_image)
                detail_image: detailKey
            };

            console.log("최종 전송 데이터:", dto); // 콘솔에서 확인 가능

            await createProduct(dto);

            alert("상품 등록 완료되었습니다.");
            nav("/admin/allproducts");

        } catch (err) {
            console.error("[상품 등록 오류]", err);
            alert("상품 등록에 실패했습니다. (입력값을 확인해주세요)");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Wrap>
            <Title>상품 등록</Title>
            <form onSubmit={onSubmit}>
                <Panel>
                    <Row>
                        <Cell>
                            <Label>상품명</Label>
                            <Input value={form.prdName} onChange={onChange("prdName")} />
                        </Cell>
                    </Row>
                    <Row>
                        <Cell>
                            <Label>성분</Label>
                            <Textarea value={form.ingredient} onChange={onChange("ingredient")} />
                        </Cell>
                    </Row>

                    {/* 상세 설명(Description) Row 삭제됨 */}

                    {/* 대표 이미지 섹션 */}
                    <Row>
                        <Cell>
                            <Label>대표 이미지 <span style={{color:'red', fontSize:'12px'}}>(필수)</span></Label>
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

                    {/* 상세 이미지 섹션 */}
                    <Row>
                        <Cell>
                            <Label>상세 이미지 <span style={{color:'red', fontSize:'12px'}}>(필수)</span></Label>
                            <UploadBox>
                                <Thumb>
                                    {detailPreview ? (
                                        <img src={detailPreview} alt="상세" style={{
                                            width: "100%", height: "100%", objectFit: "cover"
                                        }} />
                                    ) : "상세"}
                                </Thumb>
                                <UploadBtn type="button" onClick={onPickDetail}>
                                    상세 사진 첨부 +
                                </UploadBtn>
                                <input
                                    type="file"
                                    ref={detailRef}
                                    hidden
                                    accept="image/*"
                                    onChange={onDetailChange}
                                />
                            </UploadBox>
                        </Cell>
                    </Row>

                    <Row>
                        <Cell>
                            <Label>브랜드</Label>
                            <Input value={form.prdBrand} onChange={onChange("prdBrand")} />
                        </Cell>
                        <Cell>
                            <Label>카테고리</Label>
                            <Input value={form.category} onChange={onChange("category")} />
                        </Cell>
                    </Row>
                    <Row>
                        <Cell>
                            <Label>가격(원)</Label>
                            <Input type="number" value={form.price} onChange={onChange("price")} />
                        </Cell>
                        <Cell>
                            <Label>재고 수량</Label>
                            <Input type="number" value={form.stock} onChange={onChange("stock")} />
                        </Cell>
                    </Row>
                    <Row>
                        <Cell>
                            <Label>Baumann 타입</Label>
                            <Select value={form.baumannType} onChange={onChange("baumannType")}>
                                <option value="">선택하세요</option>
                                {Object.keys(BAUMANN_ID_MAP).map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </Select>
                        </Cell>
                    </Row>
                </Panel>
                <Actions>
                    <Ghost type="button" onClick={() => nav(-1)} disabled={isSubmitting}>
                        취소
                    </Ghost>
                    <Primary type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "등록 중..." : "상품 등록"}
                    </Primary>
                </Actions>
            </form>
        </Wrap>
    );
}