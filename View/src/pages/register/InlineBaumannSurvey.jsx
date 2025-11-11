// src/pages/register/InlineBaumannSurvey.jsx
import React, { useMemo, useState } from 'react';
import {
    SECTIONS,
    QUESTION_COUNT,
    buildTallyFromSelections,
} from '../survey/questions';

/** 바우만 코드 계산기 (SurveyPage랑 동일 로직) */
function computeBaumann(tally) {
    const pick = (a, b, A, B) => (tally[A] === tally[B] ? A : tally[A] > tally[B] ? A : B);
    const od = pick(tally.O, tally.D, 'O', 'D');
    const sr = pick(tally.S, tally.R, 'S', 'R');
    const pw = pick(tally.P, tally.N, 'P', 'N');
    const wt = pick(tally.W, tally.T, 'W', 'T');
    return `${od}${sr}${pw}${wt}`;
}

export default function InlineBaumannSurvey({ onComplete, onCancel }) {
    const [selections, setSelections] = useState({});
    const [index, setIndex] = useState(0);

    const flatQuestions = useMemo(
        () =>
            SECTIONS.flatMap(sec =>
                sec.questions.map(q => ({
                    ...q,
                    sectionTitle: sec.title,
                }))
            ),
        []
    );

    const total = QUESTION_COUNT;
    const current = flatQuestions[index];
    const progress = Math.round(((index + 1) / total) * 100);

    const handleSelect = idx => {
        const nextSel = { ...selections, [current.id]: idx };
        setSelections(nextSel);

        if (index < total - 1) {
            setIndex(i => i + 1);
        } else {
            const tally = buildTallyFromSelections(nextSel);
            const type = computeBaumann(tally);

            localStorage.setItem('surveyResult', JSON.stringify({ type, score: tally }));

            if (onComplete) onComplete(type);
        }
    };

    const handlePrev = () => {
        if (index === 0) return;
        setIndex(i => i - 1);
    };

    if (!current) return null;

    return (
        <div className="inline-survey">
            <div className="inline-survey-header">
                <h3 className="inline-survey-title">피부 타입 설문조사</h3>
                <p className="inline-survey-caption">
                    문항에 하나씩 응답하면 바우만 타입을 자동으로 계산해 드립니다.
                </p>
            </div>

            <div className="inline-survey-progress">
                <span className="inline-survey-step">
                    {index + 1} / {total}
                </span>
                <div className="inline-survey-bar">
                    <div
                        className="inline-survey-bar-fill"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="inline-survey-body">
                <div className="inline-survey-section">{current.sectionTitle}</div>
                <div className="inline-survey-question">{current.text}</div>

                <div className="inline-survey-options">
                    {current.options.map((opt, idx) => {
                        const checked = selections[current.id] === idx;
                        return (
                            <button
                                key={idx}
                                type="button"
                                className={
                                    'inline-survey-option' +
                                    (checked ? ' inline-survey-option--active' : '')
                                }
                                onClick={() => handleSelect(idx)}
                            >
                                {opt.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="inline-survey-footer">
                <button
                    type="button"
                    className="inline-survey-nav inline-survey-nav-prev"
                    onClick={handlePrev}
                    disabled={index === 0}
                >
                    이전
                </button>
                <button
                    type="button"
                    className="inline-survey-nav inline-survey-nav-cancel"
                    onClick={onCancel}
                >
                    닫기
                </button>
            </div>
        </div>
    );
}