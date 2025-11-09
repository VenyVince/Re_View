// src/pages/survey/SurveyPage.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { SECTIONS, QUESTION_COUNT, buildTallyFromSelections, selectionsToAnswerArray } from "./questions";

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

// 서버 POST 호출 – 아직 백엔드 없으면 주석 유지
// import { submitBaumann } from "../../api/survey";

export default function SurveyPage() {
    // selections: { [qid]: index(0~3) }
    const [selections, setSelections] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const { search } = useLocation();

    const progress = useMemo(
        () => Math.round((Object.keys(selections).length / QUESTION_COUNT) * 100),
        [selections]
    );

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

        // 3) 서버 제출
        // try {
        //   const userId = localStorage.getItem("userId");
        //   const answers = selectionsToAnswerArray(selections); // [0,2,1,...]
        //   await submitBaumann({ userId, answers });
        // } catch (e) {
        //   console.error(e);
        // }

        // 4) 돌아가기 (기본 /register)
        const params = new URLSearchParams(search);
        const returnTo = params.get("return") || "/register";
        navigate(`/survey/result?return=${encodeURIComponent(returnTo)}`, {
            state: {type, score: tally, returnTo},
            replace: true,
        });
    };

    return (
        <div style={{ maxWidth: 1024, margin: "40px auto", padding: "0 24px" }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, textAlign: "center" }}>피부 타입 설문조사</h1>
            <p style={{ color: "#666", textAlign: "center" }}>진행도 {progress}%</p>

            <form onSubmit={handleSubmit}>
                {SECTIONS.map((sec) => (
                    <section key={sec.key} style={{ background: "#fafafa", border: "1px solid #eee", borderRadius: 16, padding: 24, marginTop: 24 }}>
                        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{sec.title}</h2>
                        <ol style={{ margin: 0, paddingLeft: 0, listStyleType:"none" }}>
                            {sec.questions.map((q, qi) => (
                                <li key={q.id} style={{ margin: "12px 0" }}>
                                    <div style={{ fontWeight: 600, marginBottom: 8 }}>{qi + 1}. {q.text}</div>
                                    <div style={{ display: "grid", gap: 8 }}>
                                        {q.options.map((opt, idx) => (
                                            <label key={idx} style={{ display: "flex", gap: 10, alignItems: "flex-start", border: "1px solid #e5e5e5", borderRadius: 12, padding: "12px 14px", background: selections[q.id] === idx ? "#fff" : "#fff" }}>
                                                <input
                                                    type="radio"
                                                    name={q.id}
                                                    checked={selections[q.id] === idx}
                                                    onChange={() => handleChange(q.id, idx)}
                                                    style={{ marginTop: 3 }}
                                                />
                                                <span>{opt.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </section>
                ))}

                <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
                    <button
                        type="submit"
                        disabled={submitting}
                        style={{ padding: "12px 18px", borderRadius: 10, border: "none", background: "#111", color: "#fff", cursor: "pointer" }}
                    >
                        결과 보기
                    </button>
                    <button
                        type="button"
                        onClick={() => setSelections({})}
                        style={{ padding: "12px 18px", borderRadius: 10, border: "1px solid #ddd", background: "#fff", cursor: "pointer" }}
                    >
                        초기화
                    </button>
                </div>
            </form>
        </div>
    );
}
