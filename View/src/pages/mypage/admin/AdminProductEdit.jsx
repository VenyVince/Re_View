import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "api/axiosClient"; // axiosClient 임포트 추가
import {
    Wrap, Inner, Title, Panel, Row, Label, Input, Select,
    TextArea, ImageBox, UploadBtn, FooterRow, SubmitBtn, Helper
} from "./adminProductEdit.style";
import { updateProduct, fetchAdminProduct } from "../../../api/admin/adminProductApi";

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

const CATEGORY_OPTIONS = [
    "로션",
    "앰플",
    "토너",
    "크림",
    "클렌징",
];

const BAUMANN_CODE_BY_ID = Object.fromEntries(
    Object.entries(BAUMANN_ID_MAP).map(([code, id]) => [id, code])
);

/**
 * [추가/수정된 함수] 단일 파일을 Presigned URL로 업로드하고 Object Key를 반환합니다.
 * @param {File} file 업로드할 파일 객체
 * @returns {string | null} 업로드된 파일의 Object Key
 */
const uploadSingleImage = async (file) => {
    if (!file) return null;

    try {
        // 1. Presigned URL 발급 요청 (Body에 파일명 전송)
        // AdminProductNew.js와 동일한 /convert-data 엔드포인트 사용
        const res = await axiosClient.post(
            "/api/images/products/convert-data",
            { fileName: file.name }
        );

        const { objectKey, presignedUrl } = res.data;

        // 2. MinIO에 실제 파일 업로드 (PUT)
        const uploadRes = await fetch(presignedUrl, {
            method: "PUT",
            body: file,
            headers: { "Content-Type": file.type },
        });

        if (!uploadRes.ok) {
            throw new Error(`이미지 업로드 실패: ${file.name}`);
        }

        return objectKey;

    } catch (err) {
        console.error("Presigned URL 이미지 업로드 실패:", err);
        throw new Error("이미지 업로드 서버 요청에 실패했습니다.");
    }
};

export default function AdminProductEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [originalBaumannId, setOriginalBaumannId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false); // 전송 상태 추가

    const [form, setForm] = useState({
        prd_name: "",
        ingredient: "",
        prd_brand: "",
        category: "",
        price: "",
        stock: "",
        description: "",
        baumannType: "",
        mainPreview: "", // 기존 키(Key) 또는 임시 URL
        detailPreview: "", // 기존 키(Key) 또는 임시 URL
        mainImage: null, // 새 파일 객체
        detailImage: null, // 새 파일 객체
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
                    // 서버에서 받은 Object Key를 Preview로 설정 (Key가 URL 역할도 함)
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

        // URL.createObjectURL은 새 파일을 위한 임시 로컬 URL입니다.
        const url = URL.createObjectURL(file);

        setForm((prev) => ({
            ...prev,
            [key]: file, // 새 파일 객체 저장
            [previewKey]: url // 로컬 프리뷰 URL 저장 (기존 키를 덮어씀)
        }));
    };


    const onSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);

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

            // ==========================================================
            // [이미지 처리 로직]
            // 기본값: 기존 키/URL (form.mainPreview는 로드 시 Object Key를 가지고 있음)
            let finalThumbnailKey = form.mainPreview;
            let finalDetailKey = form.detailPreview;

            // 1. 대표 이미지 처리: 새 파일이 있다면 업로드하고 새 키를 받습니다.
            if (form.mainImage) {
                // uploadSingleImage는 업로드 후 Object Key를 반환합니다.
                finalThumbnailKey = await uploadSingleImage(form.mainImage);
            }

            // 2. 상세 이미지 처리: 새 파일이 있다면 업로드하고 새 키를 받습니다.
            if (form.detailImage) {
                finalDetailKey = await uploadSingleImage(form.detailImage);
            }
            // ==========================================================


            const payload = {
                product: {
                    product_id: Number(id),
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
                // DB에는 최종 Object Key를 전송합니다. (업로드된 새 키 또는 기존 키)
                thumbnail_image: finalThumbnailKey,
                detail_image: finalDetailKey
            };


            await updateProduct(id, payload);

            alert("상품이 성공적으로 수정되었습니다.");
            navigate("/admin/allproducts");
        } catch (err) {
            console.error(err);
            alert("상품 수정 중 오류가 발생했습니다. (이미지 업로드 실패 혹은 입력값 확인)");
        } finally {
            setIsSubmitting(false);
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
                                disabled={isSubmitting}
                            />
                        </Row>
                        <Row>
                            <Label>성분</Label>
                            <TextArea
                                name="ingredient"
                                value={form.ingredient}
                                onChange={onChange}
                                placeholder="성분을 입력해주세요."
                                disabled={isSubmitting}
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
                                <UploadBtn htmlFor="mainImg" disabled={isSubmitting}>대표 사진 첨부 +</UploadBtn>
                                <input
                                    id="mainImg"
                                    type="file"
                                    accept="image/*"
                                    onChange={onPickImage("mainImage", "mainPreview")}
                                    disabled={isSubmitting}
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
                                <UploadBtn htmlFor="detailImg" disabled={isSubmitting}>상세 사진 첨부 +</UploadBtn>
                                <input
                                    id="detailImg"
                                    type="file"
                                    accept="image/*"
                                    onChange={onPickImage("detailImage", "detailPreview")}
                                    disabled={isSubmitting}
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
                                    disabled={isSubmitting}
                                />
                                <Select
                                    name="category"
                                    value={form.category}
                                    onChange={onChange}
                                    disabled={isSubmitting}
                                >
                                    <option value="">선택하세요</option>
                                    {CATEGORY_OPTIONS.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </Select>
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
                                    disabled={isSubmitting}
                                />
                                <Input
                                    type="number"
                                    min="0"
                                    name="stock"
                                    value={form.stock}
                                    onChange={onChange}
                                    placeholder="재고"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </Row>
                        <Row>
                            <Label>Baumann 타입</Label>
                            <Select
                                name="baumannType"
                                value={form.baumannType}
                                onChange={onChange}
                                disabled={isSubmitting}
                            >
                                <option value="">선택하세요</option>
                                {Object.keys(BAUMANN_ID_MAP).map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </Select>
                        </Row>
                    </Panel>
                    <FooterRow>
                        <SubmitBtn type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "수정 중..." : "상품 수정"}
                        </SubmitBtn>
                    </FooterRow>
                    <Helper>* 저장 시 목록으로 이동합니다.</Helper>
                </form>
            </Inner>
        </Wrap>
    );
}