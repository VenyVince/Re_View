import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../../api/admin/adminProductApi";
import {
    Wrap, Title, Panel, Row, Cell, Label, Input, Textarea,
    UploadBox, Thumb, UploadBtn, Actions, Primary, Ghost
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
    const [form, setForm] = useState({
        prdName: "", prdBrand: "", ingredient: "", description: "",
        price: "", category: "", stock: "", baumannType: "",
    });
    const nav = useNavigate();
    const onChange = k => e => setForm(s => ({ ...s, [k]: e.target.value }));

    const onSubmit = async (e) => {
        e.preventDefault();

        const type = form.baumannType.trim().toUpperCase(); // 소문자로 써도 처리 됨

        let baumannId = null;
        if (type) {
            baumannId = BAUMANN_ID_MAP[type];
            if (!baumannId) {
                alert(`'${type}' 은(는) 유효한 Baumann 타입이 아닙니다. 다시 확인해 주세요.`);
                return;
            }
        }

        const payload = {
            prd_name: form.prdName.trim(),
            prd_brand: form.prdBrand.trim(),
            ingredient: form.ingredient.trim(),
            description: form.description.trim(),
            price: Number(form.price || 0),
            category: form.category.trim(),
            stock: Number(form.stock || 0),
            baumann_id: baumannId ?? null,
        };

        console.log("[CREATE PAYLOAD]", payload);

        try {
            await createProduct(payload);
            alert("상품이 등록되었습니다.");
            nav("/admin/allproducts");
        } catch (error) {
            console.error(error);
            alert("상품 등록에 실패했습니다.");
        }
    };

    // 파일 업로드 상태/참조 추가
    const [mainFile, setMainFile] = useState(null);
    const [detailFiles, setDetailFiles] = useState([]);
    const [mainPreview, setMainPreview] = useState(null);
    const [detailPreviews, setDetailPreviews] = useState([]);

    const mainRef = useRef(null);
    const detailRef = useRef(null);

    const onPickMain = () => mainRef.current?.click();
    const onPickDetail = () => detailRef.current?.click();

    const onMainChange = (e) => {
        const f = e.target.files?.[0];
        if (!f) return;

        setMainFile(f);
        setMainPreview((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return URL.createObjectURL(f);
        });

        e.target.value = "";
    };

    const onDetailChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        // 중복 방지 (파일명+크기+수정시간 기준)
        const key = (f) => `${f.name}-${f.size}-${f.lastModified}`;

        setDetailFiles((prev) => {
            const existing = new Set(prev.map(key));
            const next = [...prev, ...files.filter((f) => !existing.has(key(f)))];
            return next;
        });

        setDetailPreviews((prev) => [
            ...prev,
            ...files.map((f) => URL.createObjectURL(f)),
        ]);

        // 같은 파일을 다시 선택해도 onChange가 동작하도록 초기화
        e.target.value = "";
    };

    const removeDetail = (idx) => {
        setDetailFiles((prev) => prev.filter((_, i) => i !== idx));
        setDetailPreviews((prev) => {
            URL.revokeObjectURL(prev[idx]);
            return prev.filter((_, i) => i !== idx);
        });
    };

    return (
        <Wrap>
            <Title>상품 등록</Title>
            <form onSubmit={onSubmit}>
                <Panel>
                    <Row>
                        <Cell>
                            <Label>상품명</Label>
                            <Input placeholder="상품명을 입력해주세요." value={form.prdName} onChange={onChange("prdName")} />
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

                    {/* ✅ 상세 설명 */}
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

                    <Row>
                        <Cell>
                            <Label>대표 이미지</Label>
                            <UploadBox>
                                <Thumb>
                                    {mainPreview ? (
                                        <img
                                            src={mainPreview}
                                            alt="대표 미리보기"
                                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        />
                                    ) : (
                                        "대표"
                                    )}
                                </Thumb>
                                <UploadBtn type="button" onClick={onPickMain}>
                                    대표 사진 첨부 +
                                </UploadBtn>
                                <input
                                    ref={mainRef}
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={onMainChange}
                                />
                            </UploadBox>
                        </Cell>
                    </Row>

                    <Row>
                        <Cell>
                            <Label>상세 이미지</Label>
                            <UploadBox>
                                <Thumb>{detailPreviews.length ? `${detailPreviews.length}장` : "상세"}</Thumb>

                                <UploadBtn type="button" onClick={onPickDetail}>
                                    상세 사진 첨부 +
                                </UploadBtn>

                                {/* 파일 선택창 (다중 선택) */}
                                <input
                                    ref={detailRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    hidden
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
                                                alt={`상세${i + 1}`}
                                                style={{
                                                    width: "100%",
                                                    aspectRatio: "1 / 1",
                                                    objectFit: "cover",
                                                    borderRadius: 8,
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
                                                    border: "1px solid #ddd",
                                                    background: "#fff",
                                                    cursor: "pointer",
                                                }}
                                                title="삭제"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Cell>
                    </Row>

                    <Row>
                        <Cell>
                            <Label>브랜드</Label>
                            <Input placeholder="브랜드명을 입력해주세요."
                                   value={form.prdBrand} onChange={onChange("prdBrand")} />
                        </Cell>
                        <Cell>
                            <Label>카테고리</Label>
                            <Input placeholder="예) 크림, 토너, 세럼"
                                   value={form.category} onChange={onChange("category")} />
                        </Cell>
                    </Row>

                    <Row>
                        <Cell>
                            <Label>가격(원)</Label>
                            <Input type="number" min="0" placeholder="0"
                                   value={form.price} onChange={onChange("price")} />
                        </Cell>
                        <Cell>
                            <Label>재고 수량</Label>
                            <Input type="number" min="0" placeholder="0"
                                   value={form.stock} onChange={onChange("stock")} />
                        </Cell>
                    </Row>

                    {/* ✅ Baumann 타입 */}
                    <Row>
                        <Cell>
                            <Label>Baumann 타입</Label>
                            <Input
                                placeholder="예) DRNT, DSPW, OSNT ..."
                                value={form.baumannType}
                                onChange={onChange("baumannType")}
                            />
                            <p
                                style={{
                                    marginTop: 8,
                                    fontSize: 12,
                                    color: "#6b7280",
                                }}
                            >
                                * Baumann 피부 타입 코드 (예: DRNT). 입력하면 자동으로 ID로 변환됩니다.
                            </p>
                        </Cell>
                    </Row>

                </Panel>

                <Actions>
                    <Ghost type="button" onClick={() => nav(-1)}>취소</Ghost>
                    <Primary type="submit">상품 등록</Primary>
                </Actions>
            </form>
        </Wrap>
    );
}
