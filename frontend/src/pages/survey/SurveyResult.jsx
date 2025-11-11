import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getBaumannBadge } from "../../assets/baumann";
import {
    fetchMyBaumann,
    fetchBaumannRecommendations,
} from "../../api/survey/surveyApi"
import styles from "./SurveyResult.module.css";

function tagsFrom(code = "") {
    if (code.length !== 4) return "";
    return [
        code[0] === "D" ? "#건성" : "#지성",
        code[1] === "S" ? "#민감" : "#저자극",
        code[2] === "P" ? "#색소" : "#비색소",
        code[3] === "W" ? "#주름형" : "#탄력형",
    ].join(" ");
}

export default function SurveyResult() {
    const nav = useNavigate();
    const { state, search } = useLocation();

    // state로 오면 우선 사용, 새로고침 대비 localStorage 예비
    const stored = (() => {
        try {
            const raw = localStorage.getItem("surveyResult");
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    })();

    const type  = state?.type  || stored?.type;
    const score = state?.score || stored?.score;
    const badge = getBaumannBadge ? getBaumannBadge(type) : null;

    const [loading, setLoading] = useState(true);
    const [serverType, setServerType] = useState(null); // { user_id, baumann }
    const [reco, setReco] = useState([]);
    const [errorMsg, setErrorMsg] = useState("");

    const params = new URLSearchParams(search);
    const returnTo = state?.returnTo || params.get("return") || "/register";

    useEffect(() => {
        let isMounted = true;
        (async () => {
            setLoading(true);
            try {
                // 서버에 저장된 "내 바우만 타입" + "추천" 조회
                const [mineRes, recoRes] = await Promise.all([
                    fetchMyBaumann(),
                    fetchBaumannRecommendations(),
                ]);
                if (!isMounted) return;
                setServerType(mineRes?.data ?? mineRes);
                setReco(recoRes?.data ?? recoRes);
            } catch (err) {
                const st = err?.response?.status;
                if (st === 401) setErrorMsg("로그인이 필요합니다.");
                else if (st === 404) setErrorMsg("서버에 타입 정보가 없습니다. 설문을 먼저 제출하세요.");
                else setErrorMsg("서버 오류입니다. 잠시 후 다시 시도해주세요.");
            } finally {
                if (isMounted) setLoading(false);
            }
        })();
        return () => { isMounted = false; };
    }, []);

    if (!type) {
        return (
            <div style={{maxWidth:1024, margin:"60px auto", textAlign:"center"}}>
                <h2>결과 없음</h2>
                <p>설문을 먼저 완료해 주세요.</p>
                <button onClick={()=>nav("/survey/baumann")} style={{marginTop:12}}>설문으로 가기</button>
            </div>
        );
    }

    const onApply = () => {
        // 이미 surveyResult에 저장되어 있지만, 안전하게 한 번 더 저장
        localStorage.setItem("surveyResult", JSON.stringify({ type, score }));

        // /register로 돌아갈 때 from=survey 플래그를 쿼리와 state로 함께 전달
        const url = new URL(returnTo, window.location.origin);
        if (!url.searchParams.get('from')) url.searchParams.set('from', 'survey');

        nav(url.pathname + url.search, {
            replace: true,
            state: { fromSurvey: true },
        });
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>피부 타입 결과</h1>
            <p className={styles.desc}>
                당신의 피부 타입은 <b>{type}</b> 입니다.
            </p>

            <div className={styles.card}>
                {badge ? (
                    <img
                        src={badge}
                        alt={type}
                        width={72}
                        height={72}
                        className={styles.badgeImg}
                        onError={(e) => {
                            e.currentTarget.style.display = "none";
                        }}
                    />
                ) : (
                    <div className={styles.badgeBox}>{type}</div>
                )}
                <div className={styles.typeInfo}>
                    <div className={styles.typeCode}>{type}</div>
                    <div className={styles.tags}>{tagsFrom(type)}</div>
                </div>
            </div>

            <button onClick={onApply} className={styles.button}>
                타입 입력
            </button>
        </div>
    );
}
