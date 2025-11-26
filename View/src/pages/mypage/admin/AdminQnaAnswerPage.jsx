import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
    Wrap, Inner, Title, QuestionHeader, IconCircle,
    TextBlock, QuestionText, Meta, AnswerBox, AnswerTitleInput, AnswerTextarea,
    AnswerButtonWrap, AnswerButton,QuestionContent} from "./adminQnaPage.style";
import {fetchQnaDetail, updateQnaAnswer,} from "../../../api/admin/adminQnaApi";

export default function AdminQnaAnswerPage() {
    const { id } = useParams(); // URL의 qnaId
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

    const [answerTitle, setAnswerTitle] = useState("");
    const [answerBody, setAnswerBody] = useState("");

    // 상세 데이터 로딩
    useEffect(() => {
        const loadDetail = async () => {
            if (stateData) {
                setQuestion(stateData);

                if (stateData.answer) {
                    setAnswerBody(stateData.answer);
                }

                // stateData에는 title/user_name만 있고 content는 없음
                // content 없으면 detail API 호출 계속 진행
                if (stateData.content) {
                    return;        // content 있으면 API 안 불러도 됨
                }
            }

            try {
                const res = await fetchQnaDetail(id);
                console.log("QNA 상세:", res.data);
                console.log("상세 조회 데이터 키들:", Object.keys(res.data));
                const q = res.data;

                setQuestion(q);

                // 기존 답변 세팅
                if (q.answer) {
                    setAnswerBody(q.answer);
                }

            } catch (error) {
                console.error("[ADMIN] QnA 상세 조회 실패:", error);
            }
        };

        loadDetail();
    }, [id, stateData]);

    // 답변 등록/수정
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await updateQnaAnswer(question.qna_id, answerBody);
            alert("답변이 등록되었습니다.");
            navigate("/admin/qna");
        } catch (error) {
            console.error("[ADMIN] 답변 등록 실패:", error);
            alert("답변 등록에 실패했습니다.");
        }
    };

    return (
        <Wrap>
            <Inner>
                <Title>Q&A 관리</Title>

                {/* 상단 질문 영역 */}
                <QuestionHeader>
                    <IconCircle>?</IconCircle>
                    <TextBlock>
                        <QuestionText>{question.title}</QuestionText>
                        <Meta>상품번호: {question.product_id}</Meta>
                        <Meta>고객: {question.user_name}</Meta>
                        <Meta style={{ marginTop: "6px" }}>
                            작성일: {question.created_at}
                        </Meta>
                    </TextBlock>
                </QuestionHeader>

                <QuestionContent>
                    {question.content}
                </QuestionContent>

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
