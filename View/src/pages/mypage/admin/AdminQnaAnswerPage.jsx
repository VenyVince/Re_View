import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
    Wrap, Inner, Content, TitleRow, CenterTitle, BackButton,
    QuestionHeader, IconCircle, TextBlock, QuestionText, Meta,
    QuestionContent, AnswerBox, AnswerTitleInput, AnswerTextarea,
    AnswerButtonWrap, AnswerButton
} from "./adminQnaPage.style";

import { fetchQnaDetail, updateQnaAnswer } from "../../../api/admin/adminQnaApi";

export default function AdminQnaAnswerPage() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const stateData = location.state;

    const [question, setQuestion] = useState(
        stateData || {
            qna_id: id,
            title: "",
            content: "",
            user_name: "",
            answer: "",
        }
    );

    const [answerBody, setAnswerBody] = useState("");

    useEffect(() => {
        const load = async () => {
            if (stateData) {
                setQuestion(stateData);
                if (stateData.answer) setAnswerBody(stateData.answer);
                if (stateData.content) return;
            }

            try {
                const res = await fetchQnaDetail(id);
                setQuestion(res.data);
                if (res.data.answer) setAnswerBody(res.data.answer);
            } catch (e) {
                console.error("QnA 상세 조회 실패:", e);
            }
        };

        load();
    }, [id, stateData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await updateQnaAnswer(question.qna_id, answerBody);
            alert("답변이 등록되었습니다.");
            navigate("/admin/qna");
        } catch (e) {
            alert("답변 등록 실패!");
        }
    };

    return (
        <Wrap>
            <Inner>
                <Content>

                    <TitleRow>
                        <BackButton onClick={() => navigate(-1)}>← 뒤로가기</BackButton>
                        <CenterTitle>Q&A 관리</CenterTitle>
                    </TitleRow>

                    <QuestionHeader>
                        <IconCircle>?</IconCircle>
                        <TextBlock>
                            <QuestionText>{question.title}</QuestionText>
                            <Meta>상품번호: {question.product_id}</Meta>
                            <Meta>고객: {question.user_name}</Meta>
                            <Meta>
                                작성일: {question.created_at && question.created_at.slice(0, 16).replace("T", " ")}
                            </Meta>
                        </TextBlock>
                    </QuestionHeader>

                    <QuestionContent>{question.content}</QuestionContent>

                    <form onSubmit={handleSubmit}>
                        <AnswerBox>
                            <AnswerTitleInput placeholder="(선택) 답변 제목을 입력해주세요." />
                            <AnswerTextarea
                                placeholder="답변 내용을 입력해주세요."
                                value={answerBody}
                                onChange={(e) => setAnswerBody(e.target.value)}
                            />
                        </AnswerBox>

                        <AnswerButtonWrap>
                            <AnswerButton type="submit">답변등록</AnswerButton>
                        </AnswerButtonWrap>
                    </form>

                </Content>
            </Inner>
        </Wrap>
    );
}
