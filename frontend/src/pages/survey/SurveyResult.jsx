import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getBaumannBadge } from "../../assets/baumann";

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
    const raw = localStorage.getItem("surveyResult");
    const stored = raw ? JSON.parse(raw) : null;

    const type  = state?.type  || stored?.type;
    const score = state?.score || stored?.score;
    const badge = getBaumannBadge(type);
    const params = new URLSearchParams(search);
    const returnTo = state?.returnTo || params.get("return") || "/register";

    if (!type) {
        return (
            <div style={{maxWidth:1024, margin:"60px auto", textAlign:"center"}}>
                <h2>결과 없음</h2>
                <p>설문을 먼저 완료해 주세요.</p>
                <button onClick={()=>nav("/survey")} style={{marginTop:12}}>설문으로 가기</button>
            </div>
        );
    }

    const onApply = () => {
        // 이미 surveyResult에 저장되어 있지만, 안전하게 한 번 더 저장
        localStorage.setItem("surveyResult", JSON.stringify({ type, score }));
        nav(returnTo, { replace: true }); // 회원가입으로 복귀

        // /register로 돌아갈 때 from=survey 플래그를 쿼리와 state로 함께 전달
        const url = new URL(returnTo, window.location.origin);
        if (!url.searchParams.get('from')) url.searchParams.set('from', 'survey');

        nav(url.pathname + url.search, {
            replace: true,
            state: { fromSurvey: true },
        });
    };

    return (
        <div style={{maxWidth:1024, margin:"60px auto", padding:"0 24px", textAlign:"center"}}>
            <h1 style={{fontSize:36, fontWeight:900}}>피부 타입 결과</h1>
            <p style={{color:"#666", marginTop:8}}>당신의 피부 타입은 <b>{type}</b> 입니다.</p>

            <div style={{
                margin:"24px auto 0", maxWidth:520, padding:20,
                border:"1px solid #eee", borderRadius:16, display:"flex", gap:16, alignItems:"center"
            }}>
                {badge ? (
                    <img
                        src={badge}
                        alt={type}
                        width={72}
                        height={72}
                        style={{ borderRadius:16, objectFit:"cover", boxShadow:"0 6px 18px rgba(0,0,0,.08)" }}
                        onError={(e)=>{e.currentTarget.style.display="none";}}
                        />
                ) : (
                 <div style={
                     {
                         width:64, height:64, borderRadius:16, background:"#f4f4f4",
                         display:"grid", placeItems:"center", fontWeight:900, fontSize:18, letterSpacing:1
                     }}>
                     {type}
                 </div>
                )}
                <div style={{textAlign:"left"}}>
                    <div style={{fontSize:18, fontWeight:800}}>{type}</div>
                    <div style={{color:"#666", marginTop:4}}>{tagsFrom(type)}</div>
                </div>
            </div>

            <button
                onClick={onApply}
                style={{
                    marginTop:24, padding:"12px 24px", border:"none",
                    background:"#111", color:"#fff", borderRadius:10, cursor:"pointer"
                }}
            >
                타입 입력
            </button>
        </div>
    );
}
