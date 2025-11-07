// 설문 페이지에서 저장된 결과(localLStorage.surveyResult)를 읽어오는 훅
// type에 DRNT와 같은 바우만 코드 자동 연결

import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function useBaumann() {
    const [type, setType] = useState("");
    const location = useLocation();
    useEffect(() => {
        const raw = localStorage.getItem("surveyResult");
        if (!raw) return;
        try { setType(JSON.parse(raw).type || ""); } catch {}
    }, [location.key]);
    return type;
}


/*
*  회원가입 페이지에서 연결하는 방법
*  1) 경로 맞춰서 useBaumann import 하기
*
*  2) state 선언 부분 근처에 선언하기
*       const baumann = useBaumann();
*
*  3) 바우만 타입 필드 연결
* <label>바우만 피부타입</label>
<div style={{ display: "flex", gap: 8 }}>
  <input
    value={baumann}
    onChange={(e) => setForm({ ...form, baumann: e.target.value })}
    placeholder="예: DRNT"
  />
  <button
    type="button"
    onClick={() => navigate("/survey?return=/register")}
  >
    설문하기
  </button>
</div>
*
* 위에 저건 예시인데 저런식으로 연결하시면 될 거 같아요
* */