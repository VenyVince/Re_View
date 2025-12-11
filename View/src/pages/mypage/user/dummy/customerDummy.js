// src/pages/mypage/user/dummy/customerDummy.js

// 1:1 문의 내역 더미
export const inquiryDummy = [
    {
        id: 1,
        product_id: 101,
        product_name: "셀럽 마이크로 폼 클렌저",
        product_thumbnail: "/images/product1.png",

        category: "상품문의",
        title: "이 제품 임산부 사용 가능할까요?",
        content: "성분이 안전한지 궁금합니다.",
        status: "답변완료", // 처리중, 답변완료
        answer: "임산부도 사용 가능한 저자극 제품입니다.",
        created_at: "2025-11-10",
        answered_at: "2025-11-11",
    },

    {
        id: 2,
        product_id: 103,
        product_name: "워터풀 크리미 수분 크림",
        product_thumbnail: "/images/product3.png",

        category: "상품문의",
        title: "유통기한 궁금합니다",
        content: "제조일자와 유통기한이 궁금합니다.",
        status: "처리중",
        answer: null,
        created_at: "2025-11-15",
        answered_at: null,
    },
];

// FAQ 더미
export const faqDummy = [
    {
        id: 1,
        category: "주문/결제",
        question: "주문 후 결제 수단을 변경할 수 있나요?",
        answer:
            "이미 결제가 완료된 주문의 결제 수단 변경은 불가능합니다. 기존 주문을 취소 후, 원하시는 결제 수단으로 재주문해 주세요.",
    },
    {
        id: 2,
        category: "배송",
        question: "배송 기간은 얼마나 걸리나요?",
        answer:
            "평일 오후 2시 이전 결제 완료 건은 당일 출고되며, 평균 배송 기간은 1~3일 소요됩니다. 제주/도서산간 지역은 1~2일 추가될 수 있습니다.",
    },
    {
        id: 3,
        category: "회원/포인트",
        question: "포인트는 언제 적립되나요?",
        answer:
            "주문하신 상품이 배송 완료 처리된 후 7일 뒤 자동 적립됩니다. 반품/취소 시에는 적립 예정 포인트가 함께 취소됩니다.",
    },
];