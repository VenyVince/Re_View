// src/pages/mypage/user/UserSkinTestPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import UserMyPageLayout from "./UserMyPageLayout";
import "./UserSkinTestPage.css";

import {BAUMANN_BADGES, BAUMANN_CODE_BY_ID, getBaumannBadge} from "../../../assets/baumann";
import {
    SECTIONS,
    QUESTION_COUNT,
    buildTallyFromSelections,
} from "../../survey/questions";

/** 바우만 코드 계산기 (회원가입 설문과 동일 로직) */
function computeBaumann(tally) {
    const pick = (a, b, A, B) => (tally[A] === tally[B] ? A : tally[A] > tally[B] ? A : B);
    const od = pick(tally.O, tally.D, "O", "D");
    const sr = pick(tally.S, tally.R, "S", "R");
    const pw = pick(tally.P, tally.N, "P", "N");
    const wt = pick(tally.W, tally.T, "W", "T");
    return `${od}${sr}${pw}${wt}`;
}

// 바우만 16타입 코드 리스트 (셀렉트박스 옵션용)
const BAUMANN_TYPES = Object.keys(BAUMANN_BADGES).sort();

export default function UserSkinTestPage() {
    // ⚫ 서버에 저장되어 있는 “나의 바우만 타입”
    const [myType, setMyType] = useState(null);

    // ⚪ 화면에서 사용자가 현재 선택한 타입 (드롭다운 & 설문 결과가 이 값에 반영)
    const [selectedType, setSelectedType] = useState(null);

    // 🔸 설문 상태
    const [surveySelections, setSurveySelections] = useState({});
    const [surveyIndex, setSurveyIndex] = useState(0);

    // === 1. 유저 정보에서 현재 바우만 타입 불러오기 ===
    useEffect(() => {
        const fetchMe = async () => {
            try {
                const res = await axios.get("/api/users/me", {
                    withCredentials: true,
                });

                // 서버에서 내려오는 필드명: baumann_id
                const typeId = res.data.baumann_id;

                // id → 코드 변환
                const code = typeId ? BAUMANN_CODE_BY_ID[typeId] || null : null;

                // 상단 “나의 바우만 타입”
                setMyType(code);

                // 드롭다운 초기값도 동일하게 설정
                setSelectedType(code);

            } catch (e) {
                console.error("내 정보 조회 실패 (바우만 타입):", e);
            }
        };

        fetchMe();
    }, []);

    // === 2. 설문 질문 펼치기 ===
    const flatQuestions = useMemo(
        () =>
            SECTIONS.flatMap((sec) =>
                sec.questions.map((q) => ({
                    ...q,
                    sectionTitle: sec.title,
                }))
            ),
        []
    );

    const total = QUESTION_COUNT;
    const current = flatQuestions[surveyIndex];
    const progress = Math.round(((surveyIndex + 1) / total) * 100);

    // === 3. 설문 답변 선택 ===
    const handleSurveySelect = (optionIdx) => {
        if (!current) return;

        const nextSel = { ...surveySelections, [current.id]: optionIdx };
        setSurveySelections(nextSel);

        const isLast = surveyIndex === total - 1;

        if (isLast) {
            // 마지막 문항 → 바우만 타입 계산해서 "선택된 바우만 타입"에 즉시 반영
            const tally = buildTallyFromSelections(nextSel);
            const type = computeBaumann(tally);

            // 설문 결과를 선택된 타입으로 적용
            setSelectedType(type);

            // 원하면 로컬스토리지에도 저장
            localStorage.setItem("surveyResult", JSON.stringify({ type, score: tally }));
        } else {
            // 다음 문항으로 이동
            setSurveyIndex((i) => i + 1);
        }
    };

    const handleSurveyPrev = () => {
        if (surveyIndex === 0) return;
        setSurveyIndex((i) => i - 1);
    };

    // 설문 전체 초기화 (선택된 바우만 타입은 그대로 두고 설문만 리셋)
    const handleSurveyReset = () => {
        setSurveySelections({});
        setSurveyIndex(0);
    };

    // === 4. 드롭다운으로 선택된 바우만 타입 변경 ===
    const handleSelectTypeChange = (e) => {
        const value = e.target.value || null;
        setSelectedType(value);
        // ❗ 나의 바우만 타입(myType)은 여기서는 바꾸지 않는다.
    };

    // === 5. “피부타입 저장” 버튼 → 서버에 반영 ===
    const handleSaveType = async () => {
        if (!selectedType) {
            alert("저장할 바우만 피부 타입을 선택해 주세요.");
            return;
        }

        try {
            await axios.patch(
                "/api/users/baumann",
                { baumann_type: selectedType }, // 필드명은 백엔드와 맞게 수정
                { withCredentials: true }
            );

            setMyType(selectedType); // 이제야 상단 “나의 바우만 타입”이 변경됨
            alert("피부 타입이 저장되었어요.");
        } catch (e) {
            console.error("바우만 타입 저장 실패:", e);
            alert("피부 타입 저장 중 오류가 발생했습니다.");
        }
    };

    const currentBadge = getBaumannBadge(myType);
    const selectedBadge = getBaumannBadge(selectedType);

    return (
        <UserMyPageLayout>
            <section className="mypage-section skin-section">
                {/* ===== 상단: 나의 바우만 타입 ===== */}
                <div className="skin-current-card">
                    <div className="skin-current-inner">
                        <h4 className="skin-current-label">나의 바우만 타입</h4>
                        <div className="skin-current-main">
                            {currentBadge && (
                                <img
                                    src={currentBadge}
                                    alt={myType || "바우만 타입"}
                                    className="skin-current-badge"
                                />
                            )}
                            <span className="skin-current-type">{myType || "미설정"}</span>
                        </div>
                        <p className="skin-current-desc">
                            현재 저장된 피부 타입입니다. 피부 상태가 달라졌다면 아래 테스트를 다시
                            진행한 후 <strong>피부타입 저장</strong> 버튼을 눌러 변경해 주세요.
                        </p>
                    </div>
                </div>

                {/* ===== 선택된 바우만 피부 타입 (수정 대상) ===== */}
                <div className="skin-select-card">
                    <div className="skin-select-inner">
                        <p className="skin-select-label">선택된 바우만 피부 타입</p>
                        <div className="skin-select-row">
                            <div className="skin-select-left">
                                {selectedBadge && (
                                    <img
                                        src={selectedBadge}
                                        alt={selectedType || "선택된 바우만 타입"}
                                        className="skin-select-badge"
                                    />
                                )}
                            </div>
                            <div className="skin-select-right">
                                <select
                                    className="skin-select-dropdown"
                                    value={selectedType || ""}
                                    onChange={handleSelectTypeChange}
                                >
                                    <option value="">바우만 타입을 선택해 주세요</option>
                                    {BAUMANN_TYPES.map((code) => (
                                        <option key={code} value={code}>
                                            {code}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== 바우만 피부 타입 설문 ===== */}
                <div className="skin-survey-card">
                    <div className="skin-survey-inner">
                        <h4 className="skin-survey-title">바우만 피부 타입 설문</h4>
                        <p className="skin-survey-caption">
                            일상적인 피부 상태를 떠올리면서 솔직하게 답변해 주세요. 설문을 모두 완료하면
                            결과 타입이 위의 선택된 바우만 피부 타입에 자동으로 적용됩니다.
                        </p>
                    </div>

                    {/* 설문 본문 */}
                    {current && (
                        <div className="inline-survey">
                            {/* 진행도 */}
                            <div className="inline-survey-progress">
                <span className="inline-survey-step">
                  {surveyIndex + 1} / {total}
                </span>
                                <div className="inline-survey-bar">
                                    <div
                                        className="inline-survey-bar-fill"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>

                            {/* 질문 영역 */}
                            <div className="inline-survey-body">
                                <div className="inline-survey-section">
                                    {current.sectionTitle}
                                </div>
                                <div className="inline-survey-question">{current.text}</div>

                                <div className="inline-survey-options">
                                    {current.options.map((opt, idx) => {
                                        const checked = surveySelections[current.id] === idx;
                                        return (
                                            <button
                                                key={idx}
                                                type="button"
                                                className={
                                                    "inline-survey-option" +
                                                    (checked ? " inline-survey-option--active" : "")
                                                }
                                                onClick={() => handleSurveySelect(idx)}
                                            >
                                                {opt.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* 하단 네비게이션: 왼쪽 초기화, 오른쪽 이전 */}
                            <div className="inline-survey-footer">
                                <button
                                    type="button"
                                    className="inline-survey-nav inline-survey-reset"
                                    onClick={handleSurveyReset}
                                >
                                    초기화
                                </button>

                                <button
                                    type="button"
                                    className="inline-survey-nav inline-survey-nav-prev"
                                    onClick={handleSurveyPrev}
                                    disabled={surveyIndex === 0}
                                >
                                    이전
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* ===== 저장 버튼 ===== */}
                <div className="skin-save-area">
                    <button
                        type="button"
                        className="skin-save-btn"
                        onClick={handleSaveType}
                    >
                        피부타입 저장
                    </button>
                </div>
            </section>
        </UserMyPageLayout>
    );
}