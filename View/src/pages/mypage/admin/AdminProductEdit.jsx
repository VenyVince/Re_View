import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Wrap, Inner, Title, Panel, Row, Label, Input,
    TextArea, ImageBox, UploadBtn, FooterRow, SubmitBtn, Helper
} from "./adminProductEdit.style";
import { updateProduct} from "../../../api/admin/adminProductApi";

export default function AdminProductEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        desc: "",
        mainImage: null,
        detailImage: null,
        mainPreview: "",
        detailPreview: "",
    });

    useEffect(() => {
        // TODO: 단일 상품 조회 API 생기면 여기서 불러오기
    }, [id]);

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const onPickImage = (key, previewKey) => (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        setForm((p) => ({ ...p, [key]: file, [previewKey]: url }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            // 1차 버전: 이름/설명만 수정한다고 가정
            await updateProduct(id, {
                prdName: form.name,
                description: form.desc,
                // 나머지 필드는 백엔드에서 기존 값 유지하거나 기본값 처리한다고 가정
            });

            alert("상품이 수정되었습니다!");
            navigate("/mypage/admin/allproducts");
        } catch (error) {
            console.error(error);
            alert("상품 수정에 실패했습니다.");
        }
    };

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
