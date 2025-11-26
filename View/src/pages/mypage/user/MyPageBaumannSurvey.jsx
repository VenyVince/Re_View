// src/pages/mypage/user/MyPageBaumannSurvey.jsx
import React, { useState } from "react";
import "./UserSkinTestPage.css";

/**
 * 마이페이지 전용 바우만 설문 컴포넌트
 *
 * props:
 *  - questions: [{ id, title, options: [{ value, label }] }, ...]
 *  - getBaumannType(answers): string (예: "DSNT")
 *  - onSurveyResult(typeCode): 마지막 문항까지 답했을 때 계산된 타입 콜백
 *  - onReset(): 설문 초기화 시 호출 (선택된 타입도 원래 값으로 복원하도록 외부에서 처리)
 */
export default function MyPageBaumannSurvey({
                                                questions,
                                                getBaumannType,
                                                onSurveyResult,
                                                onReset,
                                            }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    // answers: { [questionId]: choiceValue }
    const [answers, setAnswers] = useState({});

    const total = questions.length;
    const currentQuestion = questions[currentIndex];
    const isLast = currentIndex === total - 1;

    const handleChoice = (value) => {
        const qid = currentQuestion.id;
        const nextAnswers = { ...answers, [qid]: value };
        setAnswers(nextAnswers);

        if (isLast) {
            // 마지막 문항 선택 → 타입 계산 후 바로 상위로 전달
            if (typeof getBaumannType === "function") {
                const type = getBaumannType(nextAnswers);
                if (type && typeof onSurveyResult === "function") {
                    onSurveyResult(type);
                }
            }
        } else {
            setCurrentIndex((idx) => idx + 1);
        }
    };

    const handlePrev = () => {
        setCurrentIndex((idx) => Math.max(0, idx - 1));
    };

    const handleReset = () => {
        setAnswers({});
        setCurrentIndex(0);
        if (typeof onReset === "function") {
            onReset();
        }
    };

    const progressRatio = ((currentIndex + 1) / total) * 100;

    return (
        <div className="mp-baumann-wrap">
            {/* 상단 설명 + 진행률 */}
            <div className="mp-baumann-header">
                <p className="mp-baumann-desc">
                    문항에 하나씩 응답하면 바우만 타입을 자동으로 계산해 드립니다.
                </p>
                <div className="mp-baumann-progress-bar">
                    <div
                        className="mp-baumann-progress-fill"
                        style={{ width: `${progressRatio}%` }}
                    />
                </div>
                <div className="mp-baumann-progress-text">
                    {currentIndex + 1} / {total}
                </div>
            </div>

            {/* 현재 문항 */}
            <div className="mp-baumann-question-box">
                <div className="mp-baumann-question-label">
                    {currentQuestion.axisLabel}
                </div>
                <div className="mp-baumann-question-title">
                    {currentQuestion.title}
                </div>

                <div className="mp-baumann-options">
                    {currentQuestion.options.map((opt) => {
                        const isSelected =
                            answers[currentQuestion.id] &&
                            answers[currentQuestion.id] === opt.value;

                        return (
                            <button
                                key={opt.value}
                                type="button"
                                className={
                                    "mp-baumann-option-btn" +
                                    (isSelected ? " mp-baumann-option-btn--active" : "")
                                }
                                onClick={() => handleChoice(opt.value)}
                            >
                                {opt.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* 하단 버튼들 (왼쪽: 초기화 / 오른쪽: 이전, 다음) */}
            <div className="mp-baumann-footer">
                <button
                    type="button"
                    className="mp-baumann-reset-btn"
                    onClick={handleReset}
                >
                    초기화
                </button>

                <div className="mp-baumann-nav-group">
                    <button
                        type="button"
                        className="mp-baumann-nav-btn mp-baumann-nav-btn--ghost"
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                    >
                        이전
                    </button>

                    {!isLast && (
                        <button
                            type="button"
                            className="mp-baumann-nav-btn"
                            onClick={() => setCurrentIndex((idx) => Math.min(total - 1, idx + 1))}
                        >
                            다음
                        </button>
                    )}

                    {/* 마지막 문항에서는 “다음” 버튼이 없어도
              선택만 하면 바로 타입이 계산되므로 별도 완료 버튼이 필요 없음 */}
                </div>
            </div>
        </div>
    );
}