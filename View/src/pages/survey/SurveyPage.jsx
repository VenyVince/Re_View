// src/pages/survey/SurveyPage.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SECTIONS, QUESTION_COUNT, buildTallyFromSelections, selectionsToAnswerArray } from "./questions";
import { submitBaumannSurvey } from "../../api/survey/surveyApi";
import styles from "./SurveyPage.module.css";

// 간단한 바우만 코드 계산기
function computeBaumann(t) {
    const pick = (a, b, A, B) => (t[A] === t[B] ? A : (t[A] > t[B] ? A : B));
    // 동점이면 앞쪽 문자 선택(D,S,P,N) – 필요하면 타이브레이크 규칙 추가 가능
    const od = pick(t.O, t.D, "O", "D"); // O/D 중 하나 반환
    const sr = pick(t.S, t.R, "S", "R");
    const pw = pick(t.P, t.N, "P", "N");
    const nt = pick(t.W, t.T, "W", "T");
    return `${od}${sr}${pw}${nt}`;
}

export default function SurveyPage() {
    // selections: { [qid]: index(0~3) }
    const [selections, setSelections] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const { search } = useLocation();
    const answeredCount = Object.keys(selections).length;

    const progress = useMemo(
        () =>
            Math.round(
                (Math.min(answeredCount, QUESTION_COUNT) / QUESTION_COUNT) * 100
            ),
        [answeredCount]
    );
    const allAnswered = answeredCount === QUESTION_COUNT;

    const handleChange = (qid, idx) =>
        setSelections((prev) => ({ ...prev, [qid]: idx }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.keys(selections).length < QUESTION_COUNT) {
            alert("모든 문항에 응답해주세요.");
            return;
        }
        setSubmitting(true);

        // 1) 점수 → 타입 계산
        const tally = buildTallyFromSelections(selections);
        const type = computeBaumann(tally);

        // 2) 로컬 저장
        localStorage.setItem("surveyResult", JSON.stringify({ type, score: tally }));

        // 3) 서버 제출 (axios 연동)
        try {
            const userId = localStorage.getItem("userId") || "user123";
            const answers = selectionsToAnswerArray(selections); // [0,2,1,...]
            await submitBaumannSurvey({ userId, answers });
        } catch (err) {
            console.error(err);
            const st = err?.response?.status;
            if (st === 400) alert("빠뜨린 항목이 있습니다. 모든 항목에 체크해주세요.");
            else if (st === 401) alert("로그인이 필요합니다.");
            else alert("서버 오류입니다. 관리자에게 문의하세요.");
            setSubmitting(false);
            return;
        }

        // 4) 결과 페이지 이동
        const params = new URLSearchParams(search);
        const returnTo = params.get("return") || "/register";
        navigate(`/survey/result?return=${encodeURIComponent(returnTo)}`, {
            state: { type, score: tally, returnTo },
            replace: true,
        });
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>피부 타입 설문조사</h1>
            <p className={styles.progress}>진행도 {progress}%</p>

            <form onSubmit={handleSubmit}>
                {SECTIONS.map((sec) => (
                    <section key={sec.key} className={styles.section}>
                        <h2 className={styles.sectionTitle}>{sec.title}</h2>
                        <ol className={styles.list}>
                            {sec.questions.map((q, qi) => (
                                <li key={q.id} className={styles.listItem}>
                                    <div className={styles.question}>
                                        {qi + 1}. {q.text}
                                    </div>
                                    <div className={styles.options}>
                                        {q.options.map((opt, idx) => {
                                            const checked = selections[q.id] === idx;
                                            const inputId = `${q.id}-${idx}`;
                                            return (
                                                <label
                                                    key={idx}
                                                    htmlFor={inputId}
                                                    className={`${styles.optionLabel} ${checked ? styles.checked : ""}`}
                                                >
                                                    <input
                                                        id={inputId}
                                                        type="radio"
                                                        name={q.id}
                                                        value={idx}
                                                        checked={checked}
                                                        onChange={() => handleChange(q.id, idx)}
                                                        required={idx === 0} /* 그룹 필수 응답 */
                                                        style={{ marginTop: 3 }}
                                                    />
                                                    <span>{opt.label}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </section>
                ))}

                <div className={styles.btnRow}>
                    <button
                        type="submit"
                        disabled={submitting || !allAnswered}
                        className={`${styles.btnPrimary} ${submitting || !allAnswered ? styles.disabled : ""}`}
                    >
                        {submitting ? "제출 중..." : "결과 보기"}
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelections({})}
                        className={styles.btnGhost}
                    >
                        초기화
                    </button>
                </div>
            </form>
        </div>
    );
}