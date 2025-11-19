import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Wrap, Inner, Title, Panel, Row, Label, Input,
    TextArea, ImageBox, UploadBtn, FooterRow, SubmitBtn, Helper
} from "./adminProductEdit.style";
import { updateProduct, fetchAdminProduct } from "../../../api/admin/adminProductApi";

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

    // 제출(이름/ 성분/ 브랜드/ 카테고리/ 가격/ 재고 수정)
    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            const payload = {
                prd_name: form.prd_name,
                ingredient: form.ingredient,
                prd_brand: form.prd_brand,
                category: form.category,
                price: Number(form.price) || 0,
                stock: Number(form.stock) || 0,
                // 이미지 쪽은 백엔드랑 멀티파트 협의되면 여기서 FormData로 다시 처리
            };

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
                            <Input name="name" value={form.name} onChange={onChange} placeholder="기존 상품명" />
                        </Row>

                        <Row>
                            <Label>상품 설명</Label>
                            <TextArea name="desc" value={form.desc} onChange={onChange} placeholder="상품 설명" />
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
