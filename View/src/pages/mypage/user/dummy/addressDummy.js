// src/pages/mypage/user/dummy/addressDummy.js

// 실제 DB 스키마를 그대로 반영한 더미 데이터
const addressDummy = [
    {
        address_id: 1,
        user_id: 1,
        address_name: "집",
        recipient: "공융USER",
        phone: "010-0000-0000",
        postal_code: "01234",
        address: "서울시 강남구 테헤란로 123",
        detail_address: "101동 1001호",
        is_default: true,
    },
    {
        address_id: 2,
        user_id: 1,
        address_name: "회사",
        recipient: "공융USER",
        phone: "010-1111-2222",
        postal_code: "04567",
        address: "서울시 중구 세종대로 45",
        detail_address: "10층",
        is_default: false,
    },
];

export default addressDummy;