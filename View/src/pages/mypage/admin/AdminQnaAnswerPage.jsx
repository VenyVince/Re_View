import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
    Wrap, Inner, Title, SectionTitle, QuestionHeader, IconCircle,
    TextBlock, QuestionText, Meta, AnswerBox, AnswerTitleInput, AnswerTextarea,
    AnswerButtonWrap, AnswerButton,} from "./adminQnaPage.style";
import {fetchQnaDetail, updateQnaAnswer,} from "../../../api/admin/adminQnaApi";

export default function AdminQnaAnswerPage() {
    const { id } = useParams(); // URL의 qnaId
    const location = useLocation();
    const navigate = useNavigate();

    // 목록에서 넘어올 때 넘겨준 state (없을 수도 있음)
    const stateQuestion = location.state;

    const [question, setQuestion] = useState(
        stateQuestion || {
            qnaId: id,
            title: "질문 내용을 불러올 수 없습니다.",
            content: "",
            username: "",
        }
    );

    const [answerTitle, setAnswerTitle] = useState("");
    const [answerBody, setAnswerBody] = useState("");

    // 🔹 location.state가 없으면 백엔드에서 상세 조회
    useEffect(() => {
        const loadDetail = async () => {
            if (stateQuestion) return; // 이미 있으면 스킵

            try {
                const res = await fetchQnaDetail(id);
                setQuestion(res.data);
            } catch (error) {
                console.error("[ADMIN] QnA 상세 조회 실패:", error);
            }
        };

        loadDetail();
    }, [id, stateQuestion]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 백엔드 스펙: PATCH /api/admin/qna/{qnaId}/answer
        // body: { "adminAnswer": "답변 내용" }
        const qnaId = question.qnaId || id;

        try {
            await updateQnaAnswer(qnaId, answerBody);
            alert("답변이 등록되었습니다.");
            navigate("/admin/qna"); // QnA 목록으로 이동
        } catch (error) {
            console.error("[ADMIN] QnA 답변 등록 실패:", error);
            alert("답변 등록에 실패했습니다.");
        }
    };

    return (
        <Wrap>
            <Inner>
                <Title>Q&A 관리</Title>
                <SectionTitle>질문 상세 / 답변 작성</SectionTitle>

                {/* 상단 질문 영역 */}
                <QuestionHeader>
                    <IconCircle>?</IconCircle>
                    <TextBlock>
                        <QuestionText>
                            {/* 제목이 있으면 제목, 없으면 내용 한 줄 */}
                            {question.title || question.content || "질문 내용을 불러올 수 없습니다."}
                        </QuestionText>
                        {question.username && <Meta>고객: {question.username}</Meta>}
                    </TextBlock>
                </QuestionHeader>

                {/* 답변 작성 박스 */}
                <form onSubmit={handleSubmit}>
                    <AnswerBox>
                        <AnswerTitleInput
                            placeholder="(선택) 답변 제목을 입력해주세요."
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
