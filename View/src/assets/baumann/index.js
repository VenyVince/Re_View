// src/assets/baumann/index.js
// 바우만 16타입 이미지 매핑

import DRNT from "./DRNT.png";
import DRNW from "./DRNW.png";
import DRPT from "./DRPT.png";
import DRPW from "./DRPW.png";

import DSNT from "./DSNT.png";
import DSNW from "./DSNW.png";
import DSPT from "./DSPT.png";
import DSPW from "./DSPW.png";

import ORNT from "./ORNT.png";
import ORNW from "./ORNW.png";
import ORPT from "./ORPT.png";
import ORPW from "./ORPW.png";

import OSNT from "./OSNT.png";
import OSNW from "./OSNW.png";
import OSPT from "./OSPT.png";
import OSPW from "./OSPW.png";

// 매핑 객체로 export
export const BAUMANN_BADGES = {
    DRNT, DRNW, DRPT, DRPW,
    DSNT, DSNW, DSPT, DSPW,
    ORNT, ORNW, ORPT, ORPW,
    OSNT, OSNW, OSPT, OSPW,
};

// 헬퍼: 코드 넣으면 해당 이미지 반환
export const getBaumannBadge = (type) => BAUMANN_BADGES[type] || null;

// === 바우만 타입 ID → 코드 매핑 ===
export const BAUMANN_CODE_BY_ID = {
    1: "DSPW",
    2: "DSPT",
    4: "DSNW",
    5: "DSNT",
    10: "DRPW",
    11: "DRPT",
    13: "DRNW",
    14: "DRNT",
    28: "OSPW",
    29: "OSPT",
    31: "OSNW",
    32: "OSNT",
    37: "ORPW",
    38: "ORPT",
    40: "ORNW",
    41: "ORNT",
};

// 코드 → baumann_id 역매핑 (PATCH용)
export const BAUMANN_ID_BY_CODE = Object.fromEntries(
    Object.entries(BAUMANN_CODE_BY_ID).map(([id, code]) => [code, Number(id)])
);