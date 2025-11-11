import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Wrap, Inner, Title, Panel, Row, Label, Input,
    TextArea, ImageBox, UploadBtn, FooterRow, SubmitBtn, Helper
} from "./adminProductEdit.style";

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
        // TODO: 실제 API 연결 시 fetch(`/api/admin/products/${id}`)
        setForm({
            name: "수분 크림",
            desc: "촉촉하고 산뜻한 크림입니다.",
        });
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

    const onSubmit = (e) => {
        e.preventDefault();
        alert("상품이 수정되었습니다!");
        navigate("/admin/products");
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
