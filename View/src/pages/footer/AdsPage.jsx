import React, { useState } from "react";
import {
    Wrap, Section, Grid, Left, Title, Sub,
    Right, Form, Field, Label, Input, Textarea, ErrorText, SubmitBtn, SentMsg
} from "./AdsPage.styled";

export default function AdInquiryPage() {
    const [values, setValues] = useState({ name: "", email: "", message: "" });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [sent, setSent] = useState(false);

    const onChange = (e) => {
        const { name, value } = e.target;
        setValues((v) => ({ ...v, [name]: value }));
    };

    const validate = () => {
        const e = {};
        if (!values.name.trim()) e.name = "이름을 입력해주세요.";
        if (!values.email.trim()) e.email = "이메일을 입력해주세요.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
            e.email = "이메일 형식이 올바르지 않습니다.";
        if (!values.message.trim()) e.message = "문의 내용을 입력해주세요.";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const onSubmit = async (ev) => {
        ev.preventDefault();
        if (!validate()) return;

        try {
            setSubmitting(true);

            // TODO: 백엔드 연결 시 아래 주석 해제
            // import axios client from services folder and call:
            // await api.post("/ads/inquiries", values);

            // 임시 딜레이(UX용)
            await new Promise((r) => setTimeout(r, 600));

            setSent(true);
            setValues({ name: "", email: "", message: "" });
        } catch (err) {
            alert("전송에 실패했습니다. 잠시 후 다시 시도해주세요.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Wrap>
            <Section>
                <Grid>
                    <Left>
                        <Title>광고 제휴 문의</Title>
                        {!sent && (
                            <Sub>광고 제휴에 관한 문의는 아래 양식을 작성해주세요.</Sub>
                        )}
                    </Left>

                    <Right>
                        {sent ? (
                            <SentMsg role="status">문의가 접수되었습니다. 검토 후 메일로 연락 드리겠습니다.</SentMsg>
                        ) : (
                            <Form onSubmit={onSubmit} noValidate>
                                <Field>
                                    <Label htmlFor="name">이름</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="당신의 이름을 입력하세요."
                                        value={values.name}
                                        onChange={onChange}
                                        aria-invalid={!!errors.name}
                                        aria-describedby={errors.name ? "name-error" : undefined}
                                    />
                                    {errors.name && <ErrorText id="name-error">{errors.name}</ErrorText>}
                                </Field>

                                <Field>
                                    <Label htmlFor="email">이메일</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="이메일 주소를 입력하세요."
                                        value={values.email}
                                        onChange={onChange}
                                        aria-invalid={!!errors.email}
                                        aria-describedby={errors.email ? "email-error" : undefined}
                                    />
                                    {errors.email && <ErrorText id="email-error">{errors.email}</ErrorText>}
                                </Field>

                                <Field>
                                    <Label htmlFor="message">내용</Label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        placeholder="광고 내용을 입력하세요."
                                        rows={4}
                                        value={values.message}
                                        onChange={onChange}
                                        aria-invalid={!!errors.message}
                                        aria-describedby={errors.message ? "message-error" : undefined}
                                    />
                                    {errors.message && <ErrorText id="message-error">{errors.message}</ErrorText>}
                                </Field>

                                <SubmitBtn type="submit" disabled={submitting}>
                                    {submitting ? "전송 중…" : "문의하기"}
                                </SubmitBtn>
                            </Form>
                        )}
                    </Right>
                </Grid>
            </Section>
        </Wrap>
    );
}