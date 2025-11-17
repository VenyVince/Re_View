// 태그 아이콘 (파일명은 팀 내 합의대로 맞춰주세요)
import dry from "./dry.png";
import oily from "./oily.png";
import resistant from "./resistant.png";
import sensitive from "./sensitive.png";
import pigmented from "./pigmented.png";
import nonPigmented from "./nonPigmented.png";
import tight from "./tight.png";
import wrinkled from "./wrinkled.png";

export const TAG_ICONS = {
    dry, oily, resistant, sensitive, pigmented, nonPigmented, tight, wrinkled,
};

// 한글 → 아이콘 키
export const TAG_KEY_MAP = {
    "건성": "dry",
    "지성": "oily",
    "저자극": "resistant",
    "민감성": "sensitive",
    "색소성": "pigmented",
    "비색소": "nonPigmented",
    "탄력": "tight",
    "주름": "wrinkled",
};

export const getTagIcon = (koreanTag) => TAG_ICONS[TAG_KEY_MAP[koreanTag]];
