import React, { useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
    Wrap,
    Inner,
    Title,
    SectionTitle,
    QuestionHeader,
    IconCircle,
    TextBlock,
    QuestionText,
    Meta,
    AnswerBox,
    AnswerTitleInput,
    AnswerTextarea,
    AnswerButtonWrap,
    AnswerButton,
} from "./adminQnaPage.style";

export default function AdminQnaAnswerPage() {
    const { id } = useParams();
    const location = useLocation();
    const question = location.state || {
        id,
        question: "질문 내용을 불러올 수 없습니다.",
        customer: "",
    };

    const [answerTitle, setAnswerTitle] = useState("");
    const [answerBody, setAnswerBody] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        // TODO: 여기서 실제 API 호출로 답변 등록
        console.log("답변 등록", {
            questionId: question.id,
            title: answerTitle,
            content: answerBody,
        });

        alert("답변이 등록되었습니다. (지금은 콘솔로만 전송)");
    };

    return (
        <Wrap>
            <Inner>
                <Title>Q&A 관리</Title>
                <SectionTitle>질문 목록</SectionTitle>

                {/* 상단 선택된 질문 영역 */}
                <QuestionHeader>
                    <IconCircle>?</IconCircle>
                    <TextBlock>
                        <QuestionText>{question.question}</QuestionText>
                        {question.customer && <Meta>고객: {question.customer}</Meta>}
                    </TextBlock>
                </QuestionHeader>

                {/* 답변 작성 박스 */}
                <form onSubmit={handleSubmit}>
                    <AnswerBox>
                        <AnswerTitleInput
                            placeholder="제목을 입력해주세요."
                            value={answerTitle}
                            onChange={(e) => setAnswerTitle(e.target.value)}
                        />
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
            </Inner>
        </Wrap>
    );
}
